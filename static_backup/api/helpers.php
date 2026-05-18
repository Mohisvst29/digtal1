<?php
// Production-Grade Reusable Security & Optimization Helper Functions
// Location: website/api/helpers.php

if (!defined('SECURE_ACCESS')) {
    define('SECURE_ACCESS', true);
}

// 1. SECURE SESSION INITIALIZATION & AUTOMATIC INACTIVITY TIMEOUT
function init_secure_session() {
    if (session_status() === PHP_SESSION_NONE) {
        $isSecure = isset($_SERVER['HTTPS']) || 
                    (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
                    (isset($_SERVER['HTTP_FRONT_END_HTTPS']) && strtolower($_SERVER['HTTP_FRONT_END_HTTPS']) === 'on');

        $cookieParams = [
            'lifetime' => 0, // Session cookie, dies when browser closes
            'path' => '/',
            'domain' => '',
            'secure' => $isSecure,
            'httponly' => true, // Prevents XSS cookie theft
            'samesite' => 'Strict' // Prevents CSRF on third party sites
        ];
        
        session_set_cookie_params($cookieParams);
        session_start();
    }
    
    // Inactivity Timeout (30 minutes)
    if (isset($_SESSION['admin_user'])) {
        $timeoutDuration = 1800; // 30 mins
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeoutDuration)) {
            // Log timeout event
            secure_log_error("Admin session timeout for user: " . $_SESSION['admin_user'], 'INFO');
            
            session_unset();
            session_destroy();
            
            // Check if JSON request
            if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['status' => 'error', 'session_expired' => true, 'message' => 'انتهت الجلسة بسبب عدم النشاط. يرجى تسجيل الدخول مجدداً.']);
                exit;
            } else {
                header("Location: index.php?expired=1");
                exit;
            }
        }
        $_SESSION['last_activity'] = time();
    }
}

// 2. CSRF PROTECTION (CROSS-SITE REQUEST FORGERY)
function get_csrf_token() {
    if (session_status() === PHP_SESSION_NONE) {
        init_secure_session();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    if (session_status() === PHP_SESSION_NONE) {
        init_secure_session();
    }
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function verify_csrf_from_header() {
    $headers = apache_request_headers();
    $token = '';
    
    if (isset($headers['X-CSRF-TOKEN'])) {
        $token = $headers['X-CSRF-TOKEN'];
    } elseif (isset($headers['x-csrf-token'])) {
        $token = $headers['x-csrf-token'];
    } elseif (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'];
    }
    
    return verify_csrf_token($token);
}

// 3. SECURE ERROR LOGGER
function secure_log_error($message, $severity = 'ERROR') {
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0700, true); // Extremely restricted folder (read/write only by owner)
    }
    
    // Create an .htaccess inside the logs folder to prevent direct HTTP access
    $htaccessFile = $logDir . '/.htaccess';
    if (!file_exists($htaccessFile)) {
        file_put_contents($htaccessFile, "Order Deny,Allow\nDeny from all");
    }
    
    $logFile = $logDir . '/secure_errors.log';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $timestamp = date('Y-m-d H:i:s');
    $formattedMessage = "[$timestamp] [$severity] [IP: $ip] - $message" . PHP_EOL;
    file_put_contents($logFile, $formattedMessage, FILE_APPEND);
}

// Custom production error handler
function production_error_handler($errno, $errstr, $errfile, $errline) {
    $msg = "Error [$errno]: $errstr in $errfile on line $errline";
    secure_log_error($msg, 'PHP_ERROR');
    
    // Prevent sensitive information leak in production
    if (ini_get('display_errors') == 0) {
        return true;
    }
    return false;
}
set_error_handler('production_error_handler');

// 4. DB-BACKED RATE LIMITING (DDoS & API SPAM SHIELD)
function rate_limit($pdo, $actionKey, $maxRequests = 40, $timeframeSeconds = 60) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $now = time();
    $cutoff = $now - $timeframeSeconds;
    
    try {
        // Clean old rate limit records first to maintain a lightweight database
        $stmt = $pdo->prepare("DELETE FROM rate_limits WHERE request_time < ?");
        $stmt->execute([$cutoff]);
        
        // Count active requests from this IP for this action
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM rate_limits WHERE ip_address = ? AND action_key = ? AND request_time >= ?");
        $stmt->execute([$ip, $actionKey, $cutoff]);
        $requestCount = $stmt->fetchColumn();
        
        if ($requestCount >= $maxRequests) {
            secure_log_error("Rate limit exceeded for IP: $ip, Action: $actionKey", 'WARN');
            http_response_code(429);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => 'error',
                'message' => 'لقد تجاوزت حد الطلبات المسموح به. يرجى الانتظار دقيقة واحدة والمحاولة مجدداً.'
            ]);
            exit;
        }
        
        // Log the new request
        $stmt = $pdo->prepare("INSERT INTO rate_limits (ip_address, action_key, request_time) VALUES (?, ?, ?)");
        $stmt->execute([$ip, $actionKey, $now]);
        
    } catch (PDOException $e) {
        secure_log_error("Rate limiting DB query failed: " . $e->getMessage());
    }
}

// 5. BRUTE-FORCE SHIELD FOR LOGINS
function check_brute_force($pdo, $username, $maxFailedAttempts = 5, $lockoutMinutes = 15) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $cutoff = date('Y-m-d H:i:s', time() - ($lockoutMinutes * 60));
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip_address = ? AND success = 0 AND attempt_time >= ?");
        $stmt->execute([$ip, $cutoff]);
        $failedCount = $stmt->fetchColumn();
        
        if ($failedCount >= $maxFailedAttempts) {
            secure_log_error("Login blocked due to brute-force protection. Username: $username, IP: $ip", 'SECURITY');
            return false; // Block login attempt
        }
    } catch (PDOException $e) {
        secure_log_error("Brute force check query failed: " . $e->getMessage());
    }
    return true; // Safe to proceed
}

function log_login_attempt($pdo, $username, $success) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    try {
        $stmt = $pdo->prepare("INSERT INTO login_attempts (ip_address, username, success) VALUES (?, ?, ?)");
        $stmt->execute([$ip, $username, $success ? 1 : 0]);
    } catch (PDOException $e) {
        secure_log_error("Logging login attempt failed: " . $e->getMessage());
    }
}

// 6. DEEP OUTPUT SANITIZATION FOR XSS PREVENTION
function escape_xss($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = escape_xss($value);
        }
        return $data;
    }
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

// 7. RESPONSIVE IMAGE DOWNSCALING & TRANSPARENCY-PRESERVING COMPRESSION (GD ENGINE)
function compress_and_save_image($sourcePath, $destinationPath, $ext, $maxWidth = 1200, $quality = 82) {
    list($width, $height, $type) = getimagesize($sourcePath);
    if (!$width || !$height) return false;
    
    // Responsive downscaling for massive screens (prevents resource overload)
    $newWidth = $width;
    $newHeight = $height;
    if ($width > $maxWidth) {
        $newWidth = $maxWidth;
        $newHeight = ($height / $width) * $maxWidth;
    }
    
    switch ($type) {
        case IMAGETYPE_JPEG:
            $src = imagecreatefromjpeg($sourcePath);
            break;
        case IMAGETYPE_PNG:
            $src = imagecreatefrompng($sourcePath);
            break;
        case IMAGETYPE_GIF:
            $src = imagecreatefromgif($sourcePath);
            break;
        case IMAGETYPE_WEBP:
            $src = imagecreatefromwebp($sourcePath);
            break;
        default:
            return false;
    }
    
    if (!$src) return false;
    
    // Create new blank truecolor canvas
    $dst = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preserve alpha channel transparency for PNG/GIF/WEBP
    if ($type == IMAGETYPE_PNG || $type == IMAGETYPE_GIF || $type == IMAGETYPE_WEBP) {
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
        imagefilledrectangle($dst, 0, 0, $newWidth, $newHeight, $transparent);
    }
    
    // Perform high-quality resample
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    
    // Save image with optimized compression
    $success = false;
    switch ($type) {
        case IMAGETYPE_JPEG:
            $success = imagejpeg($dst, $destinationPath, $quality);
            break;
        case IMAGETYPE_PNG:
            // PNG quality: 0 (no compression) to 9 (max compression)
            $pngQuality = 9 - round($quality / 10);
            $success = imagepng($dst, $destinationPath, $pngQuality);
            break;
        case IMAGETYPE_GIF:
            $success = imagegif($dst, $destinationPath);
            break;
        case IMAGETYPE_WEBP:
            $success = imagewebp($dst, $destinationPath, $quality);
            break;
    }
    
    imagedestroy($src);
    imagedestroy($dst);
    
    return $success;
}

// 8. SECURE & RIGOROUS IMAGE FILE UPLOADER
function secure_media_upload($file, $uploadDir, $pdo = null) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['status' => 'error', 'message' => 'فشل في رفع الملف على الخادم. كود الخطأ: ' . $file['error']];
    }
    
    // Limit maximum upload size to 10MB to protect memory
    if ($file['size'] > 10 * 1024 * 1024) {
        return ['status' => 'error', 'message' => 'حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت.'];
    }
    
    $originalName = basename($file['name']);
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    
    // 1. Strict extension white-listing
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    if (!in_array($ext, $allowedExts)) {
        return ['status' => 'error', 'message' => 'امتداد الملف غير مسموح به. الامتدادات المدعومة هي: JPG, PNG, GIF, WEBP, SVG'];
    }
    
    // 2. Strict MIME-type checking (prevents double extension PHP execution exploits)
    $tmpFile = $file['tmp_name'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $tmpFile);
    finfo_close($finfo);
    
    // Check image mime types or SVG XML
    $isSvg = ($ext === 'svg' && ($mimeType === 'image/svg+xml' || $mimeType === 'text/plain' || $mimeType === 'text/xml'));
    $isStandardImage = (strpos($mimeType, 'image/') === 0);
    
    if (!$isStandardImage && !$isSvg) {
        return ['status' => 'error', 'message' => 'محتوى الملف غير صالح. يرجى رفع ملف صور حقيقي فقط.'];
    }
    
    // Ensure upload directory exists securely
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // 3. Cryptographically random file naming (prevents directory traversal and file overwriting)
    $safeName = bin2hex(random_bytes(16)) . '.' . $ext;
    $targetFilePath = $uploadDir . '/' . $safeName;
    
    // Compress standard images (exclude SVG/GIF to keep code original)
    if ($isStandardImage && $ext !== 'gif' && $ext !== 'svg') {
        $saveSuccess = compress_and_save_image($tmpFile, $targetFilePath, $ext);
        if (!$saveSuccess) {
            // Fallback to simple move if compression fails
            $saveSuccess = move_uploaded_file($tmpFile, $targetFilePath);
        }
    } else {
        $saveSuccess = move_uploaded_file($tmpFile, $targetFilePath);
    }
    
    if ($saveSuccess) {
        $url = 'uploads/' . $safeName;
        
        // Log to media library database if pdo connection provided
        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO media (name, url) VALUES (?, ?)");
            $stmt->execute([$originalName, $url]);
            $insertedId = $pdo->lastInsertId();
            return [
                'status' => 'success',
                'id' => (int)$insertedId,
                'name' => $originalName,
                'url' => $url
            ];
        }
        
        return [
            'status' => 'success',
            'name' => $originalName,
            'url' => $url
        ];
    }
    
    return ['status' => 'error', 'message' => 'تعذر حفظ الملف على القرص الصلب للموقع.'];
}

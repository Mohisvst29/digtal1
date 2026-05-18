<?php
// Production-Hardened Admin Session Authentication API
// Location: website/api/auth.php

define('SECURE_ACCESS', true);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// Initialize secure session with cookies and inactivity limits
init_secure_session();

header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. LOGIN CONTROLLER
if ($action === 'login') {
    // Implement API rate-limiting: Max 10 attempts per minute per IP
    rate_limit($pdo, 'login_action', 10, 60);
    
    $input = json_decode(file_get_contents('php://input'), true);
    $user = isset($input['username']) ? trim($input['username']) : '';
    $pass = isset($input['password']) ? trim($input['password']) : '';

    if (empty($user) || empty($pass)) {
        echo json_encode(['status' => 'error', 'message' => 'الرجاء إدخال اسم المستخدم وكلمة المرور.']);
        exit;
    }

    // Check if user is locked out due to brute force limits (5 failures in 15 minutes)
    if (!check_brute_force($pdo, $user, 5, 15)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'تم حظر محاولات الدخول مؤقتاً لكثرة المحاولات الخاطئة. يرجى الانتظار 15 دقيقة.'
        ]);
        exit;
    }

    try {
        // SQL Injection protected prepared statement
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$user]);
        $dbUser = $stmt->fetch();

        if ($dbUser && password_verify($pass, $dbUser['password'])) {
            // Log successful attempt
            log_login_attempt($pdo, $user, true);
            
            // Session Fixation Shield: Regenerate Session ID on auth change
            session_regenerate_id(true);
            
            $_SESSION['admin_user'] = $dbUser['username'];
            $_SESSION['admin_id'] = (int)$dbUser['id'];
            $_SESSION['last_activity'] = time();
            
            // Generate CSRF token for this admin session
            $csrfToken = get_csrf_token();

            secure_log_error("Successful login for user: $user", 'INFO');
            
            echo json_encode([
                'status' => 'success', 
                'message' => 'تم تسجيل الدخول بنجاح!',
                'csrf_token' => $csrfToken
            ]);
        } else {
            // Log failed attempt for brute force tracking
            log_login_attempt($pdo, $user, false);
            secure_log_error("Failed login attempt for user: $user", 'SECURITY');
            
            echo json_encode(['status' => 'error', 'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة.']);
        }
    } catch (PDOException $e) {
        secure_log_error("Authentication database error: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'حدث خطأ غير متوقع في النظام.']);
    }
    exit;
}

// 2. LOGOUT CONTROLLER
if ($action === 'logout') {
    $username = $_SESSION['admin_user'] ?? 'unknown';
    secure_log_error("Admin logged out: $username", 'INFO');
    
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    
    echo json_encode(['status' => 'success', 'message' => 'تم تسجيل الخروج بنجاح!']);
    exit;
}

// 3. STATUS CHECKER
if ($action === 'status') {
    if (isset($_SESSION['admin_user'])) {
        // Return existing CSRF token
        $csrfToken = get_csrf_token();
        echo json_encode([
            'status' => 'success', 
            'logged_in' => true, 
            'username' => escape_xss($_SESSION['admin_user']),
            'csrf_token' => $csrfToken
        ]);
    } else {
        echo json_encode(['status' => 'success', 'logged_in' => false]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'طلب غير صالح.']);

<?php
// Production-Grade Secured Media Upload API
// Location: website/api/upload_media.php

define('SECURE_ACCESS', true);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// 1. Initialize secure session and rate-limit API uploads
init_secure_session();
rate_limit($pdo, 'media_upload_action', 15, 60); // Max 15 uploads per minute

header('Content-Type: application/json; charset=utf-8');

// 2. SECURITY: Authorization checks
if (!isset($_SESSION['admin_user'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'جلسة العمل غير صالحة. يرجى تسجيل الدخول مجدداً.']);
    exit;
}

// 3. SECURITY: CSRF Token verification
if (!verify_csrf_from_header()) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'تم رفض الطلب: رمز الحماية (CSRF) غير صالح.']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads';

// A. HANDLE BASE64 UPLOADS (for client-side base64 conversions)
$input = json_decode(file_get_contents('php://input'), true);
if (isset($input['base64Data']) && isset($input['name'])) {
    $base64Data = $input['base64Data'];
    $originalName = trim($input['name']);
    
    if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $typeMatches)) {
        $ext = strtolower($typeMatches[1]);
        $base64Content = substr($base64Data, strpos($base64Data, ',') + 1);
        $decodedData = base64_decode($base64Content);
        
        if ($decodedData === false) {
            echo json_encode(['status' => 'error', 'message' => 'بيانات الصورة المرفوعة غير صالحة.']);
            exit;
        }
        
        // Save base64 temporarily to run it through the secure validation flow
        $tempFile = tempnam(sys_get_temp_dir(), 'img_upload_b64');
        if ($tempFile && file_put_contents($tempFile, $decodedData) !== false) {
            $mockFile = [
                'name' => $originalName,
                'tmp_name' => $tempFile,
                'error' => UPLOAD_ERR_OK,
                'size' => filesize($tempFile)
            ];
            
            // Route through secure, GD-optimized upload pipeline
            $result = secure_media_upload($mockFile, $uploadDir, $pdo);
            @unlink($tempFile); // Instantly clean up temp file
            
            if ($result['status'] === 'success') {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'تم رفع الصورة وضغطها بنجاح!',
                    'id' => $result['id'],
                    'name' => $result['name'],
                    'url' => $result['url']
                ]);
            } else {
                echo json_encode($result);
            }
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'فشل معالجة الملف المؤقت على الخادم.']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'صيغة الصورة غير مدعومة.']);
        exit;
    }
}

// B. HANDLE MULTIPART FORM DATA UPLOADS
if (isset($_FILES['image'])) {
    $file = $_FILES['image'];
    
    // Route through secure, GD-optimized upload pipeline
    $result = secure_media_upload($file, $uploadDir, $pdo);
    
    if ($result['status'] === 'success') {
        echo json_encode([
            'status' => 'success',
            'message' => 'تم رفع الصورة وضغطها بنجاح!',
            'id' => $result['id'],
            'name' => $result['name'],
            'url' => $result['url']
        ]);
    } else {
        echo json_encode($result);
    }
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'لم يتم إرسال أي ملفات للرفع.']);

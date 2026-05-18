<?php
// Production-Hardened Lead Capture API
// Location: website/api/add_lead.php

define('SECURE_ACCESS', true);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// Public API Rate Limit: Max 5 submissions per minute per IP to completely stop spam bots
rate_limit($pdo, 'public_add_lead', 5, 60);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// XSS Prevention sanitization on all input fields
$input = escape_xss($input);

$name = isset($input['name']) ? trim($input['name']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$clientType = isset($input['clientType']) ? trim($input['clientType']) : '';
$specialty = isset($input['specialty']) ? trim($input['specialty']) : '';
$services = isset($input['services']) ? $input['services'] : [];
$budget = isset($input['budget']) ? trim($input['budget']) : '';
$referrer = isset($input['referrer']) ? trim($input['referrer']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';
$date = date('Y-m-d H:i');

if (empty($name) || empty($phone) || empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'الرجاء تعبئة الحقول الأساسية: الاسم، الهاتف، والبريد الإلكتروني.']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'البريد الإلكتروني المدخل غير صالح.']);
    exit;
}

try {
    $servicesJson = json_encode($services, JSON_UNESCAPED_UNICODE);
    
    // SQL Injection protected prepared statement
    $stmt = $pdo->prepare("INSERT INTO leads (name, phone, email, client_type, specialty, services, budget, referrer, message, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $name,
        $phone,
        $email,
        $clientType,
        $specialty,
        $servicesJson,
        $budget,
        $referrer,
        $message,
        $date
    ]);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'تم استلام طلب الاستشارة بنجاح، سنتواصل معك قريباً!'
    ]);
} catch (PDOException $e) {
    secure_log_error("Lead capture failed: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة لاحقاً.'
    ]);
}

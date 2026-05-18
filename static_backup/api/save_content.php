<?php
// Production-Hardened CRUD Admin Settings API
// Location: website/api/save_content.php

define('SECURE_ACCESS', true);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// 1. Initialize secure session and rate-limit API calls
init_secure_session();
rate_limit($pdo, 'admin_save_action', 50, 60); // Max 50 settings updates per minute per IP

header('Content-Type: application/json; charset=utf-8');

// 2. SECURITY: Admin Authentication check
if (!isset($_SESSION['admin_user'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'جلسة العمل غير صالحة. يرجى تسجيل الدخول مجدداً.']);
    exit;
}

// 3. SECURITY: CSRF Token check
if (!verify_csrf_from_header()) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'تم رفض العملية: رمز الحماية (CSRF) غير صالح.']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// XSS Prevention: Recursively escape inputs except structural HTML markup if any,
// but for standard keys, we sanitize fully.
$input = escape_xss($input);

try {
    switch ($action) {
        
        // 1. UPDATE GENERAL SETTINGS (KEY-VALUE SYSTEM)
        case 'update_content':
            if (isset($input['content']) && is_array($input['content'])) {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("INSERT INTO content (content_key, content_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_value = ?");
                foreach ($input['content'] as $key => $val) {
                    $stmt->execute([$key, $val, $val]);
                }
                $pdo->commit();
                echo json_encode(['status' => 'success', 'message' => 'تم حفظ وتزامن إعدادات المحتوى العام للموقع بنجاح!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'بيانات المحتوى غير مرسلة بالشكل الصحيح.']);
            }
            break;

        // 2. ARTICLES CRUD
        case 'save_article':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $title_ar = isset($input['title_ar']) ? trim($input['title_ar']) : '';
            $title_en = isset($input['title_en']) ? trim($input['title_en']) : '';
            $cat_ar = isset($input['cat_ar']) ? trim($input['cat_ar']) : '';
            $cat_en = isset($input['cat_en']) ? trim($input['cat_en']) : '';
            $image = isset($input['image']) ? trim($input['image']) : '';
            $excerpt_ar = isset($input['excerpt_ar']) ? trim($input['excerpt_ar']) : '';
            $excerpt_en = isset($input['excerpt_en']) ? trim($input['excerpt_en']) : '';
            $date = isset($input['date']) ? trim($input['date']) : date('Y-m-d');

            if (empty($title_ar) || empty($title_en)) {
                echo json_encode(['status' => 'error', 'message' => 'عنوان المقال باللغتين العربية والانجليزية مطلوب.']);
                break;
            }

            if ($id > 0) {
                // Update with SQL injection protected PDO
                $stmt = $pdo->prepare("UPDATE articles SET title_ar = ?, title_en = ?, cat_ar = ?, cat_en = ?, image = ?, excerpt_ar = ?, excerpt_en = ?, date = ? WHERE id = ?");
                $stmt->execute([$title_ar, $title_en, $cat_ar, $cat_en, $image, $excerpt_ar, $excerpt_en, $date, $id]);
                echo json_encode(['status' => 'success', 'message' => 'تم تحديث المقال بنجاح!']);
            } else {
                // Create
                $stmt = $pdo->prepare("INSERT INTO articles (title_ar, title_en, cat_ar, cat_en, image, excerpt_ar, excerpt_en, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$title_ar, $title_en, $cat_ar, $cat_en, $image, $excerpt_ar, $excerpt_en, $date]);
                echo json_encode(['status' => 'success', 'message' => 'تم نشر المقال الطبي بنجاح!']);
            }
            break;

        case 'delete_article':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'تم حذف المقال بنجاح.']);
            break;

        // 3. TESTIMONIALS CRUD
        case 'save_testimonial':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $name_ar = isset($input['name_ar']) ? trim($input['name_ar']) : '';
            $name_en = isset($input['name_en']) ? trim($input['name_en']) : '';
            $title_ar = isset($input['title_ar']) ? trim($input['title_ar']) : '';
            $title_en = isset($input['title_en']) ? trim($input['title_en']) : '';
            $quote_ar = isset($input['quote_ar']) ? trim($input['quote_ar']) : '';
            $quote_en = isset($input['quote_en']) ? trim($input['quote_en']) : '';
            $image = isset($input['image']) ? trim($input['image']) : null;

            if (empty($name_ar) || empty($quote_ar)) {
                echo json_encode(['status' => 'error', 'message' => 'اسم صاحب التقييم ونص التقييم باللغة العربية مطلوب.']);
                break;
            }

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE testimonials SET name_ar = ?, name_en = ?, title_ar = ?, title_en = ?, quote_ar = ?, quote_en = ?, image = ? WHERE id = ?");
                $stmt->execute([$name_ar, $name_en, $title_ar, $title_en, $quote_ar, $quote_en, $image, $id]);
                echo json_encode(['status' => 'success', 'message' => 'تم تحديث التقييم بنجاح!']);
            } else {
                $stmt = $pdo->prepare("INSERT INTO testimonials (name_ar, name_en, title_ar, title_en, quote_ar, quote_en, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name_ar, $name_en, $title_ar, $title_en, $quote_ar, $quote_en, $image]);
                echo json_encode(['status' => 'success', 'message' => 'تمت إضافة التقييم بنجاح!']);
            }
            break;

        case 'delete_testimonial':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'تم حذف التقييم بنجاح.']);
            break;

        // 4. PORTFOLIO CRUD
        case 'save_portfolio':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $title_ar = isset($input['title_ar']) ? trim($input['title_ar']) : '';
            $title_en = isset($input['title_en']) ? trim($input['title_en']) : '';
            $cat_ar = isset($input['cat_ar']) ? trim($input['cat_ar']) : '';
            $cat_en = isset($input['cat_en']) ? trim($input['cat_en']) : '';
            $metric_ar = isset($input['metric_ar']) ? trim($input['metric_ar']) : '';
            $metric_en = isset($input['metric_en']) ? trim($input['metric_en']) : '';
            $image = isset($input['image']) ? trim($input['image']) : '';

            if (empty($title_ar) || empty($metric_ar)) {
                echo json_encode(['status' => 'error', 'message' => 'عنوان قصة النجاح والإحصائية الرقمية باللغة العربية مطلوب.']);
                break;
            }

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE portfolio SET title_ar = ?, title_en = ?, cat_ar = ?, cat_en = ?, metric_ar = ?, metric_en = ?, image = ? WHERE id = ?");
                $stmt->execute([$title_ar, $title_en, $cat_ar, $cat_en, $metric_ar, $metric_en, $image, $id]);
                echo json_encode(['status' => 'success', 'message' => 'تم تحديث قصة النجاح بنجاح!']);
            } else {
                $stmt = $pdo->prepare("INSERT INTO portfolio (title_ar, title_en, cat_ar, cat_en, metric_ar, metric_en, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$title_ar, $title_en, $cat_ar, $cat_en, $metric_ar, $metric_en, $image]);
                echo json_encode(['status' => 'success', 'message' => 'تمت إضافة قصة النجاح بنجاح!']);
            }
            break;

        case 'delete_portfolio':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $stmt = $pdo->prepare("DELETE FROM portfolio WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'تم حذف قصة النجاح بنجاح.']);
            break;

        // 5. LEADS OPERATIONS
        case 'delete_lead':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'تم حذف طلب الاستشارة بنجاح.']);
            break;

        case 'clear_leads':
            $pdo->exec("DELETE FROM leads");
            echo json_encode(['status' => 'success', 'message' => 'تم مسح كافة طلبات الاستشارة المخزنة.']);
            break;

        // 6. DB FULL RESTORE / IMPORT (WITH TRANSACTION INTEGRITY)
        case 'import_db':
            if (isset($input['content']) && isset($input['articles']) && isset($input['testimonials']) && isset($input['portfolio'])) {
                $pdo->beginTransaction();
                
                // Clear existing safely
                $pdo->exec("DELETE FROM content");
                $pdo->exec("DELETE FROM articles");
                $pdo->exec("DELETE FROM testimonials");
                $pdo->exec("DELETE FROM portfolio");
                $pdo->exec("DELETE FROM media");
                
                // Import content (key-value)
                $stmt = $pdo->prepare("INSERT INTO content (content_key, content_value) VALUES (?, ?)");
                foreach ($input['content'] as $k => $v) {
                    $stmt->execute([$k, $v]);
                }
                
                // Import articles
                $stmt = $pdo->prepare("INSERT INTO articles (id, title_ar, title_en, cat_ar, cat_en, image, excerpt_ar, excerpt_en, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['articles'] as $art) {
                    $stmt->execute([
                        (int)$art['id'], $art['title_ar'], $art['title_en'],
                        $art['cat_ar'], $art['cat_en'], $art['image'],
                        $art['excerpt_ar'], $art['excerpt_en'], $art['date']
                    ]);
                }
                
                // Import testimonials
                $stmt = $pdo->prepare("INSERT INTO testimonials (id, name_ar, name_en, title_ar, title_en, quote_ar, quote_en, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['testimonials'] as $t) {
                    $img = isset($t['image']) ? $t['image'] : null;
                    $stmt->execute([
                        (int)$t['id'], $t['name_ar'], $t['name_en'],
                        $t['title_ar'], $t['title_en'], $t['quote_ar'], $t['quote_en'], $img
                    ]);
                }
                
                // Import portfolio
                $stmt = $pdo->prepare("INSERT INTO portfolio (id, title_ar, title_en, cat_ar, cat_en, metric_ar, metric_en, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['portfolio'] as $p) {
                    $stmt->execute([
                        (int)$p['id'], $p['title_ar'], $p['title_en'],
                        $p['cat_ar'], $p['cat_en'], $p['metric_ar'], $p['metric_en'], $p['image']
                    ]);
                }

                // Import media list
                if (isset($input['media'])) {
                    $stmt = $pdo->prepare("INSERT INTO media (id, name, url) VALUES (?, ?, ?)");
                    foreach ($input['media'] as $med) {
                        $stmt->execute([(int)$med['id'], $med['name'], $med['url']]);
                    }
                }
                
                $pdo->commit();
                secure_log_error("Full database import successfully completed by: " . $_SESSION['admin_user'], 'INFO');
                echo json_encode(['status' => 'success', 'message' => 'تم استيراد قاعدة بيانات الموقع بنجاح بالكامل!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'تنسيق الملف المستورد غير صحيح.']);
            }
            break;

        // 7. SECURITY & CREDENTIALS CONTROLLER
        case 'update_credentials':
            $current_username = $_SESSION['admin_user'] ?? '';
            $current_pass_input = isset($input['current_password']) ? trim($input['current_password']) : '';
            $new_username = isset($input['new_username']) ? trim($input['new_username']) : '';
            $new_password = isset($input['new_password']) ? trim($input['new_password']) : '';

            if (empty($current_pass_input) || empty($new_username)) {
                echo json_encode(['status' => 'error', 'message' => 'جميع الحقول مطلوبة لتغيير إعدادات الأمان.']);
                break;
            }

            // 1. Verify current password
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$current_username]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($current_pass_input, $user['password'])) {
                secure_log_error("Failed credential update attempt for user: $current_username", 'SECURITY');
                echo json_encode(['status' => 'error', 'message' => 'كلمة المرور الحالية غير صحيحة.']);
                break;
            }

            // 2. Perform updates
            if (!empty($new_password)) {
                // Enforce password strength: minimum 8 characters
                if (strlen($new_password) < 8) {
                    echo json_encode(['status' => 'error', 'message' => 'يجب ألا تقل كلمة المرور الجديدة عن 8 خانات.']);
                    break;
                }
                // Update username & password
                $new_pass_hash = password_hash($new_password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET username = ?, password = ? WHERE id = ?");
                $stmt->execute([$new_username, $new_pass_hash, $user['id']]);
            } else {
                // Update username only
                $stmt = $pdo->prepare("UPDATE users SET username = ? WHERE id = ?");
                $stmt->execute([$new_username, $user['id']]);
            }

            // Update session variables
            $_SESSION['admin_user'] = $new_username;
            secure_log_error("Credentials updated successfully for user: $new_username", 'INFO');

            echo json_encode(['status' => 'success', 'message' => 'تم تحديث إعدادات الحساب والأمان بنجاح!']);
            break;

        // 8. MEDIA TRASH/DELETE FILE CONTROLLER
        case 'delete_media':
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $stmt = $pdo->prepare("SELECT * FROM media WHERE id = ?");
            $stmt->execute([$id]);
            $mediaItem = $stmt->fetch();
            
            if ($mediaItem) {
                $filePath = realpath(__DIR__ . '/../' . $mediaItem['url']);
                $uploadBaseDir = realpath(__DIR__ . '/../uploads/');
                
                // Prevent directory traversal attacks on deletes
                if ($filePath && strpos($filePath, $uploadBaseDir) === 0) {
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                }
                
                $stmt2 = $pdo->prepare("DELETE FROM media WHERE id = ?");
                $stmt2->execute([$id]);
                
                echo json_encode(['status' => 'success', 'message' => 'تم حذف الصورة من خادم الموقع والمكتبة بنجاح!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'الصورة غير موجودة في قاعدة البيانات.']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'إجراء غير معروف.']);
            break;
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    secure_log_error("Database Exception: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'حدث خطأ غير متوقع في قاعدة البيانات.']);
}

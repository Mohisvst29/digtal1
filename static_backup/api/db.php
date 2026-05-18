<?php
// Secure PDO Database Configuration and Auto-Initializer
// Location: website/api/db.php

error_reporting(E_ALL);
ini_set('display_errors', 0); // Hide in production, log errors

$host = 'localhost';
$dbname = 'u363963266_dejatal1';
$username = 'u363963266_dejatal1';
$password = 'dejatal121@#';
$remote_host = 'srv1815.hstgr.io'; // Hostinger Remote MySQL Host

// Detect if we are running locally or on production
$is_local = false;
if (isset($_SERVER['HTTP_HOST'])) {
    $host_name = strtolower($_SERVER['HTTP_HOST']);
    if (strpos($host_name, 'localhost') !== false || strpos($host_name, '127.0.0.1') !== false || strpos($host_name, '::1') !== false) {
        $is_local = true;
    }
} else {
    $is_local = true; // Default to local for CLI/scripts
}

try {
    if ($is_local) {
        // Try connecting directly to the remote Hostinger database from local machine
        $pdo = new PDO("mysql:host=$remote_host;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 4 // 4 seconds timeout to fail fast if remote MySQL is blocked/offline
        ]);
    } else {
        // Running on the live server itself, connect locally for best performance
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    $pdo->exec("SET NAMES utf8mb4");
} catch (PDOException $e) {
    // Fallback 1: Try local server with production credentials (if created locally)
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec("SET NAMES utf8mb4");
    } catch (PDOException $e2) {
        // Fallback 1.5: Try local root with the production password (in case root has this password locally)
        try {
            $pdo = new PDO("mysql:host=localhost;charset=utf8mb4", "root", $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            $pdo->exec("SET NAMES utf8mb4");
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $pdo->exec("USE `$dbname`;");
        } catch (PDOException $e3) {
            // Fallback 1.75: Try local root with password 'root' (common in MAMP/some local setups)
            try {
                $pdo = new PDO("mysql:host=localhost;charset=utf8mb4", "root", "root", [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
                $pdo->exec("SET NAMES utf8mb4");
                $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
                $pdo->exec("USE `$dbname`;");
            } catch (PDOException $e4) {
                // Fallback 2: Try standard local server with default XAMPP/WAMP 'root' and empty password
                try {
                    $pdo = new PDO("mysql:host=localhost;charset=utf8mb4", "root", "", [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]);
                    $pdo->exec("SET NAMES utf8mb4");
                    
                    // Auto-create database if it doesn't exist locally
                    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
                    $pdo->exec("USE `$dbname`;");
                } catch (PDOException $localErr) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'فشل الاتصال بقاعدة البيانات محلياً وعبر الخادم. الرجاء التأكد من تشغيل خادم MySQL (مثل XAMPP أو WampServer أو Laragon). إذا كنت تستخدم كلمة مرور للمستخدم root في خادمك المحلي غير "dejatal121@#"، يرجى كتابتها في ملف api/db.php في السطر 11 أو سطر الاتصال. | Database connection failed locally and remotely. Please ensure your MySQL server (like XAMPP or Laragon) is running. If you are using a custom password for root locally, please update it in website/api/db.php on line 11. Details: ' . $e->getMessage() . ' | Fallback error: ' . $localErr->getMessage()
                    ], JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }
    }
}

// ----------------------------------------------------
// AUTO-INITIALIZE TABLES IF THEY ARE MISSING
// ----------------------------------------------------

try {
    // 1. Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Content Table (key-value store for static elements)
    $pdo->exec("CREATE TABLE IF NOT EXISTS content (
        content_key VARCHAR(50) PRIMARY KEY,
        content_value TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 3. Articles Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        cat_ar VARCHAR(100) NOT NULL,
        cat_en VARCHAR(100) NOT NULL,
        image TEXT NULL,
        excerpt_ar TEXT NOT NULL,
        excerpt_en TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 4. Testimonials Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        quote_ar TEXT NOT NULL,
        quote_en TEXT NOT NULL,
        image TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 5. Portfolio Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        cat_ar VARCHAR(100) NOT NULL,
        cat_en VARCHAR(100) NOT NULL,
        metric_ar VARCHAR(255) NOT NULL,
        metric_en VARCHAR(255) NOT NULL,
        image TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 6. Leads / Contact Form Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        client_type VARCHAR(100) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        services TEXT NOT NULL,
        budget VARCHAR(100) NOT NULL,
        referrer VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 7. Media Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 8. Rate Limits Table (XSS, Rate Limiting, DDoS protection support)
    $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        action_key VARCHAR(100) NOT NULL,
        request_time INT NOT NULL,
        KEY idx_rate_ip_action (ip_address, action_key, request_time)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 9. Login Attempts Table (Brute force prevention support)
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        username VARCHAR(100) NOT NULL,
        attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        success TINYINT(1) DEFAULT 0,
        KEY idx_login_ip_time (ip_address, attempt_time)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // ----------------------------------------------------
    // SEED DEFAULT ADMIN ACCOUNT IF EMPTY
    // ----------------------------------------------------
    $userCheck = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCheck == 0) {
        $defaultUser = 'admin';
        $defaultPass = password_hash('dejatal121@#', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->execute([$defaultUser, $defaultPass]);
    }

    // ----------------------------------------------------
    // SEED DEFAULT GENERAL CONTENT IF EMPTY
    // ----------------------------------------------------
    $contentCheck = $pdo->query("SELECT COUNT(*) FROM content")->fetchColumn();
    if ($contentCheck == 0) {
        $defaultContent = [
            'contact_phone' => '+9660541659332',
            'contact_whatsapp' => '+9660541659332',
            'contact_email' => 'info@digitalhealth.agency',
            'contact_address' => 'الرياض، المملكة العربية السعودية',
            'contact_map_iframe' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9782522502677!2d46.708890784999994!3d24.6589332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03f7e5d8f63b%3A0xe5a3c08cd4ad4e2c!2sPrince%20Abdulaziz%20Bin%20Musaid%20Bin%20Jalawi%20St%2C%20Al%20Murabba%2C%20Riyadh%2012628!5e0!3m2!1sen!2ssa!4v1700000000000',
            'hero_title_ar' => 'شريك النمو الطبي الاستراتيجي',
            'hero_title_en' => 'Integrated Medical Growth for Your Clinic',
            'hero_tagline_ar' => 'نهتم بالهوية الرقمية للعيادات الطبية المتخصصة، تحسين محركات البحث، وجذب المرضى بأعلى معايير المصداقية المهنية.',
            'hero_tagline_en' => 'Empowering healthcare providers and doctors in the Kingdom with digital leadership and patient attraction under the highest clinical authority standards.',
            'logo_text_ar' => 'ديجيتال هيلث',
            'logo_text_en' => 'Digital Health',
            'logo_image' => 'assets/logo.png',
            'font_family_ar' => 'Tajawal',
            'font_family_en' => 'Plus Jakarta Sans',
            'primary_color' => '#00daf3',
            'secondary_color' => '#00e3fd',
            'bg_color' => '#011230',
            'surface_color' => '#0e1f3d',
            'seo_title_ar' => 'ديجيتال هيلث | وكالة تسويق رقمي طبي في الرياض',
            'seo_title_en' => 'Digital Health | Medical Digital Marketing Agency in Riyadh',
            'seo_desc_ar' => 'وكالة تسويق رقمي طبي متخصصة في الرياض. نساعد الأطباء، العيادات، والمستشفيات على جذب المرضى وزيادة الحجوزات من خلال استراتيجيات تسويق طبية.',
            'seo_desc_en' => 'Specialized medical digital marketing agency in Riyadh. We help doctors, clinics, and hospitals attract patients and increase bookings through medical marketing strategies.',
            'seo_keywords_ar' => 'تسويق طبي, تسويق عيادات, سيو طبي, الهوية الطبية, جذب المرضى, الرياض',
            'seo_keywords_en' => 'medical marketing, clinic marketing, medical seo, medical identity, patient attraction, Riyadh'
        ];
        
        $stmt = $pdo->prepare("INSERT INTO content (content_key, content_value) VALUES (?, ?)");
        foreach ($defaultContent as $key => $val) {
            $stmt->execute([$key, $val]);
        }
    } else {
        // Fallback: Ensure missing branding and SEO keys are created safely on existing database
        $requiredKeys = [
            'contact_whatsapp' => '+9660541659332',
            'contact_map_iframe' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9782522502677!2d46.708890784999994!3d24.6589332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03f7e5d8f63b%3A0xe5a3c08cd4ad4e2c!2sPrince%20Abdulaziz%20Bin%20Musaid%20Bin%20Jalawi%20St%2C%20Al%20Murabba%2C%20Riyadh%2012628!5e0!3m2!1sen!2ssa!4v1700000000000',
            'logo_text_ar' => 'ديجيتال هيلث',
            'logo_text_en' => 'Digital Health',
            'logo_image' => 'assets/logo.png',
            'font_family_ar' => 'Tajawal',
            'font_family_en' => 'Plus Jakarta Sans',
            'primary_color' => '#00daf3',
            'secondary_color' => '#00e3fd',
            'bg_color' => '#011230',
            'surface_color' => '#0e1f3d',
            'seo_title_ar' => 'ديجيتال هيلث | وكالة تسويق رقمي طبي في الرياض',
            'seo_title_en' => 'Digital Health | Medical Digital Marketing Agency in Riyadh',
            'seo_desc_ar' => 'وكالة تسويق رقمي طبي متخصصة في الرياض. نساعد الأطباء، العيادات، والمستشفيات على جذب المرضى وزيادة الحجوزات من خلال استراتيجيات تسويق طبية.',
            'seo_desc_en' => 'Specialized medical digital marketing agency in Riyadh. We help doctors, clinics, and hospitals attract patients and increase bookings through medical marketing strategies.',
            'seo_keywords_ar' => 'تسويق طبي, تسويق عيادات, سيو طبي, الهوية الطبية, جذب المرضى, الرياض',
            'seo_keywords_en' => 'medical marketing, clinic marketing, medical seo, medical identity, patient attraction, Riyadh'
        ];
        
        $stmt = $pdo->prepare("INSERT IGNORE INTO content (content_key, content_value) VALUES (?, ?)");
        foreach ($requiredKeys as $k => $v) {
            $stmt->execute([$k, $v]);
        }
    }

    // Dynamic Database Migration: Force set logo_image to assets/logo.png if it's empty to display the new logo
    $pdo->exec("UPDATE content SET content_value = 'assets/logo.png' WHERE content_key = 'logo_image' AND (content_value = '' OR content_value IS NULL)");

    // ----------------------------------------------------
    // SEED DEFAULT ARTICLES IF EMPTY
    // ----------------------------------------------------
    $artCheck = $pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
    if ($artCheck == 0) {
        $defaultArticles = [
            [
                'title_ar' => 'كيف تختار الهوية البصرية المناسبة لعيادتك الطبية؟',
                'title_en' => 'How to Choose the Right Visual Identity for Your Medical Clinic?',
                'cat_ar' => 'الهوية الطبية',
                'cat_en' => 'Medical Identity',
                'image' => 'assets/blog-identity.jpg',
                'excerpt_ar' => 'الهوية البصرية ليست مجرد شعار، بل هي حجر الأساس لبناء ثقة المرضى والمصداقية المهنية في القطاع الصحي.',
                'excerpt_en' => 'Visual identity is not just a logo, but the cornerstone for building patient trust and professional credibility in the health sector.',
                'date' => date('Y-m-d')
            ],
            [
                'title_ar' => 'دليل السيو الطبي: تصدر نتائج البحث وجذب مرضى جدد لعيادتك',
                'title_en' => 'Medical SEO Guide: Rank High on Search Engines and Attract Patients',
                'cat_ar' => 'السيو الطبي',
                'cat_en' => 'Medical SEO',
                'image' => 'assets/blog-seo.jpg',
                'excerpt_ar' => 'تعلم كيف يبحث المرضى عن الخدمات الطبية في الرياض، وكيف تجعل موقع عيادتك الخيار الأول على محرك جوجل.',
                'excerpt_en' => 'Learn how patients search for medical services in Riyadh, and how to make your clinic website the first choice on Google.',
                'date' => date('Y-m-d')
            ]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO articles (title_ar, title_en, cat_ar, cat_en, image, excerpt_ar, excerpt_en, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($defaultArticles as $art) {
            $stmt->execute([
                $art['title_ar'], $art['title_en'],
                $art['cat_ar'], $art['cat_en'],
                $art['image'],
                $art['excerpt_ar'], $art['excerpt_en'],
                $art['date']
            ]);
        }
    }

    // ----------------------------------------------------
    // SEED DEFAULT TESTIMONIALS IF EMPTY
    // ----------------------------------------------------
    $testCheck = $pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
    if ($testCheck == 0) {
        $defaultTestimonial = [
            'name_ar' => 'د. خالد عبد الرحمن',
            'name_en' => 'Dr. Khaled Abdulrahman',
            'title_ar' => 'استشاري جراحة التجميل - الرياض',
            'title_en' => 'Consultant Plastic Surgeon - Riyadh',
            'quote_ar' => 'حققت حملات ديجيتال هيلث نتائج مبهرة جداً لعيادتنا. تضاعف عدد الحجوزات ونمت سمعتنا الطبية بشكل احترافي.',
            'quote_en' => 'Digital Health campaigns achieved impressive results for our clinic. Bookings doubled and our professional medical reputation grew.',
            'image' => null
        ];
        $stmt = $pdo->prepare("INSERT INTO testimonials (name_ar, name_en, title_ar, title_en, quote_ar, quote_en, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $defaultTestimonial['name_ar'], $defaultTestimonial['name_en'],
            $defaultTestimonial['title_ar'], $defaultTestimonial['title_en'],
            $defaultTestimonial['quote_ar'], $defaultTestimonial['quote_en'],
            $defaultTestimonial['image']
        ]);
    }

    // ----------------------------------------------------
    // SEED DEFAULT PORTFOLIO IF EMPTY
    // ----------------------------------------------------
    $portCheck = $pdo->query("SELECT COUNT(*) FROM portfolio")->fetchColumn();
    if ($portCheck == 0) {
        $defaultPortfolio = [
            'title_ar' => 'حملة نمو مركز النخبة لطب الأسنان',
            'title_en' => 'Growth Campaign for Al Nokhba Dental Center',
            'cat_ar' => 'إعلانات ممولة وسيو',
            'cat_en' => 'Paid Ads & SEO',
            'metric_ar' => 'زيادة 142% في الحجوزات المؤكدة',
            'metric_en' => '+142% Increase in Confirmed Bookings',
            'image' => 'assets/case-dental.jpg'
        ];
        $stmt = $pdo->prepare("INSERT INTO portfolio (title_ar, title_en, cat_ar, cat_en, metric_ar, metric_en, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $defaultPortfolio['title_ar'], $defaultPortfolio['title_en'],
            $defaultPortfolio['cat_ar'], $defaultPortfolio['cat_en'],
            $defaultPortfolio['metric_ar'], $defaultPortfolio['metric_en'],
            $defaultPortfolio['image']
        ]);
    }

} catch (PDOException $ex) {
    // Log exception but do not halt if tables already exist
    error_log("Database initialization notice: " . $ex->getMessage());
}

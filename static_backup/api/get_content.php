<?php
// Production-Hardened Content Retrieval API
// Location: website/api/get_content.php

define('SECURE_ACCESS', true);
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// Initialize secure session to read admin status
init_secure_session();

// Rate limiting: Max 120 content requests per minute per IP (generous for standard page loads)
rate_limit($pdo, 'public_fetch_content', 120, 60);

header('Content-Type: application/json; charset=utf-8');

try {
    // 1. Fetch content table (key-value store)
    $contentRows = $pdo->query("SELECT * FROM content")->fetchAll();
    $content = [];
    foreach ($contentRows as $row) {
        $content[$row['content_key']] = $row['content_value'];
    }

    // 2. Fetch articles
    $articles = $pdo->query("SELECT * FROM articles ORDER BY id DESC")->fetchAll();
    foreach ($articles as &$art) {
        $art['id'] = (int)$art['id'];
    }

    // 3. Fetch testimonials
    $testimonials = $pdo->query("SELECT * FROM testimonials ORDER BY id DESC")->fetchAll();
    foreach ($testimonials as &$test) {
        $test['id'] = (int)$test['id'];
    }

    // 4. Fetch portfolio
    $portfolio = $pdo->query("SELECT * FROM portfolio ORDER BY id DESC")->fetchAll();
    foreach ($portfolio as &$port) {
        $port['id'] = (int)$port['id'];
    }

    // 5. Fetch media library URLs
    $media = $pdo->query("SELECT * FROM media ORDER BY id DESC")->fetchAll();
    foreach ($media as &$med) {
        $med['id'] = (int)$med['id'];
    }

    // 6. Fetch leads / consults (STRICTLY FOR LOGGED IN ADMIN ONLY)
    $leads = [];
    if (isset($_SESSION['admin_user'])) {
        $leadsRows = $pdo->query("SELECT * FROM leads ORDER BY id DESC")->fetchAll();
        foreach ($leadsRows as $row) {
            $leads[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'phone' => $row['phone'],
                'email' => $row['email'],
                'clientType' => $row['client_type'],
                'specialty' => $row['specialty'],
                'services' => !empty($row['services']) ? json_decode($row['services'], true) : [],
                'budget' => $row['budget'],
                'referrer' => $row['referrer'],
                'message' => $row['message'],
                'date' => $row['date']
            ];
        }
    }

    // Output unified site database structure safely
    echo json_encode([
        'status' => 'success',
        'content' => $content,
        'articles' => $articles,
        'testimonials' => $testimonials,
        'portfolio' => $portfolio,
        'media' => $media,
        'leads' => $leads
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    secure_log_error("Content fetching DB error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'فشل في استرجاع محتوى الموقع.'
    ]);
}

<?php
/**
 * Contact Form API
 * POST /php-api/contact.php → Send contact message
 * GET /php-api/contact.php → List messages (admin only)
 * PATCH /php-api/contact.php → Mark as read
 * DELETE /php-api/contact.php → Delete message
 */

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

// Rate limiting for contact form (prevent spam)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/portfolio_contact_' . md5($ip) . '.json';
$maxAttempts = 5; // Max 5 messages per hour
$windowSeconds = 3600; // 1 hour

$db = getDB();

// Create table if not exists
$db->exec("CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// GET - List messages (requires admin auth)
if ($method === 'GET') {
    requireAuth();
    $stmt = $db->query('SELECT id, name, email, subject, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC');
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// PATCH - Mark as read
if ($method === 'PATCH') {
    requireAuth();
    $body = getJsonBody();
    $id = intval($body['id'] ?? 0);
    $isRead = $body['is_read'] ?? true;
    
    if ($id <= 0) {
        jsonResponse(['error' => 'Geçersiz mesaj ID'], 400);
    }
    
    $stmt = $db->prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?');
    $stmt->execute([$isRead ? 1 : 0, $id]);
    
    jsonResponse(['success' => true]);
}

// DELETE - Delete message
if ($method === 'DELETE') {
    requireAuth();
    $body = getJsonBody();
    $id = intval($body['id'] ?? 0);
    
    if ($id <= 0) {
        jsonResponse(['error' => 'Geçersiz mesaj ID'], 400);
    }
    
    $stmt = $db->prepare('DELETE FROM contact_messages WHERE id = ?');
    $stmt->execute([$id]);
    
    jsonResponse(['success' => true]);
}

// POST - Send message
if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Rate limit check
if (file_exists($rateLimitFile)) {
    $rateData = json_decode(file_get_contents($rateLimitFile), true);
    if ($rateData && $rateData['count'] >= $maxAttempts && (time() - $rateData['first']) < $windowSeconds) {
        $remaining = ceil(($windowSeconds - (time() - $rateData['first'])) / 60);
        jsonResponse(['error' => "Çok fazla mesaj gönderildi. $remaining dakika sonra tekrar deneyin."], 429);
    }
    if ((time() - $rateData['first']) >= $windowSeconds) {
        $rateData = ['count' => 0, 'first' => time()];
    }
} else {
    $rateData = ['count' => 0, 'first' => time()];
}

$body = getJsonBody();

$name = trim($body['name'] ?? '');
$email = trim($body['email'] ?? '');
$subject = trim($body['subject'] ?? '');
$message = trim($body['message'] ?? '');

// Validation
if (empty($name) || strlen($name) < 2) {
    jsonResponse(['error' => 'İsim en az 2 karakter olmalı'], 400);
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Geçerli bir e-posta adresi girin'], 400);
}

if (empty($message) || strlen($message) < 10) {
    jsonResponse(['error' => 'Mesaj en az 10 karakter olmalı'], 400);
}

if (strlen($message) > 5000) {
    jsonResponse(['error' => 'Mesaj çok uzun (max 5000 karakter)'], 400);
}

// Honeypot check (bot detection)
if (!empty($body['website'])) {
    // Bot detected, silently accept but don't process
    jsonResponse(['success' => true, 'message' => 'Mesajınız alındı!']);
}

// Save message
$stmt = $db->prepare('INSERT INTO contact_messages (name, email, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([
    $name,
    $email,
    $subject ?: 'Konu belirtilmedi',
    $message,
    $ip,
    $_SERVER['HTTP_USER_AGENT'] ?? ''
]);

// Update rate limit
$rateData['count']++;
file_put_contents($rateLimitFile, json_encode($rateData));

// Optional: Send email notification
$adminEmail = getenv('ADMIN_EMAIL');
if ($adminEmail && filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
    $emailSubject = "Yeni İletişim Formu: " . ($subject ?: 'Konu belirtilmedi');
    $emailBody = "İsim: $name\nE-posta: $email\nKonu: $subject\n\nMesaj:\n$message";
    $headers = "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    @mail($adminEmail, $emailSubject, $emailBody, $headers);
}

jsonResponse([
    'success' => true,
    'message' => 'Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.'
], 201);

<?php
/**
 * Admin Authentication API
 * POST /php-api/auth.php  → Login
 */

require_once __DIR__ . '/helpers.php';

if (method() !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Rate limiting: max 5 login attempts per IP per 15 minutes
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/portfolio_login_' . md5($ip) . '.json';
$maxAttempts = 5;
$windowSeconds = 900; // 15 minutes

if (file_exists($rateLimitFile)) {
    $rateData = json_decode(file_get_contents($rateLimitFile), true);
    if ($rateData && $rateData['count'] >= $maxAttempts && (time() - $rateData['first']) < $windowSeconds) {
        $remaining = $windowSeconds - (time() - $rateData['first']);
        jsonResponse(['error' => "Çok fazla deneme. $remaining saniye sonra tekrar deneyin."], 429);
    }
    if ($rateData && (time() - $rateData['first']) >= $windowSeconds) {
        $rateData = null; // Reset window
    }
}

$body = getJsonBody();
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if (empty($username) || empty($password)) {
    jsonResponse(['error' => 'Kullanıcı adı ve şifre gerekli.'], 400);
}

$db = getDB();

// Find admin
$stmt = $db->prepare('SELECT id, username, password FROM admins WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin) {
    // Track failed attempt
    $rateData = $rateData ?? ['count' => 0, 'first' => time()];
    $rateData['count']++;
    file_put_contents($rateLimitFile, json_encode($rateData));
    jsonResponse(['error' => 'Kullanıcı adı veya şifre hatalı.'], 401);
}

// Verify password
if (!password_verify($password, $admin['password'])) {
    // Track failed attempt
    $rateData = $rateData ?? ['count' => 0, 'first' => time()];
    $rateData['count']++;
    file_put_contents($rateLimitFile, json_encode($rateData));
    jsonResponse(['error' => 'Kullanıcı adı veya şifre hatalı.'], 401);
}

// Successful login - clear rate limit
if (file_exists($rateLimitFile)) {
    unlink($rateLimitFile);
}

// Generate token
$token = generateToken($admin['id'], $admin['username']);

jsonResponse([
    'success' => true,
    'token' => $token,
    'user' => [
        'id' => $admin['id'],
        'username' => $admin['username'],
    ]
]);

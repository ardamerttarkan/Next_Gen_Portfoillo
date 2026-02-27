<?php
/**
 * Admin Authentication API
 * POST   /php-api/auth.php              → Login
 * PUT    /php-api/auth.php              → Update credentials (auth required)
 */

require_once __DIR__ . '/helpers.php';

$method = method();

if ($method === 'PUT') {
    // ===== UPDATE ADMIN CREDENTIALS =====
    $user = requireAuth();
    $body = getJsonBody();

    $newUsername = trim($body['username'] ?? '');
    $newPassword = $body['password'] ?? '';
    $currentPassword = $body['currentPassword'] ?? '';

    if (empty($currentPassword)) {
        jsonResponse(['error' => 'Mevcut şifre gerekli.'], 400);
    }

    $db = getDB();

    // Verify current password
    $stmt = $db->prepare('SELECT id, username, password FROM admins WHERE id = ?');
    $stmt->execute([$user['id']]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($currentPassword, $admin['password'])) {
        jsonResponse(['error' => 'Mevcut şifre hatalı.'], 403);
    }

    // Build update
    $fields = [];
    $params = [];

    if (!empty($newUsername) && $newUsername !== $admin['username']) {
        // Check if username already taken
        $check = $db->prepare('SELECT id FROM admins WHERE username = ? AND id != ?');
        $check->execute([$newUsername, $admin['id']]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Bu kullanıcı adı zaten kullanılıyor.'], 409);
        }
        $fields[] = 'username = ?';
        $params[] = $newUsername;
    }

    if (!empty($newPassword)) {
        if (strlen($newPassword) < 6) {
            jsonResponse(['error' => 'Şifre en az 6 karakter olmalı.'], 400);
        }
        $fields[] = 'password = ?';
        $params[] = password_hash($newPassword, PASSWORD_DEFAULT);
    }

    if (empty($fields)) {
        jsonResponse(['error' => 'Değiştirilecek bilgi yok.'], 400);
    }

    $params[] = $admin['id'];
    $sql = 'UPDATE admins SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    // Generate new token with updated info
    $finalUsername = !empty($newUsername) ? $newUsername : $admin['username'];
    $token = generateToken($admin['id'], $finalUsername);

    jsonResponse([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $admin['id'],
            'username' => $finalUsername,
        ]
    ]);
}

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Rate limiting: max 5 login attempts per IP per 15 minutes
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/portfolio_login_' . md5($ip) . '.json';
$maxAttempts = 5;
$windowSeconds = 900; // 15 minutes

// Eski rate limit dosyalarını temizle (windowSeconds'ı geçmiş olanlar)
// Her istekte sadece %5 olasılıkla çalışır (performans optimizasyonu)
if (random_int(1, 20) === 1) {
    $pattern = sys_get_temp_dir() . '/portfolio_login_*.json';
    foreach (glob($pattern) ?: [] as $f) {
        if (file_exists($f) && (time() - filemtime($f)) > $windowSeconds) {
            @unlink($f);
        }
    }
}

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

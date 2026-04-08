<?php
/**
 * Setup Script - Run once to initialize the database with default admin
 * 
 * Usage: 
 *   php php-api/setup.php                          # Rastgele güvenli şifre oluşturur
 *   php php-api/setup.php --password="MySecure123" # Özel şifre belirler
 * 
 * NOT: Bu script sadece CLI veya localhost üzerinden çalışır.
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

// Security: Only allow CLI or localhost access
$isCli = php_sapi_name() === 'cli';
$isLocalhost = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1', 'localhost']);
if (!$isCli && !$isLocalhost) {
    http_response_code(403);
    echo json_encode(['error' => 'Setup is only accessible from localhost']);
    exit;
}

/**
 * Güvenli rastgele şifre oluşturur
 */
function generateSecurePassword(int $length = 16): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    $password = '';
    $max = strlen($chars) - 1;
    for ($i = 0; $i < $length; $i++) {
        $password .= $chars[random_int(0, $max)];
    }
    return $password;
}

/**
 * Şifre güvenlik kontrolü
 */
function validatePassword(string $password): array
{
    $errors = [];
    if (strlen($password) < 8) {
        $errors[] = 'Şifre en az 8 karakter olmalı';
    }
    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = 'Şifre en az 1 büyük harf içermeli';
    }
    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = 'Şifre en az 1 küçük harf içermeli';
    }
    if (!preg_match('/[0-9]/', $password)) {
        $errors[] = 'Şifre en az 1 rakam içermeli';
    }
    return $errors;
}

$db = getDB();

// Şifreyi belirle: CLI argümanı, environment variable veya rastgele oluştur
$password = null;
$isGeneratedPassword = false;

// CLI argümanından al
if ($isCli && isset($argv)) {
    foreach ($argv as $arg) {
        if (strpos($arg, '--password=') === 0) {
            $password = substr($arg, 11);
        }
    }
}

// Environment variable'dan al
if (!$password) {
    $password = getenv('ADMIN_INITIAL_PASSWORD');
}

// Hiçbiri yoksa güvenli rastgele şifre oluştur
if (!$password) {
    $password = generateSecurePassword(16);
    $isGeneratedPassword = true;
}

// Şifre validasyonu
$validationErrors = validatePassword($password);
if (!empty($validationErrors)) {
    echo json_encode([
        'error' => 'Şifre güvenlik gereksinimlerini karşılamıyor',
        'details' => $validationErrors
    ], JSON_UNESCAPED_UNICODE);
    exit(1);
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if admin exists
$stmt = $db->prepare('SELECT id FROM admins WHERE username = ?');
$stmt->execute(['admin']);
$existing = $stmt->fetch();

$response = [
    'status' => $existing ? 'Admin password updated' : 'Admin created',
    'username' => 'admin',
];

if ($isGeneratedPassword) {
    $response['generated_password'] = $password;
    $response['warning'] = '⚠️ Bu şifreyi güvenli bir yere kaydedin! Tekrar gösterilmeyecek.';
}

if ($existing) {
    $stmt = $db->prepare('UPDATE admins SET password = ? WHERE username = ?');
    $stmt->execute([$hashedPassword, 'admin']);
} else {
    $stmt = $db->prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
    $stmt->execute(['admin', $hashedPassword]);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
echo "\n";

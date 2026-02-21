<?php
/**
 * Setup Script - Run once to initialize the database with default admin
 * 
 * Usage: php php-api/setup.php
 * Or visit: http://localhost/Next_Gen_Portfoillo/php-api/setup.php
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

$db = getDB();

// Create/update admin with hashed password
$hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);

// Check if admin exists
$stmt = $db->prepare('SELECT id FROM admins WHERE username = ?');
$stmt->execute(['admin']);
$existing = $stmt->fetch();

if ($existing) {
    // Update password
    $stmt = $db->prepare('UPDATE admins SET password = ? WHERE username = ?');
    $stmt->execute([$hashedPassword, 'admin']);
    echo json_encode(['status' => 'Admin password updated', 'username' => 'admin', 'password' => 'admin123']);
} else {
    // Insert
    $stmt = $db->prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
    $stmt->execute(['admin', $hashedPassword]);
    echo json_encode(['status' => 'Admin created', 'username' => 'admin', 'password' => 'admin123']);
}

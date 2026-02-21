<?php
/**
 * Common helpers for all API endpoints
 */

require_once __DIR__ . '/config.php';

// CORS Headers
$allowedOrigin = getenv('CORS_ORIGIN') ?: 'http://localhost:3000';
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: $allowedOrigin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Read JSON body from request
 */
function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Send JSON response
 */
function jsonResponse(mixed $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Simple JWT-like token (HMAC based)
 */
$jwtSecret = getenv('JWT_SECRET');
if (!$jwtSecret) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error: JWT_SECRET not set']);
    exit;
}
define('SECRET_KEY', $jwtSecret);

function generateToken(int $adminId, string $username): string
{
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'id' => $adminId,
        'username' => $username,
        'exp' => time() + (24 * 60 * 60), // 24 hours
    ]));
    $signature = hash_hmac('sha256', "$header.$payload", SECRET_KEY);
    return "$header.$payload.$signature";
}

function verifyToken(): array|false
{
    // Support multiple ways Apache/CGI passes Authorization header
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    // Also check Apache function
    if (empty($authHeader) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        return false;
    }

    $token = $matches[1];
    $parts = explode('.', $token);
    if (count($parts) !== 3)
        return false;

    [$header, $payload, $signature] = $parts;

    // Verify signature
    $expectedSig = hash_hmac('sha256', "$header.$payload", SECRET_KEY);
    if (!hash_equals($expectedSig, $signature))
        return false;

    // Decode payload
    $data = json_decode(base64_decode($payload), true);
    if (!$data)
        return false;

    // Check expiration
    if (isset($data['exp']) && $data['exp'] < time())
        return false;

    return $data;
}

/**
 * Require authentication - call at top of protected endpoints
 */
function requireAuth(): array
{
    $user = verifyToken();
    if (!$user) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
    return $user;
}

/**
 * Get request method
 */
function method(): string
{
    return $_SERVER['REQUEST_METHOD'];
}

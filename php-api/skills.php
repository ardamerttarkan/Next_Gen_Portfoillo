<?php
/**
 * Skills API
 * GET    /php-api/skills.php              → List all
 * POST   /php-api/skills.php              → Create (auth required)
 * PUT    /php-api/skills.php?name=xxx     → Update (auth required)
 * DELETE /php-api/skills.php?name=xxx     → Delete (auth required)
 */

require_once __DIR__ . '/helpers.php';

$db = getDB();

switch (method()) {
    case 'GET':
        $stmt = $db->query('SELECT name, level FROM skills ORDER BY level DESC, name ASC');
        $skills = $stmt->fetchAll();
        jsonResponse($skills);
        break;

    case 'POST':
        requireAuth();
        $body = getJsonBody();

        $name = trim($body['name'] ?? '');
        $level = intval($body['level'] ?? 50);
        $level = max(0, min(100, $level));

        if (empty($name)) {
            jsonResponse(['error' => 'Skill name is required'], 400);
        }

        $stmt = $db->prepare('INSERT INTO skills (name, level) VALUES (?, ?) ON DUPLICATE KEY UPDATE level = ?');
        $stmt->execute([$name, $level, $level]);

        jsonResponse(['success' => true], 201);
        break;

    case 'PUT':
        requireAuth();
        $name = $_GET['name'] ?? '';
        if (empty($name))
            jsonResponse(['error' => 'Name required'], 400);

        $body = getJsonBody();
        $newName = trim($body['name'] ?? $name);
        $level = intval($body['level'] ?? 50);
        $level = max(0, min(100, $level));

        $stmt = $db->prepare('UPDATE skills SET name=?, level=? WHERE name=?');
        $stmt->execute([$newName, $level, $name]);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        requireAuth();
        $name = $_GET['name'] ?? '';
        if (empty($name))
            jsonResponse(['error' => 'Name required'], 400);

        $stmt = $db->prepare('DELETE FROM skills WHERE name = ?');
        $stmt->execute([$name]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

<?php
/**
 * Projects API
 * GET    /php-api/projects.php        → List all
 * POST   /php-api/projects.php        → Create (auth required)
 * PUT    /php-api/projects.php?id=xxx → Update (auth required)
 * DELETE /php-api/projects.php?id=xxx → Delete (auth required)
 */

require_once __DIR__ . '/helpers.php';

$db = getDB();

switch (method()) {
    case 'GET':
        $stmt = $db->query('SELECT * FROM projects ORDER BY created_at ASC');
        $projects = $stmt->fetchAll();

        // Convert tech_stack JSON string to array
        foreach ($projects as &$p) {
            $p['techStack'] = json_decode($p['tech_stack'], true) ?? [];
            $p['repoUrl'] = $p['repo_url'];
            $p['liveUrl'] = $p['live_url'];
            unset($p['tech_stack'], $p['repo_url'], $p['live_url'], $p['created_at'], $p['updated_at']);
        }

        jsonResponse($projects);
        break;

    case 'POST':
        requireAuth();
        $body = getJsonBody();

        $id = $body['id'] ?? uniqid('p_');
        $title = trim($body['title'] ?? '');
        $description = trim($body['description'] ?? '');
        $techStack = json_encode($body['techStack'] ?? []);
        $repoUrl = trim($body['repoUrl'] ?? '');
        $liveUrl = trim($body['liveUrl'] ?? '');
        $image = $body['image'] ?? '';

        if (empty($title)) {
            jsonResponse(['error' => 'Title is required'], 400);
        }

        $stmt = $db->prepare('
            INSERT INTO projects (id, title, description, tech_stack, repo_url, live_url, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([$id, $title, $description, $techStack, $repoUrl, $liveUrl, $image]);

        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $body = getJsonBody();
        $title = trim($body['title'] ?? '');
        $description = trim($body['description'] ?? '');
        $techStack = json_encode($body['techStack'] ?? []);
        $repoUrl = trim($body['repoUrl'] ?? '');
        $liveUrl = trim($body['liveUrl'] ?? '');
        $image = $body['image'] ?? '';

        $stmt = $db->prepare('
            INSERT INTO projects (id, title, description, tech_stack, repo_url, live_url, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), tech_stack=VALUES(tech_stack), repo_url=VALUES(repo_url), live_url=VALUES(live_url), image=VALUES(image)
        ');
        $stmt->execute([$id, $title, $description, $techStack, $repoUrl, $liveUrl, $image]);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $stmt = $db->prepare('DELETE FROM projects WHERE id = ?');
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

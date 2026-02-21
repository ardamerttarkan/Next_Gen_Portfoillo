<?php
/**
 * Blogs API
 * GET    /php-api/blogs.php              → List all (optional ?category=tech|hobby)
 * POST   /php-api/blogs.php              → Create (auth required)
 * PUT    /php-api/blogs.php?id=xxx       → Update (auth required)
 * DELETE /php-api/blogs.php?id=xxx       → Delete (auth required)
 */

require_once __DIR__ . '/helpers.php';

$db = getDB();

switch (method()) {
    case 'GET':
        $category = $_GET['category'] ?? null;

        if ($category && in_array($category, ['tech', 'hobby'])) {
            $stmt = $db->prepare('SELECT * FROM blogs WHERE category = ? ORDER BY created_at DESC');
            $stmt->execute([$category]);
        } else {
            $stmt = $db->query('SELECT * FROM blogs ORDER BY created_at DESC');
        }

        $blogs = $stmt->fetchAll();

        // Map field names to camelCase
        foreach ($blogs as &$b) {
            $b['readTime'] = $b['read_time'];
            unset($b['read_time'], $b['created_at'], $b['updated_at']);
        }

        jsonResponse($blogs);
        break;

    case 'POST':
        requireAuth();
        $body = getJsonBody();

        $id = $body['id'] ?? uniqid('b_');
        $title = trim($body['title'] ?? '');
        $excerpt = trim($body['excerpt'] ?? '');
        $content = $body['content'] ?? '';
        $date = $body['date'] ?? date('Y-m-d');
        $readTime = $body['readTime'] ?? '5 min';
        $category = $body['category'] ?? 'tech';
        $image = $body['image'] ?? '';

        if (empty($title)) {
            jsonResponse(['error' => 'Title is required'], 400);
        }

        $stmt = $db->prepare('
            INSERT INTO blogs (id, title, excerpt, content, date, read_time, category, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([$id, $title, $excerpt, $content, $date, $readTime, $category, $image]);

        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $body = getJsonBody();
        $title = trim($body['title'] ?? '');
        $excerpt = trim($body['excerpt'] ?? '');
        $content = $body['content'] ?? '';
        $date = $body['date'] ?? '';
        $readTime = $body['readTime'] ?? '';
        $category = $body['category'] ?? 'tech';
        $image = $body['image'] ?? '';

        $stmt = $db->prepare('
            INSERT INTO blogs (id, title, excerpt, content, date, read_time, category, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title=VALUES(title), excerpt=VALUES(excerpt), content=VALUES(content), date=VALUES(date), read_time=VALUES(read_time), category=VALUES(category), image=VALUES(image)
        ');
        $stmt->execute([$id, $title, $excerpt, $content, $date, $readTime, $category, $image]);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $stmt = $db->prepare('DELETE FROM blogs WHERE id = ?');
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

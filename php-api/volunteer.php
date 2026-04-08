<?php
/**
 * Volunteer API
 * GET    /php-api/volunteer.php              → List all
 * POST   /php-api/volunteer.php              → Create (auth required)
 * PUT    /php-api/volunteer.php?id=xxx       → Update (auth required)
 * DELETE /php-api/volunteer.php?id=xxx       → Delete (auth required)
 */

require_once __DIR__ . '/helpers.php';

$db = getDB();

// Tablo yoksa oluştur
$db->exec("CREATE TABLE IF NOT EXISTS volunteer (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('club', 'community', 'event', 'other') DEFAULT 'club',
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    description TEXT,
    tech_stack JSON,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

switch (method()) {
    case 'GET':
        $stmt = $db->query('SELECT id, type, title, organization, location, start_date, end_date, description, tech_stack FROM volunteer ORDER BY start_date DESC, sort_order ASC');
        $items = $stmt->fetchAll();

        $result = array_map(function ($row) {
            return [
                'id' => $row['id'],
                'type' => $row['type'],
                'title' => $row['title'],
                'organization' => $row['organization'],
                'location' => $row['location'] ?: '',
                'startDate' => $row['start_date'],
                'endDate' => $row['end_date'] ?: '',
                'description' => $row['description'],
                'techStack' => json_decode($row['tech_stack'] ?: '[]', true),
            ];
        }, $items);

        jsonResponse($result);
        break;

    case 'POST':
        requireAuth();
        $body = getJsonBody();

        $id = trim($body['id'] ?? ('volunteer_' . uniqid()));
        $type = in_array($body['type'] ?? '', ['club', 'community', 'event', 'other']) ? $body['type'] : 'club';
        $title = trim($body['title'] ?? '');
        $organization = trim($body['organization'] ?? '');
        $location = trim($body['location'] ?? '');
        $startDate = trim($body['startDate'] ?? '');
        $endDate = trim($body['endDate'] ?? '');
        $description = trim($body['description'] ?? '');
        $techStack = json_encode($body['techStack'] ?? [], JSON_UNESCAPED_UNICODE);

        if (empty($title) || empty($organization)) {
            jsonResponse(['error' => 'Title and organization are required'], 400);
        }
        if (empty($startDate)) {
            jsonResponse(['error' => 'Start date is required'], 400);
        }

        $stmt = $db->prepare('INSERT INTO volunteer (id, type, title, organization, location, start_date, end_date, description, tech_stack) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$id, $type, $title, $organization, $location, $startDate, $endDate, $description, $techStack]);

        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $body = getJsonBody();

        $fields = [];
        $params = [];

        if (isset($body['type'])) {
            $fields[] = 'type = ?';
            $params[] = in_array($body['type'], ['club', 'community', 'event', 'other']) ? $body['type'] : 'club';
        }
        if (isset($body['title'])) {
            $fields[] = 'title = ?';
            $params[] = trim($body['title']);
        }
        if (isset($body['organization'])) {
            $fields[] = 'organization = ?';
            $params[] = trim($body['organization']);
        }
        if (array_key_exists('location', $body)) {
            $fields[] = 'location = ?';
            $params[] = trim($body['location'] ?? '');
        }
        if (isset($body['startDate'])) {
            $fields[] = 'start_date = ?';
            $params[] = trim($body['startDate']);
        }
        if (array_key_exists('endDate', $body)) {
            $fields[] = 'end_date = ?';
            $params[] = trim($body['endDate'] ?? '');
        }
        if (isset($body['description'])) {
            $fields[] = 'description = ?';
            $params[] = trim($body['description']);
        }
        if (isset($body['techStack'])) {
            $fields[] = 'tech_stack = ?';
            $params[] = json_encode($body['techStack'], JSON_UNESCAPED_UNICODE);
        }

        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $sql = 'UPDATE volunteer SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $stmt = $db->prepare('DELETE FROM volunteer WHERE id = ?');
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

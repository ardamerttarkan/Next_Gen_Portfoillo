<?php
/**
 * Career API
 * GET    /php-api/career.php              → List all
 * POST   /php-api/career.php              → Create (auth required)
 * PUT    /php-api/career.php?id=xxx       → Update (auth required)
 * DELETE /php-api/career.php?id=xxx       → Delete (auth required)
 */

require_once __DIR__ . '/helpers.php';

$db = getDB();

switch (method()) {
    case 'GET':
        $stmt = $db->query('SELECT id, type, title, company, location, start_date, end_date, description, tech_stack FROM career ORDER BY start_date DESC, sort_order ASC');
        $items = $stmt->fetchAll();

        // Transform DB columns to camelCase for frontend
        $result = array_map(function ($row) {
            return [
                'id' => $row['id'],
                'type' => $row['type'],
                'title' => $row['title'],
                'company' => $row['company'],
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

        $id = trim($body['id'] ?? ('career_' . uniqid()));
        $type = in_array($body['type'] ?? '', ['work', 'internship', 'freelance']) ? $body['type'] : 'work';
        $title = trim($body['title'] ?? '');
        $company = trim($body['company'] ?? '');
        $location = trim($body['location'] ?? '');
        $startDate = trim($body['startDate'] ?? '');
        $endDate = trim($body['endDate'] ?? '');
        $description = trim($body['description'] ?? '');
        $techStack = json_encode($body['techStack'] ?? [], JSON_UNESCAPED_UNICODE);

        if (empty($title) || empty($company)) {
            jsonResponse(['error' => 'Title and company are required'], 400);
        }
        if (empty($startDate)) {
            jsonResponse(['error' => 'Start date is required'], 400);
        }

        $stmt = $db->prepare('INSERT INTO career (id, type, title, company, location, start_date, end_date, description, tech_stack) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$id, $type, $title, $company, $location, $startDate, $endDate, $description, $techStack]);

        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $body = getJsonBody();

        // Build dynamic update
        $fields = [];
        $params = [];

        if (isset($body['type'])) {
            $fields[] = 'type = ?';
            $params[] = in_array($body['type'], ['work', 'internship', 'freelance']) ? $body['type'] : 'work';
        }
        if (isset($body['title'])) {
            $fields[] = 'title = ?';
            $params[] = trim($body['title']);
        }
        if (isset($body['company'])) {
            $fields[] = 'company = ?';
            $params[] = trim($body['company']);
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
        $sql = 'UPDATE career SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        requireAuth();
        $id = $_GET['id'] ?? '';
        if (empty($id))
            jsonResponse(['error' => 'ID required'], 400);

        $stmt = $db->prepare('DELETE FROM career WHERE id = ?');
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

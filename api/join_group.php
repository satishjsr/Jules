<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$group_id = $_POST['group_id'] ?? '';
$guest_name = $_POST['guest_name'] ?? '';
$dietary_tag = $_POST['dietary_tag'] ?? 'Veg';

if (empty($group_id) || empty($guest_name)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$db = get_db_connection();
if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Verify group exists
$check = $db->prepare('SELECT status FROM group_sessions WHERE group_id = :gid');
$check->bindValue(':gid', $group_id, SQLITE3_TEXT);
$result = $check->execute()->fetchArray(SQLITE3_ASSOC);

if (!$result || $result['status'] !== 'Active') {
    echo json_encode(['success' => false, 'message' => 'Group session not found or inactive']);
    exit;
}

$stmt = $db->prepare('INSERT INTO group_members (group_id, guest_name, dietary_tag) VALUES (:gid, :name, :tag)');
$stmt->bindValue(':gid', $group_id, SQLITE3_TEXT);
$stmt->bindValue(':name', $guest_name, SQLITE3_TEXT);
$stmt->bindValue(':tag', $dietary_tag, SQLITE3_TEXT);

if ($stmt->execute()) {
    $guest_id = $db->lastInsertRowID();
    echo json_encode([
        'success' => true,
        'guest_id' => $guest_id,
        'group_id' => $group_id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to join group']);
}
?>

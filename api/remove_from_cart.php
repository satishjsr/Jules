<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$group_id = $_POST['group_id'] ?? '';
$guest_id = $_POST['guest_id'] ?? '';
$item_id = $_POST['item_id'] ?? '';

if (empty($group_id) || empty($guest_id) || empty($item_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$db = get_db_connection();
if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$stmt = $db->prepare('DELETE FROM group_cart WHERE group_id = :gid AND guest_id = :guest AND item_id = :item');
$stmt->bindValue(':gid', $group_id, SQLITE3_TEXT);
$stmt->bindValue(':guest', $guest_id, SQLITE3_INTEGER);
$stmt->bindValue(':item', $item_id, SQLITE3_TEXT);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to remove item']);
}
?>

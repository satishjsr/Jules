<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$host_name = $_POST['host_name'] ?? 'Guest';
$budget_limit = floatval($_POST['budget_limit'] ?? 0);
$group_id = bin2hex(random_bytes(4)); // Generate 8-char hex ID

$db = get_db_connection();
if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$stmt = $db->prepare('INSERT INTO group_sessions (host_name, group_id, status, budget_limit) VALUES (:host, :gid, "Active", :budget)');
$stmt->bindValue(':host', $host_name, SQLITE3_TEXT);
$stmt->bindValue(':gid', $group_id, SQLITE3_TEXT);
$stmt->bindValue(':budget', $budget_limit, SQLITE3_FLOAT);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'group_id' => $group_id,
        'share_link' => "https://templestreet.in/menu.php?group=$group_id&host=" . urlencode($host_name)
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create group session']);
}
?>

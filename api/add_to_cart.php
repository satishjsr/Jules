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
$qty = intval($_POST['qty'] ?? 1);

if (empty($group_id) || empty($guest_id) || empty($item_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$db = get_db_connection();
if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if item already in cart for this guest
$check = $db->prepare('SELECT id, qty FROM group_cart WHERE group_id = :gid AND guest_id = :guest AND item_id = :item');
$check->bindValue(':gid', $group_id, SQLITE3_TEXT);
$check->bindValue(':guest', $guest_id, SQLITE3_INTEGER);
$check->bindValue(':item', $item_id, SQLITE3_TEXT);
$res = $check->execute()->fetchArray(SQLITE3_ASSOC);

if ($res) {
    $new_qty = $res['qty'] + $qty;
    $stmt = $db->prepare('UPDATE group_cart SET qty = :qty WHERE id = :id');
    $stmt->bindValue(':qty', $new_qty, SQLITE3_INTEGER);
    $stmt->bindValue(':id', $res['id'], SQLITE3_INTEGER);
} else {
    $stmt = $db->prepare('INSERT INTO group_cart (group_id, item_id, guest_id, qty) VALUES (:gid, :item, :guest, :qty)');
    $stmt->bindValue(':gid', $group_id, SQLITE3_TEXT);
    $stmt->bindValue(':item', $item_id, SQLITE3_TEXT);
    $stmt->bindValue(':guest', $guest_id, SQLITE3_INTEGER);
    $stmt->bindValue(':qty', $qty, SQLITE3_INTEGER);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update cart']);
}
?>

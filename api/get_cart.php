<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/config.php';

$group_id = $_GET['group_id'] ?? '';

if (empty($group_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing group_id']);
    exit;
}

$db = get_db_connection();
if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Fetch all items in the group cart, joined with guest names
$query = "
    SELECT gc.item_id, gc.qty, gm.guest_name, gm.id as guest_id
    FROM group_cart gc
    JOIN group_members gm ON gc.guest_id = gm.id
    WHERE gc.group_id = :gid
    ORDER BY gm.guest_name ASC
";

$stmt = $db->prepare($query);
$stmt->bindValue(':gid', $group_id, SQLITE3_TEXT);
$result = $stmt->execute();

$cart_data = [];
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $guest_name = $row['guest_name'];
    if (!isset($cart_data[$guest_name])) {
        $cart_data[$guest_name] = [];
    }
    $cart_data[$guest_name][] = [
        'item_id' => $row['item_id'],
        'qty' => $row['qty'],
        'guest_id' => $row['guest_id']
    ];
}

echo json_encode([
    'success' => true,
    'cart' => $cart_data
]);
?>

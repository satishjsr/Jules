<?php
require_once 'auth.php';
check_auth();

$db = get_db_connection();

// Fetch Active Group Sessions
$sessions_query = $db->query("SELECT * FROM group_sessions ORDER BY id DESC");
$active_sessions_count = $db->querySingle("SELECT COUNT(*) FROM group_sessions WHERE status = 'Active'");
$total_members_count = $db->querySingle("SELECT COUNT(*) FROM group_members");
$total_items_count = $db->querySingle("SELECT COUNT(*) FROM group_cart");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - Temple Street</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/admin_dashboard.css">
</head>
<body>
    <div class="sidebar">
        <h2>TS 2030 Admin</h2>
        <nav>
            <a href="dashboard.php" class="nav-link">🏠 Dashboard</a>
            <a href="#" class="nav-link">🛒 Group Orders</a>
            <a href="#" class="nav-link">📋 Menu Management</a>
            <a href="#" class="nav-link">📊 Analytics</a>
            <a href="logout.php" class="nav-link mt-50 text-danger">🚪 Logout</a>
        </nav>
    </div>
    <div class="main-content">
        <div class="header">
            <h1>Welcome, <?php echo htmlspecialchars($_SESSION['admin_user']); ?></h1>
            <span><?php echo date('l, F j, Y'); ?></span>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Active Group Sessions</h3>
                <p><?php echo $active_sessions_count; ?></p>
            </div>
            <div class="stat-card">
                <h3>Total Group Members</h3>
                <p><?php echo $total_members_count; ?></p>
            </div>
            <div class="stat-card">
                <h3>Items in Group Carts</h3>
                <p><?php echo $total_items_count; ?></p>
            </div>
        </div>

        <div class="mt-40 bg-white p-30 rounded-20 shadow-sm">
            <h2>Recent Group Activity</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid #F5F5F5;">
                        <th style="padding: 10px;">Host Name</th>
                        <th style="padding: 10px;">Group ID</th>
                        <th style="padding: 10px;">Status</th>
                        <th style="padding: 10px;">Budget</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = $sessions_query->fetchArray(SQLITE3_ASSOC)): ?>
                        <tr style="border-bottom: 1px solid #F9F9F9;">
                            <td style="padding: 10px;"><?php echo htmlspecialchars($row['host_name']); ?></td>
                            <td style="padding: 10px;"><?php echo htmlspecialchars($row['group_id']); ?></td>
                            <td style="padding: 10px;">
                                <span style="color: <?php echo $row['status'] == 'Active' ? '#004331' : '#666'; ?>; font-weight: 700;">
                                    <?php echo $row['status']; ?>
                                </span>
                            </td>
                            <td style="padding: 10px;">₹<?php echo $row['budget_limit']; ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>

<?php
require_once 'auth.php';
check_auth();

// Placeholder for database connection
// $db = new SQLite3('../data/temple_street.db');
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
                <p>0</p>
            </div>
            <div class="stat-card">
                <h3>Total Orders Today</h3>
                <p>0</p>
            </div>
            <div class="stat-card">
                <h3>Revenue Today</h3>
                <p>₹0.00</p>
            </div>
        </div>

        <div class="mt-40 bg-white p-30 rounded-20 shadow-sm">
            <h2>Live Group Activity</h2>
            <p class="text-muted">No active group orders at the moment. When Phase 3 is implemented, live polling will appear here.</p>
        </div>
    </div>
</body>
</html>

<?php
// Temple Street 2030 - Menu Page
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

$outlet = isset($_GET['outlet']) ? $_GET['outlet'] : 'rajinder';
$outlet_name = ($outlet == 'ashok') ? "Ashok Nagar" : "Old Rajinder Nagar";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu - Temple Street <?php echo htmlspecialchars($outlet_name); ?></title>
    <link rel="stylesheet" href="assets/css/landing_2030.css">
    <link rel="stylesheet" href="assets/css/menu_2030.css">
</head>
<body>
    <header class="top-navbar">
        <a href="index.php" class="back-link">⬅️ Back</a>
        <h1 class="outlet-title"><?php echo htmlspecialchars($outlet_name); ?></h1>
    </header>

    <div class="menu-container">
        <h2 class="category-title">Popular Items</h2>
        <div class="menu-item">
            <div class="item-info">
                <h3>Special Veg Thali</h3>
                <span class="item-price">₹249</span>
            </div>
            <button class="add-btn">ADD</button>
        </div>
        <div class="menu-item">
            <div class="item-info">
                <h3>Paneer Butter Masala</h3>
                <span class="item-price">₹189</span>
            </div>
            <button class="add-btn">ADD</button>
        </div>
    </div>

    <!-- Multiplayer Group Order Banner (Future Phase) -->
    <div id="group-order-banner" class="hidden">
        Start a Group Order! 👥
    </div>

    <script src="assets/js/landing.js"></script>
</body>
</html>

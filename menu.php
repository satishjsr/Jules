<?php
require_once 'includes/config.php';
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://templestreet.in;");

$outlet = isset($_GET['outlet']) ? $_GET['outlet'] : 'rajinder';
$outlet_name = ($outlet == 'ashok') ? "Ashok Nagar" : "Old Rajinder Nagar";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Menu - Temple Street <?php echo htmlspecialchars($outlet_name); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/landing_2030.css?v=2030.7">
    <link rel="stylesheet" href="assets/css/group_order.css?v=2030.7">
</head>
<body>

<header class="ts-top-header">
    <div class="ts-loc-wrapper">
        <a href="index.php" class="no-style">⬅️ Back</a>
    </div>
    <div class="ts-logo-wrapper">
        <img src="https://templestreet.in/assets/images/templestreet-logo.png" alt="Temple Street">
    </div>
</header>

<div class="menu-section">
    <h2 class="category-header">Popular Items</h2>

    <div class="item-card">
        <div class="item-info">
            <h3 class="item-name">Special Veg Thali</h3>
            <span class="item-price">₹249</span>
            <p style="color: #666; font-size: 0.8rem; margin-top: 5px;">A complete meal with Paneer, Dal, Sabzi, Rice, and Roti.</p>
        </div>
        <div class="item-img-wrapper">
            <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200" class="item-img">
            <button class="add-btn">ADD</button>
        </div>
    </div>

    <div class="item-card">
        <div class="item-info">
            <h3 class="item-name">Paneer Butter Masala</h3>
            <span class="item-price">₹189</span>
            <p style="color: #666; font-size: 0.8rem; margin-top: 5px;">Rich and creamy paneer curry in butter sauce.</p>
        </div>
        <div class="item-img-wrapper">
            <img src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=200" class="item-img">
            <button class="add-btn">ADD</button>
        </div>
    </div>
</div>

<div id="group-order-banner" class="hidden">
    Start a Group Order! 👥
</div>

<button id="glowing-cart" class="glowing-cart-btn hidden">
    🛒
    <span id="cart-count" class="cart-badge">0</span>
</button>

<script src="assets/js/group_order.js?v=2030.7"></script>
</body>
</html>

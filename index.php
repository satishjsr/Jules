<?php
require_once 'includes/config.php';
// Reconstructed original index.php with security headers
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://fonts.googleapis.com https://maps.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' https://maps.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://templestreet.in https://maps.gstatic.com https://maps.googleapis.com; connect-src 'self' https://maps.googleapis.com;");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <title>Order Pure Veg Food Online | Temple Street Delhi</title>
    <meta name="description" content="Order premium pure vegetarian food online from Temple Street. Authentic North Indian, South Indian, Thalis & Snacks.">
    <meta id="google-maps-config" data-api-key="<?php echo GOOGLE_MAPS_API_KEY; ?>">

    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/landing_2030.css?v=2030.7">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Temple Street",
      "servesCuisine": "Pure Vegetarian"
    }
    </script>
</head>
<body>

    <header class="top-navbar">
    <img src="https://templestreet.in/assets/images/templestreet-logo.png" alt="Temple Street" class="nav-logo">
    <div class="nav-pill">
        ⭐ 4.6 • ✅ Pure Veg
    </div>
</header>

<div class="header-compact"></div>

    <main class="container">
        <section class="hero fade-in-up">
            <h1 class="hero-title" id="dynamic-greeting">Pure Veg. Cooked Fresh. Delivered Hot.</h1>
            <p class="hero-subtitle" id="dynamic-subgreeting">Delhi's most trusted vegetarian kitchen</p>
        </section>

        <p id="ambient-status" class="ambient-status fade-in-up">✨ Sensing your ambient context...</p>

        <section class="outlets-wrapper fade-in-up" id="outlet-list">

            <div class="outlet-card" data-lat="28.6423459" data-lng="77.1861384" data-id="rajinder" data-is-open="true">
                <div class="card-badge hidden-initial">📍 Nearest to you</div>
                <img src="https://templestreet.in/assets/images/rajinder-default.jpg" alt="Old Rajinder Nagar" class="card-img">
                <div class="card-body">
                    <h2 class="outlet-name">Old Rajinder Nagar</h2>
                    <div class="outlet-meta">
                        <span class="rating">⭐ 4.5</span><span class="dot">•</span>
                        <span class="time">🕐 25-35 min</span> <span class="dot">•</span>
                        <span class="distance" id="dist-rajinder"></span>
                    </div>
                    <p class="cuisine-tags">North Indian • Thalis • South Indian</p>
                    <div class="status-row">
                            <span class="status-indicator"></span> <span class="text-brand-green font-800">Open Now</span>
                    </div>
                    <a href="menu.php?outlet=rajinder" class="order-btn haptic-order">ORDER NOW ➔</a>
                </div>
            </div>

            <div class="outlet-card" data-lat="28.637239" data-lng="77.0997542" data-id="ashok" data-is-open="true">
                <div class="card-badge hidden-initial">📍 Nearest to you</div>
                <img src="https://templestreet.in/assets/images/ashok-default.jpg" alt="Ashok Nagar" class="card-img">
                <div class="card-body">
                    <h2 class="outlet-name">Ashok Nagar</h2>
                    <div class="outlet-meta">
                        <span class="rating">⭐ 4.6</span><span class="dot">•</span>
                        <span class="time">🕐 30-40 min</span> <span class="dot">•</span>
                        <span class="distance" id="dist-ashok"></span>
                    </div>
                    <p class="cuisine-tags">North Indian • Thalis • Snacks</p>
                    <div class="status-row">
                            <span class="status-indicator"></span> <span class="text-brand-green font-800">Open Now</span>
                    </div>
                    <a href="menu.php?outlet=ashok" class="order-btn haptic-order">ORDER NOW ➔</a>
                </div>
            </div>

        </section>
    </main>

    <script src="assets/js/landing.js?v=2030.7"></script>
</body>
</html>

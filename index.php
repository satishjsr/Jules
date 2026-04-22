<?php
// Temple Street 2030 - Security Headers
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://templestreet.in;");

$page_title = "Order Pure Veg Food Online | Temple Street Delhi | Rajinder Nagar & Ashok Nagar";
$page_description = "Order premium pure vegetarian food online from Temple Street. Authentic North Indian, South Indian, Thalis & Snacks delivered hot and fresh. Open in Old Rajinder Nagar & Ashok Nagar.";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $page_description; ?>">
    <meta name="keywords" content="pure veg restaurant delhi, order pure veg food, temple street menu, south indian food rajinder nagar, veg thali ashok nagar, vegetarian food delivery">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://templestreet.in/">
    <meta property="og:title" content="Temple Street - Premium Pure Veg Food Delivery">
    <meta property="og:description" content="Craving hot & fresh pure veg food? Order directly from Temple Street. Fastest delivery in Rajinder Nagar & Ashok Nagar.">
    <meta property="og:image" content="https://templestreet.in/assets/images/og-thumbnail.jpg">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
    <?php require_once 'includes/config.php'; ?>
    <link rel="stylesheet" href="assets/css/landing_2030.css?v=2030.6">
    <script>
        const GOOGLE_MAPS_API_KEY = "<?php echo GOOGLE_MAPS_API_KEY; ?>";
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Restaurant",
          "name": "Temple Street - Old Rajinder Nagar",
          "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
          "servesCuisine": "Pure Vegetarian, North Indian, South Indian",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Old Rajinder Nagar",
            "addressLocality": "Delhi",
            "addressRegion": "Delhi",
            "addressCountry": "IN"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "8809"
          }
        },
        {
          "@type": "Restaurant",
          "name": "Temple Street - Ashok Nagar",
          "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
          "servesCuisine": "Pure Vegetarian, North Indian, Thali",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ashok Nagar",
            "addressLocality": "Delhi",
            "addressRegion": "Delhi",
            "addressCountry": "IN"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.6",
            "reviewCount": "8809"
          }
        }
      ]
    }
    </script>
</head>
<body>

    <header class="top-navbar">
        <img src="assets/images/templestreet-logo.png" alt="Temple Street" class="nav-logo">
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
                <img src="https://templestreet.in/assets/images/rajinder-default.jpg" alt="Temple Street Old Rajinder Nagar" class="card-img">
                <div class="card-body">
                    <h2 class="outlet-name">Old Rajinder Nagar</h2>
                    <div class="outlet-meta">
                        <span class="rating">⭐ 4.5</span><span class="dot">•</span>
                        <span class="time">🕐 25-35 min</span>
                    </div>
                    <p class="cuisine-tags">North Indian • Thalis • South Indian</p>
                    <div class="status-row">
                        <span class="status-indicator"></span> <span class="status-text">Open Now</span>
                    </div>
                    <a href="menu.php?outlet=rajinder" class="order-btn haptic-order">ORDER NOW ➔</a>
                </div>
            </div>

            <div class="outlet-card" data-lat="28.637239" data-lng="77.0997542" data-id="ashok" data-is-open="true">
                <div class="card-badge hidden-initial">📍 Nearest to you</div>
                <img src="https://templestreet.in/assets/images/ashok-default.jpg" alt="Temple Street Ashok Nagar" class="card-img">
                <div class="card-body">
                    <h2 class="outlet-name">Ashok Nagar</h2>
                    <div class="outlet-meta">
                        <span class="rating">⭐ 4.6</span><span class="dot">•</span>
                        <span class="time">🕐 30-40 min</span>
                    </div>
                    <p class="cuisine-tags">North Indian • Thalis • Snacks</p>
                    <div class="status-row">
                        <span class="status-indicator"></span> <span class="status-text">Open Now</span>
                    </div>
                    <a href="menu.php?outlet=ashok" class="order-btn haptic-order">ORDER NOW ➔</a>
                </div>
            </div>

        </section>
    </main>

    <script src="assets/js/landing.js?v=2030.6"></script>
</body>
</html>

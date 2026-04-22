<?php
// Temple Street 2030 - Secure Configuration
// NOTE: In a real production environment, these should be environment variables.

define('ADMIN_USERNAME', 'admin');
// Hashed password for 'TempleStreet2030_Secure'
define('ADMIN_PASSWORD_HASH', '$2y$10$FAUbOcLNwU9ac/3I9zj7jeVgG9F..FvHGeKp.eIz3v/j7yfK99rBK');
define('GOOGLE_MAPS_API_KEY', 'YOUR_RESTRICTED_API_KEY_HERE');
define('DB_PATH', __DIR__ . '/../data/temple_street.db');

// Database initialization helper (if needed)
function get_db_connection() {
    try {
        $db = new SQLite3(DB_PATH);
        return $db;
    } catch (Exception $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}
?>

<?php
// Temple Street 2030 - Secure Configuration
// NOTE: In a real production environment, these should be environment variables.

define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'TempleStreet2030_Secure'); // Should be hashed in DB
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

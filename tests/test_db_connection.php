<?php
// Test database connection
require_once 'backend/config/Database.php';

use App\Config\Database;

try {
    echo "Testing database connection...\n";
    
    if (Database::testConnection()) {
        echo "✅ Database connection successful!\n";
    } else {
        echo "❌ Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
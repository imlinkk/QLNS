<?php
/**
 * Database Installation Script
 * Run this file once to set up the HRM database
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>HRM Database Setup</title>";
echo "<style>body{font-family:Arial;padding:20px;background:#f0f0f0}";
echo ".success{color:green;padding:10px;background:#d4edda;border:1px solid green;margin:10px 0}";
echo ".error{color:red;padding:10px;background:#f8d7da;border:1px solid red;margin:10px 0}";
echo ".info{color:blue;padding:10px;background:#d1ecf1;border:1px solid blue;margin:10px 0}</style></head><body>";

echo "<h1>🚀 HRM Database Installation</h1>";

// Database configuration
$host = 'localhost';
$user = 'cdmidkxg_imlink_user';
$pass = '2612Link@';
$dbname = 'cdmidkxg_imlink_hrm';

try {
    echo "<div class='info'>📡 Connecting to MySQL...</div>";
    
    // Connect with database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<div class='success'>✅ Connected to MySQL successfully!</div>";
    
    // Read SQL file
    echo "<div class='info'>📄 Reading init.sql file...</div>";
    $sqlFile = __DIR__ . '/init.sql';  // Sửa đường dẫn nếu file ở chỗ khác
    
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }
    
    $sql = file_get_contents($sqlFile);
    echo "<div class='success'>✅ SQL file loaded successfully!</div>";
    
    // Execute SQL
    echo "<div class='info'>⚙️ Executing SQL queries...</div>";
    $pdo->exec($sql);
    echo "<div class='success'>✅ SQL executed successfully!</div>";
    
    // Check tables
    $result = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<div class='success'>✅ Found " . count($result) . " tables:</div>";
    echo "<ul>";
    foreach ($result as $table) {
        // Count records in table
        try {
            $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
            echo "<li><strong>$table</strong>: $count records</li>";
        } catch (PDOException $e) {
            echo "<li><strong>$table</strong>: (view or error)</li>";
        }
    }
    echo "</ul>";
    
    echo "<div class='success' style='font-size:18px;font-weight:bold'>";
    echo "🎉 DATABASE INSTALLATION COMPLETE!<br><br>";
    echo "👉 You can now access your application at: <a href='index.html'>index.html</a><br>";
    echo "👉 Login with: <strong>admin</strong> / <strong>admin123</strong>";
    echo "</div>";
    
    echo "<div class='info'>";
    echo "<h3>Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Delete this file (install_db.php) for security</li>";
    echo "<li>Open index.html in your browser</li>";
    echo "<li>Login and start using the HRM system</li>";
    echo "</ol>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<div class='error'>";
    echo "❌ <strong>Database Error:</strong><br>";
    echo htmlspecialchars($e->getMessage());
    echo "</div>";
    
    echo "<div class='info'>";
    echo "<h3>Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Check username, password, dbname in this file</li>";
    echo "<li>Make sure MySQL is running on hosting</li>";
    echo "<li>Check permissions for user in cPanel > MySQL Databases</li>";
    echo "</ul>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</div>";
}

echo "</body></html>";
?>
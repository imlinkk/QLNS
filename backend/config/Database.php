<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
private const DB_HOST = 'localhost';
private const DB_NAME = 'cdmidkxg_imlink_hrm';     // ← TÊN DATABASE
private const DB_USER = 'cdmidkxg_imlink_user';   // ← TÊN USER
private const DB_PASS = '2612Link@';            // ← MẬT KHẨU BẠN ĐÃ ĐẶT
private const DB_CHARSET = 'utf8mb4';

// private const DB_HOST = 'localhost';
// private const DB_NAME = 'linh_hrm';     // ← TÊN DATABASE
// private const DB_USER = 'root';   // ← TÊN USER
// private const DB_PASS = 'quan2004';            // ← MẬT KHẨU BẠN ĐÃ ĐẶT
// private const DB_CHARSET = 'utf8mb4';
    // PDO instance (singleton pattern)
    private static ?PDO $instance = null;
    
    /**
     * Private constructor to prevent direct instantiation
     * Implements Singleton pattern
     */
    private function __construct() {}
    
    /**
     * Prevent cloning of the instance
     */
    private function __clone() {}
    
    /**
     * Prevent unserializing of the instance
     */
    public function __wakeup() {
        throw new \Exception("Cannot unserialize singleton");
    }
    
    /**
     * Get database connection instance
     * 
     * @return PDO Database connection
     * @throws PDOException If connection fails
     */
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf(
                    'mysql:host=%s;dbname=%s;charset=%s',
                    self::DB_HOST,
                    self::DB_NAME,
                    self::DB_CHARSET
                );
                
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ];
                
                self::$instance = new PDO($dsn, self::DB_USER, self::DB_PASS, $options);
                
            } catch (PDOException $e) {
                // Log error and throw exception
                error_log("Database connection error: " . $e->getMessage());
                throw new PDOException("Database connection failed: " . $e->getMessage());
            }
        }
        
        return self::$instance;
    }
    
    /**
     * Close database connection
     */
    public static function closeConnection(): void {
        self::$instance = null;
    }
    
    /**
     * Test database connection
     * 
     * @return bool True if connection is successful
     */
    public static function testConnection(): bool {
        try {
            $db = self::getInstance();
            $db->query('SELECT 1');
            return true;
        } catch (PDOException $e) {
            error_log("Database connection test failed: " . $e->getMessage());
            return false;
        }
    }
}

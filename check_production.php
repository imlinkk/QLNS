<?php
/**
 * Production Environment Checker
 * Kiểm tra môi trường production
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$result = [
    'status' => 'checking',
    'time' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
];

// Test database connection
try {
    require_once __DIR__ . '/backend/config/Database.php';
    $db = \App\Config\Database::getInstance();
    $result['database'] = 'Connected successfully';
} catch (Exception $e) {
    $result['database'] = 'Error: ' . $e->getMessage();
}

// Test autoloader
$result['autoloader_exists'] = file_exists(__DIR__ . '/backend/vendor/autoload.php');

// Test core files
$result['files'] = [
    'Request.php' => file_exists(__DIR__ . '/backend/core/Request.php'),
    'Router.php' => file_exists(__DIR__ . '/backend/core/Router.php'),
    'api.php' => file_exists(__DIR__ . '/backend/api.php'),
];

echo json_encode($result, JSON_PRETTY_PRINT);

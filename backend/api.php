<?php
// Error handling: Log errors but don't display them (to avoid breaking JSON responses)
error_reporting(E_ALL);
ini_set('display_errors', 0);  // Don't display errors in response
ini_set('log_errors', 1);       // Log errors to PHP error log

// Set JSON content type early
header('Content-Type: application/json; charset=utf-8');

// Auto-detect environment and set appropriate CORS
$isLocalhost = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80']);

if ($isLocalhost) {
    // Local development - allow all origins
    header('Access-Control-Allow-Origin: *');
} else {
    // Production - allow only same origin
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Autoloader for classes
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require $file;
    } else {
        // Log detailed error
        $errorMsg = "Autoloader: File not found - $file for class $class";
        error_log($errorMsg);
        
        // In case of critical error, output JSON error
        if (!headers_sent()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server configuration error',
                'error' => 'Required class not found: ' . $class
            ]);
            exit;
        }
    }
});

// Import core classes
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;

try {
    // Create request and router instances
    $request = new Request();
    $router = new Router($request);

    // Load route files
    $routeFiles = [
        __DIR__ . '/routes/auth.php',
        __DIR__ . '/routes/employees.php',
        __DIR__ . '/routes/departments.php',
        __DIR__ . '/routes/positions.php',
        __DIR__ . '/routes/salaries.php',
        __DIR__ . '/routes/attendance.php',
        __DIR__ . '/routes/leaves.php',
        __DIR__ . '/routes/performance.php',
    ];

    foreach ($routeFiles as $file) {
        if (file_exists($file)) {
            $registerRoutes = require $file;
            $registerRoutes($router);
        }
    }

    // Dispatch request
    $router->dispatch();
} catch (\Exception $e) {
    error_log("API Error: " . $e->getMessage());
    Response::serverError('An unexpected error occurred', $e->getMessage());
}

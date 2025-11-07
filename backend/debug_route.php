<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

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
    
    // Add a simple test route
    $router->get('/test', function() {
        return [
            'success' => true,
            'message' => 'Test route is working!',
            'data' => [
                'path' => $request->path(),
                'segments' => $request->segments(),
                'method' => $request->method()
            ]
        ];
    });
    
    // Load employee routes
    $routeFile = __DIR__ . '/routes/employees.php';
    if (file_exists($routeFile)) {
        $registerRoutes = require $routeFile;
        $registerRoutes($router);
    }
    
    // Debug info
    echo json_encode([
        'debug' => [
            'request_path' => $request->path(),
            'request_segments' => $request->segments(),
            'request_method' => $request->method(),
            'registered_routes' => count($router->getRoutes() ?? [])
        ]
    ]);
    
    // Dispatch request
    // $router->dispatch();
    
} catch (\Exception $e) {
    error_log("API Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred',
        'error' => $e->getMessage()
    ]);
}
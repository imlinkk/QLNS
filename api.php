<?php
// Simple API test endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple routing based on PATH_INFO
$path = $_SERVER['PATH_INFO'] ?? '/';

switch ($path) {
    case '/employees':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo json_encode([
                'success' => true,
                'data' => [
                    ['id' => 1, 'name' => 'John Doe'],
                    ['id' => 2, 'name' => 'Jane Smith']
                ]
            ]);
        }
        break;
    default:
        echo json_encode([
            'success' => true,
            'message' => 'API is working!',
            'path' => $path
        ]);
}

exit();
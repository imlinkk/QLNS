<?php
// Debug request handling
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

echo json_encode([
    'request_uri' => $_SERVER['REQUEST_URI'] ?? null,
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? null,
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? null,
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? null,
    'path_info' => $_SERVER['PATH_INFO'] ?? null,
    'query_string' => $_SERVER['QUERY_STRING'] ?? null,
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? null,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? null
]);
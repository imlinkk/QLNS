<?php
require_once 'core/Request.php';

use App\Core\Request;

// Create a mock $_SERVER array to simulate a request
$_SERVER['REQUEST_URI'] = '/backend/api.php/employees';
$_SERVER['REQUEST_METHOD'] = 'GET';

$request = new Request();

echo "Request URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "Parsed path: " . $request->path() . "\n";
echo "Segments: " . json_encode($request->segments()) . "\n";
echo "Resource: " . $request->resource() . "\n";
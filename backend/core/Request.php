<?php
/**
 * Request Handler Class
 * 
 * Handles HTTP request parsing and data extraction
 */

namespace App\Core;

class Request {
    private string $method;
    private string $path;
    private array $data;
    private array $segments;
    
    /**
     * Constructor - Parse incoming request
     */
    public function __construct() {
        $this->method = $this->getMethod();
        $this->path = $this->getPath();
        $this->data = $this->getData();
        $this->segments = $this->parseSegments();
    }
    
    /**
     * Get HTTP method
     */
    private function getMethod(): string {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    /**
     * Get request path
     */
    private function getPath(): string {
        $uri = $_SERVER['REQUEST_URI'];
        $path = parse_url($uri, PHP_URL_PATH);
        
        // Remove base path if exists
        $basePath = '/backend';
        if (strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
        }
        
        return rtrim($path, '/');
    }
    
    /**
     * Get request data (JSON or form data)
     */
    private function getData(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'application/json') !== false) {
            $json = file_get_contents('php://input');
            return json_decode($json, true) ?? [];
        }
        
        return array_merge($_POST, $_GET);
    }
    
    /**
     * Parse path segments
     */
    private function parseSegments(): array {
        $segments = array_filter(explode('/', $this->path));
        $segments = array_values($segments);
        
        // Remove 'api.php' if present
        if (!empty($segments) && $segments[0] === 'api.php') {
            array_shift($segments);
        }
        
        return $segments;
    }
    
    /**
     * Get HTTP method
     */
    public function method(): string {
        return $this->method;
    }
    
    /**
     * Get full path
     */
    public function path(): string {
        return $this->path;
    }
    
    /**
     * Get request data
     */
    public function data(): array {
        return $this->data;
    }
    
    /**
     * Get specific data value
     */
    public function get(string $key, $default = null) {
        return $this->data[$key] ?? $default;
    }
    
    /**
     * Get path segments
     */
    public function segments(): array {
        return $this->segments;
    }
    
    /**
     * Get specific segment
     */
    public function segment(int $index, $default = null) {
        return $this->segments[$index] ?? $default;
    }
    
    /**
     * Get resource name (first segment)
     */
    public function resource(): string {
        return $this->segments[0] ?? '';
    }
    
    /**
     * Get resource ID or action (second segment)
     */
    public function resourceId(): ?int {
        $segment = $this->segments[1] ?? null;
        return is_numeric($segment) ? (int)$segment : null;
    }
    
    /**
     * Get action (second segment if not numeric)
     */
    public function action(): ?string {
        $segment = $this->segments[1] ?? null;
        return !is_numeric($segment) ? $segment : null;
    }
    
    /**
     * Check if method is GET
     */
    public function isGet(): bool {
        return $this->method === 'GET';
    }
    
    /**
     * Check if method is POST
     */
    public function isPost(): bool {
        return $this->method === 'POST';
    }
    
    /**
     * Check if method is PUT
     */
    public function isPut(): bool {
        return $this->method === 'PUT';
    }
    
    /**
     * Check if method is DELETE
     */
    public function isDelete(): bool {
        return $this->method === 'DELETE';
    }
}

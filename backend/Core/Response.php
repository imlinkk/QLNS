<?php
/**
 * Response Handler Class
 * 
 * Handles HTTP response formatting and sending
 */

namespace App\Core;

class Response {
    /**
     * Send JSON response
     */
    public static function json(array $data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }
    
    /**
     * Send success response
     */
    public static function success($data = null, string $message = null, int $statusCode = 200): void {
        $response = ['success' => true];
        
        if ($message) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        self::json($response, $statusCode);
    }
    
    /**
     * Send error response
     */
    public static function error(string $message, int $statusCode = 400, $details = null): void {
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($details !== null) {
            $response['error'] = $details;
        }
        
        self::json($response, $statusCode);
    }
    
    /**
     * Send 404 Not Found response
     */
    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, 404);
    }
    
    /**
     * Send 401 Unauthorized response
     */
    public static function unauthorized(string $message = 'Authentication required'): void {
        self::error($message, 401);
    }
    
    /**
     * Send 403 Forbidden response
     */
    public static function forbidden(string $message = 'Access forbidden'): void {
        self::error($message, 403);
    }
    
    /**
     * Send 500 Internal Server Error response
     */
    public static function serverError(string $message = 'Internal server error', $details = null): void {
        self::error($message, 500, $details);
    }
}

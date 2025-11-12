<?php
/**
 * Middleware Class
 * 
 * Handles request middleware like authentication
 */

namespace App\Core;

class Middleware {
    /**
     * Check if user is authenticated
     */
    public static function auth(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
            Response::unauthorized('Authentication required');
        }
    }
    
    /**
     * Check if user has specific role
     */
    public static function role(string $role): void {
        self::auth();
        
        if (!isset($_SESSION['role']) || $_SESSION['role'] !== $role) {
            Response::forbidden('Insufficient permissions');
        }
    }
    
    /**
     * Validate required fields in request data
     */
    public static function validate(Request $request, array $required): void {
        $data = $request->data();
        $missing = [];
        
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            Response::error(
                'Missing required fields: ' . implode(', ', $missing),
                422
            );
        }
    }
}

<?php
/**
 * Authentication Controller
 * 
 * Handles authentication-related requests (login, register, logout)
 * Implements session management
 * 
 * Learning Resources:
 * - Session Management: https://www.php.net/manual/en/book.session.php
 * - Security Best Practices: https://www.php.net/manual/en/security.php
 */

namespace App\Controllers;

use App\Models\UserModel;

class AuthController {
    private UserModel $userModel;
    
    /**
     * Constructor - Initialize UserModel
     */
    public function __construct() {
        $this->userModel = new UserModel();
        
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    /**
     * Handle login request
     * 
     * @param array $data Login data (username, password)
     * @return array Response array
     */
    public function login(array $data): array {
        try {
            // Validate input
            if (empty($data['username']) || empty($data['password'])) {
                return [
                    'success' => false,
                    'message' => 'Username and password are required'
                ];
            }
            
            // Authenticate user
            $user = $this->userModel->authenticate($data['username'], $data['password']);
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Invalid username or password'
                ];
            }
            
            // Store user data in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['full_name'] = $user['full_name'] ?? $user['username'];
            $_SESSION['logged_in'] = true;
            
            return [
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'session_id' => session_id()
                ]
            ];
            
        } catch (\Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred during login'
            ];
        }
    }
    
    /**
     * Handle register request
     * 
     * @param array $data Registration data (username, password, email, etc.)
     * @return array Response array
     */
    public function register(array $data): array {
        try {
            // Validate input
            if (empty($data['username']) || empty($data['password'])) {
                return [
                    'success' => false,
                    'message' => 'Username and password are required'
                ];
            }
            
            // Validate password length
            if (strlen($data['password']) < 6) {
                return [
                    'success' => false,
                    'message' => 'Password must be at least 6 characters long'
                ];
            }
            
            // Check if username already exists
            if ($this->userModel->findByUsername($data['username'])) {
                return [
                    'success' => false,
                    'message' => 'Username already exists'
                ];
            }
            
            // Register user
            $userId = $this->userModel->register($data);
            
            if (!$userId) {
                return [
                    'success' => false,
                    'message' => 'Registration failed'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Registration successful',
                'data' => [
                    'user_id' => $userId
                ]
            ];
            
        } catch (\Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred during registration'
            ];
        }
    }
    
    /**
     * Handle logout request
     * 
     * @return array Response array
     */
    public function logout(): array {
        try {
            // Clear session data
            $_SESSION = [];
            
            // Destroy session cookie
            if (isset($_COOKIE[session_name()])) {
                setcookie(session_name(), '', time() - 3600, '/');
            }
            
            // Destroy session
            session_destroy();
            
            return [
                'success' => true,
                'message' => 'Logout successful'
            ];
            
        } catch (\Exception $e) {
            error_log("Logout error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred during logout'
            ];
        }
    }
    
    /**
     * Check if user is logged in
     * 
     * @return array Response array
     */
    public function checkAuth(): array {
        $isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
        
        if ($isLoggedIn) {
            return [
                'success' => true,
                'authenticated' => true,
                'data' => [
                    'user_id' => $_SESSION['user_id'] ?? null,
                    'username' => $_SESSION['username'] ?? null,
                    'role' => $_SESSION['role'] ?? null,
                    'full_name' => $_SESSION['full_name'] ?? null
                ]
            ];
        }
        
        return [
            'success' => true,
            'authenticated' => false
        ];
    }
    
    /**
     * Get current user data
     * 
     * @return array Response array
     */
    public function getCurrentUser(): array {
        if (!isset($_SESSION['user_id'])) {
            return [
                'success' => false,
                'message' => 'User not logged in'
            ];
        }
        
        $user = $this->userModel->getUserById($_SESSION['user_id']);
        
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found'
            ];
        }
        
        return [
            'success' => true,
            'data' => $user
        ];
    }
    
    /**
     * Update user profile
     * 
     * @param array $data Profile data
     * @return array Response array
     */
    public function updateProfile(array $data): array {
        if (!isset($_SESSION['user_id'])) {
            return [
                'success' => false,
                'message' => 'User not logged in'
            ];
        }
        
        $success = $this->userModel->updateProfile($_SESSION['user_id'], $data);
        
        if ($success) {
            // Update session data if full_name was changed
            if (isset($data['full_name'])) {
                $_SESSION['full_name'] = $data['full_name'];
            }
            
            return [
                'success' => true,
                'message' => 'Profile updated successfully'
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to update profile'
        ];
    }
    
    /**
     * Change password
     * 
     * @param array $data Password change data (old_password, new_password)
     * @return array Response array
     */
    public function changePassword(array $data): array {
        if (!isset($_SESSION['user_id'])) {
            return [
                'success' => false,
                'message' => 'User not logged in'
            ];
        }
        
        if (empty($data['old_password']) || empty($data['new_password'])) {
            return [
                'success' => false,
                'message' => 'Old password and new password are required'
            ];
        }
        
        // Verify old password
        $user = $this->userModel->find($_SESSION['user_id']);
        if (!$user || !password_verify($data['old_password'], $user['password'])) {
            return [
                'success' => false,
                'message' => 'Invalid old password'
            ];
        }
        
        // Update password
        $success = $this->userModel->updatePassword($_SESSION['user_id'], $data['new_password']);
        
        if ($success) {
            return [
                'success' => true,
                'message' => 'Password changed successfully'
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to change password'
        ];
    }
}

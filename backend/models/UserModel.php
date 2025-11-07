<?php
/**
 * User Model Class
 * 
 * Handles user data and authentication operations
 * Extends BaseModel for common CRUD operations
 * 
 * Learning Resources:
 * - Password Hashing: https://www.php.net/manual/en/function.password-hash.php
 * - Authentication Best Practices: https://www.php.net/manual/en/security.php
 */

namespace App\Models;

use PDOException;

class UserModel extends BaseModel {
    protected string $table = 'users';
    
    /**
     * Find user by username
     * 
     * @param string $username Username
     * @return array|null User data or null if not found
     */
    public function findByUsername(string $username): ?array {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE username = :username LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['username' => $username]);
            
            $result = $stmt->fetch();
            return $result ?: null;
            
        } catch (PDOException $e) {
            error_log("Error in findByUsername(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Find user by email
     * 
     * @param string $email Email address
     * @return array|null User data or null if not found
     */
    public function findByEmail(string $email): ?array {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['email' => $email]);
            
            $result = $stmt->fetch();
            return $result ?: null;
            
        } catch (PDOException $e) {
            error_log("Error in findByEmail(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Register a new user
     * 
     * @param array $data User data (username, password, email, etc.)
     * @return int|bool User ID on success, false on failure
     */
    public function register(array $data) {
        try {
            // Check if username already exists
            if ($this->findByUsername($data['username'])) {
                return false; // Username exists
            }
            
            // Hash password
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Set default role if not provided
            if (!isset($data['role'])) {
                $data['role'] = 'employee';
            }
            
            return $this->create($data);
            
        } catch (PDOException $e) {
            error_log("Error in register(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Authenticate user
     * 
     * @param string $username Username
     * @param string $password Plain text password
     * @return array|null User data (without password) or null on failure
     */
    public function authenticate(string $username, string $password): ?array {
        try {
            $user = $this->findByUsername($username);
            
            if (!$user) {
                return null; // User not found
            }
            
            // Verify password
            if (!password_verify($password, $user['password'])) {
                return null; // Invalid password
            }
            
            // Remove password from returned data
            unset($user['password']);
            
            return $user;
            
        } catch (PDOException $e) {
            error_log("Error in authenticate(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Update user password
     * 
     * @param int $userId User ID
     * @param string $newPassword New password
     * @return bool True on success, false on failure
     */
    public function updatePassword(int $userId, string $newPassword): bool {
        try {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            
            return $this->update($userId, ['password' => $hashedPassword]);
            
        } catch (PDOException $e) {
            error_log("Error in updatePassword(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get user by ID (without password)
     * 
     * @param int $id User ID
     * @return array|null User data or null if not found
     */
    public function getUserById(int $id): ?array {
        $user = $this->find($id);
        
        if ($user) {
            unset($user['password']);
        }
        
        return $user;
    }
    
    /**
     * Get all users (without passwords)
     * 
     * @return array Array of users
     */
    public function getAllUsers(): array {
        $users = $this->all();
        
        // Remove passwords from all users
        return array_map(function($user) {
            unset($user['password']);
            return $user;
        }, $users);
    }
    
    /**
     * Update user profile
     * 
     * @param int $userId User ID
     * @param array $data Profile data (email, full_name, etc.)
     * @return bool True on success, false on failure
     */
    public function updateProfile(int $userId, array $data): bool {
        // Remove sensitive fields that shouldn't be updated through profile
        unset($data['password'], $data['username'], $data['role']);
        
        return $this->update($userId, $data);
    }
}

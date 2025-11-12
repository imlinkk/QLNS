<?php
/**
 * Performance Review Model Class
 */

namespace App\Models;

class PerformanceModel extends BaseModel {
    protected string $table = 'performance_reviews';
    
    /**
     * Get reviews by employee
     */
    public function getByEmployee(int $employeeId): array {
        $sql = "SELECT p.*, e.name as employee_name, u.username as reviewer_name
                FROM {$this->table} p
                LEFT JOIN employees e ON p.employee_id = e.id
                LEFT JOIN users u ON p.reviewer_id = u.id
                WHERE p.employee_id = :employeeId
                ORDER BY p.review_period_end DESC";
        
        return $this->query($sql, ['employeeId' => $employeeId]);
    }
    
    /**
     * Get all reviews with details
     */
    public function getAllWithDetails(): array {
        $sql = "SELECT p.*, e.name as employee_name, d.name as department_name, u.username as reviewer_name
                FROM {$this->table} p
                LEFT JOIN employees e ON p.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN users u ON p.reviewer_id = u.id
                ORDER BY p.created_at DESC";
        
        return $this->query($sql);
    }
    
    /**
     * Get average rating for employee
     */
    public function getAverageRating(int $employeeId): ?float {
        $sql = "SELECT AVG(rating) as avg_rating
                FROM {$this->table}
                WHERE employee_id = :employeeId AND status = 'completed'";
        
        $result = $this->query($sql, ['employeeId' => $employeeId]);
        return $result[0]['avg_rating'] ?? null;
    }
    
    /**
     * Get performance statistics
     */
    public function getStatistics(): array {
        $sql = "SELECT 
                    COUNT(*) as total_reviews,
                    AVG(rating) as average_rating,
                    MAX(rating) as highest_rating,
                    MIN(rating) as lowest_rating,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reviews
                FROM {$this->table}";
        
        $result = $this->query($sql);
        return $result[0] ?? [];
    }
}

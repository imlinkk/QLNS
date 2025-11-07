<?php
/**
 * Department Model Class
 */

namespace App\Models;

class DepartmentModel extends BaseModel {
    protected string $table = 'departments';
    
    /**
     * Get all departments with employee count
     */
    public function getAllWithCount(): array {
        $sql = "SELECT 
                    d.*,
                    COUNT(e.id) as employee_count
                FROM {$this->table} d
                LEFT JOIN employees e ON d.id = e.department_id
                GROUP BY d.id
                ORDER BY d.name ASC";
        
        return $this->query($sql);
    }
    
    /**
     * Get department with details
     */
    public function getWithDetails(int $id): ?array {
        $sql = "SELECT 
                    d.*,
                    COUNT(e.id) as employee_count
                FROM {$this->table} d
                LEFT JOIN employees e ON d.id = e.department_id
                WHERE d.id = :id
                GROUP BY d.id
                LIMIT 1";
        
        $result = $this->query($sql, ['id' => $id]);
        return $result[0] ?? null;
    }
}

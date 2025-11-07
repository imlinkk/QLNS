<?php
/**
 * Position Model Class
 */

namespace App\Models;

class PositionModel extends BaseModel {
    protected string $table = 'positions';
    
    /**
     * Get all positions with employee count
     */
    public function getAllWithCount(): array {
        $sql = "SELECT 
                    p.*,
                    COUNT(e.id) as employee_count
                FROM {$this->table} p
                LEFT JOIN employees e ON p.id = e.position_id
                GROUP BY p.id
                ORDER BY p.title ASC";
        
        return $this->query($sql);
    }
}

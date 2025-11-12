<?php
/**
 * Leave Model Class
 */

namespace App\Models;

class LeaveModel extends BaseModel {
    protected string $table = 'leaves';
    
    /**
     * Get leave requests by employee
     */
    public function getByEmployee(int $employeeId): array {
        $sql = "SELECT l.*, e.name as employee_name, u.username as approved_by_name
                FROM {$this->table} l
                LEFT JOIN employees e ON l.employee_id = e.id
                LEFT JOIN users u ON l.approved_by = u.id
                WHERE l.employee_id = :employeeId
                ORDER BY l.created_at DESC";
        
        return $this->query($sql, ['employeeId' => $employeeId]);
    }
    
    /**
     * Get all leave requests with details
     */
    public function getAllWithDetails(): array {
        $sql = "SELECT l.*, e.name as employee_name, d.name as department_name, u.username as approved_by_name
                FROM {$this->table} l
                LEFT JOIN employees e ON l.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN users u ON l.approved_by = u.id
                ORDER BY l.created_at DESC";
        
        return $this->query($sql);
    }
    
    /**
     * Get pending leave requests
     */
    public function getPending(): array {
        $sql = "SELECT l.*, e.name as employee_name, d.name as department_name
                FROM {$this->table} l
                LEFT JOIN employees e ON l.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                WHERE l.status = 'pending'
                ORDER BY l.created_at ASC";
        
        return $this->query($sql);
    }
    
    /**
     * Approve leave request
     */
    public function approve(int $leaveId, int $approvedBy): bool {
        $data = [
            'status' => 'approved',
            'approved_by' => $approvedBy,
            'approved_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->update($leaveId, $data);
    }
    
    /**
     * Reject leave request
     */
    public function reject(int $leaveId, int $approvedBy): bool {
        $data = [
            'status' => 'rejected',
            'approved_by' => $approvedBy,
            'approved_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->update($leaveId, $data);
    }
    
    /**
     * Get leave statistics for employee
     */
    public function getStatistics(int $employeeId, int $year): array {
        $sql = "SELECT 
                    leave_type,
                    COUNT(*) as count,
                    SUM(days_count) as total_days
                FROM {$this->table}
                WHERE employee_id = :employeeId 
                AND YEAR(start_date) = :year
                AND status = 'approved'
                GROUP BY leave_type";
        
        return $this->query($sql, ['employeeId' => $employeeId, 'year' => $year]);
    }
}

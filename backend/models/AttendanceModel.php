<?php
/**
 * Attendance Model Class
 */

namespace App\Models;

class AttendanceModel extends BaseModel {
    protected string $table = 'attendance';
    
    /**
     * Get attendance records by employee
     */
    public function getByEmployee(int $employeeId, int $month = null, int $year = null): array {
        $params = ['employeeId' => $employeeId];
        $where = 'WHERE a.employee_id = :employeeId';
        
        if ($month && $year) {
            $where .= ' AND MONTH(a.date) = :month AND YEAR(a.date) = :year';
            $params['month'] = $month;
            $params['year'] = $year;
        }
        
        $sql = "SELECT a.*, e.name as employee_name
                FROM {$this->table} a
                LEFT JOIN employees e ON a.employee_id = e.id
                {$where}
                ORDER BY a.date DESC";
        
        return $this->query($sql, $params);
    }
    
    /**
     * Get attendance by date range
     */
    public function getByDateRange(string $startDate, string $endDate): array {
        $sql = "SELECT a.*, e.name as employee_name, d.name as department_name
                FROM {$this->table} a
                LEFT JOIN employees e ON a.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                WHERE a.date BETWEEN :startDate AND :endDate
                ORDER BY a.date DESC, e.name ASC";
        
        return $this->query($sql, ['startDate' => $startDate, 'endDate' => $endDate]);
    }
    
    /**
     * Get today's attendance
     */
    public function getToday(): array {
        $today = date('Y-m-d');
        return $this->getByDateRange($today, $today);
    }
    
    /**
     * Check if attendance record exists
     */
    public function exists(int $employeeId, string $date): bool {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} 
                WHERE employee_id = :employeeId AND date = :date";
        
        $result = $this->query($sql, ['employeeId' => $employeeId, 'date' => $date]);
        return ($result[0]['count'] ?? 0) > 0;
    }
    
    /**
     * Get attendance summary for employee
     */
    public function getSummary(int $employeeId, int $month, int $year): array {
        $sql = "SELECT 
                    COUNT(*) as total_days,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
                    COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
                    COUNT(CASE WHEN status = 'on_leave' THEN 1 END) as leave_days
                FROM {$this->table}
                WHERE employee_id = :employeeId 
                AND MONTH(date) = :month 
                AND YEAR(date) = :year";
        
        $result = $this->query($sql, ['employeeId' => $employeeId, 'month' => $month, 'year' => $year]);
        return $result[0] ?? [];
    }
}

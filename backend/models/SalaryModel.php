<?php
/**
 * Salary Model Class
 */

namespace App\Models;

class SalaryModel extends BaseModel {
    protected string $table = 'salaries';
    
    /**
     * Get salary records for an employee
     */
    public function getByEmployee(int $employeeId): array {
        $sql = "SELECT s.*, e.name as employee_name
                FROM {$this->table} s
                LEFT JOIN employees e ON s.employee_id = e.id
                WHERE s.employee_id = :employeeId
                ORDER BY s.year DESC, s.month DESC";
        
        return $this->query($sql, ['employeeId' => $employeeId]);
    }
    
    /**
     * Get salary records for a specific month/year
     */
    public function getByPeriod(int $month, int $year): array {
        $sql = "SELECT s.*, e.name as employee_name, e.department_id, d.name as department_name
                FROM {$this->table} s
                LEFT JOIN employees e ON s.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                WHERE s.month = :month AND s.year = :year
                ORDER BY e.name ASC";
        
        return $this->query($sql, ['month' => $month, 'year' => $year]);
    }
    
    /**
     * Get current month salary records
     */
    public function getCurrentMonth(): array {
        $month = date('n');
        $year = date('Y');
        return $this->getByPeriod($month, $year);
    }
    
    /**
     * Calculate total salary statistics
     */
    public function getStatistics(int $month = null, int $year = null): array {
        $params = [];
        $where = '';
        
        if ($month && $year) {
            $where = 'WHERE month = :month AND year = :year';
            $params = ['month' => $month, 'year' => $year];
        }
        
        $sql = "SELECT 
                    COUNT(*) as total_records,
                    SUM(base_salary) as total_base_salary,
                    SUM(bonus) as total_bonus,
                    SUM(deduction) as total_deduction,
                    SUM(total_salary) as total_payroll,
                    AVG(total_salary) as average_salary
                FROM {$this->table}
                {$where}";
        
        $result = $this->query($sql, $params);
        return $result[0] ?? [];
    }
}

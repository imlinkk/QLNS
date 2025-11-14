<?php
/**
 * Employee Model Class
 * 
 * Handles employee data operations
 * Extends BaseModel for common CRUD operations
 * 
 * Learning Resources:
 * - JOIN operations: https://www.mysqltutorial.org/mysql-join/
 * - Complex queries: https://www.w3schools.com/mysql/
 */

namespace App\Models;

use PDOException;

class EmployeeModel extends BaseModel {
    protected string $table = 'employees';
    
    /**
     * Get all employees with department and position details
     * 
     * @return array Array of employees
     */
    public function getAllWithDetails(): array {
        try {
            $sql = "SELECT 
                        e.id,
                        e.name,
                        e.email,
                        e.phone,
                        e.department_id as departmentId,
                        e.position_id as positionId,
                        e.salary,
                        e.hire_date as hireDate,
                        e.birth_date as birthDate,
                        e.address,
                        e.status,
                        d.name as departmentName,
                        p.title as positionTitle
                    FROM {$this->table} e
                    LEFT JOIN departments d ON e.department_id = d.id
                    LEFT JOIN positions p ON e.position_id = p.id
                    ORDER BY e.id ASC";
            
            return $this->query($sql);
            
        } catch (PDOException $e) {
            error_log("Error in getAllWithDetails(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get employee by ID with details
     * 
     * @param int $id Employee ID
     * @return array|null Employee data or null if not found
     */
    public function getWithDetails(int $id): ?array {
        try {
            $sql = "SELECT 
                        e.*,
                        d.name as department_name,
                        p.title as position_title
                    FROM {$this->table} e
                    LEFT JOIN departments d ON e.department_id = d.id
                    LEFT JOIN positions p ON e.position_id = p.id
                    WHERE e.id = :id
                    LIMIT 1";
            
            $result = $this->query($sql, ['id' => $id]);
            return $result[0] ?? null;
            
        } catch (PDOException $e) {
            error_log("Error in getWithDetails(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Search employees by multiple criteria
     * 
     * @param array $criteria Search criteria
     * @return array Array of employees
     */
    public function search(array $criteria): array {
        try {
            $sql = "SELECT 
                        e.id,
                        e.name,
                        e.email,
                        e.phone,
                        e.department_id as departmentId,
                        e.position_id as positionId,
                        e.salary,
                        e.hire_date as hireDate,
                        e.birth_date as birthDate,
                        e.address,
                        e.status,
                        d.name as departmentName,
                        p.title as positionTitle
                    FROM {$this->table} e
                    LEFT JOIN departments d ON e.department_id = d.id
                    LEFT JOIN positions p ON e.position_id = p.id
                    WHERE 1=1";
            
            $params = [];
            
            // Name search
            if (!empty($criteria['name'])) {
                $sql .= " AND e.name LIKE :name";
                $params['name'] = '%' . $criteria['name'] . '%';
            }
            
            // Department filter
            if (!empty($criteria['departmentId'])) {
                $sql .= " AND e.department_id = :departmentId";
                $params['departmentId'] = $criteria['departmentId'];
            }
            

            // Position filter
            if (!empty($criteria['positionId'])) {
                $sql .= " AND e.position_id = :positionId";
                $params['positionId'] = $criteria['positionId'];
            }
            
            // Salary range
            if (isset($criteria['minSalary']) && $criteria['minSalary'] !== '') {
                $sql .= " AND e.salary >= :minSalary";
                $params['minSalary'] = $criteria['minSalary'];
            }
            
            if (isset($criteria['maxSalary']) && $criteria['maxSalary'] !== '') {
                $sql .= " AND e.salary <= :maxSalary";
                $params['maxSalary'] = $criteria['maxSalary'];
            }
            
            // Status filter
            if (!empty($criteria['status'])) {
                $sql .= " AND e.status = :status";
                $params['status'] = $criteria['status'];
            }
            
            $sql .= " ORDER BY e.salary DESC";
           
            return $this->query($sql, $params);
            
        } catch (PDOException $e) {
            error_log("Error in search(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get employees by department
     * 
     * @param int $departmentId Department ID
     * @return array Array of employees
     */
    public function getByDepartment(int $departmentId): array {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE department_id = :departmentId ORDER BY name ASC";
            return $this->query($sql, ['departmentId' => $departmentId]);
            
        } catch (PDOException $e) {
            error_log("Error in getByDepartment(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get employees by position
     * 
     * @param int $positionId Position ID
     * @return array Array of employees
     */
    public function getByPosition(int $positionId): array {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE position_id = :positionId ORDER BY name ASC";
            return $this->query($sql, ['positionId' => $positionId]);
            
        } catch (PDOException $e) {
            error_log("Error in getByPosition(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get employee statistics
     * 
     * @return array Statistics data
     */
    public function getStatistics(): array {
        try {
            $sql = "SELECT 
                        COUNT(*) as total_employees,
                        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_employees,
                        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_employees,
                        AVG(salary) as average_salary,
                        MAX(salary) as max_salary,
                        MIN(salary) as min_salary
                    FROM {$this->table}";
            
            $result = $this->query($sql);
            return $result[0] ?? [];
            
        } catch (PDOException $e) {
            error_log("Error in getStatistics(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Update employee status
     * 
     * @param int $id Employee ID
     * @param string $status New status
     * @return bool True on success, false on failure
     */
    public function updateStatus(int $id, string $status): bool {
        return $this->update($id, ['status' => $status]);
    }
}

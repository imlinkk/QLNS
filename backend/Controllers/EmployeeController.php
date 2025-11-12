<?php
/**
 * Employee Controller
 * 
 * Handles employee-related HTTP requests
 * Implements CRUD operations for employees
 */

namespace App\Controllers;

use App\Models\EmployeeModel;

class EmployeeController {
    private EmployeeModel $employeeModel;
    
    /**
     * Constructor - Initialize EmployeeModel
     */
    public function __construct() {
        $this->employeeModel = new EmployeeModel();
    }
    
    /**
     * Get all employees
     * 
     * @return array Response array
     */
    public function index(): array {
        try {
            $employees = $this->employeeModel->getAllWithDetails();
            
            return [
                'success' => true,
                'data' => $employees
            ];
            
        } catch (\Exception $e) {
            error_log("Error in index(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to fetch employees'
            ];
        }
    }
    
    /**
     * Get employee by ID
     * 
     * @param int $id Employee ID
     * @return array Response array
     */
    public function show(int $id): array {
        try {
            $employee = $this->employeeModel->getWithDetails($id);
            
            if (!$employee) {
                return [
                    'success' => false,
                    'message' => 'Employee not found'
                ];
            }
            
            return [
                'success' => true,
                'data' => $employee
            ];
            
        } catch (\Exception $e) {
            error_log("Error in show(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to fetch employee'
            ];
        }
    }
    
    /**
     * Create a new employee
     * 
     * @param array $data Employee data
     * @return array Response array
     */
    public function store(array $data): array {
        try {
            // Validate required fields
            $required = ['name', 'department_id', 'position_id', 'salary', 'hire_date'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    return [
                        'success' => false,
                        'message' => "Field '{$field}' is required"
                    ];
                }
            }
            
            // Set default status if not provided
            if (!isset($data['status'])) {
                $data['status'] = 'active';
            }
            
            $employeeId = $this->employeeModel->create($data);
            
            if (!$employeeId) {
                return [
                    'success' => false,
                    'message' => 'Failed to create employee'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => [
                    'id' => $employeeId
                ]
            ];
            
        } catch (\Exception $e) {
            error_log("Error in store(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to create employee'
            ];
        }
    }
    
    /**
     * Update an employee
     * 
     * @param int $id Employee ID
     * @param array $data Employee data
     * @return array Response array
     */
    public function update(int $id, array $data): array {
        try {
            // Check if employee exists
            $employee = $this->employeeModel->find($id);
            if (!$employee) {
                return [
                    'success' => false,
                    'message' => 'Employee not found'
                ];
            }
            
            // Remove ID from data if present
            unset($data['id']);
            
            $success = $this->employeeModel->update($id, $data);
            
            if (!$success) {
                return [
                    'success' => false,
                    'message' => 'Failed to update employee'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Employee updated successfully'
            ];
            
        } catch (\Exception $e) {
            error_log("Error in update(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to update employee'
            ];
        }
    }
    
    /**
     * Delete an employee
     * 
     * @param int $id Employee ID
     * @return array Response array
     */
    public function destroy(int $id): array {
        try {
            // Check if employee exists
            $employee = $this->employeeModel->find($id);
            if (!$employee) {
                return [
                    'success' => false,
                    'message' => 'Employee not found'
                ];
            }
            
            $success = $this->employeeModel->delete($id);
            
            if (!$success) {
                return [
                    'success' => false,
                    'message' => 'Failed to delete employee'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Employee deleted successfully'
            ];
            
        } catch (\Exception $e) {
            error_log("Error in destroy(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to delete employee'
            ];
        }
    }
    
    /**
     * Search employees
     * 
     * @param array $criteria Search criteria
     * @return array Response array
     */
    public function search(array $criteria): array {
        try {
            $employees = $this->employeeModel->search($criteria);
            
            return [
                'success' => true,
                'data' => $employees
            ];
            
        } catch (\Exception $e) {
            error_log("Error in search(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to search employees'
            ];
        }
    }
    
    /**
     * Get employee statistics
     * 
     * @return array Response array
     */
    public function statistics(): array {
        try {
            $stats = $this->employeeModel->getStatistics();
            
            return [
                'success' => true,
                'data' => $stats
            ];
            
        } catch (\Exception $e) {
            error_log("Error in statistics(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to fetch statistics'
            ];
        }
    }
}

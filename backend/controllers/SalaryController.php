<?php
/**
 * Salary Controller
 */

namespace App\Controllers;

use App\Models\SalaryModel;

class SalaryController {
    private SalaryModel $model;
    
    public function __construct() {
        $this->model = new SalaryModel();
    }
    
    public function index(): array {
        try {
            $salaries = $this->model->getCurrentMonth();
            return ['success' => true, 'data' => $salaries];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch salaries'];
        }
    }
    
    public function getByPeriod(int $month, int $year): array {
        try {
            $salaries = $this->model->getByPeriod($month, $year);
            return ['success' => true, 'data' => $salaries];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch salaries'];
        }
    }
    
    public function getByEmployee(int $employeeId): array {
        try {
            $salaries = $this->model->getByEmployee($employeeId);
            return ['success' => true, 'data' => $salaries];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch employee salaries'];
        }
    }
    
    public function statistics(int $month = null, int $year = null): array {
        try {
            $stats = $this->model->getStatistics($month, $year);
            return ['success' => true, 'data' => $stats];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch statistics'];
        }
    }
    
    public function store(array $data): array {
        try {
            $required = ['employee_id', 'base_salary', 'month', 'year'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    return ['success' => false, 'message' => "Field '{$field}' is required"];
                }
            }
            
            // Set defaults
            $data['bonus'] = $data['bonus'] ?? 0;
            $data['deduction'] = $data['deduction'] ?? 0;
            
            $id = $this->model->create($data);
            return ['success' => true, 'message' => 'Salary record created', 'data' => ['id' => $id]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to create salary record'];
        }
    }
    
    public function update(int $id, array $data): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Salary record not found'];
            }
            
            unset($data['id']);
            $success = $this->model->update($id, $data);
            return $success 
                ? ['success' => true, 'message' => 'Salary record updated']
                : ['success' => false, 'message' => 'Failed to update salary record'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to update salary record'];
        }
    }
}

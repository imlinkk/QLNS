<?php
/**
 * Attendance Controller
 */

namespace App\Controllers;

use App\Models\AttendanceModel;

class AttendanceController {
    private AttendanceModel $model;
    
    public function __construct() {
        $this->model = new AttendanceModel();
    }
    
    public function index(): array {
        try {
            $attendance = $this->model->getToday();
            return ['success' => true, 'data' => $attendance];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch attendance'];
        }
    }
    
    public function getByEmployee(int $employeeId, int $month = null, int $year = null): array {
        try {
            $attendance = $this->model->getByEmployee($employeeId, $month, $year);
            return ['success' => true, 'data' => $attendance];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch attendance'];
        }
    }
    
    public function getSummary(int $employeeId, int $month, int $year): array {
        try {
            $summary = $this->model->getSummary($employeeId, $month, $year);
            return ['success' => true, 'data' => $summary];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch summary'];
        }
    }
    
    public function store(array $data): array {
        try {
            $required = ['employee_id', 'date', 'status'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    return ['success' => false, 'message' => "Field '{$field}' is required"];
                }
            }
            
            // Check if already exists
            if ($this->model->exists($data['employee_id'], $data['date'])) {
                return ['success' => false, 'message' => 'Attendance already recorded for this date'];
            }
            
            $id = $this->model->create($data);
            return ['success' => true, 'message' => 'Attendance recorded', 'data' => ['id' => $id]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to record attendance'];
        }
    }
    
    public function update(int $id, array $data): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Attendance record not found'];
            }
            
            unset($data['id']);
            $success = $this->model->update($id, $data);
            return $success 
                ? ['success' => true, 'message' => 'Attendance updated']
                : ['success' => false, 'message' => 'Failed to update attendance'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to update attendance'];
        }
    }
}

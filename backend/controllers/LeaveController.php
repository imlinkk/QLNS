<?php
/**
 * Leave Controller
 */

namespace App\Controllers;

use App\Models\LeaveModel;

class LeaveController {
    private LeaveModel $model;
    
    public function __construct() {
        $this->model = new LeaveModel();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    public function index(): array {
        try {
            $leaves = $this->model->getAllWithDetails();
            return ['success' => true, 'data' => $leaves];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch leave requests'];
        }
    }
    
    public function getPending(): array {
        try {
            $leaves = $this->model->getPending();
            return ['success' => true, 'data' => $leaves];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch pending requests'];
        }
    }
    
    public function getByEmployee(int $employeeId): array {
        try {
            $leaves = $this->model->getByEmployee($employeeId);
            return ['success' => true, 'data' => $leaves];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch employee leaves'];
        }
    }
    
    public function store(array $data): array {
        try {
            $required = ['employee_id', 'leave_type', 'start_date', 'end_date', 'days_count'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    return ['success' => false, 'message' => "Field '{$field}' is required"];
                }
            }
            
            $data['status'] = 'pending';
            $id = $this->model->create($data);
            return ['success' => true, 'message' => 'Leave request submitted', 'data' => ['id' => $id]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to submit leave request'];
        }
    }
    
    public function approve(int $id): array {
        try {
            if (!isset($_SESSION['user_id'])) {
                return ['success' => false, 'message' => 'Unauthorized'];
            }
            
            $success = $this->model->approve($id, $_SESSION['user_id']);
            return $success 
                ? ['success' => true, 'message' => 'Leave request approved']
                : ['success' => false, 'message' => 'Failed to approve request'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to approve request'];
        }
    }
    
    public function reject(int $id): array {
        try {
            if (!isset($_SESSION['user_id'])) {
                return ['success' => false, 'message' => 'Unauthorized'];
            }
            
            $success = $this->model->reject($id, $_SESSION['user_id']);
            return $success 
                ? ['success' => true, 'message' => 'Leave request rejected']
                : ['success' => false, 'message' => 'Failed to reject request'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to reject request'];
        }
    }
    
    public function getStatistics(int $employeeId, int $year): array {
        try {
            $stats = $this->model->getStatistics($employeeId, $year);
            return ['success' => true, 'data' => $stats];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch statistics'];
        }
    }
}

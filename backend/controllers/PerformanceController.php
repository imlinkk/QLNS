<?php
/**
 * Performance Review Controller
 */

namespace App\Controllers;

use App\Models\PerformanceModel;

class PerformanceController {
    private PerformanceModel $model;
    
    public function __construct() {
        $this->model = new PerformanceModel();
    }
    
    public function index(): array {
        try {
            $reviews = $this->model->getAllWithDetails();
            return ['success' => true, 'data' => $reviews];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch performance reviews'];
        }
    }
    
    public function getByEmployee(int $employeeId): array {
        try {
            $reviews = $this->model->getByEmployee($employeeId);
            return ['success' => true, 'data' => $reviews];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch employee reviews'];
        }
    }
    
    public function getAverageRating(int $employeeId): array {
        try {
            $rating = $this->model->getAverageRating($employeeId);
            return ['success' => true, 'data' => ['average_rating' => $rating]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch average rating'];
        }
    }
    
    public function statistics(): array {
        try {
            $stats = $this->model->getStatistics();
            return ['success' => true, 'data' => $stats];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch statistics'];
        }
    }
    
    public function store(array $data): array {
        try {
            $required = ['employee_id', 'reviewer_id', 'review_period_start', 'review_period_end', 'rating'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    return ['success' => false, 'message' => "Field '{$field}' is required"];
                }
            }
            
            // Validate rating
            if ($data['rating'] < 0 || $data['rating'] > 5) {
                return ['success' => false, 'message' => 'Rating must be between 0 and 5'];
            }
            
            $data['status'] = $data['status'] ?? 'draft';
            $id = $this->model->create($data);
            return ['success' => true, 'message' => 'Performance review created', 'data' => ['id' => $id]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to create review'];
        }
    }
    
    public function update(int $id, array $data): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Review not found'];
            }
            
            // Validate rating if provided
            if (isset($data['rating']) && ($data['rating'] < 0 || $data['rating'] > 5)) {
                return ['success' => false, 'message' => 'Rating must be between 0 and 5'];
            }
            
            unset($data['id']);
            $success = $this->model->update($id, $data);
            return $success 
                ? ['success' => true, 'message' => 'Review updated']
                : ['success' => false, 'message' => 'Failed to update review'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to update review'];
        }
    }
}

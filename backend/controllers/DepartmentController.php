<?php
/**
 * Department Controller
 */

namespace App\Controllers;

use App\Models\DepartmentModel;

class DepartmentController {
    private DepartmentModel $model;
    
    public function __construct() {
        $this->model = new DepartmentModel();
    }
    
    public function index(): array {
        try {
            $departments = $this->model->getAllWithCount();
            return ['success' => true, 'data' => $departments];
        } catch (\Exception $e) {
            error_log("Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Failed to fetch departments'];
        }
    }
    
    public function show(int $id): array {
        try {
            $department = $this->model->getWithDetails($id);
            if (!$department) {
                return ['success' => false, 'message' => 'Department not found'];
            }
            return ['success' => true, 'data' => $department];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch department'];
        }
    }
    
    public function store(array $data): array {
        try {
            if (empty($data['name'])) {
                return ['success' => false, 'message' => 'Department name is required'];
            }
            
            $id = $this->model->create($data);
            return ['success' => true, 'message' => 'Department created', 'data' => ['id' => $id]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to create department'];
        }
    }
    
    public function update(int $id, array $data): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Department not found'];
            }
            
            unset($data['id']);
            $success = $this->model->update($id, $data);
            return $success 
                ? ['success' => true, 'message' => 'Department updated']
                : ['success' => false, 'message' => 'Failed to update department'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to update department'];
        }
    }
    
    public function destroy(int $id): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Department not found'];
            }
            
            $success = $this->model->delete($id);
            return $success 
                ? ['success' => true, 'message' => 'Department deleted']
                : ['success' => false, 'message' => 'Failed to delete department'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Cannot delete department with employees'];
        }
    }
}

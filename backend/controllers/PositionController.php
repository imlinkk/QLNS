<?php
/**
 * Position Controller
 */

namespace App\Controllers;

use App\Models\PositionModel;

class PositionController {
    private PositionModel $model;
    
    public function __construct() {
        $this->model = new PositionModel();
    }
    
    public function index(): array {
        try {
            $positions = $this->model->getAllWithCount();
            return ['success' => true, 'data' => $positions];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch positions'];
        }
    }
    
    public function show(int $id): array {
        try {
            $position = $this->model->find($id);
            if (!$position) {
                return ['success' => false, 'message' => 'Position not found'];
            }
            return ['success' => true, 'data' => $position];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to fetch position'];
        }
    }
    
    public function store(array $data): array {
        try {
            if (empty($data['title'])) {
                return ['success' => false, 'message' => 'Position title is required'];
            }
            
            $id = $this->model->create($data);
            return ['success' => true, 'message' => 'Position created', 'data' => ['id' => $id]];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to create position'];
        }
    }
    
    public function update(int $id, array $data): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Position not found'];
            }
            
            unset($data['id']);
            $success = $this->model->update($id, $data);
            return $success 
                ? ['success' => true, 'message' => 'Position updated']
                : ['success' => false, 'message' => 'Failed to update position'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Failed to update position'];
        }
    }
    
    public function destroy(int $id): array {
        try {
            if (!$this->model->find($id)) {
                return ['success' => false, 'message' => 'Position not found'];
            }
            
            $success = $this->model->delete($id);
            return $success 
                ? ['success' => true, 'message' => 'Position deleted']
                : ['success' => false, 'message' => 'Failed to delete position'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Cannot delete position with employees'];
        }
    }
}

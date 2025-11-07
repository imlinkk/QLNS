<?php
/**
 * Base Model Class
 * 
 * Abstract base class for all models providing common CRUD operations
 * Implements OOP principles: Encapsulation, Abstraction
 * 
 * Learning Resources:
 * - OOP in PHP: https://www.php.net/manual/en/language.oop5.php
 * - Abstract Classes: https://www.php.net/manual/en/language.oop5.abstract.php
 * - Prepared Statements: https://www.php.net/manual/en/pdo.prepared-statements.php
 */

namespace App\Models;

use PDO;
use PDOException;
use App\Config\Database;

abstract class BaseModel {
    protected PDO $db;
    protected string $table;
    protected string $primaryKey = 'id';
    
    /**
     * Constructor - Initialize database connection
     */
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Get all records from the table
     * 
     * @param array $conditions WHERE conditions
     * @param string $orderBy ORDER BY clause
     * @param int $limit LIMIT clause
     * @return array Array of records
     */
    public function all(array $conditions = [], string $orderBy = '', int $limit = 0): array {
        try {
            $sql = "SELECT * FROM {$this->table}";
            
            $where = $this->buildWhereClause($conditions);
            if ($where) {
                $sql .= " WHERE " . $where;
            }
            
            if ($orderBy) {
                $sql .= " ORDER BY " . $orderBy;
            }
            
            if ($limit > 0) {
                $sql .= " LIMIT " . $limit;
            }
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($conditions);
            
            return $stmt->fetchAll();
            
        } catch (PDOException $e) {
            error_log("Error in all(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Find a record by ID
     * 
     * @param int $id Primary key value
     * @return array|null Record data or null if not found
     */
    public function find(int $id): ?array {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['id' => $id]);
            
            $result = $stmt->fetch();
            return $result ?: null;
            
        } catch (PDOException $e) {
            error_log("Error in find(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Find records by conditions
     * 
     * @param array $conditions WHERE conditions
     * @param string $orderBy ORDER BY clause
     * @return array Array of records
     */
    public function where(array $conditions, string $orderBy = ''): array {
        return $this->all($conditions, $orderBy);
    }
    
    /**
     * Insert a new record
     * 
     * @param array $data Record data
     * @return int|bool Last insert ID or false on failure
     */
    public function create(array $data) {
        try {
            $fields = array_keys($data);
            $placeholders = array_map(fn($field) => ":$field", $fields);
            
            $sql = sprintf(
                "INSERT INTO %s (%s) VALUES (%s)",
                $this->table,
                implode(', ', $fields),
                implode(', ', $placeholders)
            );
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($data);
            
            return $this->db->lastInsertId();
            
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update a record by ID
     * 
     * @param int $id Primary key value
     * @param array $data Data to update
     * @return bool True on success, false on failure
     */
    public function update(int $id, array $data): bool {
        try {
            $fields = array_keys($data);
            $setClause = implode(', ', array_map(fn($field) => "$field = :$field", $fields));
            
            $sql = sprintf(
                "UPDATE %s SET %s WHERE %s = :id",
                $this->table,
                $setClause,
                $this->primaryKey
            );
            
            $data['id'] = $id;
            $stmt = $this->db->prepare($sql);
            
            return $stmt->execute($data);
            
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete a record by ID
     * 
     * @param int $id Primary key value
     * @return bool True on success, false on failure
     */
    public function delete(int $id): bool {
        try {
            $sql = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id";
            $stmt = $this->db->prepare($sql);
            
            return $stmt->execute(['id' => $id]);
            
        } catch (PDOException $e) {
            error_log("Error in delete(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Count records
     * 
     * @param array $conditions WHERE conditions
     * @return int Count of records
     */
    public function count(array $conditions = []): int {
        try {
            $sql = "SELECT COUNT(*) as count FROM {$this->table}";
            
            $where = $this->buildWhereClause($conditions);
            if ($where) {
                $sql .= " WHERE " . $where;
            }
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($conditions);
            
            $result = $stmt->fetch();
            return (int)($result['count'] ?? 0);
            
        } catch (PDOException $e) {
            error_log("Error in count(): " . $e->getMessage());
            return 0;
        }
    }
    
    /**
     * Execute a custom query
     * 
     * @param string $sql SQL query
     * @param array $params Query parameters
     * @return array Query results
     */
    protected function query(string $sql, array $params = []): array {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            
            return $stmt->fetchAll();
            
        } catch (PDOException $e) {
            error_log("Error in query(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Execute a custom query that doesn't return results
     * 
     * @param string $sql SQL query
     * @param array $params Query parameters
     * @return bool True on success, false on failure
     */
    protected function execute(string $sql, array $params = []): bool {
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute($params);
            
        } catch (PDOException $e) {
            error_log("Error in execute(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Build WHERE clause from conditions array
     * 
     * @param array $conditions Conditions array
     * @return string WHERE clause
     */
    private function buildWhereClause(array $conditions): string {
        if (empty($conditions)) {
            return '';
        }
        
        $where = [];
        foreach (array_keys($conditions) as $field) {
            $where[] = "$field = :$field";
        }
        
        return implode(' AND ', $where);
    }
    
    /**
     * Begin database transaction
     * 
     * @return bool True on success, false on failure
     */
    public function beginTransaction(): bool {
        try {
            return $this->db->beginTransaction();
        } catch (PDOException $e) {
            error_log("Error beginning transaction: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Commit database transaction
     * 
     * @return bool True on success, false on failure
     */
    public function commit(): bool {
        try {
            return $this->db->commit();
        } catch (PDOException $e) {
            error_log("Error committing transaction: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Rollback database transaction
     * 
     * @return bool True on success, false on failure
     */
    public function rollback(): bool {
        try {
            return $this->db->rollBack();
        } catch (PDOException $e) {
            error_log("Error rolling back transaction: " . $e->getMessage());
            return false;
        }
    }
}

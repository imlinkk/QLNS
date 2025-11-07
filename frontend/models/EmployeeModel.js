/**
 * EmployeeModel - Handles employee data operations
 * Calls backend API endpoints for employee management
 */

import { BaseModel } from "./BaseModel.js";

export class EmployeeModel extends BaseModel {
  constructor() {
    super("/employees");
  }

  /**
   * Get employees with details (department, position)
   */
  async getAllWithDetails() {
    return await this.getAll();
  }

  /**
   * Search employees by criteria
   */
  async searchEmployees(criteria) {
    return await this.search(criteria);
  }

  /**
   * Get employee statistics
   */
  async getStatistics() {
    try {
      const response = await this.api.get(`${this.endpoint}/statistics`);
      return response.data || {};
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {};
    }
  }

  /**
   * Get employees by department
   */
  async getByDepartment(departmentId) {
    try {
      const response = await this.api.get(this.endpoint, {
        department_id: departmentId,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      return [];
    }
  }

  /**
   * Get employees by position
   */
  async getByPosition(positionId) {
    try {
      const response = await this.api.get(this.endpoint, {
        position_id: positionId,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by position:", error);
      return [];
    }
  }
}

// Export singleton instance
export default new EmployeeModel();

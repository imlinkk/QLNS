/**
 * DepartmentModel - Handles department data operations
 */

import { BaseModel } from "./BaseModel.js";

export class DepartmentModel extends BaseModel {
  constructor() {
    super("/departments");
  }

  /**
   * Get all departments
   */
  async getAllDepartments() {
    return await this.getAll();
  }

  /**
   * Create new department
   */
  async createDepartment(name, description = "") {
    return await this.create({ name, description });
  }

  /**
   * Update department
   */
  async updateDepartment(id, name, description = "") {
    return await this.update(id, { name, description });
  }

  /**
   * Delete department
   */
  async deleteDepartment(id) {
    return await this.delete(id);
  }
}

export default new DepartmentModel();

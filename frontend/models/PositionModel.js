/**
 * PositionModel - Handles position data operations
 */

import { BaseModel } from "./BaseModel.js";

export class PositionModel extends BaseModel {
  constructor() {
    super("/positions");
  }

  /**
   * Get all positions
   */
  async getAllPositions() {
    return await this.getAll();
  }

  /**
   * Create new position
   */
  async createPosition(title, description = "", salaryBase = 0) {
    return await this.create({ title, description, salary_base: salaryBase });
  }

  /**
   * Update position
   */
  async updatePosition(id, data) {
    return await this.update(id, data);
  }

  /**
   * Delete position
   */
  async deletePosition(id) {
    return await this.delete(id);
  }
}

export default new PositionModel();

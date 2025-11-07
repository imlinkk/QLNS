/**
 * PerformanceModel - Handles performance review data operations
 */

import { BaseModel } from "./BaseModel.js";

export class PerformanceModel extends BaseModel {
  constructor() {
    super("/performance");
  }

  /**
   * Add performance review
   */
  async addReview(reviewData) {
    return await this.create(reviewData);
  }

  /**
   * Get average rating for employee
   */
  async getAverageRating(employeeId) {
    try {
      const response = await this.api.get(
        `${this.endpoint}/average/${employeeId}`
      );
      return response.data || { rating: 0 };
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return { rating: 0 };
    }
  }

  /**
   * Get top performers
   */
  async getTopPerformers(limit = 10) {
    try {
      const response = await this.api.get(`${this.endpoint}/top`, { limit });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching top performers:", error);
      return [];
    }
  }
}

export default new PerformanceModel();

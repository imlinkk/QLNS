/**
 * AttendanceModel - Handles attendance data operations
 */

import { BaseModel } from "./BaseModel.js";

export class AttendanceModel extends BaseModel {
  constructor() {
    super("/attendance");
  }

  /**
   * Check in
   */
  async checkIn(employeeId) {
    try {
      const response = await this.api.post(`${this.endpoint}/checkin`, {
        employee_id: employeeId,
      });
      return response;
    } catch (error) {
      console.error("Error checking in:", error);
      throw error;
    }
  }

  /**
   * Check out
   */
  async checkOut(employeeId) {
    try {
      const response = await this.api.post(`${this.endpoint}/checkout`, {
        employee_id: employeeId,
      });
      return response;
    } catch (error) {
      console.error("Error checking out:", error);
      throw error;
    }
  }

  /**
   * Get attendance report
   */
  async getReport(employeeId, fromDate, toDate) {
    try {
      const response = await this.api.get(`${this.endpoint}/report`, {
        employee_id: employeeId,
        from_date: fromDate,
        to_date: toDate,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance report:", error);
      return [];
    }
  }
}

export default new AttendanceModel();

/**
 * LeaveModel - Handles leave management data operations
 */

import { BaseModel } from "./BaseModel.js";

export class LeaveModel extends BaseModel {
  constructor() {
    super("/leaves");
  }

  /**
   * Request leave
   */
  async requestLeave(leaveData) {
    return await this.create(leaveData);
  }

  /**
   * Approve leave
   */
  async approveLeave(leaveId) {
    try {
      const response = await this.api.put(
        `${this.endpoint}/${leaveId}/approve`
      );
      return response;
    } catch (error) {
      console.error("Error approving leave:", error);
      throw error;
    }
  }

  /**
   * Reject leave
   */
  async rejectLeave(leaveId) {
    try {
      const response = await this.api.put(`${this.endpoint}/${leaveId}/reject`);
      return response;
    } catch (error) {
      console.error("Error rejecting leave:", error);
      throw error;
    }
  }

  /**
   * Get leave balance
   */
  async getLeaveBalance(employeeId) {
    try {
      const response = await this.api.get(
        `${this.endpoint}/balance/${employeeId}`
      );
      return response.data || {};
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      return {};
    }
  }
}

export default new LeaveModel();

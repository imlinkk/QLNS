/**
 * SalaryModel - Handles salary data operations
 */

import { BaseModel } from "./BaseModel.js";

export class SalaryModel extends BaseModel {
  constructor() {
    super("/salaries");
  }

  /**
   * Get payroll report
   */
  async getPayrollReport() {
    try {
      const response = await this.api.get(`${this.endpoint}/report`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching payroll report:", error);
      return [];
    }
  }

  /**
   * Update salary for employee
   */
  async updateEmployeeSalary(employeeId, salaryData) {
    return await this.update(employeeId, salaryData);
  }
}

export default new SalaryModel();

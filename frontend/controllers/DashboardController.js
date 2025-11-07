/**
 * DashboardController - Handles dashboard logic
 */

import EmployeeModel from "../models/EmployeeModel.js";
import DepartmentModel from "../models/DepartmentModel.js";
import PositionModel from "../models/PositionModel.js";
import AuthModel from "../models/AuthModel.js";
import { DashboardView } from "../views/DashboardView.js";

export class DashboardController {
  constructor(container) {
    this.container = container;
    this.view = new DashboardView(container);
    this.employeeModel = EmployeeModel;
    this.departmentModel = DepartmentModel;
    this.positionModel = PositionModel;
    this.authModel = AuthModel;
  }

  /**
   * Initialize and render dashboard
   */
  async init() {
    try {
      this.view.showLoading();

      // Get current user
      const user = this.authModel.getCurrentUser();
      const username = user?.username || "User";

      // Fetch all data in parallel
      const [employees, departments, positions] = await Promise.all([
        this.employeeModel.getAll(),
        this.departmentModel.getAll(),
        this.positionModel.getAll(),
      ]);

      // Calculate statistics
      const stats = this.calculateStatistics(employees, departments, positions);

      // Render dashboard
      this.view.renderDashboard(stats, username);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      this.view.showError(
        "Không thể tải dữ liệu dashboard. Vui lòng thử lại sau."
      );
    }
  }

  /**
   * Calculate dashboard statistics
   */
  calculateStatistics(employees, departments, positions) {
    const totalEmployees = employees.length;
    const totalDepartments = departments.length;
    const totalPositions = positions.length;

    // Calculate average salary
    const avgSalary =
      employees.length > 0
        ? employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) /
          employees.length
        : 0;

    // Get newest employee
    const newestEmployee =
      employees.length > 0
        ? employees.reduce((newest, emp) => {
            const empDate = new Date(emp.hire_date || emp.hireDate);
            const newestDate = new Date(newest.hire_date || newest.hireDate);
            return empDate > newestDate ? emp : newest;
          })
        : null;

    // Count employees by department
    const employeesByDept = departments.map((dept) => {
      const count = employees.filter(
        (emp) => emp.department_id === dept.id || emp.departmentId === dept.id
      ).length;
      return { name: dept.name, count };
    });

    return {
      totalEmployees,
      totalDepartments,
      totalPositions,
      avgSalary,
      newestEmployee,
      employeesByDept,
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    this.view.clear();
  }
}

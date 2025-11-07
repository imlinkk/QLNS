/**
 * DepartmentController - Handles department management
 */

import DepartmentModel from "../models/DepartmentModel.js";
import { BaseView } from "../views/BaseView.js";

export class DepartmentController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.departmentModel = DepartmentModel;
  }

  /**
   * Initialize department management
   */
  async init() {
    try {
      this.view.showLoading();
      const departments = await this.departmentModel.getAll();
      this.renderDepartments(departments);
    } catch (error) {
      console.error("Error loading departments:", error);
      this.view.showError("Không thể tải dữ liệu phòng ban.");
    }
  }

  /**
   * Render departments
   */
  renderDepartments(departments) {
    this.container.innerHTML = `
      <div class="module-header">
        <h2>🏢 Quản lý Phòng ban</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Phòng ban
        </button>
      </div>
      <div class="card">
        <p>Tổng số phòng ban: <strong>${departments.length}</strong></p>
        <ul>
          ${departments
            .map(
              (dept) => `
            <li>${dept.name} - ${dept.description || "Không có mô tả"}</li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.view.clear();
  }
}

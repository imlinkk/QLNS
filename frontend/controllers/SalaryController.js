/**
 * SalaryController - Handles salary management
 */

import SalaryModel from "../models/SalaryModel.js";
import { BaseView } from "../views/BaseView.js";

export class SalaryController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.salaryModel = SalaryModel;
  }

  /**
   * Initialize salary management
   */
  async init() {
    try {
      this.view.showLoading();
      const salaries = await this.salaryModel.getAll();
      this.renderSalaries(salaries);
    } catch (error) {
      console.error("Error loading salaries:", error);
      this.view.showError("Không thể tải dữ liệu lương.");
    }
  }

  /**
   * Render salaries
   */
  renderSalaries(salaries) {
    this.container.innerHTML = `
      <div class="module-header">
        <h2>💰 Quản lý Lương</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Bảng lương
        </button>
      </div>
      <div class="card">
        <p>Tổng số bản ghi lương: <strong>${salaries.length}</strong></p>
        <p><em>Chức năng quản lý lương đang được phát triển...</em></p>
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

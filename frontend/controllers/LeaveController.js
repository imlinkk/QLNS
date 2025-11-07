/**
 * LeaveController - Handles leave management
 */

import LeaveModel from "../models/LeaveModel.js";
import { BaseView } from "../views/BaseView.js";

export class LeaveController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.leaveModel = LeaveModel;
  }

  /**
   * Initialize leave management
   */
  async init() {
    try {
      this.view.showLoading();
      const leaves = await this.leaveModel.getAll();
      this.renderLeaves(leaves);
    } catch (error) {
      console.error("Error loading leaves:", error);
      this.view.showError("Không thể tải dữ liệu nghỉ phép.");
    }
  }

  /**
   * Render leaves
   */
  renderLeaves(leaves) {
    this.container.innerHTML = `
      <div class="module-header">
        <h2>📅 Quản lý Nghỉ phép</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Đơn nghỉ phép
        </button>
      </div>
      <div class="card">
        <p>Tổng số đơn: <strong>${leaves.length}</strong></p>
        <p><em>Chức năng quản lý nghỉ phép đang được phát triển...</em></p>
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

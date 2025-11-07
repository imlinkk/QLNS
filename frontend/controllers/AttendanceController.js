/**
 * AttendanceController - Handles attendance tracking
 */

import AttendanceModel from "../models/AttendanceModel.js";
import { BaseView } from "../views/BaseView.js";

export class AttendanceController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.attendanceModel = AttendanceModel;
  }

  /**
   * Initialize attendance tracking
   */
  async init() {
    try {
      this.view.showLoading();
      const records = await this.attendanceModel.getAll();
      this.renderAttendance(records);
    } catch (error) {
      console.error("Error loading attendance:", error);
      this.view.showError("Không thể tải dữ liệu chấm công.");
    }
  }

  /**
   * Render attendance
   */
  renderAttendance(records) {
    this.container.innerHTML = `
      <div class="module-header">
        <h2>⏰ Theo dõi Chấm công</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Chấm công
        </button>
      </div>
      <div class="card">
        <p>Tổng số bản ghi: <strong>${records.length}</strong></p>
        <p><em>Chức năng chấm công đang được phát triển...</em></p>
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

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
    const today = new Date().toLocaleDateString("vi-VN");
    const present = records.filter((r) => r.status === "present").length;
    const late = records.filter((r) => r.status === "late").length;
    const absent = records.filter((r) => r.status === "absent").length;

    this.container.innerHTML = `
      <div class="module-header">
        <h2>⏰ Theo dõi Chấm công</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Chấm công
        </button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            ✅
          </div>
          <div class="stat-info">
            <h3>${present}</h3>
            <p>Có mặt</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            ⏰
          </div>
          <div class="stat-info">
            <h3>${late}</h3>
            <p>Đi muộn</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            ❌
          </div>
          <div class="stat-info">
            <h3>${absent}</h3>
            <p>Vắng mặt</p>
          </div>
        </div>
      </div>

      <div class="attendance-container">
        <div class="attendance-header">
          <h3>📆 Bảng chấm công hôm nay - ${today}</h3>
          <div class="filter-buttons">
            <button class="filter-btn active" onclick="alert('Lọc: Tất cả')">Tất cả</button>
            <button class="filter-btn" onclick="alert('Lọc: Có mặt')">✅ Có mặt</button>
            <button class="filter-btn" onclick="alert('Lọc: Đi muộn')">⏰ Đi muộn</button>
            <button class="filter-btn" onclick="alert('Lọc: Vắng')">❌ Vắng</button>
          </div>
        </div>

        <div class="attendance-grid">
          ${
            records.length > 0
              ? records
                  .map(
                    (record) => `
            <div class="attendance-card ${record.status}">
              <div class="att-employee">
                <div class="emp-avatar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  ${
                    record.employee_name
                      ? record.employee_name.charAt(0).toUpperCase()
                      : "?"
                  }
                </div>
                <div class="emp-details">
                  <h4>${record.employee_name || "Nhân viên"}</h4>
                  <span class="emp-code">${record.employee_code || "N/A"}</span>
                </div>
              </div>
              
              <div class="att-info">
                <div class="att-time">
                  <span class="time-label">⏰ Giờ vào:</span>
                  <span class="time-value ${
                    record.status === "late" ? "late-time" : ""
                  }">${record.check_in || "--:--"}</span>
                </div>
                <div class="att-time">
                  <span class="time-label">🚪 Giờ ra:</span>
                  <span class="time-value">${record.check_out || "--:--"}</span>
                </div>
              </div>

              <div class="att-status">
                <span class="status-badge status-${record.status}">
                  ${
                    record.status === "present"
                      ? "✅ Đúng giờ"
                      : record.status === "late"
                      ? "⏰ Đi muộn"
                      : record.status === "absent"
                      ? "❌ Vắng"
                      : "⏸️ Chưa check"
                  }
                </span>
                ${
                  record.status === "late"
                    ? `<span class="late-duration">+${
                        record.late_minutes || 0
                      } phút</span>`
                    : ""
                }
              </div>

              <div class="att-actions">
                <button class="btn-icon" onclick="alert('Xem chi tiết')" title="Chi tiết">👁️</button>
                <button class="btn-icon" onclick="alert('Sửa chấm công')" title="Sửa">✏️</button>
              </div>
            </div>
          `
                  )
                  .join("")
              : `
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <p>Chưa có dữ liệu chấm công hôm nay</p>
            </div>
          `
          }
        </div>
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

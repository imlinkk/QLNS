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
    const pending = leaves.filter((l) => l.status === "pending").length;
    const approved = leaves.filter((l) => l.status === "approved").length;
    const rejected = leaves.filter((l) => l.status === "rejected").length;

    this.container.innerHTML = `
      <div class="module-header">
        <h2>📅 Quản lý Nghỉ phép</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Tạo Đơn nghỉ phép
        </button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);">
            ⏳
          </div>
          <div class="stat-info">
            <h3>${pending}</h3>
            <p>Chờ duyệt</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            ✅
          </div>
          <div class="stat-info">
            <h3>${approved}</h3>
            <p>Đã duyệt</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            ❌
          </div>
          <div class="stat-info">
            <h3>${rejected}</h3>
            <p>Từ chối</p>
          </div>
        </div>
      </div>

      <div class="leave-container">
        <div class="leave-tabs">
          <button class="tab-btn active" onclick="alert('Tất cả đơn')">Tất cả (${
            leaves.length
          })</button>
          <button class="tab-btn" onclick="alert('Chờ duyệt')">⏳ Chờ duyệt (${pending})</button>
          <button class="tab-btn" onclick="alert('Đã duyệt')">✅ Đã duyệt (${approved})</button>
          <button class="tab-btn" onclick="alert('Từ chối')">❌ Từ chối (${rejected})</button>
        </div>

        <div class="leave-grid">
          ${
            leaves.length > 0
              ? leaves
                  .map(
                    (leave) => `
            <div class="leave-card">
              <div class="leave-header">
                <div class="leave-employee">
                  <div class="emp-avatar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    ${
                      leave.employee_name
                        ? leave.employee_name.charAt(0).toUpperCase()
                        : "?"
                    }
                  </div>
                  <div>
                    <h4>${leave.employee_name || "Nhân viên"}</h4>
                    <span class="leave-type-badge">${
                      leave.leave_type || "Nghỉ phép"
                    }</span>
                  </div>
                </div>
                <span class="status-badge status-${leave.status}">
                  ${
                    leave.status === "pending"
                      ? "⏳ Chờ duyệt"
                      : leave.status === "approved"
                      ? "✅ Đã duyệt"
                      : "❌ Từ chối"
                  }
                </span>
              </div>

              <div class="leave-body">
                <div class="leave-dates">
                  <div class="date-item">
                    <span class="date-icon">📅</span>
                    <div>
                      <span class="date-label">Từ ngày</span>
                      <span class="date-value">${
                        leave.start_date || "N/A"
                      }</span>
                    </div>
                  </div>
                  <div class="date-item">
                    <span class="date-icon">📅</span>
                    <div>
                      <span class="date-label">Đến ngày</span>
                      <span class="date-value">${leave.end_date || "N/A"}</span>
                    </div>
                  </div>
                  <div class="date-item">
                    <span class="date-icon">⏱️</span>
                    <div>
                      <span class="date-label">Số ngày</span>
                      <span class="date-value days-count">${
                        leave.days_count || 0
                      } ngày</span>
                    </div>
                  </div>
                </div>

                <div class="leave-reason">
                  <strong>Lý do:</strong>
                  <p>${leave.reason || "Không có lý do"}</p>
                </div>

                ${
                  leave.status === "pending"
                    ? `
                  <div class="leave-actions">
                    <button class="btn-approve" onclick="alert('Phê duyệt đơn')">✅ Phê duyệt</button>
                    <button class="btn-reject" onclick="alert('Từ chối đơn')">❌ Từ chối</button>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          `
                  )
                  .join("")
              : `
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <p>Chưa có đơn nghỉ phép nào</p>
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

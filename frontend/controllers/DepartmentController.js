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

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            🏢
          </div>
          <div class="stat-info">
            <h3>${departments.length}</h3>
            <p>Tổng Phòng ban</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            👥
          </div>
          <div class="stat-info">
            <h3>${departments.reduce(
              (sum, d) => sum + (d.employee_count || 0),
              0
            )}</h3>
            <p>Tổng Nhân viên</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            ✅
          </div>
          <div class="stat-info">
            <h3>${departments.filter((d) => d.status === "active").length}</h3>
            <p>Đang Hoạt động</p>
          </div>
        </div>
      </div>

      <div class="departments-grid">
        ${departments
          .map(
            (dept) => `
          <div class="department-card">
            <div class="dept-card-header">
              <div class="dept-icon">🏢</div>
              <div class="dept-title">
                <h3>${dept.name}</h3>
                <span class="dept-badge ${
                  dept.status === "active" ? "badge-success" : "badge-inactive"
                }">
                  ${dept.status === "active" ? "✅ Hoạt động" : "⏸️ Ngưng"}
                </span>
              </div>
            </div>
            <div class="dept-card-body">
              <p class="dept-description">${
                dept.description || "Chưa có mô tả"
              }</p>
              <div class="dept-stats">
                <div class="dept-stat-item">
                  <span class="stat-label">👥 Nhân viên:</span>
                  <span class="stat-value">${dept.employee_count || 0}</span>
                </div>
                <div class="dept-stat-item">
                  <span class="stat-label">👤 Trưởng phòng:</span>
                  <span class="stat-value">${
                    dept.manager_name || "Chưa có"
                  }</span>
                </div>
              </div>
            </div>
            <div class="dept-card-footer">
              <button class="btn-icon" onclick="alert('Xem chi tiết: ${
                dept.name
              }')" title="Xem chi tiết">
                👁️
              </button>
              <button class="btn-icon" onclick="alert('Chỉnh sửa: ${
                dept.name
              }')" title="Chỉnh sửa">
                ✏️
              </button>
              <button class="btn-icon btn-danger" onclick="if(confirm('Xóa phòng ban ${
                dept.name
              }?')) alert('Đã xóa!')" title="Xóa">
                🗑️
              </button>
            </div>
          </div>
        `
          )
          .join("")}
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

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
    const totalSalary = salaries.reduce(
      (sum, s) => sum + parseFloat(s.total_salary || 0),
      0
    );
    const avgSalary = salaries.length > 0 ? totalSalary / salaries.length : 0;
    const currentMonth = new Date().toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });

    this.container.innerHTML = `
      <div class="module-header">
        <h2>💰 Quản lý Lương</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Tạo Bảng lương
        </button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            💰
          </div>
          <div class="stat-info">
            <h3>${(totalSalary / 1000000).toFixed(1)}M</h3>
            <p>Tổng Chi lương</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            📊
          </div>
          <div class="stat-info">
            <h3>${(avgSalary / 1000000).toFixed(1)}M</h3>
            <p>Lương Trung bình</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            👥
          </div>
          <div class="stat-info">
            <h3>${salaries.length}</h3>
            <p>Nhân viên</p>
          </div>
        </div>
      </div>

      <div class="salary-table-container">
        <div class="table-header">
          <h3>📅 Bảng lương ${currentMonth}</h3>
          <div class="table-actions">
            <button class="btn-secondary" onclick="alert('Xuất Excel')">📥 Xuất Excel</button>
            <button class="btn-secondary" onclick="alert('In bảng lương')">🖨️ In</button>
          </div>
        </div>
        
        <div class="salary-table">
          <table>
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Tên nhân viên</th>
                <th>Chức vụ</th>
                <th>Lương cơ bản</th>
                <th>Phụ cấp</th>
                <th>Thưởng</th>
                <th>Khấu trừ</th>
                <th class="total-col">Thực lãnh</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${
                salaries.length > 0
                  ? salaries
                      .map(
                        (salary) => `
                <tr>
                  <td><span class="emp-code">${
                    salary.employee_code || "N/A"
                  }</span></td>
                  <td><strong>${
                    salary.employee_name || "Nhân viên"
                  }</strong></td>
                  <td>${salary.position_title || "N/A"}</td>
                  <td>${(parseFloat(salary.base_salary || 0) / 1000000).toFixed(
                    1
                  )}M</td>
                  <td>${(parseFloat(salary.allowances || 0) / 1000000).toFixed(
                    1
                  )}M</td>
                  <td class="bonus">${(
                    parseFloat(salary.bonus || 0) / 1000000
                  ).toFixed(1)}M</td>
                  <td class="deduction">${(
                    parseFloat(salary.deductions || 0) / 1000000
                  ).toFixed(1)}M</td>
                  <td class="total-col"><strong>${(
                    parseFloat(salary.total_salary || 0) / 1000000
                  ).toFixed(1)}M</strong></td>
                  <td>
                    <span class="status-badge ${
                      salary.status === "paid"
                        ? "status-paid"
                        : "status-pending"
                    }">
                      ${salary.status === "paid" ? "✅ Đã trả" : "⏳ Chưa trả"}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-sm" onclick="alert('Xem chi tiết')" title="Chi tiết">👁️</button>
                      <button class="btn-sm" onclick="alert('Chỉnh sửa')" title="Sửa">✏️</button>
                    </div>
                  </td>
                </tr>
              `
                      )
                      .join("")
                  : `
                <tr>
                  <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    📭 Chưa có dữ liệu bảng lương cho tháng này
                  </td>
                </tr>
              `
              }
            </tbody>
          </table>
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

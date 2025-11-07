/**
 * DashboardView - Displays dashboard with statistics
 */

import { BaseView } from "./BaseView.js";

export class DashboardView extends BaseView {
  constructor(container) {
    super(container);
  }

  /**
   * Render dashboard with statistics
   */
  renderDashboard(stats, username) {
    const greeting = this.getGreeting();
    const currentDate = new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h2>📊 Bảng Điều Khiển</h2>
                    <div class="user-greeting">
                        <h3>${greeting}, <span class="username">${username}</span>! 👋</h3>
                        <p class="current-date">${currentDate}</p>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card stat-primary">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <div class="stat-value">${
                              stats.totalEmployees || 0
                            }</div>
                            <div class="stat-label">Tổng Nhân Viên</div>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-success">
                        <div class="stat-icon">🏢</div>
                        <div class="stat-content">
                            <div class="stat-value">${
                              stats.totalDepartments || 0
                            }</div>
                            <div class="stat-label">Phòng Ban</div>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-warning">
                        <div class="stat-icon">💼</div>
                        <div class="stat-content">
                            <div class="stat-value">${
                              stats.totalPositions || 0
                            }</div>
                            <div class="stat-label">Vị Trí</div>
                        </div>
                    </div>
                    
                    <div class="stat-card stat-info">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.formatCurrency(
                              stats.avgSalary || 0
                            )}</div>
                            <div class="stat-label">Lương Trung Bình</div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="dashboard-section">
                        <h4>📈 Phân Bổ Nhân Viên Theo Phòng Ban</h4>
                        <div class="department-chart">
                            ${this.renderDepartmentChart(
                              stats.employeesByDept || []
                            )}
                        </div>
                    </div>
                    
                    ${
                      stats.newestEmployee
                        ? this.renderNewestEmployee(stats.newestEmployee)
                        : ""
                    }
                    
                    <div class="dashboard-section">
                        <h4>🎯 Tóm Tắt Hệ Thống</h4>
                        <div class="system-summary">
                            <div class="summary-item">
                                <span class="summary-icon">✅</span>
                                <span>Hệ thống hoạt động bình thường</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-icon">📊</span>
                                <span>Dữ liệu được đồng bộ với database</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-icon">🔒</span>
                                <span>Phiên đăng nhập an toàn</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.render(html);
  }

  /**
   * Render department chart
   */
  renderDepartmentChart(departments) {
    if (!departments || departments.length === 0) {
      return '<p style="color: #999;">Không có dữ liệu phòng ban</p>';
    }

    const maxCount = Math.max(...departments.map((d) => d.count || 0));

    return departments
      .map(
        (dept) => `
            <div class="dept-bar-container">
                <div class="dept-label">${dept.name}</div>
                <div class="dept-bar-wrapper">
                    <div class="dept-bar" style="width: ${
                      maxCount > 0 ? (dept.count / maxCount) * 100 : 0
                    }%">
                        <span class="dept-count">${dept.count || 0}</span>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  /**
   * Render newest employee card
   */
  renderNewestEmployee(employee) {
    return `
            <div class="dashboard-section">
                <h4>🆕 Nhân Viên Mới Nhất</h4>
                <div class="newest-employee-card">
                    <div class="employee-avatar">👤</div>
                    <div class="employee-info">
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-details">
                            <span>📅 Ngày tuyển: ${new Date(
                              employee.hire_date
                            ).toLocaleDateString("vi-VN")}</span>
                            <span>💰 Lương: ${this.formatCurrency(
                              employee.salary
                            )}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Get greeting based on time
   */
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

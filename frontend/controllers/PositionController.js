/**
 * PositionController - Handles position management
 */

import PositionModel from "../models/PositionModel.js";
import { BaseView } from "../views/BaseView.js";

export class PositionController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.positionModel = PositionModel;
  }

  /**
   * Initialize position management
   */
  async init() {
    try {
      this.view.showLoading();
      const positions = await this.positionModel.getAll();
      this.renderPositions(positions);
    } catch (error) {
      console.error("Error loading positions:", error);
      this.view.showError("Không thể tải dữ liệu vị trí.");
    }
  }

  /**
   * Render positions
   */
  renderPositions(positions) {
    // Group positions by level (C-level, Manager, Staff, Entry)
    const groupedPositions = {
      "C-level": positions.filter(
        (p) =>
          p.level === "executive" ||
          p.title.includes("CEO") ||
          p.title.includes("CTO") ||
          p.title.includes("CFO")
      ),
      Manager: positions.filter(
        (p) =>
          p.level === "manager" ||
          p.title.includes("Manager") ||
          p.title.includes("Trưởng")
      ),
      Staff: positions.filter(
        (p) =>
          p.level === "staff" ||
          (!p.title.includes("Manager") && !p.title.includes("CEO"))
      ),
    };

    this.container.innerHTML = `
      <div class="module-header">
        <h2>💼 Quản lý Vị trí</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Vị trí
        </button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            💼
          </div>
          <div class="stat-info">
            <h3>${positions.length}</h3>
            <p>Tổng Vị trí</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            👔
          </div>
          <div class="stat-info">
            <h3>${
              groupedPositions["C-level"].length +
              groupedPositions["Manager"].length
            }</h3>
            <p>Vị trí Quản lý</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            👥
          </div>
          <div class="stat-info">
            <h3>${groupedPositions["Staff"].length}</h3>
            <p>Vị trí Nhân viên</p>
          </div>
        </div>
      </div>

      <div class="positions-container">
        ${Object.entries(groupedPositions)
          .map(([level, posArray]) =>
            posArray.length > 0
              ? `
          <div class="position-section">
            <h3 class="section-title">
              ${
                level === "C-level"
                  ? "👑 Cấp Lãnh đạo"
                  : level === "Manager"
                  ? "👔 Cấp Quản lý"
                  : "👥 Nhân viên"
              }
            </h3>
            <div class="positions-grid">
              ${posArray
                .map(
                  (pos) => `
                <div class="position-card">
                  <div class="position-header">
                    <div class="position-icon">
                      ${
                        level === "C-level"
                          ? "👑"
                          : level === "Manager"
                          ? "👔"
                          : "👤"
                      }
                    </div>
                    <div class="position-title">
                      <h4>${pos.title}</h4>
                      <span class="position-level">${pos.level || level}</span>
                    </div>
                  </div>
                  <div class="position-body">
                    <p class="position-description">${
                      pos.description || "Chưa có mô tả vị trí"
                    }</p>
                    <div class="position-details">
                      <div class="detail-item">
                        <span class="detail-icon">💰</span>
                        <span class="detail-text">
                          ${
                            pos.salary_min && pos.salary_max
                              ? `${(pos.salary_min / 1000000).toFixed(0)}-${(
                                  pos.salary_max / 1000000
                                ).toFixed(0)} triệu`
                              : "Thương lượng"
                          }
                        </span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-icon">👥</span>
                        <span class="detail-text">${
                          pos.employee_count || 0
                        } nhân viên</span>
                      </div>
                    </div>
                  </div>
                  <div class="position-footer">
                    <button class="btn-icon" onclick="alert('Xem chi tiết: ${
                      pos.title
                    }')" title="Xem chi tiết">
                      👁️
                    </button>
                    <button class="btn-icon" onclick="alert('Chỉnh sửa: ${
                      pos.title
                    }')" title="Chỉnh sửa">
                      ✏️
                    </button>
                    <button class="btn-icon btn-danger" onclick="if(confirm('Xóa vị trí ${
                      pos.title
                    }?')) alert('Đã xóa!')" title="Xóa">
                      🗑️
                    </button>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
              : ""
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

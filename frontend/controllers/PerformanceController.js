/**
 * PerformanceController - Handles performance reviews
 */

import PerformanceModel from "../models/PerformanceModel.js";
import { BaseView } from "../views/BaseView.js";

export class PerformanceController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.performanceModel = PerformanceModel;
  }

  /**
   * Initialize performance reviews
   */
  async init() {
    try {
      this.view.showLoading();
      const reviews = await this.performanceModel.getAll();
      this.renderPerformance(reviews);
    } catch (error) {
      console.error("Error loading performance reviews:", error);
      this.view.showError("Không thể tải dữ liệu đánh giá.");
    }
  }

  /**
   * Render performance reviews
   */
  renderPerformance(reviews) {
    const excellent = reviews.filter((r) => parseFloat(r.rating) >= 4.5).length;
    const good = reviews.filter(
      (r) => parseFloat(r.rating) >= 3.5 && parseFloat(r.rating) < 4.5
    ).length;
    const average = reviews.filter((r) => parseFloat(r.rating) < 3.5).length;
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    this.container.innerHTML = `
      <div class="module-header">
        <h2>⭐ Đánh giá Hiệu suất</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Tạo Đánh giá
        </button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);">
            ⭐
          </div>
          <div class="stat-info">
            <h3>${avgRating}</h3>
            <p>Điểm TB</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            🏆
          </div>
          <div class="stat-info">
            <h3>${excellent}</h3>
            <p>Xuất sắc</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            👍
          </div>
          <div class="stat-info">
            <h3>${good}</h3>
            <p>Tốt</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            📊
          </div>
          <div class="stat-info">
            <h3>${average}</h3>
            <p>Trung bình</p>
          </div>
        </div>
      </div>

      <div class="performance-container">
        <div class="perf-grid">
          ${
            reviews.length > 0
              ? reviews
                  .map((review) => {
                    const rating = parseFloat(review.rating || 0);
                    const stars = "⭐".repeat(Math.round(rating));
                    const ratingClass =
                      rating >= 4.5
                        ? "excellent"
                        : rating >= 3.5
                        ? "good"
                        : "average";

                    return `
            <div class="performance-card">
              <div class="perf-header">
                <div class="perf-employee">
                  <div class="emp-avatar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    ${
                      review.employee_name
                        ? review.employee_name.charAt(0).toUpperCase()
                        : "?"
                    }
                  </div>
                  <div>
                    <h4>${review.employee_name || "Nhân viên"}</h4>
                    <span class="perf-position">${
                      review.position_title || "Vị trí"
                    }</span>
                  </div>
                </div>
                <div class="rating-badge ${ratingClass}">
                  <span class="rating-number">${rating.toFixed(1)}</span>
                  <span class="rating-stars">${stars}</span>
                </div>
              </div>

              <div class="perf-body">
                <div class="perf-period">
                  <span class="period-icon">📅</span>
                  <span>Kỳ đánh giá: ${review.review_period || "Q1 2024"}</span>
                </div>

                <div class="perf-metrics">
                  <div class="metric-item">
                    <span class="metric-label">💼 Chuyên môn</span>
                    <div class="metric-bar">
                      <div class="metric-fill" style="width: ${
                        (review.technical_score || 0) * 20
                      }%; background: #667eea;"></div>
                    </div>
                    <span class="metric-value">${
                      review.technical_score || 0
                    }/5</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">🤝 Teamwork</span>
                    <div class="metric-bar">
                      <div class="metric-fill" style="width: ${
                        (review.teamwork_score || 0) * 20
                      }%; background: #43e97b;"></div>
                    </div>
                    <span class="metric-value">${
                      review.teamwork_score || 0
                    }/5</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">🎯 Đạt mục tiêu</span>
                    <div class="metric-bar">
                      <div class="metric-fill" style="width: ${
                        (review.goal_achievement || 0) * 20
                      }%; background: #4facfe;"></div>
                    </div>
                    <span class="metric-value">${
                      review.goal_achievement || 0
                    }/5</span>
                  </div>
                </div>

                <div class="perf-comments">
                  <strong>📝 Nhận xét:</strong>
                  <p>${review.comments || "Chưa có nhận xét"}</p>
                </div>

                <div class="perf-footer">
                  <span class="reviewer">Người đánh giá: ${
                    review.reviewer_name || "N/A"
                  }</span>
                  <div class="perf-actions">
                    <button class="btn-icon" onclick="alert('Xem chi tiết')" title="Chi tiết">👁️</button>
                    <button class="btn-icon" onclick="alert('Sửa đánh giá')" title="Sửa">✏️</button>
                  </div>
                </div>
              </div>
            </div>
          `;
                  })
                  .join("")
              : `
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <p>Chưa có đánh giá hiệu suất nào</p>
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

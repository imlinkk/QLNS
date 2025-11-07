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
    this.container.innerHTML = `
      <div class="module-header">
        <h2>⭐ Đánh giá Hiệu suất</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Đánh giá
        </button>
      </div>
      <div class="card">
        <p>Tổng số đánh giá: <strong>${reviews.length}</strong></p>
        <p><em>Chức năng đánh giá hiệu suất đang được phát triển...</em></p>
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

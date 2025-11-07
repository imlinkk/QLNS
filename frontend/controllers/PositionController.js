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
    this.container.innerHTML = `
      <div class="module-header">
        <h2>💼 Quản lý Vị trí</h2>
        <button class="btn-primary" onclick="alert('Chức năng đang phát triển')">
          ➕ Thêm Vị trí
        </button>
      </div>
      <div class="card">
        <p>Tổng số vị trí: <strong>${positions.length}</strong></p>
        <ul>
          ${positions
            .map(
              (pos) => `
            <li>${pos.title} - ${pos.description || "Không có mô tả"}</li>
          `
            )
            .join("")}
        </ul>
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

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
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  /**
   * Render positions
   */
  renderPositions(positions) {
    this.container.innerHTML = `
      <div class="module-header">
        <h2>💼 Quản lý Vị trí</h2>
        <button class="btn-primary" id="btnAddPosition">
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
            👥
          </div>
          <div class="stat-info">
            <h3>${positions.reduce((sum, p) => sum + (p.employee_count || 0), 0)}</h3>
            <p>Tổng Nhân viên</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            💰
          </div>
          <div class="stat-info">
            <h3>${this.formatCurrency(positions.reduce((sum, p) => sum + parseFloat(p.max_salary || 0), 0) / positions.length || 0)}</h3>
            <p>Lương TB Cao nhất</p>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Mô tả</th>
              <th>Lương Tối thiểu</th>
              <th>Lương Tối đa</th>
              <th>Số NV</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${positions.map(pos => `
              <tr>
                <td><strong>${pos.title}</strong></td>
                <td>${pos.description || 'N/A'}</td>
                <td>${this.formatCurrency(pos.min_salary || 0)}</td>
                <td>${this.formatCurrency(pos.max_salary || 0)}</td>
                <td><span class="badge badge-info">${pos.employee_count || 0}</span></td>
                <td>
                  <button class="btn-icon" data-action="view" data-id="${pos.id}" title="Xem chi tiết">👁️</button>
                  <button class="btn-icon" data-action="edit" data-id="${pos.id}" title="Sửa">✏️</button>
                  <button class="btn-icon btn-danger" data-action="delete" data-id="${pos.id}" title="Xóa">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const btnAdd = this.container.querySelector('#btnAddPosition');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => this.showAddPositionForm());
    }

    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.currentTarget.dataset.action;
        const id = parseInt(e.currentTarget.dataset.id);
        
        switch (action) {
          case 'view':
            await this.viewPosition(id);
            break;
          case 'edit':
            await this.showEditPositionForm(id);
            break;
          case 'delete':
            await this.deletePosition(id);
            break;
        }
      });
    });
  }

  /**
   * Show add position form
   */
  showAddPositionForm() {
    this.view.showModal(`
      <h3>➕ Thêm Vị trí Mới</h3>
      <form id="formAddPosition">
        <div class="form-group">
          <label>Tên vị trí <span class="required">*</span></label>
          <input type="text" name="title" required placeholder="Ví dụ: Senior Developer">
        </div>
        
        <div class="form-group">
          <label>Mô tả</label>
          <textarea name="description" rows="3" placeholder="Mô tả công việc..."></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Lương tối thiểu <span class="required">*</span></label>
            <input type="number" name="min_salary" required placeholder="10000000">
          </div>
          
          <div class="form-group">
            <label>Lương tối đa <span class="required">*</span></label>
            <input type="number" name="max_salary" required placeholder="20000000">
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">➕ Thêm Vị trí</button>
        </div>
      </form>
    `);

    document.getElementById('formAddPosition').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleAddPosition(new FormData(e.target));
    });
  }

  /**
   * Handle add position
   */
  async handleAddPosition(formData) {
    try {
      this.view.showLoading();
      
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        min_salary: parseFloat(formData.get('min_salary')),
        max_salary: parseFloat(formData.get('max_salary'))
      };

      await this.positionModel.create(data);
      
      this.view.showSuccess('Thêm vị trí thành công!');
      document.querySelector('.modal')?.remove();
      await this.init();
    } catch (error) {
      console.error('Error adding position:', error);
      this.view.showError('Không thể thêm vị trí: ' + error.message);
    }
  }

  /**
   * Show edit position form
   */
  async showEditPositionForm(id) {
    try {
      this.view.showLoading();
      const position = await this.positionModel.getById(id);
      
      this.view.showModal(`
        <h3>✏️ Chỉnh sửa Vị trí</h3>
        <form id="formEditPosition">
          <input type="hidden" name="id" value="${position.id}">
          
          <div class="form-group">
            <label>Tên vị trí <span class="required">*</span></label>
            <input type="text" name="title" value="${position.title}" required>
          </div>
          
          <div class="form-group">
            <label>Mô tả</label>
            <textarea name="description" rows="3">${position.description || ''}</textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Lương tối thiểu <span class="required">*</span></label>
              <input type="number" name="min_salary" value="${position.min_salary}" required>
            </div>
            
            <div class="form-group">
              <label>Lương tối đa <span class="required">*</span></label>
              <input type="number" name="max_salary" value="${position.max_salary}" required>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
            <button type="submit" class="btn-primary">💾 Lưu</button>
          </div>
        </form>
      `);

      document.getElementById('formEditPosition').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleEditPosition(new FormData(e.target));
      });
    } catch (error) {
      console.error('Error loading position:', error);
      this.view.showError('Không thể tải thông tin vị trí.');
    }
  }

  /**
   * Handle edit position
   */
  async handleEditPosition(formData) {
    try {
      this.view.showLoading();
      
      const id = formData.get('id');
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        min_salary: parseFloat(formData.get('min_salary')),
        max_salary: parseFloat(formData.get('max_salary'))
      };

      await this.positionModel.update(id, data);
      
      this.view.showSuccess('Cập nhật vị trí thành công!');
      document.querySelector('.modal')?.remove();
      await this.init();
    } catch (error) {
      console.error('Error updating position:', error);
      this.view.showError('Không thể cập nhật vị trí: ' + error.message);
    }
  }

  /**
   * View position details
   */
  async viewPosition(id) {
    try {
      this.view.showLoading();
      const position = await this.positionModel.getById(id);
      
      this.view.showModal(`
        <h3>💼 Chi tiết Vị trí</h3>
        <div class="detail-view">
          <div class="detail-row">
            <span class="detail-label">Tên vị trí:</span>
            <span class="detail-value">${position.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Mô tả:</span>
            <span class="detail-value">${position.description || 'Chưa có'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Lương tối thiểu:</span>
            <span class="detail-value">${this.formatCurrency(position.min_salary)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Lương tối đa:</span>
            <span class="detail-value">${this.formatCurrency(position.max_salary)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Số nhân viên:</span>
            <span class="detail-value">${position.employee_count || 0}</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Đóng</button>
        </div>
      `);
    } catch (error) {
      console.error('Error viewing position:', error);
      this.view.showError('Không thể tải thông tin vị trí.');
    }
  }

  /**
   * Delete position
   */
  async deletePosition(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa vị trí này?')) {
      return;
    }

    try {
      this.view.showLoading();
      await this.positionModel.delete(id);
      this.view.showSuccess('Xóa vị trí thành công!');
      await this.init();
    } catch (error) {
      console.error('Error deleting position:', error);
      this.view.showError('Không thể xóa vị trí: ' + error.message);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.view.clear();
  }
}
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

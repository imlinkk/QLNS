/**
 * PerformanceController - Full Implementation
 */

import PerformanceModel from "../models/PerformanceModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { BaseView } from "../views/BaseView.js";

export class PerformanceController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.performanceModel = PerformanceModel;
    this.employeeModel = EmployeeModel;
  }

  async init() {
    try {
      this.view.showLoading();
      const reviews = await this.performanceModel.getAll();
      this.renderPerformance(reviews);
    } catch (error) {
      console.error("Error loading performance reviews:", error);
      this.view.showError("Không thể tải dữ liệu đánh giá hiệu suất.");
    }
  }

  renderPerformance(reviews) {
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) / reviews.length).toFixed(2)
      : 0;
    
    const stats = {
      total: reviews.length,
      completed: reviews.filter(r => r.status === 'completed').length,
      draft: reviews.filter(r => r.status === 'draft').length,
      avgRating: avgRating
    };

    this.container.innerHTML = `
      <div class="module-header">
        <h2>⭐ Đánh giá Hiệu suất</h2>
        <button class="btn-primary" id="btnAddReview">➕ Thêm Đánh giá</button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">📊</div>
          <div class="stat-info"><h3>${stats.total}</h3><p>Tổng Đánh giá</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">✅</div>
          <div class="stat-info"><h3>${stats.completed}</h3><p>Hoàn thành</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">📝</div>
          <div class="stat-info"><h3>${stats.draft}</h3><p>Nháp</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">⭐</div>
          <div class="stat-info"><h3>${stats.avgRating}/5.0</h3><p>Điểm TB</p></div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Người đánh giá</th>
              <th>Kỳ đánh giá</th>
              <th>Điểm</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${reviews.map(review => `
              <tr>
                <td>${review.employee_name || 'N/A'}</td>
                <td>${review.reviewer_name || 'N/A'}</td>
                <td>${review.review_period_start} → ${review.review_period_end}</td>
                <td><span class="badge ${this.getRatingBadge(review.rating)}">${this.formatRating(review.rating)}</span></td>
                <td><span class="badge badge-${this.getStatusClass(review.status)}">${this.getStatusLabel(review.status)}</span></td>
                <td>
                  <button class="btn-icon" data-action="view" data-id="${review.id}" title="Xem">👁️</button>
                  <button class="btn-icon" data-action="edit" data-id="${review.id}" title="Sửa">✏️</button>
                  <button class="btn-icon btn-danger" data-action="delete" data-id="${review.id}" title="Xóa">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.attachEventListeners();
  }

  formatRating(rating) {
    const r = parseFloat(rating || 0);
    return `⭐ ${r.toFixed(2)}/5.0`;
  }

  getRatingBadge(rating) {
    const r = parseFloat(rating || 0);
    if (r >= 4.5) return 'badge-success';
    if (r >= 3.5) return 'badge-info';
    if (r >= 2.5) return 'badge-warning';
    return 'badge-danger';
  }

  getStatusClass(status) {
    return { draft: 'secondary', submitted: 'warning', completed: 'success' }[status] || 'secondary';
  }

  getStatusLabel(status) {
    return { draft: '📝 Nháp', submitted: '📤 Đã gửi', completed: '✅ Hoàn thành' }[status] || status;
  }

  attachEventListeners() {
    document.getElementById('btnAddReview')?.addEventListener('click', () => this.showAddForm());
    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.currentTarget.dataset.action;
        const id = parseInt(e.currentTarget.dataset.id);
        if (action === 'view') await this.view(id);
        else if (action === 'edit') await this.showEditForm(id);
        else if (action === 'delete') await this.delete(id);
      });
    });
  }

  async showAddForm() {
    const employees = await this.employeeModel.getAll();
    
    this.view.showModal(`
      <h3>➕ Thêm Đánh giá Hiệu suất</h3>
      <form id="formAddReview">
        <div class="form-group">
          <label>Nhân viên <span class="required">*</span></label>
          <select name="employee_id" required>
            ${employees.map(e => `<option value="${e.id}">${e.name} - ${e.position_title || 'N/A'}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Người đánh giá <span class="required">*</span></label>
          <select name="reviewer_id" required>
            ${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Từ ngày <span class="required">*</span></label>
            <input type="date" name="review_period_start" required>
          </div>
          <div class="form-group">
            <label>Đến ngày <span class="required">*</span></label>
            <input type="date" name="review_period_end" required>
          </div>
        </div>
        <div class="form-group">
          <label>Điểm đánh giá <span class="required">*</span></label>
          <input type="number" name="rating" required min="0" max="5" step="0.1" placeholder="0 - 5.0">
        </div>
        <div class="form-group">
          <label>Điểm mạnh</label>
          <textarea name="strengths" rows="2" placeholder="Những điểm mạnh của nhân viên..."></textarea>
        </div>
        <div class="form-group">
          <label>Điểm cần cải thiện</label>
          <textarea name="weaknesses" rows="2" placeholder="Những điểm cần cải thiện..."></textarea>
        </div>
        <div class="form-group">
          <label>Mục tiêu</label>
          <textarea name="goals" rows="2" placeholder="Mục tiêu cho kỳ tiếp theo..."></textarea>
        </div>
        <div class="form-group">
          <label>Nhận xét</label>
          <textarea name="comments" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Trạng thái</label>
          <select name="status">
            <option value="draft">📝 Nháp</option>
            <option value="submitted">📤 Đã gửi</option>
            <option value="completed">✅ Hoàn thành</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">➕ Thêm</button>
        </div>
      </form>
    `);

    document.getElementById('formAddReview').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      try {
        await this.performanceModel.create(data);
        this.view.showSuccess('Thêm đánh giá thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async showEditForm(id) {
    const review = await this.performanceModel.getById(id);
    const employees = await this.employeeModel.getAll();
    
    this.view.showModal(`
      <h3>✏️ Sửa Đánh giá</h3>
      <form id="formEditReview">
        <input type="hidden" name="id" value="${review.id}">
        <div class="form-group">
          <label>Nhân viên</label>
          <select name="employee_id" required>
            ${employees.map(e => `<option value="${e.id}" ${e.id == review.employee_id ? 'selected' : ''}>${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Người đánh giá</label>
          <select name="reviewer_id" required>
            ${employees.map(e => `<option value="${e.id}" ${e.id == review.reviewer_id ? 'selected' : ''}>${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Từ ngày</label>
            <input type="date" name="review_period_start" value="${review.review_period_start}" required>
          </div>
          <div class="form-group">
            <label>Đến ngày</label>
            <input type="date" name="review_period_end" value="${review.review_period_end}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Điểm đánh giá</label>
          <input type="number" name="rating" value="${review.rating}" required min="0" max="5" step="0.1">
        </div>
        <div class="form-group">
          <label>Điểm mạnh</label>
          <textarea name="strengths" rows="2">${review.strengths || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Điểm cần cải thiện</label>
          <textarea name="weaknesses" rows="2">${review.weaknesses || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Mục tiêu</label>
          <textarea name="goals" rows="2">${review.goals || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Nhận xét</label>
          <textarea name="comments" rows="2">${review.comments || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Trạng thái</label>
          <select name="status">
            <option value="draft" ${review.status === 'draft' ? 'selected' : ''}>📝 Nháp</option>
            <option value="submitted" ${review.status === 'submitted' ? 'selected' : ''}>📤 Đã gửi</option>
            <option value="completed" ${review.status === 'completed' ? 'selected' : ''}>✅ Hoàn thành</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">💾 Lưu</button>
        </div>
      </form>
    `);

    document.getElementById('formEditReview').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get('id');
      const data = Object.fromEntries(formData);
      delete data.id;
      
      try {
        await this.performanceModel.update(id, data);
        this.view.showSuccess('Cập nhật thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async view(id) {
    const review = await this.performanceModel.getById(id);
    this.view.showModal(`
      <h3>⭐ Chi tiết Đánh giá</h3>
      <div class="detail-view">
        <div class="detail-row">
          <span class="detail-label">Nhân viên:</span>
          <span class="detail-value">${review.employee_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Người đánh giá:</span>
          <span class="detail-value">${review.reviewer_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Kỳ đánh giá:</span>
          <span class="detail-value">${review.review_period_start} → ${review.review_period_end}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Điểm:</span>
          <span class="detail-value"><span class="badge ${this.getRatingBadge(review.rating)}">${this.formatRating(review.rating)}</span></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Điểm mạnh:</span>
          <span class="detail-value">${review.strengths || 'Chưa có'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Điểm yếu:</span>
          <span class="detail-value">${review.weaknesses || 'Chưa có'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Mục tiêu:</span>
          <span class="detail-value">${review.goals || 'Chưa có'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Nhận xét:</span>
          <span class="detail-value">${review.comments || 'Chưa có'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Trạng thái:</span>
          <span class="detail-value"><span class="badge badge-${this.getStatusClass(review.status)}">${this.getStatusLabel(review.status)}</span></span>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Đóng</button>
      </div>
    `);
  }

  async delete(id) {
    if (!confirm('Xóa đánh giá này?')) return;
    try {
      await this.performanceModel.delete(id);
      this.view.showSuccess('Xóa thành công!');
      await this.init();
    } catch (error) {
      this.view.showError('Lỗi: ' + error.message);
    }
  }

  destroy() {
    this.view.clear();
  }
}

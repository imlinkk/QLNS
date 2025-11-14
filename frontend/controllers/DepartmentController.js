/**
 * DepartmentController - Handles department management
 */

import DepartmentModel from "../models/DepartmentModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { BaseView } from "../views/BaseView.js";

export class DepartmentController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.departmentModel = DepartmentModel;
    this.employeeModel = EmployeeModel;
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
        <button class="btn-primary" id="btnAddDepartment">
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
              <button class="btn-icon" data-action="view" data-id="${dept.id}" title="Xem chi tiết">
                👁️
              </button>
              <button class="btn-icon" data-action="edit" data-id="${dept.id}" title="Chỉnh sửa">
                ✏️
              </button>
              <button class="btn-icon btn-danger" data-action="delete" data-id="${dept.id}" title="Xóa">
                🗑️
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Attach event listeners
    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Add department button
    const btnAdd = this.container.querySelector('#btnAddDepartment');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => this.showAddDepartmentForm());
    }

    // Action buttons
    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.currentTarget.dataset.action;
        const id = parseInt(e.currentTarget.dataset.id);
        
        switch (action) {
          case 'view':
            await this.viewDepartment(id);
            break;
          case 'edit':
            await this.showEditDepartmentForm(id);
            break;
          case 'delete':
            await this.deleteDepartment(id);
            break;
        }
      });
    });
  }

  /**
   * Show add department form
   */
  async showAddDepartmentForm() {
    const employees = await this.employeeModel.getAll();
    
    this.view.showModal(`
      <h3>➕ Thêm Phòng ban Mới</h3>
      <form id="formAddDepartment">
        <div class="form-group">
          <label>Tên Phòng ban <span class="required">*</span></label>
          <input type="text" name="name" required placeholder="Ví dụ: Phòng IT">
        </div>
        
        <div class="form-group">
          <label>Mô tả</label>
          <textarea name="description" rows="3" placeholder="Mô tả về phòng ban..."></textarea>
        </div>
        
        <div class="form-group">
          <label>Trưởng phòng</label>
          <select name="manager_id">
            <option value="">-- Chọn trưởng phòng --</option>
            ${employees.map(emp => `
              <option value="${emp.id}">${emp.name} - ${emp.position_title || 'N/A'}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
            Hủy
          </button>
          <button type="submit" class="btn-primary">
            ➕ Thêm Phòng ban
          </button>
        </div>
      </form>
    `);

    // Handle form submit
    document.getElementById('formAddDepartment').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleAddDepartment(new FormData(e.target));
    });
  }

  /**
   * Handle add department
   */
  async handleAddDepartment(formData) {
    try {
      this.view.showLoading();
      
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        manager_id: formData.get('manager_id') || null
      };

      await this.departmentModel.create(data);
      
      this.view.showSuccess('Thêm phòng ban thành công!');
      document.querySelector('.modal')?.remove();
      await this.init();
    } catch (error) {
      console.error('Error adding department:', error);
      this.view.showError('Không thể thêm phòng ban: ' + error.message);
    }
  }

  /**
   * Show edit department form
   */
  async showEditDepartmentForm(id) {
    try {
      this.view.showLoading();
      const department = await this.departmentModel.getById(id);
      const employees = await this.employeeModel.getAll();
      
      this.view.showModal(`
        <h3>✏️ Chỉnh sửa Phòng ban</h3>
        <form id="formEditDepartment">
          <input type="hidden" name="id" value="${department.id}">
          
          <div class="form-group">
            <label>Tên Phòng ban <span class="required">*</span></label>
            <input type="text" name="name" value="${department.name}" required>
          </div>
          
          <div class="form-group">
            <label>Mô tả</label>
            <textarea name="description" rows="3">${department.description || ''}</textarea>
          </div>
          
          <div class="form-group">
            <label>Trưởng phòng</label>
            <select name="manager_id">
              <option value="">-- Chọn trưởng phòng --</option>
              ${employees.map(emp => `
                <option value="${emp.id}" ${emp.id == department.manager_id ? 'selected' : ''}>
                  ${emp.name} - ${emp.position_title || 'N/A'}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
              Hủy
            </button>
            <button type="submit" class="btn-primary">
              💾 Lưu Thay đổi
            </button>
          </div>
        </form>
      `);

      document.getElementById('formEditDepartment').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleEditDepartment(new FormData(e.target));
      });
    } catch (error) {
      console.error('Error loading department:', error);
      this.view.showError('Không thể tải thông tin phòng ban.');
    }
  }

  /**
   * Handle edit department
   */
  async handleEditDepartment(formData) {
    try {
      this.view.showLoading();
      
      const id = formData.get('id');
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        manager_id: formData.get('manager_id') || null
      };

      await this.departmentModel.update(id, data);
      
      this.view.showSuccess('Cập nhật phòng ban thành công!');
      document.querySelector('.modal')?.remove();
      await this.init();
    } catch (error) {
      console.error('Error updating department:', error);
      this.view.showError('Không thể cập nhật phòng ban: ' + error.message);
    }
  }

  /**
   * View department details
   */
  async viewDepartment(id) {
    try {
      this.view.showLoading();
      const department = await this.departmentModel.getById(id);
      
      this.view.showModal(`
        <h3>🏢 Chi tiết Phòng ban</h3>
        <div class="detail-view">
          <div class="detail-row">
            <span class="detail-label">Tên phòng ban:</span>
            <span class="detail-value">${department.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Mô tả:</span>
            <span class="detail-value">${department.description || 'Chưa có mô tả'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Trưởng phòng:</span>
            <span class="detail-value">${department.manager_name || 'Chưa có'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Số nhân viên:</span>
            <span class="detail-value">${department.employee_count || 0}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Trạng thái:</span>
            <span class="detail-value">
              <span class="badge ${department.status === 'active' ? 'badge-success' : 'badge-inactive'}">
                ${department.status === 'active' ? '✅ Hoạt động' : '⏸️ Ngưng'}
              </span>
            </span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
            Đóng
          </button>
        </div>
      `);
    } catch (error) {
      console.error('Error viewing department:', error);
      this.view.showError('Không thể tải thông tin phòng ban.');
    }
  }

  /**
   * Delete department
   */
  async deleteDepartment(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      return;
    }

    try {
      this.view.showLoading();
      await this.departmentModel.delete(id);
      this.view.showSuccess('Xóa phòng ban thành công!');
      await this.init();
    } catch (error) {
      console.error('Error deleting department:', error);
      this.view.showError('Không thể xóa phòng ban: ' + error.message);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.view.clear();
  }
}

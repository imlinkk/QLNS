/**
 * SalaryController - Full Implementation
 */

import SalaryModel from "../models/SalaryModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { BaseView } from "../views/BaseView.js";

export class SalaryController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.salaryModel = SalaryModel;
    this.employeeModel = EmployeeModel;
  }

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

  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  }

  renderSalaries(salaries) {
    const totalSalary = salaries.reduce((sum, s) => sum + parseFloat(s.total_salary || 0), 0);
    const totalBonus = salaries.reduce((sum, s) => sum + parseFloat(s.bonus || 0), 0);
    const totalDeduction = salaries.reduce((sum, s) => sum + parseFloat(s.deduction || 0), 0);

    this.container.innerHTML = `
      <div class="module-header">
        <h2>💰 Quản lý Lương</h2>
        <button class="btn-primary" id="btnAddSalary">➕ Thêm Bảng Lương</button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">💰</div>
          <div class="stat-info"><h3>${this.formatCurrency(totalSalary)}</h3><p>Tổng Lương</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">🎁</div>
          <div class="stat-info"><h3>${this.formatCurrency(totalBonus)}</h3><p>Tổng Thưởng</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">📉</div>
          <div class="stat-info"><h3>${this.formatCurrency(totalDeduction)}</h3><p>Tổng Khấu trừ</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">📊</div>
          <div class="stat-info"><h3>${salaries.length}</h3><p>Bản ghi</p></div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Tháng/Năm</th>
              <th>Lương Cơ bản</th>
              <th>Thưởng</th>
              <th>Khấu trừ</th>
              <th>Tổng Lương</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${salaries.map(salary => `
              <tr>
                <td>${salary.employee_name || 'N/A'}</td>
                <td>${salary.month}/${salary.year}</td>
                <td>${this.formatCurrency(salary.base_salary)}</td>
                <td><span class="badge badge-success">${this.formatCurrency(salary.bonus || 0)}</span></td>
                <td><span class="badge badge-danger">${this.formatCurrency(salary.deduction || 0)}</span></td>
                <td><strong>${this.formatCurrency(salary.total_salary)}</strong></td>
                <td>${salary.notes || '-'}</td>
                <td>
                  <button class="btn-icon" data-action="view" data-id="${salary.id}">👁️</button>
                  <button class="btn-icon" data-action="edit" data-id="${salary.id}">✏️</button>
                  <button class="btn-icon btn-danger" data-action="delete" data-id="${salary.id}">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('btnAddSalary')?.addEventListener('click', () => this.showAddForm());
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
    const now = new Date();
    
    this.view.showModal(`
      <h3>➕ Thêm Bảng Lương</h3>
      <form id="formAddSalary">
        <div class="form-group">
          <label>Nhân viên <span class="required">*</span></label>
          <select name="employee_id" required id="selectEmployee">
            <option value="">-- Chọn nhân viên --</option>
            ${employees.map(e => `<option value="${e.id}" data-salary="${e.salary}">${e.name} - ${this.formatCurrency(e.salary)}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tháng <span class="required">*</span></label>
            <input type="number" name="month" required min="1" max="12" value="${now.getMonth() + 1}">
          </div>
          <div class="form-group">
            <label>Năm <span class="required">*</span></label>
            <input type="number" name="year" required value="${now.getFullYear()}">
          </div>
        </div>
        <div class="form-group">
          <label>Lương cơ bản <span class="required">*</span></label>
          <input type="number" name="base_salary" id="baseSalary" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Thưởng</label>
            <input type="number" name="bonus" value="0">
          </div>
          <div class="form-group">
            <label>Khấu trừ</label>
            <input type="number" name="deduction" value="0">
          </div>
        </div>
        <div class="form-group">
          <label>Ghi chú</label>
          <textarea name="notes" rows="2"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">➕ Thêm</button>
        </div>
      </form>
    `);

    // Auto-fill base salary when employee is selected
    document.getElementById('selectEmployee').addEventListener('change', (e) => {
      const salary = e.target.selectedOptions[0]?.dataset.salary || 0;
      document.getElementById('baseSalary').value = salary;
    });

    document.getElementById('formAddSalary').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      try {
        await this.salaryModel.create(data);
        this.view.showSuccess('Thêm bảng lương thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async showEditForm(id) {
    const salary = await this.salaryModel.getById(id);
    const employees = await this.employeeModel.getAll();
    
    this.view.showModal(`
      <h3>✏️ Sửa Bảng Lương</h3>
      <form id="formEditSalary">
        <input type="hidden" name="id" value="${salary.id}">
        <div class="form-group">
          <label>Nhân viên</label>
          <select name="employee_id" required>
            ${employees.map(e => `<option value="${e.id}" ${e.id == salary.employee_id ? 'selected' : ''}>${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tháng</label>
            <input type="number" name="month" value="${salary.month}" required min="1" max="12">
          </div>
          <div class="form-group">
            <label>Năm</label>
            <input type="number" name="year" value="${salary.year}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Lương cơ bản</label>
          <input type="number" name="base_salary" value="${salary.base_salary}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Thưởng</label>
            <input type="number" name="bonus" value="${salary.bonus || 0}">
          </div>
          <div class="form-group">
            <label>Khấu trừ</label>
            <input type="number" name="deduction" value="${salary.deduction || 0}">
          </div>
        </div>
        <div class="form-group">
          <label>Ghi chú</label>
          <textarea name="notes" rows="2">${salary.notes || ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">💾 Lưu</button>
        </div>
      </form>
    `);

    document.getElementById('formEditSalary').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get('id');
      const data = Object.fromEntries(formData);
      delete data.id;
      
      try {
        await this.salaryModel.update(id, data);
        this.view.showSuccess('Cập nhật thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async view(id) {
    const salary = await this.salaryModel.getById(id);
    this.view.showModal(`
      <h3>💰 Chi tiết Bảng Lương</h3>
      <div class="detail-view">
        <div class="detail-row">
          <span class="detail-label">Nhân viên:</span>
          <span class="detail-value">${salary.employee_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Kỳ lương:</span>
          <span class="detail-value">Tháng ${salary.month}/${salary.year}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Lương cơ bản:</span>
          <span class="detail-value">${this.formatCurrency(salary.base_salary)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Thưởng:</span>
          <span class="detail-value badge badge-success">${this.formatCurrency(salary.bonus || 0)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Khấu trừ:</span>
          <span class="detail-value badge badge-danger">${this.formatCurrency(salary.deduction || 0)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label"><strong>Tổng lương:</strong></span>
          <span class="detail-value"><strong>${this.formatCurrency(salary.total_salary)}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Ghi chú:</span>
          <span class="detail-value">${salary.notes || 'Không có'}</span>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Đóng</button>
      </div>
    `);
  }

  async delete(id) {
    if (!confirm('Xóa bảng lương này?')) return;
    try {
      await this.salaryModel.delete(id);
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

/**
 * AttendanceController - Full Implementation
 */

import AttendanceModel from "../models/AttendanceModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { BaseView } from "../views/BaseView.js";

export class AttendanceController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.attendanceModel = AttendanceModel;
    this.employeeModel = EmployeeModel;
    this.currentFilter = 'all';
  }

  async init() {
    try {
      this.view.showLoading();
      const records = await this.attendanceModel.getAll();
      this.renderAttendance(records);
    } catch (error) {
      console.error("Error loading attendance:", error);
      this.view.showError("Không thể tải dữ liệu chấm công.");
    }
  }

  renderAttendance(records) {
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      late: records.filter(r => r.status === 'late').length,
      absent: records.filter(r => r.status === 'absent').length
    };

    this.container.innerHTML = `
      <div class="module-header">
        <h2>⏰ Quản lý Chấm công</h2>
        <button class="btn-primary" id="btnAddAttendance">➕ Thêm Chấm công</button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">📊</div>
          <div class="stat-info"><h3>${stats.total}</h3><p>Tổng Bản ghi</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">✅</div>
          <div class="stat-info"><h3>${stats.present}</h3><p>Có mặt</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">⏰</div>
          <div class="stat-info"><h3>${stats.late}</h3><p>Đi muộn</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">❌</div>
          <div class="stat-info"><h3>${stats.absent}</h3><p>Vắng</p></div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Ngày</th>
              <th>Giờ vào</th>
              <th>Giờ ra</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(rec => `
              <tr>
                <td>${rec.employee_name || 'N/A'}</td>
                <td>${rec.date}</td>
                <td>${rec.check_in || '-'}</td>
                <td>${rec.check_out || '-'}</td>
                <td><span class="badge badge-${this.getStatusClass(rec.status)}">${this.getStatusLabel(rec.status)}</span></td>
                <td>${rec.notes || '-'}</td>
                <td>
                  <button class="btn-icon" data-action="edit" data-id="${rec.id}">✏️</button>
                  <button class="btn-icon btn-danger" data-action="delete" data-id="${rec.id}">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.attachEventListeners();
  }

  getStatusClass(status) {
    const classes = { present: 'success', late: 'warning', absent: 'danger', on_leave: 'info' };
    return classes[status] || 'secondary';
  }

  getStatusLabel(status) {
    const labels = { present: '✅ Có mặt', late: '⏰ Muộn', absent: '❌ Vắng', on_leave: '🏖️ Nghỉ phép' };
    return labels[status] || status;
  }

  attachEventListeners() {
    document.getElementById('btnAddAttendance')?.addEventListener('click', () => this.showAddForm());
    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.currentTarget.dataset.action;
        const id = parseInt(e.currentTarget.dataset.id);
        if (action === 'edit') await this.showEditForm(id);
        else if (action === 'delete') await this.delete(id);
      });
    });
  }

  async showAddForm() {
    const employees = await this.employeeModel.getAll();
    this.view.showModal(`
      <h3>➕ Thêm Chấm công</h3>
      <form id="formAddAttendance">
        <div class="form-group">
          <label>Nhân viên <span class="required">*</span></label>
          <select name="employee_id" required>
            ${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Ngày <span class="required">*</span></label>
          <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Giờ vào</label>
            <input type="time" name="check_in">
          </div>
          <div class="form-group">
            <label>Giờ ra</label>
            <input type="time" name="check_out">
          </div>
        </div>
        <div class="form-group">
          <label>Trạng thái <span class="required">*</span></label>
          <select name="status" required>
            <option value="present">✅ Có mặt</option>
            <option value="late">⏰ Đi muộn</option>
            <option value="absent">❌ Vắng</option>
            <option value="on_leave">🏖️ Nghỉ phép</option>
          </select>
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

    document.getElementById('formAddAttendance').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      try {
        await this.attendanceModel.create(data);
        this.view.showSuccess('Thêm thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async showEditForm(id) {
    const record = await this.attendanceModel.getById(id);
    const employees = await this.employeeModel.getAll();
    
    this.view.showModal(`
      <h3>✏️ Sửa Chấm công</h3>
      <form id="formEditAttendance">
        <input type="hidden" name="id" value="${record.id}">
        <div class="form-group">
          <label>Nhân viên</label>
          <select name="employee_id" required>
            ${employees.map(e => `<option value="${e.id}" ${e.id == record.employee_id ? 'selected' : ''}>${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Ngày</label>
          <input type="date" name="date" value="${record.date}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Giờ vào</label>
            <input type="time" name="check_in" value="${record.check_in || ''}">
          </div>
          <div class="form-group">
            <label>Giờ ra</label>
            <input type="time" name="check_out" value="${record.check_out || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>Trạng thái</label>
          <select name="status" required>
            <option value="present" ${record.status === 'present' ? 'selected' : ''}>✅ Có mặt</option>
            <option value="late" ${record.status === 'late' ? 'selected' : ''}>⏰ Đi muộn</option>
            <option value="absent" ${record.status === 'absent' ? 'selected' : ''}>❌ Vắng</option>
            <option value="on_leave" ${record.status === 'on_leave' ? 'selected' : ''}>🏖️ Nghỉ phép</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ghi chú</label>
          <textarea name="notes" rows="2">${record.notes || ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">💾 Lưu</button>
        </div>
      </form>
    `);

    document.getElementById('formEditAttendance').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get('id');
      const data = Object.fromEntries(formData);
      delete data.id;
      
      try {
        await this.attendanceModel.update(id, data);
        this.view.showSuccess('Cập nhật thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async delete(id) {
    if (!confirm('Xóa bản ghi chấm công này?')) return;
    try {
      await this.attendanceModel.delete(id);
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

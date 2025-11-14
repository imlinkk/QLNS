/**
 * LeaveController - Full Implementation  
 */

import LeaveModel from "../models/LeaveModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { BaseView } from "../views/BaseView.js";

export class LeaveController {
  constructor(container) {
    this.container = container;
    this.view = new BaseView(container);
    this.leaveModel = LeaveModel;
    this.employeeModel = EmployeeModel;
  }

  async init() {
    try {
      this.view.showLoading();
      const leaves = await this.leaveModel.getAll();
      this.renderLeaves(leaves);
    } catch (error) {
      console.error("Error loading leaves:", error);
      this.view.showError("Không thể tải dữ liệu nghỉ phép.");
    }
  }

  renderLeaves(leaves) {
    const stats = {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'pending').length,
      approved: leaves.filter(l => l.status === 'approved').length,
      rejected: leaves.filter(l => l.status === 'rejected').length
    };

    this.container.innerHTML = `
      <div class="module-header">
        <h2>🏖️ Quản lý Nghỉ phép</h2>
        <button class="btn-primary" id="btnAddLeave">➕ Đăng ký Nghỉ phép</button>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">📋</div>
          <div class="stat-info"><h3>${stats.total}</h3><p>Tổng Đơn</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">⏳</div>
          <div class="stat-info"><h3>${stats.pending}</h3><p>Chờ duyệt</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">✅</div>
          <div class="stat-info"><h3>${stats.approved}</h3><p>Đã duyệt</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">❌</div>
          <div class="stat-info"><h3>${stats.rejected}</h3><p>Từ chối</p></div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Loại</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th>Số ngày</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${leaves.map(leave => `
              <tr>
                <td>${leave.employee_name || 'N/A'}</td>
                <td>${this.getLeaveTypeLabel(leave.leave_type)}</td>
                <td>${leave.start_date}</td>
                <td>${leave.end_date}</td>
                <td><span class="badge badge-info">${leave.days_count}</span></td>
                <td>${leave.reason || '-'}</td>
                <td><span class="badge badge-${this.getStatusClass(leave.status)}">${this.getStatusLabel(leave.status)}</span></td>
                <td>
                  ${leave.status === 'pending' ? `
                    <button class="btn-icon btn-success" data-action="approve" data-id="${leave.id}" title="Duyệt">✅</button>
                    <button class="btn-icon btn-danger" data-action="reject" data-id="${leave.id}" title="Từ chối">❌</button>
                  ` : ''}
                  <button class="btn-icon" data-action="view" data-id="${leave.id}" title="Xem">👁️</button>
                  <button class="btn-icon btn-danger" data-action="delete" data-id="${leave.id}" title="Xóa">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.attachEventListeners();
  }

  getLeaveTypeLabel(type) {
    const types = {
      annual: '🏖️ Phép năm',
      sick: '🤒 Ốm',
      personal: '👤 Cá nhân',
      maternity: '👶 Thai sản',
      unpaid: '💸 Không lương'
    };
    return types[type] || type;
  }

  getStatusClass(status) {
    return { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'secondary' }[status] || 'secondary';
  }

  getStatusLabel(status) {
    return { pending: '⏳ Chờ duyệt', approved: '✅ Đã duyệt', rejected: '❌ Từ chối', cancelled: '🚫 Đã hủy' }[status] || status;
  }

  attachEventListeners() {
    document.getElementById('btnAddLeave')?.addEventListener('click', () => this.showAddForm());
    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.currentTarget.dataset.action;
        const id = parseInt(e.currentTarget.dataset.id);
        if (action === 'approve') await this.approve(id);
        else if (action === 'reject') await this.reject(id);
        else if (action === 'view') await this.view(id);
        else if (action === 'delete') await this.delete(id);
      });
    });
  }

  async showAddForm() {
    const employees = await this.employeeModel.getAll();
    this.view.showModal(`
      <h3>➕ Đăng ký Nghỉ phép</h3>
      <form id="formAddLeave">
        <div class="form-group">
          <label>Nhân viên <span class="required">*</span></label>
          <select name="employee_id" required>
            ${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Loại nghỉ phép <span class="required">*</span></label>
          <select name="leave_type" required>
            <option value="annual">🏖️ Phép năm</option>
            <option value="sick">🤒 Nghỉ ốm</option>
            <option value="personal">👤 Việc cá nhân</option>
            <option value="maternity">👶 Thai sản</option>
            <option value="unpaid">💸 Không lương</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Từ ngày <span class="required">*</span></label>
            <input type="date" name="start_date" required>
          </div>
          <div class="form-group">
            <label>Đến ngày <span class="required">*</span></label>
            <input type="date" name="end_date" required>
          </div>
        </div>
        <div class="form-group">
          <label>Số ngày <span class="required">*</span></label>
          <input type="number" name="days_count" required min="1">
        </div>
        <div class="form-group">
          <label>Lý do <span class="required">*</span></label>
          <textarea name="reason" rows="3" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
          <button type="submit" class="btn-primary">➕ Gửi Đơn</button>
        </div>
      </form>
    `);

    document.getElementById('formAddLeave').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      try {
        await this.leaveModel.create(data);
        this.view.showSuccess('Gửi đơn thành công!');
        document.querySelector('.modal')?.remove();
        await this.init();
      } catch (error) {
        this.view.showError('Lỗi: ' + error.message);
      }
    });
  }

  async approve(id) {
    if (!confirm('Duyệt đơn nghỉ phép này?')) return;
    try {
      await this.leaveModel.update(id, { status: 'approved' });
      this.view.showSuccess('Đã duyệt đơn!');
      await this.init();
    } catch (error) {
      this.view.showError('Lỗi: ' + error.message);
    }
  }

  async reject(id) {
    const reason = prompt('Lý do từ chối:');
    if (!reason) return;
    try {
      await this.leaveModel.update(id, { status: 'rejected', reject_reason: reason });
      this.view.showSuccess('Đã từ chối đơn!');
      await this.init();
    } catch (error) {
      this.view.showError('Lỗi: ' + error.message);
    }
  }

  async view(id) {
    const leave = await this.leaveModel.getById(id);
    this.view.showModal(`
      <h3>🏖️ Chi tiết Đơn nghỉ phép</h3>
      <div class="detail-view">
        <div class="detail-row">
          <span class="detail-label">Nhân viên:</span>
          <span class="detail-value">${leave.employee_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Loại:</span>
          <span class="detail-value">${this.getLeaveTypeLabel(leave.leave_type)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Từ ngày:</span>
          <span class="detail-value">${leave.start_date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Đến ngày:</span>
          <span class="detail-value">${leave.end_date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Số ngày:</span>
          <span class="detail-value">${leave.days_count}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Lý do:</span>
          <span class="detail-value">${leave.reason}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Trạng thái:</span>
          <span class="detail-value"><span class="badge badge-${this.getStatusClass(leave.status)}">${this.getStatusLabel(leave.status)}</span></span>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Đóng</button>
      </div>
    `);
  }

  async delete(id) {
    if (!confirm('Xóa đơn nghỉ phép này?')) return;
    try {
      await this.leaveModel.delete(id);
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

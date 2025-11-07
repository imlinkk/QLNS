/**
 * EmployeeView - Handles employee management UI
 */

import { BaseView } from "./BaseView.js";

export class EmployeeView extends BaseView {
  constructor(container) {
    super(container);
  }

  /**
   * Render employee management interface
   */
  renderEmployeeManagement(departments, positions) {
    const html = `
            <div class="employee-management">
                <h2>📋 Quản lý Nhân sự</h2>
                <div class="tab-buttons">
                    <button class="tab-button active" data-tab="search">🔍 Tìm kiếm</button>
                    <button class="tab-button" data-tab="add">➕ Thêm mới</button>
                    <button class="tab-button" data-tab="edit">✎ Sửa</button>
                    <button class="tab-button" data-tab="delete">🗑️ Xóa</button>
                </div>
                
                <div class="tab-content active" id="search-tab">
                    ${this.renderSearchTab(departments)}
                </div>
                
                <div class="tab-content" id="add-tab">
                    ${this.renderAddTab(departments, positions)}
                </div>
                
                <div class="tab-content" id="edit-tab">
                    <div id="edit-content">${this.renderEditTab(
                      departments,
                      positions
                    )}</div>
                </div>
                
                <div class="tab-content" id="delete-tab">
                    <div id="delete-content">${this.renderDeleteTab()}</div>
                </div>
            </div>
        `;

    this.render(html);
  }

  /**
   * Render search tab
   */
  renderSearchTab(departments) {
    return `
            <h3>Tìm kiếm Nhân viên</h3>
            <form id="search-form" class="employee-form">
                <div class="form-group">
                    <label for="search-name">Tên:</label>
                    <input type="text" id="search-name" placeholder="Nhập tên cần tìm">
                </div>
                <div class="form-group">
                    <label for="search-dept">Phòng ban:</label>
                    <select id="search-dept">
                        <option value="">Tất cả</option>
                        ${departments
                          .map(
                            (d) => `<option value="${d.id}">${d.name}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label for="min-salary">Lương tối thiểu:</label>
                    <input type="number" id="min-salary" placeholder="Lương min" min="0">
                </div>
                <div class="form-group">
                    <label for="max-salary">Lương tối đa:</label>
                    <input type="number" id="max-salary" placeholder="Lương max" min="0">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">🔍 Tìm kiếm</button>
                    <button type="button" id="clear-search-btn" class="btn-secondary">✖ Xóa bộ lọc</button>
                </div>
            </form>
            <div id="search-results-container">
                <table id="search-results">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th>Lương</th>
                            <th>Ngày tuyển</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
  }

  /**
   * Render add tab
   */
  renderAddTab(departments, positions) {
    return `
            <h3>Thêm Nhân viên Mới</h3>
            <form id="add-employee-form" class="employee-form">
                <div class="form-group">
                    <label for="add-name">Tên nhân viên:</label>
                    <input type="text" id="add-name" placeholder="Nhập tên nhân viên" required>
                </div>
                <div class="form-group">
                    <label for="add-email">Email:</label>
                    <input type="email" id="add-email" placeholder="Nhập email">
                </div>
                <div class="form-group">
                    <label for="add-phone">Số điện thoại:</label>
                    <input type="tel" id="add-phone" placeholder="Nhập số điện thoại">
                </div>
                <div class="form-group">
                    <label for="add-departmentId">Phòng ban:</label>
                    <select id="add-departmentId" required>
                        <option value="">-- Chọn phòng ban --</option>
                        ${departments
                          .map(
                            (d) => `<option value="${d.id}">${d.name}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label for="add-positionId">Vị trí:</label>
                    <select id="add-positionId" required>
                        <option value="">-- Chọn vị trí --</option>
                        ${positions
                          .map(
                            (p) => `<option value="${p.id}">${p.title}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label for="add-salary">Lương:</label>
                    <input type="number" id="add-salary" placeholder="Nhập lương" min="0" required>
                </div>
                <div class="form-group">
                    <label for="add-hireDate">Ngày tuyển dụng:</label>
                    <input type="date" id="add-hireDate" required>
                </div>
                <button type="submit" class="btn-primary">➕ Thêm nhân viên</button>
            </form>
        `;
  }

  /**
   * Render edit tab
   */
  renderEditTab(departments, positions) {
    return `
            <h3>Sửa Thông tin Nhân viên</h3>
            <div class="two-column-layout">
                <div class="left-panel">
                    <h4>📋 Danh sách Nhân viên</h4>
                    <table id="edit-employee-list" class="reference-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Phòng ban</th>
                                <th>Lương</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="right-panel">
                    <form id="edit-employee-form" class="employee-form" style="display: none;">
                        <h4>Chỉnh sửa thông tin nhân viên ID: <span id="edit-employee-id"></span></h4>
                        <div class="form-group">
                            <label for="edit-name">Tên nhân viên:</label>
                            <input type="text" id="edit-name" placeholder="Tên nhân viên" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-email">Email:</label>
                            <input type="email" id="edit-email" placeholder="Email">
                        </div>
                        <div class="form-group">
                            <label for="edit-phone">Số điện thoại:</label>
                            <input type="tel" id="edit-phone" placeholder="Số điện thoại">
                        </div>
                        <div class="form-group">
                            <label for="edit-departmentId">Phòng ban:</label>
                            <select id="edit-departmentId" required>
                                ${departments
                                  .map(
                                    (d) =>
                                      `<option value="${d.id}">${d.name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-positionId">Vị trí:</label>
                            <select id="edit-positionId" required>
                                ${positions
                                  .map(
                                    (p) =>
                                      `<option value="${p.id}">${p.title}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-salary">Lương:</label>
                            <input type="number" id="edit-salary" placeholder="Lương" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-hireDate">Ngày tuyển dụng:</label>
                            <input type="date" id="edit-hireDate" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">✎ Cập nhật thông tin</button>
                            <button type="button" id="cancel-edit-btn" class="btn-secondary">✖ Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
  }

  /**
   * Render delete tab
   */
  renderDeleteTab() {
    return `
            <h3>Xóa Nhân viên</h3>
            <div class="two-column-layout">
                <div class="left-panel">
                    <h4>📋 Danh sách Nhân viên</h4>
                    <table id="delete-employee-list" class="reference-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Phòng ban</th>
                                <th>Lương</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="right-panel">
                </div>
            </div>
        `;
  }

  /**
   * Render employee list in tables
   */
  renderEmployeeList(employees, tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    if (employees.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">📭 Không có nhân viên</td></tr>';
      return;
    }

    const actionButton =
      tableId === "edit-employee-list"
        ? (emp) =>
            `<button class="btn-quick-edit" data-id="${emp.id}">✎ Sửa</button>`
        : (emp) =>
            `<button class="btn-quick-delete" data-id="${emp.id}">🗑️ Xóa</button>`;

    tbody.innerHTML = employees
      .map(
        (emp) => `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.departmentName || emp.department_name || "N/A"}</td>
                <td>${this.formatCurrency(emp.salary)}</td>
                <td>${actionButton(emp)}</td>
            </tr>
        `
      )
      .join("");
  }

  /**
   * Render search results
   */
  renderSearchResults(employees) {
    const tbody = document.querySelector("#search-results tbody");
    if (!tbody) return;

    if (employees.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">📭 Không tìm thấy nhân viên nào</td></tr>';
      return;
    }

    tbody.innerHTML = employees
      .map(
        (emp) => `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.departmentName || emp.department_name || "N/A"}</td>
                <td>${emp.positionTitle || emp.position_title || "N/A"}</td>
                <td>${this.formatCurrency(emp.salary)}</td>
                <td>${emp.hireDate || emp.hire_date}</td>
            </tr>
        `
      )
      .join("");
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

/**
 * EmployeeController - Handles employee management logic
 */

import EmployeeModel from "../models/EmployeeModel.js";
import DepartmentModel from "../models/DepartmentModel.js";
import PositionModel from "../models/PositionModel.js";
import { EmployeeView } from "../views/EmployeeView.js";

export class EmployeeController {
  constructor(container) {
    this.container = container;
    this.view = new EmployeeView(container);
    this.employeeModel = EmployeeModel;
    this.departmentModel = DepartmentModel;
    this.positionModel = PositionModel;
    this.currentEmployee = null;
  }

  /**
   * Initialize employee management
   */
  async init() {
    try {
      this.view.showLoading();

      // Fetch departments and positions
      const [departments, positions] = await Promise.all([
        this.departmentModel.getAll(),
        this.positionModel.getAll(),
      ]);

      // Render UI
      this.view.renderEmployeeManagement(departments, positions);

      // Setup event listeners
      this.setupEventListeners();

      // Load employee lists for edit/delete tabs
      await this.loadEmployeeLists();
    } catch (error) {
      console.error("Error initializing employee management:", error);
      this.view.showError("Không thể khởi tạo quản lý nhân viên");
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Tab switching
    this.container.addEventListener("click", async (e) => {
      if (e.target.matches(".tab-button")) {
        this.switchTab(e.target.dataset.tab);
      }

      // Edit employee button
      if (
        e.target.matches(".btn-quick-edit") ||
        e.target.closest(".btn-quick-edit")
      ) {
        const btn = e.target.closest(".btn-quick-edit") || e.target;
        const id = parseInt(btn.dataset.id);
        await this.loadEmployeeForEdit(id);
      }

      // Delete employee button
      if (
        e.target.matches(".btn-quick-delete") ||
        e.target.closest(".btn-quick-delete")
      ) {
        const btn = e.target.closest(".btn-quick-delete") || e.target;
        const id = parseInt(btn.dataset.id);
        await this.deleteEmployee(id);
      }

      // Cancel edit button
      if (e.target.matches("#cancel-edit-btn")) {
        const form = document.getElementById("edit-employee-form");
        if (form) {
          form.style.display = "none";
          form.reset();
        }
      }

      // Clear search button
      if (e.target.matches("#clear-search-btn")) {
        this.clearSearch();
      }
    });

    // Search form
    const searchForm = document.getElementById("search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.performSearch();
      });

      // Real-time search
      ["search-name", "search-dept", "min-salary", "max-salary"].forEach(
        (id) => {
          const input = document.getElementById(id);
          if (input) {
            input.addEventListener("input", () => this.performSearch());
          }
        }
      );
    }

    // Add employee form
    const addForm = document.getElementById("add-employee-form");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addEmployee();
      });
    }

    // Edit employee form
    const editForm = document.getElementById("edit-employee-form");
    if (editForm) {
      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.updateEmployee();
      });
    }
  }

  /**
   * Switch tab
   */
  async switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.style.display = "none";
    });

    // Remove active class from buttons
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
      selectedTab.style.display = "block";
    }

    // Add active class to button
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
      activeButton.classList.add("active");
    }

    // Load employee lists for edit/delete tabs
    if (tabName === "edit" || tabName === "delete") {
      await this.loadEmployeeLists();
    }
  }

  /**
   * Load employee lists for edit/delete tabs
   */
  async loadEmployeeLists() {
    try {
      const employees = await this.employeeModel.getAll();
      this.view.renderEmployeeList(employees, "edit-employee-list");
      this.view.renderEmployeeList(employees, "delete-employee-list");
    } catch (error) {
      console.error("Error loading employee lists:", error);
    }
  }

  /**
   * Perform search
   */
  async performSearch() {
    try {
      const criteria = {
        name: document.getElementById("search-name")?.value || "",
        departmentId: document.getElementById("search-dept")?.value || "",
        minSalary: document.getElementById("min-salary")?.value || "",
        maxSalary: document.getElementById("max-salary")?.value || "",
      };

      const employees = await this.employeeModel.searchEmployees(criteria);
      this.view.renderSearchResults(employees);
    } catch (error) {
      console.error("Error searching employees:", error);
      alert("❌ Lỗi khi tìm kiếm nhân viên");
    }
  }

  /**
   * Clear search
   */
  clearSearch() {
    document.getElementById("search-name").value = "";
    document.getElementById("search-dept").value = "";
    document.getElementById("min-salary").value = "";
    document.getElementById("max-salary").value = "";

    const tbody = document.querySelector("#search-results tbody");
    if (tbody) {
      tbody.innerHTML = "";
    }
  }

  /**
   * Add employee
   */
  async addEmployee() {
    try {
      const data = {
        name: document.getElementById("add-name").value,
        email: document.getElementById("add-email")?.value || "",
        phone: document.getElementById("add-phone")?.value || "",
        department_id: parseInt(
          document.getElementById("add-departmentId").value
        ),
        position_id: parseInt(document.getElementById("add-positionId").value),
        salary: parseFloat(document.getElementById("add-salary").value),
        hire_date: document.getElementById("add-hireDate").value,
      };

      await this.employeeModel.create(data);
      alert("✅ Thêm nhân viên thành công!");

      // Reset form
      document.getElementById("add-employee-form").reset();

      // Switch to search tab
      this.switchTab("search");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("❌ Lỗi khi thêm nhân viên: " + error.message);
    }
  }

  /**
   * Load employee for editing
   */
  async loadEmployeeForEdit(id) {
    try {
      const employee = await this.employeeModel.getById(id);

      if (!employee) {
        alert("❌ Không tìm thấy nhân viên");
        return;
      }

      this.currentEmployee = employee;

      // Fill form
      document.getElementById("edit-employee-id").textContent = employee.id;
      document.getElementById("edit-name").value = employee.name;
      document.getElementById("edit-email").value = employee.email || "";
      document.getElementById("edit-phone").value = employee.phone || "";
      document.getElementById("edit-departmentId").value =
        employee.department_id || employee.departmentId;
      document.getElementById("edit-positionId").value =
        employee.position_id || employee.positionId;
      document.getElementById("edit-salary").value = employee.salary;
      document.getElementById("edit-hireDate").value =
        employee.hire_date || employee.hireDate;

      // Show form
      const form = document.getElementById("edit-employee-form");
      if (form) {
        form.style.display = "block";
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (error) {
      console.error("Error loading employee:", error);
      alert("❌ Lỗi khi tải thông tin nhân viên");
    }
  }

  /**
   * Update employee
   */
  async updateEmployee() {
    try {
      if (!this.currentEmployee) {
        alert("❌ Chưa chọn nhân viên để cập nhật");
        return;
      }

      const data = {
        name: document.getElementById("edit-name").value,
        email: document.getElementById("edit-email")?.value || "",
        phone: document.getElementById("edit-phone")?.value || "",
        department_id: parseInt(
          document.getElementById("edit-departmentId").value
        ),
        position_id: parseInt(document.getElementById("edit-positionId").value),
        salary: parseFloat(document.getElementById("edit-salary").value),
        hire_date: document.getElementById("edit-hireDate").value,
      };

      if (confirm("Xác nhận cập nhật thông tin nhân viên?")) {
        await this.employeeModel.update(this.currentEmployee.id, data);
        alert("✅ Cập nhật thông tin thành công!");

        // Hide and reset form
        const form = document.getElementById("edit-employee-form");
        if (form) {
          form.style.display = "none";
          form.reset();
        }

        // Reload employee lists
        await this.loadEmployeeLists();
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("❌ Lỗi khi cập nhật nhân viên: " + error.message);
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id) {
    try {
      const employee = await this.employeeModel.getById(id);

      if (!employee) {
        alert("❌ Không tìm thấy nhân viên");
        return;
      }

      const confirmMsg = `Xác nhận xóa nhân viên?

ID: ${employee.id}
Tên: ${employee.name}

⚠️ Hành động này không thể hoàn tác!`;

      if (confirm(confirmMsg)) {
        await this.employeeModel.delete(id);
        alert("✅ Xóa nhân viên thành công!");

        // Reload employee lists
        await this.loadEmployeeLists();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("❌ Lỗi khi xóa nhân viên: " + error.message);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.view.clear();
    this.currentEmployee = null;
  }
}

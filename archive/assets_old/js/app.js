// app.js
import * as Auth from "../../modules/authModule.js";
import * as EmployeeDb from "../../modules/employeeDbModule.js";
import * as Dashboard from "../../modules/dashboardModule.js";
import * as EmployeeManagement from "../../modules/employeeManagementModule.js";
import * as Department from "../../modules/departmentModule.js";
import * as Position from "../../modules/positionModule.js";
import * as Salary from "../../modules/salaryModule.js";
import * as Attendance from "../../modules/attendanceModule.js";
import * as Leave from "../../modules/leaveModule.js";
import * as Performance from "../../modules/performanceModule.js";

let modal;
let modalMessage;
let modalClose;

export function showModal(message) {
  if (!modal) {
    modal = document.getElementById("modal");
    modalMessage = document.getElementById("modal-message");
  }
  if (modal && modalMessage) {
    modalMessage.textContent = message;
    modal.style.display = "flex";
  }
}

function initModal() {
  modal = document.getElementById("modal");
  modalMessage = document.getElementById("modal-message");
  modalClose = document.getElementById("modal-close");

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
}

const modules = {
  dashboard: Dashboard,
  employeeManagement: EmployeeManagement,
  department: Department,
  position: Position,
  salary: Salary,
  attendance: Attendance,
  leave: Leave,
  performance: Performance,
};

function initApp() {
  console.log("Initializing app...");
  console.log("Current URL:", window.location.href);
  console.log("Is logged in:", Auth.isLoggedIn());

  // Check localStorage data
  console.log("LocalStorage check:");
  console.log("- Users:", localStorage.getItem("users"));
  console.log("- Session:", localStorage.getItem("session"));
  console.log("- Employees:", localStorage.getItem("employees"));
  console.log("- Departments:", localStorage.getItem("departments"));
  console.log("- Positions:", localStorage.getItem("positions"));

  // Initialize modal first
  initModal();

  // Make showModal available globally
  window.showModal = showModal;

  try {
    Auth.init();
    EmployeeDb.init();
    Department.init();
    Position.init();
    Attendance.init();
    Leave.init();
    Performance.init();

    console.log("All modules initialized successfully");
  } catch (error) {
    console.error("Error during initialization:", error);
  }

  if (!Auth.isLoggedIn()) {
    console.log("User not logged in, showing login form");
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");

    if (loginForm) loginForm.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";

    Auth.renderLoginForm();
  } else {
    console.log("User logged in, showing dashboard");
    showDashboard();
  }

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Logging out...");
      Auth.logout();
      // Use reload() for better compatibility
      window.location.reload();
    });
  }

  document.querySelectorAll("#sidebar a[data-module]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const moduleName = e.target.dataset.module;
      loadModule(moduleName);
    });
  });
}

function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  // Load default module: dashboard
  loadModule("dashboard");
}

function loadModule(moduleName) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  modules[moduleName].render(content);
}

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

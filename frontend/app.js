/**
 * Main Application Entry Point
 * MVC Architecture Implementation
 */

import { AuthController } from "./controllers/AuthController.js";
import { DashboardController } from "./controllers/DashboardController.js";
import { EmployeeController } from "./controllers/EmployeeController.js";
import Router from "./core/Router.js";
import AuthModel from "./models/AuthModel.js";

class App {
  constructor() {
    this.router = Router;
    this.authController = null;
    this.initialized = false;
  }

  /**
   * Initialize application
   */
  async init() {
    if (this.initialized) return;

    console.log("🚀 Initializing HRM System (MVC Architecture)...");

    // Initialize modal
    this.initModal();

    // Register routes
    this.registerRoutes();

    // Check authentication
    if (AuthModel.isAuthenticated()) {
      console.log("✅ User authenticated, showing dashboard");
      this.showDashboard();
    } else {
      console.log("❌ User not authenticated, showing login");
      this.showLogin();
    }

    // Setup sidebar navigation
    this.setupNavigation();

    // Setup logout button
    this.setupLogout();

    this.initialized = true;
  }

  /**
   * Initialize modal
   */
  initModal() {
    const modal = document.getElementById("modal");
    const modalClose = document.getElementById("modal-close");

    if (modalClose && modal) {
      modalClose.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    // Make showModal available globally
    window.showModal = (message) => {
      const modalMessage = document.getElementById("modal-message");
      if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.style.display = "flex";
      }
    };
  }

  /**
   * Register routes
   */
  registerRoutes() {
    this.router.register("dashboard", DashboardController);
    this.router.register("employeeManagement", EmployeeController);

    // TODO: Register other routes when controllers are ready
    // this.router.register('department', DepartmentController);
    // this.router.register('position', PositionController);
    // this.router.register('salary', SalaryController);
    // this.router.register('attendance', AttendanceController);
    // this.router.register('leave', LeaveController);
    // this.router.register('performance', PerformanceController);
  }

  /**
   * Show login form
   */
  showLogin() {
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");

    if (loginForm) loginForm.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";

    // Initialize auth controller
    this.authController = new AuthController(loginForm);
    this.authController.init(() => {
      // On login success
      this.showDashboard();
    });
  }

  /**
   * Show dashboard
   */
  showDashboard() {
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");

    if (loginForm) loginForm.style.display = "none";
    if (dashboard) dashboard.style.display = "block";

    // Navigate to default route (dashboard)
    this.router.navigate("dashboard");
  }

  /**
   * Setup sidebar navigation
   */
  setupNavigation() {
    document.querySelectorAll("#sidebar a[data-module]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const moduleName = e.target.dataset.module;

        // Navigate to route
        this.router.navigate(moduleName);
      });
    });
  }

  /**
   * Setup logout button
   */
  setupLogout() {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("👋 Logging out...");

        // Logout
        AuthModel.logout();

        // Reload page
        window.location.reload();
      });
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.init();
  });
} else {
  const app = new App();
  app.init();
}

// Export for debugging
window.App = App;

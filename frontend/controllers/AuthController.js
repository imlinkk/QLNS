/**
 * AuthController - Handles authentication logic
 */

import AuthModel from "../models/AuthModel.js";
import { LoginView } from "../views/LoginView.js";

export class AuthController {
  constructor(container) {
    this.container = container;
    this.view = new LoginView(container);
    this.authModel = AuthModel;
    this.onLoginSuccess = null;
  }

  /**
   * Initialize auth controller
   */
  init(onLoginSuccess) {
    this.onLoginSuccess = onLoginSuccess;
    this.view.renderLoginForm();
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Toggle mode link
    this.container.addEventListener("click", (e) => {
      if (e.target.matches("#toggle-mode")) {
        this.view.toggleMode();
        this.setupEventListeners(); // Re-attach listeners after re-render
      }
    });

    // Auth form submission
    const form = document.getElementById("auth-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    this.view.hideErrorMessage();

    const { username, password, confirmPassword } = this.view.getFormValues();

    // Validate
    if (!username || !password) {
      this.view.showErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (this.view.isLoginMode) {
      // Login
      await this.login(username, password);
    } else {
      // Register
      if (!confirmPassword || password !== confirmPassword) {
        this.view.showErrorMessage("Mật khẩu xác nhận không khớp");
        return;
      }
      await this.register(username, password);
    }
  }

  /**
   * Login
   */
  async login(username, password) {
    try {
      const result = await this.authModel.login(username, password);

      if (result.success) {
        this.view.resetForm();

        // Call success callback
        if (this.onLoginSuccess) {
          this.onLoginSuccess();
        }
      } else {
        this.view.showErrorMessage(
          result.message || "Sai tên đăng nhập hoặc mật khẩu"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      this.view.showErrorMessage("Đăng nhập thất bại: " + error.message);
    }
  }

  /**
   * Register
   */
  async register(username, password) {
    try {
      const result = await this.authModel.register(username, password);

      if (result.success) {
        alert("✅ Đăng ký thành công! Hãy đăng nhập.");
        this.view.toggleMode();
        this.setupEventListeners();
      } else {
        this.view.showErrorMessage(result.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Register error:", error);
      this.view.showErrorMessage("Đăng ký thất bại: " + error.message);
    }
  }

  /**
   * Logout
   */
  logout() {
    this.authModel.logout();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.authModel.isAuthenticated();
  }

  /**
   * Cleanup
   */
  destroy() {
    this.view.clear();
  }
}

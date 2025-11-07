/**
 * LoginView - Handles login/register UI
 */

import { BaseView } from "./BaseView.js";

export class LoginView extends BaseView {
  constructor(container) {
    super(container);
    this.isLoginMode = true;
  }

  /**
   * Render login/register form
   */
  renderLoginForm() {
    const html = `
            <div class="login-container">
                <div class="logo">👥 HRM System</div>
                <h2 id="form-title">${
                  this.isLoginMode ? "Đăng nhập" : "Đăng ký"
                }</h2>
                <form id="auth-form">
                    <div class="input-group" id="username-group">
                        <input type="text" id="username" placeholder="Tên đăng nhập" required>
                    </div>
                    <div class="input-group" id="password-group">
                        <input type="password" id="password" placeholder="Mật khẩu" required>
                    </div>
                    <div class="input-group" id="confirm-password-group" style="display: ${
                      this.isLoginMode ? "none" : "block"
                    };">
                        <input type="password" id="confirm-password" placeholder="Xác nhận mật khẩu" ${
                          this.isLoginMode ? "" : "required"
                        }>
                    </div>
                    <button type="submit" id="submit-btn">${
                      this.isLoginMode ? "Đăng Nhập" : "Đăng Ký"
                    }</button>
                    <p class="error-message" id="error-msg"></p>
                </form>
                <p class="toggle-link" id="toggle-mode">
                    ${
                      this.isLoginMode
                        ? "Chưa có tài khoản? Đăng ký ngay"
                        : "Đã có tài khoản? Đăng nhập"
                    }
                </p>
            </div>
        `;

    this.render(html);
  }

  /**
   * Toggle between login and register mode
   */
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.renderLoginForm();
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.style.display = "block";
    }
  }

  /**
   * Hide error message
   */
  hideErrorMessage() {
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
      errorMsg.style.display = "none";
      errorMsg.textContent = "";
    }
  }

  /**
   * Get form values
   */
  getFormValues() {
    return {
      username: document.getElementById("username")?.value.trim() || "",
      password: document.getElementById("password")?.value || "",
      confirmPassword: document.getElementById("confirm-password")?.value || "",
    };
  }

  /**
   * Reset form
   */
  resetForm() {
    const form = document.getElementById("auth-form");
    if (form) {
      form.reset();
    }
    this.hideErrorMessage();
  }
}

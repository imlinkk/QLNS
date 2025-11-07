/**
 * AuthModel - Handles authentication
 * Note: Currently using localStorage for demo
 * TODO: Integrate with backend /auth endpoints
 */

import ApiService from "../core/ApiService.js";

export class AuthModel {
  constructor() {
    this.api = ApiService;
    this.storageKey = "hrm_session";
  }

  /**
   * Login user
   */
  async login(username, password) {
    try {
      // TODO: Replace with actual API call when backend auth is ready
      // const response = await this.api.post('/auth/login', { username, password });

      // Temporary localStorage-based auth
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const hashedPassword = this.hashPassword(password);
      const user = users.find(
        (u) => u.username === username && u.password === hashedPassword
      );

      if (user) {
        const session = {
          username: user.username,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(session));
        return { success: true, user: session };
      }

      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Register new user
   */
  async register(username, password) {
    try {
      // TODO: Replace with actual API call
      // const response = await this.api.post('/auth/register', { username, password });

      // Temporary localStorage-based registration
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.find((u) => u.username === username)) {
        return { success: false, message: "User already exists" };
      }

      users.push({
        username,
        password: this.hashPassword(password),
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("users", JSON.stringify(users));
      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return !!localStorage.getItem(this.storageKey);
  }

  /**
   * Get current user session
   */
  getCurrentUser() {
    const session = localStorage.getItem(this.storageKey);
    return session ? JSON.parse(session) : null;
  }

  /**
   * Simple hash function (for demo only)
   * TODO: Use proper hashing in production
   */
  hashPassword(password) {
    return password
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      .toString(16);
  }

  /**
   * Initialize users storage
   */
  init() {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
  }
}

export default new AuthModel();

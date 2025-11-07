/**
 * AuthModel - Handles authentication with backend API
 * Uses server-side sessions (no localStorage)
 */

import ApiService from "../core/ApiService.js";

export class AuthModel {
  constructor() {
    this.api = ApiService;
    this.currentUser = null;
  }

  /**
   * Login user
   */
  async login(username, password) {
    try {
      // Call backend API
      const response = await this.api.post("/login", { username, password });

      if (response.success && response.data && response.data.user) {
        // Store user info in memory
        this.currentUser = {
          username: response.data.user.username,
          userId: response.data.user.id,
          role: response.data.user.role,
          fullName: response.data.user.full_name || response.data.user.username,
        };
        return { success: true, user: this.currentUser };
      }

      return {
        success: false,
        message: response.message || "Invalid credentials",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Login failed" };
    }
  }

  /**
   * Register new user
   */
  async register(username, password) {
    try {
      // Call backend API
      const response = await this.api.post("/register", { username, password });

      if (response.success) {
        return { success: true, message: "Registration successful" };
      }

      return {
        success: false,
        message: response.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call backend API to destroy session
      await this.api.post("/logout", {});
      this.currentUser = null;
    } catch (error) {
      console.error("Logout error:", error);
      this.currentUser = null;
    }
  }

  /**
   * Check if user is logged in by calling backend
   */
  async isAuthenticated() {
    try {
      const response = await this.api.get("/auth/check");
      if (response.success && response.authenticated) {
        // Update current user from backend
        if (response.data) {
          this.currentUser = {
            username: response.data.username,
            userId: response.data.user_id,
            role: response.data.role,
            fullName: response.data.full_name || response.data.username,
          };
        }
        return true;
      }
      this.currentUser = null;
      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      this.currentUser = null;
      return false;
    }
  }

  /**
   * Get current user session (from memory or backend)
   */
  async getCurrentUser() {
    // If we already have user in memory, return it
    if (this.currentUser) {
      return this.currentUser;
    }

    // Otherwise check with backend
    const isAuth = await this.isAuthenticated();
    return isAuth ? this.currentUser : null;
  }
}

export default new AuthModel();

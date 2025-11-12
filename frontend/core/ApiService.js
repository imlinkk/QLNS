/**
 * ApiService - Base class for making API calls to backend
 * Centralized HTTP client for all API requests
 */

export class ApiService {
  constructor() {
    // Auto-detect environment: localhost uses full path, production uses relative path
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    this.baseUrl = isLocalhost
      ? "http://localhost/HRmOfLink/backend/api.php"
      : "/backend/api.php";
  }

  /**
   * Make a GET request
   */
  async get(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get("content-type");
    
    // Check if response is JSON
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("API returned non-JSON response:", text);
      throw new Error("Server error: Expected JSON but received HTML. Check backend logs.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  }
}

// Export singleton instance
export default new ApiService();

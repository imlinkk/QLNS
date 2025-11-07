/**
 * ApiService - Base class for making API calls to backend
 * Centralized HTTP client for all API requests
 */

export class ApiService {
  constructor() {
    this.baseUrl = "http://localhost/HRmOfLink/backend/api.php";
    // For production: this.baseUrl = '/backend/api.php';
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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  }
}

// Export singleton instance
export default new ApiService();

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

    // Localhost uses PATH_INFO style (/api.php/endpoint)
    // Production uses query string style (/api.php?route=endpoint) for better shared hosting compatibility
    this.baseUrl = isLocalhost
      ? "http://localhost/QLNS/backend/api.php"
      : "/backend/api.php";
    
    this.isLocalhost = isLocalhost;
  }

  /**
   * Build full URL with endpoint
   * Localhost: /api.php/endpoint
   * Production: /api.php?route=endpoint
   */
  buildUrl(endpoint) {
    if (this.isLocalhost) {
      // Use PATH_INFO style for localhost
      const fullUrl = this.baseUrl.startsWith('http') 
        ? `${this.baseUrl}${endpoint}`
        : `${window.location.origin}${this.baseUrl}${endpoint}`;
      return fullUrl;
    } else {
      // Use query string for production (better shared hosting support)
      const route = endpoint.replace(/^\//, ''); // Remove leading slash
      return `${window.location.origin}${this.baseUrl}?route=${route}`;
    }
  }

  /**
   * Make a GET request
   */
  async get(endpoint, params = {}) {
    try {
      const url = new URL(this.buildUrl(endpoint));
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
      const response = await fetch(this.buildUrl(endpoint), {
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
      const response = await fetch(this.buildUrl(endpoint), {
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
      const response = await fetch(this.buildUrl(endpoint), {
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
      throw new Error("Server error: Expected JSON but received HTML/text. Check backend logs.");
    }

    // Check if response body is empty
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.error("API returned empty response. Status:", response.status);
      throw new Error(`Server error: Empty response (HTTP ${response.status})`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Server error: Invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || `API request failed (HTTP ${response.status})`);
    }

    return data;
  }
}

// Export singleton instance
export default new ApiService();

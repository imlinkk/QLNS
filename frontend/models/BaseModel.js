/**
 * BaseModel - Abstract base class for all models
 * Provides common CRUD operations for API entities
 */

import ApiService from "../core/ApiService.js";

export class BaseModel {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.api = ApiService;
  }

  /**
   * Get all records
   */
  async getAll() {
    try {
      const response = await this.api.get(this.endpoint);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching all ${this.endpoint}:`, error);
      return [];
    }
  }

  /**
   * Get a single record by ID
   */
  async getById(id) {
    try {
      const response = await this.api.get(`${this.endpoint}/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching ${this.endpoint}/${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new record
   */
  async create(data) {
    try {
      const response = await this.api.post(this.endpoint, data);
      return response;
    } catch (error) {
      console.error(`Error creating ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing record
   */
  async update(id, data) {
    try {
      const response = await this.api.put(`${this.endpoint}/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   */
  async delete(id) {
    try {
      const response = await this.api.delete(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Search records
   */
  async search(criteria) {
    try {
      const response = await this.api.get(`${this.endpoint}/search`, criteria);
      return response.data || [];
    } catch (error) {
      console.error(`Error searching ${this.endpoint}:`, error);
      return [];
    }
  }
}

import api from './api';

class UserService {
  // Get all users
  static async getAllUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/users?${params}`);
    return response.data;
  }

  // Get user by ID
  static async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  // Register new user
  static async registerUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  }

  // Update user
  static async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }

  // Delete user
  static async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  // Get users by company
  static async getUsersByCompany(companyId, role = null) {
    const params = role ? `?role=${role}` : '';
    const response = await api.get(`/users/company/${companyId}${params}`);
    return response.data;
  }
}

export default UserService;

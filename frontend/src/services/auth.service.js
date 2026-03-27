import api from './api';

class AuthService {
  // Request OTP
  static async requestOTP(mobileNumber) {
    const response = await api.post('/auth/request-otp', {
      mobile_number: mobileNumber,
    });
    return response.data;
  }

  // Verify OTP
  static async verifyOTP(mobileNumber, otp) {
    const response = await api.post('/auth/verify-otp', {
      mobile_number: mobileNumber,
      otp: otp,
    });
    return response.data;
  }

  // Refresh token
  static async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', {
      refreshToken: refreshToken,
    });
    return response.data;
  }

  // Login (combines request and verify)
  static async login(mobileNumber, otp) {
    const data = await this.verifyOTP(mobileNumber, otp);
    if (data.success) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  // Logout
  static logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get current user
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if authenticated
  static isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  // Check user role
  static getUserRole() {
    const user = this.getCurrentUser();
    return user?.role;
  }
}

export default AuthService;

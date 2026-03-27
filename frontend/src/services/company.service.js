import api from './api';

class CompanyService {
  // Get all companies
  static async getAllCompanies() {
    const response = await api.get('/companies');
    return response.data;
  }

  // Get company by ID
  static async getCompanyById(id) {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }

  // Create company
  static async createCompany(companyData) {
    const response = await api.post('/companies', companyData);
    return response.data;
  }

  // Update company
  static async updateCompany(id, companyData) {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  }

  // Delete company
  static async deleteCompany(id) {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  }

  // Get company statistics
  static async getCompanyStats(id) {
    const response = await api.get(`/companies/${id}/stats`);
    return response.data;
  }
}

export default CompanyService;

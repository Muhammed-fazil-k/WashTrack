const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require Super Admin authentication
router.use(authenticate);
router.use(authorize('super_admin'));

// GET /api/v1/companies - Get all companies
router.get('/', CompanyController.getAllCompanies);

// GET /api/v1/companies/:id - Get single company
router.get('/:id', CompanyController.getCompanyById);

// POST /api/v1/companies - Create new company
router.post('/', CompanyController.createCompany);

// PUT /api/v1/companies/:id - Update company
router.put('/:id', CompanyController.updateCompany);

// DELETE /api/v1/companies/:id - Delete company
router.delete('/:id', CompanyController.deleteCompany);

// GET /api/v1/companies/:id/stats - Get company statistics
router.get('/:id/stats', CompanyController.getCompanyStats);

module.exports = router;

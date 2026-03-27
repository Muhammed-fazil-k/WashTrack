const db = require('../../config/database');
const ApiError = require('../utils/ApiError');

class CompanyController {
  // Get all companies (Super Admin only)
  static async getAllCompanies(req, res, next) {
    try {
      const result = await db.query(`
        SELECT
          c.id,
          c.company_code,
          c.name,
          c.contact_number,
          c.email,
          c.address,
          c.city,
          c.state,
          c.pincode,
          c.subscription_status,
          c.subscription_start_date,
          c.subscription_end_date,
          c.created_at,
          (SELECT COUNT(*) FROM users WHERE company_id = c.id AND role = 'company_admin') as admin_count,
          (SELECT COUNT(*) FROM users WHERE company_id = c.id AND role = 'worker') as worker_count,
          (SELECT COUNT(*) FROM transactions WHERE company_id = c.id) as transaction_count
        FROM companies c
        ORDER BY c.created_at DESC
      `);

      res.json({
        success: true,
        data: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single company by ID or Code
  static async getCompanyById(req, res, next) {
    try {
      const { id } = req.params;

      // Check if id is a company_code (starts with WC) or numeric id
      const isCode = /^WC\d{4}$/.test(id);
      const query = isCode
        ? `SELECT
             c.*,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id AND role = 'company_admin') as admin_count,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id AND role = 'worker') as worker_count,
             (SELECT COUNT(*) FROM transactions WHERE company_id = c.id) as transaction_count,
             (SELECT COUNT(*) FROM customers WHERE company_id = c.id) as customer_count
           FROM companies c
           WHERE c.company_code = $1`
        : `SELECT
             c.*,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id AND role = 'company_admin') as admin_count,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id AND role = 'worker') as worker_count,
             (SELECT COUNT(*) FROM transactions WHERE company_id = c.id) as transaction_count,
             (SELECT COUNT(*) FROM customers WHERE company_id = c.id) as customer_count
           FROM companies c
           WHERE c.id = $1`;

      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        throw new ApiError(404, 'Company not found');
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new company
  static async createCompany(req, res, next) {
    try {
      const {
        name,
        contact_number,
        email,
        address,
        city,
        state,
        pincode,
        subscription_start_date,
        subscription_end_date
      } = req.body;

      if (!name || !contact_number) {
        throw new ApiError(400, 'Company name and contact number are required');
      }

      // Generate unique company code
      const codeResult = await db.query(`
        SELECT company_code FROM companies
        ORDER BY id DESC LIMIT 1
      `);

      let companyCode;
      if (codeResult.rows.length === 0) {
        companyCode = 'WC0001'; // First company
      } else {
        const lastCode = codeResult.rows[0].company_code;
        const lastNumber = parseInt(lastCode.substring(2)); // Extract number from WC####
        const nextNumber = lastNumber + 1;
        companyCode = `WC${String(nextNumber).padStart(4, '0')}`; // WC0001, WC0002, etc.
      }

      const result = await db.query(`
        INSERT INTO companies (
          company_code, name, contact_number, email, address, city, state, pincode,
          subscription_status, subscription_start_date, subscription_end_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $9, $10)
        RETURNING *
      `, [companyCode, name, contact_number, email, address, city, state, pincode, subscription_start_date, subscription_end_date]);

      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Update company
  static async updateCompany(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        contact_number,
        email,
        address,
        city,
        state,
        pincode,
        subscription_status,
        subscription_start_date,
        subscription_end_date
      } = req.body;

      const result = await db.query(`
        UPDATE companies
        SET
          name = COALESCE($1, name),
          contact_number = COALESCE($2, contact_number),
          email = COALESCE($3, email),
          address = COALESCE($4, address),
          city = COALESCE($5, city),
          state = COALESCE($6, state),
          pincode = COALESCE($7, pincode),
          subscription_status = COALESCE($8, subscription_status),
          subscription_start_date = COALESCE($9, subscription_start_date),
          subscription_end_date = COALESCE($10, subscription_end_date)
        WHERE id = $11
        RETURNING *
      `, [name, contact_number, email, address, city, state, pincode, subscription_status, subscription_start_date, subscription_end_date, id]);

      if (result.rows.length === 0) {
        throw new ApiError(404, 'Company not found');
      }

      res.json({
        success: true,
        message: 'Company updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete company
  static async deleteCompany(req, res, next) {
    try {
      const { id } = req.params;

      // Check if company has any data
      const checkResult = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM users WHERE company_id = $1) as user_count,
          (SELECT COUNT(*) FROM transactions WHERE company_id = $1) as transaction_count
      `, [id]);

      const { user_count, transaction_count } = checkResult.rows[0];

      if (parseInt(user_count) > 0 || parseInt(transaction_count) > 0) {
        throw new ApiError(400, 'Cannot delete company with existing users or transactions. Please remove them first.');
      }

      const result = await db.query('DELETE FROM companies WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        throw new ApiError(404, 'Company not found');
      }

      res.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get company statistics
  static async getCompanyStats(req, res, next) {
    try {
      const { id } = req.params;

      const result = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM users WHERE company_id = $1) as total_users,
          (SELECT COUNT(*) FROM users WHERE company_id = $1 AND role = 'company_admin') as admins,
          (SELECT COUNT(*) FROM users WHERE company_id = $1 AND role = 'worker') as workers,
          (SELECT COUNT(*) FROM customers WHERE company_id = $1) as customers,
          (SELECT COUNT(*) FROM services WHERE company_id = $1) as services,
          (SELECT COUNT(*) FROM transactions WHERE company_id = $1) as transactions,
          (SELECT COALESCE(SUM(service_amount), 0) FROM transactions WHERE company_id = $1) as total_revenue,
          (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE company_id = $1) as total_expenses
      `, [id]);

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;

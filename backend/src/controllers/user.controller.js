const db = require('../../config/database');
const ApiError = require('../utils/ApiError');

class UserController {
  // Get all users for a company (Super Admin can view all)
  static async getAllUsers(req, res, next) {
    try {
      const { company_id, role } = req.query;

      let query = `
        SELECT
          u.id,
          u.mobile_number,
          u.name,
          u.email,
          u.role,
          u.company_id,
          u.is_active,
          u.created_at,
          c.name as company_name
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (company_id) {
        params.push(company_id);
        query += ` AND u.company_id = $${params.length}`;
      }

      if (role) {
        params.push(role);
        query += ` AND u.role = $${params.length}`;
      }

      query += ' ORDER BY u.created_at DESC';

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single user by ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const result = await db.query(`
        SELECT
          u.*,
          c.name as company_name
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        throw new ApiError(404, 'User not found');
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Register new user (Company Admin or Worker)
  static async registerUser(req, res, next) {
    try {
      const {
        mobile_number,
        name,
        email,
        role,
        company_id
      } = req.body;

      // Validation
      if (!mobile_number || !name || !role) {
        throw new ApiError(400, 'Mobile number, name, and role are required');
      }

      if (!['company_admin', 'worker'].includes(role)) {
        throw new ApiError(400, 'Role must be company_admin or worker');
      }

      if (!company_id) {
        throw new ApiError(400, 'Company ID is required for company_admin and worker roles');
      }

      // Check if company exists
      const companyCheck = await db.query('SELECT id FROM companies WHERE id = $1', [company_id]);
      if (companyCheck.rows.length === 0) {
        throw new ApiError(404, 'Company not found');
      }

      // Check if mobile number already exists
      const existingUser = await db.query('SELECT id FROM users WHERE mobile_number = $1', [mobile_number]);
      if (existingUser.rows.length > 0) {
        throw new ApiError(409, 'User with this mobile number already exists');
      }

      // Create user
      const result = await db.query(`
        INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id, mobile_number, name, email, role, company_id, is_active, created_at
      `, [mobile_number, name, email, role, company_id]);

      res.status(201).json({
        success: true,
        message: `${role === 'company_admin' ? 'Company Admin' : 'Worker'} registered successfully`,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, is_active } = req.body;

      const result = await db.query(`
        UPDATE users
        SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          is_active = COALESCE($3, is_active)
        WHERE id = $4
        RETURNING id, mobile_number, name, email, role, company_id, is_active, updated_at
      `, [name, email, is_active, id]);

      if (result.rows.length === 0) {
        throw new ApiError(404, 'User not found');
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Prevent deletion of super_admin
      const userCheck = await db.query('SELECT role FROM users WHERE id = $1', [id]);
      if (userCheck.rows.length === 0) {
        throw new ApiError(404, 'User not found');
      }

      if (userCheck.rows[0].role === 'super_admin') {
        throw new ApiError(403, 'Cannot delete super admin');
      }

      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get users by company
  static async getUsersByCompany(req, res, next) {
    try {
      const { companyId } = req.params;
      const { role } = req.query;

      // Check if companyId is a company_code (starts with WC) or numeric id
      const isCode = /^WC\d{4}$/.test(companyId);

      // First get the numeric company ID if code was provided
      let numericCompanyId = companyId;
      if (isCode) {
        const companyResult = await db.query('SELECT id FROM companies WHERE company_code = $1', [companyId]);
        if (companyResult.rows.length === 0) {
          throw new ApiError(404, 'Company not found');
        }
        numericCompanyId = companyResult.rows[0].id;
      }

      let query = 'SELECT * FROM users WHERE company_id = $1';
      const params = [numericCompanyId];

      if (role) {
        params.push(role);
        query += ` AND role = $${params.length}`;
      }

      query += ' ORDER BY role, name';

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

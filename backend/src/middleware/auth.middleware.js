const TokenService = require('../services/token.service');
const ApiError = require('../utils/ApiError');
const db = require('../../config/database');

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = TokenService.verifyAccessToken(token);

    // Get user from database
    const userQuery = await db.query(
      'SELECT id, mobile_number, name, email, role, company_id, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userQuery.rows.length === 0 || !userQuery.rows[0].is_active) {
      throw new ApiError(403, 'User not found or inactive');
    }

    req.user = userQuery.rows[0];
    next();

  } catch (error) {
    next(error);
  }
};

// Authorize based on roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};

// Ensure company isolation (users can only access their company's data)
const ensureCompanyAccess = (req, res, next) => {
  const { user } = req;

  // Super admin can access all companies
  if (user.role === 'super_admin') {
    return next();
  }

  // For company_admin and worker, ensure they can only access their company's data
  const companyId = req.params.companyId || req.body.company_id || req.query.company_id;

  if (companyId && companyId !== user.company_id) {
    return next(new ApiError(403, 'Forbidden: Cannot access other company data'));
  }

  // Attach company_id to request for convenience
  req.companyId = user.company_id;
  next();
};

module.exports = {
  authenticate,
  authorize,
  ensureCompanyAccess
};

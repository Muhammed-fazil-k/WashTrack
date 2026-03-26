const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const OTPService = require('../services/otp.service');
const TokenService = require('../services/token.service');
const ApiError = require('../utils/ApiError');

class AuthController {
  // Request OTP
  static async requestOTP(req, res, next) {
    try {
      const { mobile_number } = req.body;

      if (!mobile_number) {
        throw new ApiError(400, 'Mobile number is required');
      }

      // Check if user exists
      const userQuery = await db.query(
        'SELECT id, mobile_number, role, company_id, is_active FROM users WHERE mobile_number = $1',
        [mobile_number]
      );

      if (userQuery.rows.length === 0) {
        throw new ApiError(404, 'User not found with this mobile number');
      }

      const user = userQuery.rows[0];

      if (!user.is_active) {
        throw new ApiError(403, 'User account is inactive');
      }

      // Generate OTP
      const otp = OTPService.generateOTP();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = OTPService.getExpiryTime();

      // Delete any existing OTP for this mobile number
      await db.query(
        'DELETE FROM otp_verifications WHERE mobile_number = $1',
        [mobile_number]
      );

      // Store OTP in database
      await db.query(
        'INSERT INTO otp_verifications (mobile_number, otp_hash, expires_at) VALUES ($1, $2, $3)',
        [mobile_number, otpHash, expiresAt]
      );

      // Send OTP via SMS
      await OTPService.sendOTP(mobile_number, otp);

      res.json({
        success: true,
        message: 'OTP sent successfully',
        expiresIn: process.env.OTP_EXPIRY_MINUTES || 10
      });

    } catch (error) {
      next(error);
    }
  }

  // Verify OTP and login
  static async verifyOTP(req, res, next) {
    try {
      const { mobile_number, otp } = req.body;

      if (!mobile_number || !otp) {
        throw new ApiError(400, 'Mobile number and OTP are required');
      }

      // Get OTP record
      const otpQuery = await db.query(
        'SELECT * FROM otp_verifications WHERE mobile_number = $1 AND is_verified = false ORDER BY created_at DESC LIMIT 1',
        [mobile_number]
      );

      if (otpQuery.rows.length === 0) {
        throw new ApiError(400, 'No OTP request found. Please request a new OTP.');
      }

      const otpRecord = otpQuery.rows[0];

      // Check expiry
      if (new Date() > new Date(otpRecord.expires_at)) {
        throw new ApiError(400, 'OTP has expired. Please request a new one.');
      }

      // Check max attempts
      const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS) || 5;
      if (otpRecord.attempts >= maxAttempts) {
        throw new ApiError(429, 'Maximum OTP attempts exceeded. Please request a new OTP.');
      }

      // Verify OTP
      const isValid = await bcrypt.compare(otp, otpRecord.otp_hash);

      if (!isValid) {
        // Increment attempts
        await db.query(
          'UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1',
          [otpRecord.id]
        );

        throw new ApiError(400, `Invalid OTP. ${maxAttempts - otpRecord.attempts - 1} attempts remaining.`);
      }

      // Mark OTP as verified
      await db.query(
        'UPDATE otp_verifications SET is_verified = true WHERE id = $1',
        [otpRecord.id]
      );

      // Get user details
      const userQuery = await db.query(
        'SELECT id, mobile_number, name, email, role, company_id, is_active FROM users WHERE mobile_number = $1',
        [mobile_number]
      );

      const user = userQuery.rows[0];

      // Generate tokens
      const tokens = TokenService.generateTokenPair(user);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          mobile_number: user.mobile_number,
          email: user.email,
          role: user.role,
          company_id: user.company_id
        },
        ...tokens
      });

    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
      }

      const decoded = TokenService.verifyRefreshToken(refreshToken);

      // Get current user data
      const userQuery = await db.query(
        'SELECT id, mobile_number, name, email, role, company_id, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userQuery.rows.length === 0 || !userQuery.rows[0].is_active) {
        throw new ApiError(403, 'User not found or inactive');
      }

      const user = userQuery.rows[0];
      const tokens = TokenService.generateTokenPair(user);

      res.json({
        success: true,
        ...tokens
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

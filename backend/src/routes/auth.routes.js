const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');

// Stricter rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many OTP requests, please try again later'
});

// POST /api/v1/auth/request-otp - Request OTP for mobile number
router.post('/request-otp', otpLimiter, AuthController.requestOTP);

// POST /api/v1/auth/verify-otp - Verify OTP and login
router.post('/verify-otp', AuthController.verifyOTP);

// POST /api/v1/auth/refresh-token - Refresh access token
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;

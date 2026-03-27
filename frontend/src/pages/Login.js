import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  VpnKey as OtpIcon,
  LocalCarWash as CarWashIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import AuthService from '../services/auth.service';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [step, setStep] = useState(0); // 0: mobile number, 1: OTP
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle mobile number input (10 digits only, auto-add +91)
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  const getFullMobileNumber = () => {
    return mobileNumber ? `+91${mobileNumber}` : '';
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await AuthService.requestOTP(getFullMobileNumber());
      setSuccess('OTP sent successfully! Check your SMS.');
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await AuthService.login(getFullMobileNumber(), otp);

      if (data.success) {
        const { role } = data.user;

        // Redirect based on role
        if (role === 'super_admin') {
          navigate('/super-admin/dashboard');
        } else if (role === 'company_admin') {
          navigate('/admin/dashboard');
        } else if (role === 'worker') {
          navigate('/worker/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(0);
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0px 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                color: 'white',
                py: 5,
                px: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <CarWashIcon sx={{ fontSize: 64, mb: 2, opacity: 0.95 }} />
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    mb: 1,
                  }}
                >
                  WashTrack
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    opacity: 0.95,
                    fontWeight: 500,
                  }}
                >
                  Premium Carwash Management
                </Typography>
              </Box>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              {/* Stepper */}
              <Stepper activeStep={step} sx={{ mb: 4 }}>
                <Step>
                  <StepLabel>Mobile Number</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Verify OTP</StepLabel>
                </Step>
              </Stepper>

              {error && (
                <Fade in={!!error}>
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              {success && (
                <Fade in={!!success}>
                  <Alert
                    severity="success"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setSuccess('')}
                  >
                    {success}
                  </Alert>
                </Fade>
              )}

              {step === 0 ? (
                <form onSubmit={handleRequestOTP}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 3 }}
                  >
                    Sign in to your account
                  </Typography>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    margin="normal"
                    required
                    autoFocus
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" sx={{ mr: 0.5 }} />
                          <Box
                            component="span"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                              fontSize: '1rem',
                            }}
                          >
                            +91
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    helperText={`Enter 10-digit mobile number ${mobileNumber.length > 0 ? `(${mobileNumber.length}/10)` : ''}`}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || mobileNumber.length !== 10}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #000051 0%, #005662 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(0,0,0,0.12)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <IconButton onClick={handleBack} disabled={loading}>
                      <BackIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Enter Verification Code
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sent to +91 {mobileNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    label="OTP Code"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    margin="normal"
                    required
                    autoFocus
                    disabled={loading}
                    inputProps={{
                      maxLength: 6,
                      style: {
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                        fontWeight: 600,
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <OtpIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || otp.length !== 6}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #000051 0%, #005662 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(0,0,0,0.12)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 2, fontWeight: 600 }}
                    onClick={handleRequestOTP}
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                </form>
              )}

              {/* Footer */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="center"
                  display="block"
                >
                  Secure OTP-based authentication
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default Login;

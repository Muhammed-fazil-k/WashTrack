import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  Stack,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExitToApp as LogoutIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import CompanyService from '../../services/company.service';
import AuthService from '../../services/auth.service';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Handle mobile number input (10 digits only, auto-add +91)
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, contact_number: value });
    }
  };

  const getFormattedMobile = () => {
    return formData.contact_number ? `+91 ${formData.contact_number}` : '';
  };

  const getFullMobileNumber = () => {
    return formData.contact_number ? `+91${formData.contact_number}` : '';
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await CompanyService.getAllCompanies();
      setCompanies(data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditMode(true);
      setCurrentCompany(company);
      // Extract digits from +91XXXXXXXXXX format
      const mobile = company.contact_number.replace(/^\+91/, '').replace(/\D/g, '');
      setFormData({
        name: company.name,
        contact_number: mobile,
        email: company.email || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        pincode: company.pincode || '',
      });
    } else {
      setEditMode(false);
      setCurrentCompany(null);
      setFormData({
        name: '',
        contact_number: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentCompany(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        contact_number: getFullMobileNumber(), // Send as +91XXXXXXXXXX
      };

      if (editMode) {
        await CompanyService.updateCompany(currentCompany.id, submitData);
      } else {
        await CompanyService.createCompany(submitData);
      }
      handleCloseDialog();
      loadCompanies();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save company');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await CompanyService.deleteCompany(id);
        loadCompanies();
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to delete company');
      }
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleViewUsers = (companyCode) => {
    navigate(`/super-admin/companies/${companyCode}/users`);
  };

  // Calculate statistics
  const totalCompanies = companies.length;
  const totalAdmins = companies.reduce((sum, c) => sum + (parseInt(c.admin_count) || 0), 0);
  const totalWorkers = companies.reduce((sum, c) => sum + (parseInt(c.worker_count) || 0), 0);
  const totalTransactions = companies.reduce((sum, c) => sum + (parseInt(c.transaction_count) || 0), 0);

  const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
    <Card
      sx={{
        height: '100%',
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              width: 56,
              height: 56,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Icon sx={{ fontSize: 30 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      pb: 4,
    }}>
      {/* Header Bar */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2.5,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                WashTrack
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Super Admin Dashboard
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size={isMobile ? "small" : "medium"}
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {error && (
          <Fade in={!!error}>
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Companies"
              value={totalCompanies}
              icon={BusinessIcon}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Company Admins"
              value={totalAdmins}
              icon={GroupIcon}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Workers"
              value={totalWorkers}
              icon={GroupIcon}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Transactions"
              value={totalTransactions}
              icon={TrendingUpIcon}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
          </Grid>
        </Grid>

        {/* Companies Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Section Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Companies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage all registered carwash companies
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size={isMobile ? "medium" : "large"}
              sx={{
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #000051 0%, #005662 100%)',
                },
              }}
            >
              {isMobile ? 'Add' : 'Add New Company'}
            </Button>
          </Box>

          {/* Companies Table */}
          <TableContainer
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'auto',
            }}
          >
            <Table sx={{ minWidth: isTablet ? 650 : 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Company ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Company Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Contact</TableCell>
                  {!isMobile && <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Location</TableCell>}
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
                  {!isTablet && (
                    <>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Admins</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Workers</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Transactions</TableCell>
                    </>
                  )}
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Loading companies...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No companies yet
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Create your first company to get started
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow
                      key={company.id}
                      onClick={() => handleViewUsers(company.company_code)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'scale(1.002)',
                          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={company.company_code}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontFamily: 'monospace',
                            fontSize: '0.813rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {company.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{company.contact_number}</Typography>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2">{company.city || 'N/A'}</Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={company.subscription_status}
                          color={company.subscription_status === 'active' ? 'success' : 'default'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        />
                      </TableCell>
                      {!isTablet && (
                        <>
                          <TableCell align="center">
                            <Chip
                              label={company.admin_count || 0}
                              size="small"
                              sx={{ minWidth: 40 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={company.worker_count || 0}
                              size="small"
                              sx={{ minWidth: 40 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={company.transaction_count || 0}
                              size="small"
                              sx={{ minWidth: 40 }}
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Edit Company" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(company);
                              }}
                              sx={{
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Company" arrow>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(company.id);
                              }}
                              sx={{
                                '&:hover': {
                                  bgcolor: 'error.main',
                                  color: 'white',
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add/Edit Company Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : '16px',
              overflow: 'hidden',
            }
          }}
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
              color: 'white',
              fontWeight: 700,
              py: 2,
              px: 3,
              m: 0,
            }}>
              {editMode ? 'Edit Company' : 'Add New Company'}
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 3, px: 3, mt: 2 }}>
              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    placeholder="9876543210"
                    value={formData.contact_number}
                    onChange={handleMobileChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Box
                          component="span"
                          sx={{
                            mr: 1,
                            color: 'text.secondary',
                            fontWeight: 600,
                          }}
                        >
                          +91
                        </Box>
                      ),
                    }}
                    helperText={`10 digits required ${formData.contact_number.length > 0 ? `(${formData.contact_number.length}/10)` : ''}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    placeholder="company@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    placeholder="Street address, building number..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    placeholder="110001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ px: 3 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #000051 0%, #005662 100%)',
                  },
                }}
              >
                {editMode ? 'Update Company' : 'Create Company'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
}

export default SuperAdminDashboard;

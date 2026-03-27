import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { Card, CardContent } from '@mui/material';
import UserService from '../../services/user.service';
import CompanyService from '../../services/company.service';

function CompanyUsers() {
  const { companyCode } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    mobile_number: '',
    name: '',
    email: '',
    role: 'worker',
  });

  // Handle mobile number input (10 digits only, auto-add +91)
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, mobile_number: value });
    }
  };

  const getFullMobileNumber = () => {
    return formData.mobile_number ? `+91${formData.mobile_number}` : '';
  };

  useEffect(() => {
    loadCompany();
    loadUsers();
  }, [companyCode, tabValue]);

  const loadCompany = async () => {
    try {
      const data = await CompanyService.getCompanyById(companyCode);
      setCompany(data.data);
    } catch (err) {
      setError('Failed to load company details');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const roleFilter = tabValue === 1 ? 'company_admin' : tabValue === 2 ? 'worker' : null;
      const data = await UserService.getUsersByCompany(companyCode, roleFilter);
      setUsers(data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      mobile_number: '',
      name: '',
      email: '',
      role: tabValue === 1 ? 'company_admin' : 'worker',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        mobile_number: getFullMobileNumber(), // Send as +91XXXXXXXXXX
        company_id: company.id, // Use numeric ID for database operation
      };
      await UserService.registerUser(submitData);
      handleCloseDialog();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to register user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.deleteUser(userId);
        loadUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await UserService.updateUser(userId, { is_active: !currentStatus });
      loadUsers();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const admins = users.filter(u => u.role === 'company_admin');
  const workers = users.filter(u => u.role === 'worker');

  const getRoleBadgeColor = (role) => {
    return role === 'company_admin' ? 'primary' : 'secondary';
  };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={() => navigate('/super-admin/dashboard')}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  }
                }}
              >
                <BackIcon />
              </IconButton>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {company && (
                    <Chip
                      label={company.company_code}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700 }}>
                    {company?.name || 'Company Users'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Manage Company Admins and Workers
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenDialog}
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
              {isMobile ? 'Add' : 'Add User'}
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

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '100%',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Total Users
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {users.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', width: 56, height: 56 }}>
                    <BadgeIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              height: '100%',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Company Admins
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {admins.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', width: 56, height: 56 }}>
                    <PersonAddIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              height: '100%',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Workers
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {workers.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', width: 56, height: 56 }}>
                    <BadgeIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.938rem',
                minHeight: 64,
              },
            }}
          >
            <Tab label={`All Users (${users.length})`} />
            <Tab label={`Admins (${admins.length})`} />
            <Tab label={`Workers (${workers.length})`} />
          </Tabs>

          {/* Users Table */}
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{ minWidth: isTablet ? 500 : 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', bgcolor: 'background.paper' }}>
                    Name
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', bgcolor: 'background.paper' }}>
                      Mobile Number
                    </TableCell>
                  )}
                  {!isTablet && (
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', bgcolor: 'background.paper' }}>
                      Email
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', bgcolor: 'background.paper' }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', bgcolor: 'background.paper' }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem', bgcolor: 'background.paper' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Loading users...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <PersonAddIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No users yet
                      </Typography>
                      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        Add company admins and workers to get started
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleOpenDialog}
                        sx={{
                          background: 'linear-gradient(135deg, #1a237e 0%, #00838f 100%)',
                        }}
                      >
                        Add First User
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: user.role === 'company_admin' ? 'primary.main' : 'secondary.main',
                              width: 40,
                              height: 40,
                              fontWeight: 700,
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            {isMobile && (
                              <Typography variant="caption" color="text.secondary">
                                {user.mobile_number}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">{user.mobile_number}</Typography>
                          </Box>
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {user.email || <span style={{ color: '#9e9e9e' }}>Not provided</span>}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={user.role === 'company_admin' ? 'Admin' : 'Worker'}
                          color={getRoleBadgeColor(user.role)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            minWidth: 80,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? 'Active' : 'Inactive'}
                          color={user.is_active ? 'success' : 'default'}
                          size="small"
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          sx={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            minWidth: 80,
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete User" arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user.id)}
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add User Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
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
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonAddIcon />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Register New User
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 3, px: 3, mt: 2 }}>
              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    placeholder="9876543210"
                    value={formData.mobile_number}
                    onChange={handleMobileChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <>
                          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                        </>
                      ),
                    }}
                    helperText={`10 digits required ${formData.mobile_number.length > 0 ? `(${formData.mobile_number.length}/10)` : ''}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email (Optional)"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>User Role</InputLabel>
                    <Select
                      value={formData.role}
                      label="User Role"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <MenuItem value="company_admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Admin" color="primary" size="small" />
                          <Typography>Company Admin</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="worker">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Worker" color="secondary" size="small" />
                          <Typography>Worker</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 3, gap: 1 }}>
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
                Register User
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
}

export default CompanyUsers;

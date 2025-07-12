import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School
} from '@mui/icons-material';
import { useAuth } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await login(formData.email, formData.password);
      
      // Redirect based on user role or to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = async (demoType) => {
    const demoCredentials = {
      admin: { email: 'admin@college.edu', password: 'admin123' },
      faculty: { email: 'faculty@college.edu', password: 'faculty123' },
      hod: { email: 'hod@college.edu', password: 'hod123' }
    };

    setFormData(demoCredentials[demoType]);
    setError('');
    
    try {
      setLoading(true);
      await login(demoCredentials[demoType].email, demoCredentials[demoType].password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 16px 0 rgba(0,0,0,0.7)' : undefined,
          border: theme.palette.mode === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <School sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Faculty Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access your attendance monitoring dashboard
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        {/* Demo Login Section */}
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Demo Accounts
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            sx={{ justifyContent: 'flex-start' }}
          >
            Admin Demo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDemoLogin('faculty')}
            disabled={loading}
            sx={{ justifyContent: 'flex-start' }}
          >
            Faculty Demo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDemoLogin('hod')}
            disabled={loading}
            sx={{ justifyContent: 'flex-start' }}
          >
            HOD Demo
          </Button>
        </Box>

        {/* Footer Links */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link href="/register" underline="hover">
              Register here
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Link href="/forgot-password" underline="hover">
              Forgot password?
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 
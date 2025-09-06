import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // The user data will be available in the next render cycle
        // We'll use useEffect to handle the redirect
      } else {
        setError(result.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  // Handle redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user && !redirecting) {
      setRedirecting(true);
      // Add a small delay to ensure the user data is properly loaded
      const timer = setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate, redirecting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            sx={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              borderRadius: 4,
              color: 'white'
            }}
          >
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(56, 189, 248, 0.3)'
                  }}
                >
                  <LoginIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="#94a3b8" sx={{ fontWeight: 500 }}>
                  Sign in to your account to continue
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: '#94a3b8' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,0.1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#38BDF8'
                        }
                      },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: '#94a3b8' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,0.1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#38BDF8'
                        }
                      },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    mb: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderRadius: '10px',
                    textTransform: 'none',
                    color: '#0f172a',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)'
                    },
                    '&:disabled': {
                      background: 'rgba(56, 189, 248, 0.5)',
                      transform: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login; 
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Container,
  useMediaQuery,
  Chip,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Experience', path: '/experience' },
    { text: 'Projects', path: '/projects' },
    { text: 'Skills', path: '/skills' },
    { text: 'Contact', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    if (mobileOpen) setMobileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ 
      width: isSmallMobile ? '100vw' : 320, 
      height: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      color: '#F1F5F9',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Drawer Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#38BDF8' }}>
          Shubham
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#94A3B8' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Navigation Items */}
      <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              color: isActive(item.path) ? '#38BDF8' : '#94A3B8',
              background: isActive(item.path) ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              fontWeight: isActive(item.path) ? 600 : 400,
              '&:hover': {
                bgcolor: 'rgba(56, 189, 248, 0.08)',
                color: '#38BDF8'
              }
            }}
          >
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 'inherit' 
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
      
      {/* Auth Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {!isAuthenticated ? (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            fullWidth
            onClick={handleDrawerToggle}
            sx={{
              background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
              color: '#0F172A',
              fontWeight: 700,
              borderRadius: '10px',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
              }
            }}
          >
            Login
          </Button>
        ) : (
          <>
            {user?.role === 'admin' && (
              <Button
                component={Link}
                to="/admin"
                variant="contained"
                fullWidth
                startIcon={<AdminIcon />}
                onClick={handleDrawerToggle}
                sx={{
                  background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                  color: '#0F172A',
                  fontWeight: 700,
                  borderRadius: '10px',
                  py: 1.5,
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                  }
                }}
              >
                Admin Dashboard
              </Button>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontWeight: 700 }}>
                {user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#E2E8F0' }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  {user?.email || ''}
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handleLogout}
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: 'rgba(56, 189, 248, 0.5)',
                color: '#38BDF8',
                fontWeight: 600,
                borderRadius: '10px',
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(56, 189, 248, 0.1)',
                  borderColor: '#38BDF8'
                }
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          py: { xs: 1, md: 2 },
          zIndex: 1201,
          transition: 'padding 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ 
            justifyContent: 'space-between', 
            minHeight: { xs: 64, md: 72 },
            px: { xs: 1.5, sm: 2, md: 3 },
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#F1F5F9',
            boxShadow: '0 4px 24px rgba(2, 6, 23, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px'
          }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 900,
                textDecoration: 'none',
                letterSpacing: 1.5,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                px: 1,
                py: 0.5,
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(56, 189, 248, 0.1)',
                }
              }}
            >
              Shubham
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { md: 0.5, lg: 1 } 
              }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? '#38BDF8' : '#CBD5E1',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontSize: '1rem',
                      px: { md: 1.5, lg: 2 },
                      py: 1,
                      borderRadius: '10px',
                      minWidth: 'auto',
                      background: isActive(item.path)
                        ? 'rgba(56, 189, 248, 0.1)'
                        : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: '#38BDF8',
                        background: 'rgba(56, 189, 248, 0.08)',
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Profile/Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAuthenticated ? (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                    color: '#0F172A',
                    fontWeight: 700,
                    borderRadius: '10px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 2px 12px rgba(56, 189, 248, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                      boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)',
                    }
                  }}
                >
                  Login
                </Button>
              ) : (
                <>
                  {user?.role === 'admin' && !isMobile && (
                    <Button
                      component={Link}
                      to="/admin"
                      variant="contained"
                      startIcon={<AdminIcon />}
                      sx={{
                        background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                        color: '#0F172A',
                        fontWeight: 700,
                        borderRadius: '10px',
                        px: 2,
                        py: 1,
                        boxShadow: '0 2px 12px rgba(129, 140, 248, 0.3)',
                        mr: 1,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                          boxShadow: '0 4px 16px rgba(129, 140, 248, 0.4)',
                        }
                      }}
                    >
                      Admin
                    </Button>
                  )}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      p: 0.5,
                      border: '2px solid rgba(56, 189, 248, 0.3)',
                      background: 'rgba(56, 189, 248, 0.08)',
                      color: '#38BDF8',
                      '&:hover': {
                        background: 'rgba(56, 189, 248, 0.18)',
                        borderColor: 'rgba(56, 189, 248, 0.5)',
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'rgba(56, 189, 248, 0.2)', 
                      color: '#38BDF8', 
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}>
                      {user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ mt: 1 }}
                    PaperProps={{
                      sx: {
                        bgcolor: '#1E293B',
                        color: '#F1F5F9',
                        minWidth: 200,
                        boxShadow: '0 4px 24px rgba(2, 6, 23, 0.4)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        overflow: 'hidden'
                      }
                    }}
                  >
                    <MenuItem disabled sx={{ 
                      fontWeight: 700, 
                      opacity: 0.8,
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {user?.name || 'Profile'}
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout} 
                      sx={{ 
                        color: '#38BDF8', 
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(56, 189, 248, 0.1)'
                        }
                      }}
                    >
                      <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
              {/* Mobile Hamburger */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    ml: 1,
                    color: '#CBD5E1',
                    '&:hover': {
                      color: '#38BDF8',
                      bgcolor: 'rgba(56, 189, 248, 0.1)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
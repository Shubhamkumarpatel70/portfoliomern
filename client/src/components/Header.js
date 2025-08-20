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
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Portfolio
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
              fontWeight: isActive(item.path) ? 600 : 400,
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                color: theme.palette.primary.main
              }
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!isAuthenticated ? (
          <ListItem sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5b21b6, #7c3aed)'
                }
              }}
            >
              Login
            </Button>
          </ListItem>
        ) : (
          <>
            {user?.role === 'admin' && (
              <ListItem sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  to="/admin"
                  variant="contained"
                  fullWidth
                  startIcon={<AdminIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b91c1c, #dc2626)'
                    }
                  }}
                >
                  Admin Dashboard
                </Button>
              </ListItem>
            )}
            <ListItem sx={{ mt: 2 }}>
              <Button
                onClick={handleLogout}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme.palette.error.main,
                    color: 'white'
                  }
                }}
              >
                Logout
              </Button>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: '#0F172A',
          color: '#F1F5F9',
          boxShadow: '0 4px 24px rgba(16, 23, 42, 0.18)',
          borderBottom: '1.5px solid #1E293B',
          zIndex: 1201
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 900,
              textDecoration: 'none',
              color: '#38BDF8',
              letterSpacing: 1.5,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              px: 1,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                color: '#F1F5F9',
                background: 'none',
                WebkitTextFillColor: '#F1F5F9',
              }
            }}
          >
            Portfolio
          </Typography>
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path) ? '#38BDF8' : '#F1F5F9',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    px: 2.5,
                    py: 1.2,
                    borderRadius: 2.5,
                    background: isActive(item.path)
                      ? 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)'
                      : 'transparent',
                    backgroundClip: isActive(item.path) ? 'text' : 'none',
                    WebkitBackgroundClip: isActive(item.path) ? 'text' : 'none',
                    WebkitTextFillColor: isActive(item.path) ? 'transparent' : undefined,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#38BDF8',
                      background: 'rgba(56,189,248,0.08)',
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
                  borderRadius: 2.5,
                  px: 3,
                  boxShadow: '0 2px 8px #38BDF822',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                    color: '#F1F5F9',
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
                    startIcon={<AdminIcon />}
                    sx={{
                      background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                      color: '#0F172A',
                      fontWeight: 700,
                      borderRadius: 2.5,
                      px: 2.5,
                      boxShadow: '0 2px 8px #818CF822',
                      mr: 1,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                        color: '#F1F5F9',
                      }
                    }}
                  >
                    Admin
                  </Button>
                )}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    ml: 1,
                    p: 0.5,
                    border: '2px solid #38BDF8',
                    background: 'rgba(56,189,248,0.08)',
                    color: '#38BDF8',
                    '&:hover': {
                      background: 'rgba(56,189,248,0.18)',
                    }
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#1E293B', color: '#38BDF8', fontWeight: 700 }}>
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
                      minWidth: 180,
                      boxShadow: '0 4px 24px #0F172A88',
                      borderRadius: 2.5
                    }
                  }}
                >
                  <MenuItem disabled sx={{ fontWeight: 700, opacity: 0.7 }}>
                    {user?.name || 'Profile'}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#38BDF8', fontWeight: 700 }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
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
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            bgcolor: '#1E293B',
            color: '#F1F5F9',
            width: 270,
            pt: 2,
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
          }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #334155' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#38BDF8', letterSpacing: 1 }}>
            Portfolio
          </Typography>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                color: isActive(item.path) ? '#38BDF8' : '#F1F5F9',
                fontWeight: isActive(item.path) ? 700 : 500,
                borderRadius: 2,
                px: 2,
                my: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(56,189,248,0.08)',
                  color: '#38BDF8'
                }
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          {!isAuthenticated ? (
            <ListItem sx={{ mt: 2 }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                  color: '#0F172A',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  boxShadow: '0 2px 8px #38BDF822',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                    color: '#F1F5F9',
                  }
                }}
              >
                Login
              </Button>
            </ListItem>
          ) : (
            <>
              {user?.role === 'admin' && (
                <ListItem sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to="/admin"
                    variant="contained"
                    fullWidth
                    startIcon={<AdminIcon />}
                    sx={{
                      background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                      color: '#0F172A',
                      fontWeight: 700,
                      borderRadius: 2.5,
                      px: 2.5,
                      boxShadow: '0 2px 8px #818CF822',
                      mr: 1,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                        color: '#F1F5F9',
                      }
                    }}
                  >
                    Admin
                  </Button>
                </ListItem>
              )}
              <ListItem sx={{ mt: 2 }}>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: '#38BDF8',
                    color: '#38BDF8',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    '&:hover': {
                      bgcolor: '#38BDF8',
                      color: '#0F172A',
                    }
                  }}
                >
                  Logout
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Header; 
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Grid,
  useTheme,
  TextField,
  Button,
  Divider,
  Chip,
  Tooltip,
  Fab,
  Link,
  Alert,
  Snackbar
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Send as SendIcon,
  Code as CodeIcon,
  DesignServices as DesignIcon,
  Security as SecurityIcon,
  Article as BlogIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

const Footer = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const socialLinks = [
    {
      icon: <GitHubIcon />,
      url: 'https://github.com/yourusername',
      label: 'GitHub',
      color: '#333'
    },
    {
      icon: <LinkedInIcon />,
      url: 'https://linkedin.com/in/yourusername',
      label: 'LinkedIn',
      color: '#0077b5'
    },
    {
      icon: <TwitterIcon />,
      url: 'https://twitter.com/yourusername',
      label: 'Twitter',
      color: '#1da1f2'
    },
    {
      icon: <EmailIcon />,
      url: 'mailto:your.email@example.com',
      label: 'Email',
      color: '#ea4335'
    }
  ];

  const contactInfo = [
    {
      icon: <EmailIcon />,
      text: 'your.email@example.com',
      url: 'mailto:your.email@example.com'
    },
    {
      icon: <PhoneIcon />,
      text: '+1 (555) 123-4567',
      url: 'tel:+15551234567'
    },
    {
      icon: <LocationIcon />,
      text: 'San Francisco, CA',
      url: '#'
    }
  ];

  const quickLinks = [
    { name: 'Home', path: '/', icon: <ArrowUpIcon sx={{ transform: 'rotate(-90deg)' }} /> },
    { name: 'Projects', path: '/projects', icon: <CodeIcon /> },
    { name: 'Blog', path: '/blog', icon: <BlogIcon /> },
    { name: 'About', path: '/about', icon: <DesignIcon /> },
    { name: 'Contact', path: '/contact', icon: <EmailIcon /> }
  ];

  const technologies = [
    { name: 'React', icon: <CodeIcon />, color: '#61dafb' },
    { name: 'Node.js', icon: <CodeIcon />, color: '#339933' },
    { name: 'TypeScript', icon: <CodeIcon />, color: '#3178c6' },
    { name: 'MUI', icon: <DesignIcon />, color: '#007fff' }
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await api.post('/api/newsletter/subscribe', { email });
      setIsSubscribed(true);
      setEmail('');
      setSnackbar({
        open: true,
        message: response.data.message || 'Successfully subscribed to newsletter!',
        severity: 'success'
      });
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to subscribe. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#e2e8f0',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.03) 0%, transparent 50%)',
            opacity: 0.5,
            zIndex: 0
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
            {/* Brand Section */}
            <Grid item xs={12} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: '#3b82f6',
                    mr: 2,
                    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3)'
                  }} />
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 800,
                      color: 'white',
                      letterSpacing: '-0.5px',
                      background: 'linear-gradient(90deg, #e2e8f0, #94a3b8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    SHUBHAM KUMAR
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: '#94a3b8',
                    lineHeight: 1.7,
                    fontSize: '1rem',
                    maxWidth: '90%'
                  }}
                >
                  Crafting exceptional digital experiences with modern web technologies. 
                  Let's build something amazing together.
                </Typography>
                
                {/* Technology Stack */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5
                  }}>
                    Tech Stack
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {technologies.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -2 }}
                      >
                        <Chip
                          icon={React.cloneElement(tech.icon, { sx: { fontSize: '1rem' } })}
                          label={tech.name}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: 'rgba(15, 23, 42, 0.7)',
                            color: '#e2e8f0',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiChip-icon': { color: tech.color, opacity: 0.8 },
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              color: 'white',
                              borderColor: tech.color,
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>

                {/* Social Links */}
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5
                  }}>
                    Connect With Me
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={social.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -3 }}
                      >
                        <Tooltip title={social.label} arrow>
                          <IconButton
                            component="a"
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: '#94a3b8',
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              width: 40,
                              height: 40,
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 12px ${social.color}20`
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {social.icon}
                          </IconButton>
                        </Tooltip>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 3,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: 2,
                      background: 'linear-gradient(90deg, #3b82f6, transparent)',
                      borderRadius: 2
                    }
                  }}
                >
                  Navigation
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.path}
                        underline="none"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          color: '#94a3b8',
                          fontWeight: 500,
                          py: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: 'white',
                            transform: 'translateX(4px)',
                            '& .link-icon': {
                              color: '#3b82f6'
                            }
                          },
                        }}
                      >
                        <Box className="link-icon" sx={{ 
                          color: '#64748b',
                          display: 'flex',
                          transition: 'all 0.2s ease'
                        }}>
                          {React.cloneElement(link.icon, { sx: { fontSize: '1.1rem' } })}
                        </Box>
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 3,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: 2,
                      background: 'linear-gradient(90deg, #10b981, transparent)',
                      borderRadius: 2
                    }
                  }}
                >
                  Get In Touch
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={contact.text}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 2 }}
                    >
                      <Link
                        href={contact.url}
                        underline="none"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          color: '#94a3b8',
                          '&:hover': {
                            color: 'white',
                            '& .contact-icon-wrapper': {
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              borderColor: '#10b981',
                              transform: 'scale(1.05)'
                            }
                          },
                          transition: 'color 0.2s ease'
                        }}
                      >
                        <Box
                          className="contact-icon-wrapper"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#e2e8f0',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {contact.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {contact.text}
                        </Typography>
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Newsletter Subscription */}
            <Grid item xs={12} md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 3,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: 2,
                      background: 'linear-gradient(90deg, #f59e0b, transparent)',
                      borderRadius: 2
                    }
                  }}
                >
                  Newsletter
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#94a3b8',
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  Join my newsletter for exclusive insights, project updates, and web development tips delivered to your inbox.
                </Typography>
                
                <Box 
                  component="form" 
                  onSubmit={handleSubscribe} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2 
                  }}
                >
                  <TextField
                    type="email"
                    placeholder="Your email address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ color: '#64748b', mr: 1.5, fontSize: '1.2rem' }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#e2e8f0',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '& fieldset': { 
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.2s ease'
                        },
                        '&:hover fieldset': { 
                          borderColor: 'rgba(255, 255, 255, 0.2)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: '#f59e0b',
                          boxShadow: '0 0 0 2px rgba(245, 158, 11, 0.2)'
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': { 
                        color: '#64748b', 
                        opacity: 1,
                        fontSize: '0.9rem'
                      }
                    }}
                    fullWidth
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isSubscribed ? 'subscribed' : 'subscribe'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={!isSubscribed && <SendIcon />}
                        disabled={isSubscribed || isLoading}
                        sx={{
                          background: isSubscribed 
                            ? '#10b981' 
                            : 'linear-gradient(90deg, #f59e0b 0%, #f97316 100%)',
                          color: isSubscribed ? 'white' : '#0f172a',
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 700,
                          width: '100%',
                          '&:hover': { 
                            background: isSubscribed 
                              ? '#10b981' 
                              : 'linear-gradient(90deg, #f97316 0%, #f59e0b 100%)', 
                            transform: 'translateY(-2px)', 
                            boxShadow: isSubscribed 
                              ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                              : '0 4px 12px rgba(249, 115, 22, 0.3)' 
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isSubscribed ? 'Thank you! 🎉' : isLoading ? 'Subscribing...' : 'Subscribe Now'}
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ 
            my: { xs: 4, md: 6 }, 
            borderColor: 'rgba(255, 255, 255, 0.05)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
          }} />

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.8rem'
                }}
              >
                © {new Date().getFullYear()} SHUBHAM KUMAR. All rights reserved.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1.5, md: 3 }, 
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-end' }
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <CodeIcon sx={{ fontSize: '0.9rem', color: '#3b82f6' }} />
                  Crafted with React & MUI
                </Typography>
                <Box sx={{ 
                  width: '1px', 
                  height: 16, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  display: { xs: 'none', sm: 'block' }
                }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: '0.9rem', color: '#10b981' }} />
                  Secure by Design
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Back to Top Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Fab
          color="primary"
          aria-label="back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'transparent',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            color: 'white',
            '&:hover': { 
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', 
              transform: 'translateY(-3px)', 
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)' 
            },
            transition: 'all 0.3s ease',
            zIndex: 1000
          }}
        >
          <ArrowUpIcon />
        </Fab>
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Footer;
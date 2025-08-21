import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  Link
} from '@mui/material';
import { 
  Send as SendIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { api } from '../api';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.message) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/contacts', form);
      setSuccess('Your message has been sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white', 
      py: { xs: 4, sm: 6, md: 8, lg: 10 },
      position: 'relative',
      overflow: 'hidden',
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
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography variant="h2" sx={{ 
                fontWeight: 900, 
                mb: 3, 
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Let's Connect
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#94a3b8', 
                mb: 5,
                lineHeight: 1.7,
                maxWidth: '90%'
              }}>
                Have a project in mind or want to discuss opportunities? 
                Fill out the form or reach out directly through my contact information.
              </Typography>

              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" sx={{ 
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
                }}>
                  Contact Information
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
              </Box>

              <Box>
                <Typography variant="h5" sx={{ 
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
                }}>
                  Social Media
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
                      <IconButton
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: '#94a3b8',
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          width: 48,
                          height: 48,
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
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Card sx={{ 
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 4, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
                color: 'white', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ p: 5 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    mb: 3,
                    background: 'linear-gradient(90deg, #e2e8f0, #94a3b8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Send a Message
                  </Typography>
                  
                  <AnimatePresence mode="wait">
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit}>
                    <TextField
                      name="name"
                      label="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'rgba(255,255,255,0.05)',
                          color: 'white',
                          transition: 'all 0.2s ease',
                          '& fieldset': { 
                            borderColor: 'rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease'
                          },
                          '&:hover fieldset': { 
                            borderColor: 'rgba(255,255,255,0.2)' 
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#94a3b8',
                          '&.Mui-focused': {
                            color: '#3b82f6'
                          }
                        }
                      }}
                    />
                    <TextField
                      name="email"
                      label="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'rgba(255,255,255,0.05)',
                          color: 'white',
                          transition: 'all 0.2s ease',
                          '& fieldset': { 
                            borderColor: 'rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease'
                          },
                          '&:hover fieldset': { 
                            borderColor: 'rgba(255,255,255,0.2)' 
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#94a3b8',
                          '&.Mui-focused': {
                            color: '#3b82f6'
                          }
                        }
                      }}
                    />
                    <TextField
                      name="message"
                      label="Your Message"
                      value={form.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      multiline
                      rows={5}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'rgba(255,255,255,0.05)',
                          color: 'white',
                          transition: 'all 0.2s ease',
                          '& fieldset': { 
                            borderColor: 'rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease'
                          },
                          '&:hover fieldset': { 
                            borderColor: 'rgba(255,255,255,0.2)' 
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#94a3b8',
                          '&.Mui-focused': {
                            color: '#3b82f6'
                          }
                        }
                      }}
                    />
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        endIcon={!loading && <SendIcon />}
                        sx={{
                          mt: 3,
                          fontWeight: 700,
                          borderRadius: 2,
                          background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
                          fontSize: '1rem',
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                          },
                          '&:disabled': {
                            background: 'rgba(99, 102, 241, 0.5)',
                            transform: 'none'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
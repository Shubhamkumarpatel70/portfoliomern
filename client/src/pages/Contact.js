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
  IconButton,
  useTheme,
  Grid,
  Link,
  Stack,
  Chip
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
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
import { api } from '../api';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      url: 'mailto:your.email@example.com',
      label: 'Email'
    },
    {
      icon: <PhoneIcon />,
      text: '+1 (555) 123-4567',
      url: 'tel:+15551234567',
      label: 'Phone'
    },
    {
      icon: <LocationIcon />,
      text: 'San Francisco, CA',
      url: '#',
      label: 'Location'
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
      py: { xs: 3, sm: 4, md: 6 },
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.05) 0%, transparent 50%)',
        zIndex: 0
      },
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 3 }} alignItems="center">
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Box sx={{ 
                textAlign: { xs: 'center', lg: 'left' }, 
                mb: { xs: 4, lg: 0 },
                px: { xs: 2, sm: 0 }
              }}>
                <Chip 
                  label="Get in touch" 
                  sx={{ 
                    mb: 2, 
                    background: 'rgba(56, 189, 248, 0.1)', 
                    color: '#38BDF8', 
                    fontWeight: 600 
                  }} 
                />
                
                <Typography variant="h2" sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                  background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Let's Talk
                </Typography>
                
                <Typography variant="h6" sx={{ 
                  color: '#94a3b8', 
                  mb: 4,
                  lineHeight: 1.7,
                  maxWidth: '100%',
                  fontSize: { xs: '1rem', md: '1.125rem' }
                }}>
                  Have a project in mind or want to discuss opportunities? 
                  Fill out the form or reach out directly.
                </Typography>

                <Stack spacing={3} sx={{ mb: 5 }}>
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={contact.text}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        href={contact.url}
                        underline="none"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          color: '#94a3b8',
                          justifyContent: { xs: 'center', lg: 'flex-start' },
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
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#e2e8f0',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {contact.icon}
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {contact.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {contact.text}
                          </Typography>
                        </Box>
                      </Link>
                    </motion.div>
                  ))}
                </Stack>

                <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: 'white', 
                    mb: 2,
                  }}>
                    Follow me on
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', lg: 'flex-start' }}>
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
                          aria-label={social.label}
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
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={7}>
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
                mx: { xs: 2, sm: 0 },
                '&:hover, &:focus-within': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 3,
                    textAlign: 'center',
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
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="name"
                          label="Your Name"
                          value={form.name}
                          onChange={handleChange}
                          fullWidth
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
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
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="email"
                          label="Email Address"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          fullWidth
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
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
                      </Grid>
                    </Grid>
                    
                    <TextField
                      name="message"
                      label="Your Message"
                      value={form.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      multiline
                      rows={4}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
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
                    
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          endIcon={!loading && <SendIcon />}
                          sx={{
                            fontWeight: 700,
                            borderRadius: '10px',
                            background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
                            fontSize: '1rem',
                            px: 4,
                            py: 1.5,
                            minWidth: { xs: '100%', sm: 'auto' },
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
                    </Box>
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
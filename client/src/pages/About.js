import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { Button } from '@mui/material';
import {
  Code as CodeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const getStatColor = (icon) => {
  if (icon.type && icon.type.displayName === 'WorkIcon') return '#3b82f6cc';
  if (icon.type && icon.type.displayName === 'CodeIcon') return '#10b981cc';
  if (icon.type && icon.type.displayName === 'StarIcon') return '#f59e0bcc';
  if (icon.type && icon.type.displayName === 'PsychologyIcon') return '#8b5cf6cc';
  return '#3b82f6cc';
};

const About = () => {
  const [about, setAbout] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    return url;
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [experiences, setExperiences] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchAboutData();
    fetchExperiences();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const aboutResponse = await axios.get(`${API_BASE_URL}/api/about/public`);
      setAbout(aboutResponse.data.about);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setAbout(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/experiences`);
      const experiencesData = response.data.experiences || response.data || [];
      setExperiences(Array.isArray(experiencesData) ? experiencesData.slice(0, 4) : []);
    } catch (err) {
      setExperiences([]);
    }
  };

  const stats = [
    { label: 'Years Experience', value: '4+', icon: <WorkIcon /> },
    { label: 'Projects Completed', value: '50+', icon: <CodeIcon /> },
    { label: 'Technologies', value: '15+', icon: <StarIcon /> },
    { label: 'Problem Solver', value: '100%', icon: <PsychologyIcon /> }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        py: { xs: 4, md: 8 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.08)' }} />
          </Box>
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} md={6} lg={3} key={item}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)' }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!about) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        py: { xs: 4, md: 8 }
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                About Information
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#cbd5e1',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  fontWeight: 500
                }}
              >
                No about information has been set up yet. Please log in to the admin panel to add your information.
              </Typography>
            </Box>
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                maxWidth: 800,
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                  mx: 'auto',
                  mb: 3,
                  color: 'white'
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 2
                }}
              >
                Default Information
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#cbd5e1',
                  lineHeight: 1.7
                }}
              >
                This is a placeholder for your about information. Once you add your details through the admin panel, they will appear here with a beautiful, professional layout.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
      py: { xs: 4, md: 8 },
      px: { xs: 0, sm: 2 },
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.5,
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b, #334155)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              About Me
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#475569',
                maxWidth: 800,
                mx: 'auto',
                fontWeight: 600,
                mb: 3,
                lineHeight: 1.4,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              {about.bio || 'Passionate Full Stack Developer with experience creating innovative digital solutions'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 500,
                mb: 4,
                lineHeight: 1.7,
                fontSize: '1.1rem'
              }}
            >
              I love building beautiful, functional, and user-centered digital experiences. With a strong foundation in both frontend and backend development, I enjoy turning complex problems into simple, intuitive solutions.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              justifyContent: 'center',
              mb: 4
            }}>
              <Chip 
                label="4+ Years Experience" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }} 
              />
              <Chip 
                label="Full Stack" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(45deg, #10b981, #3b82f6)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }} 
              />
              <Chip 
                label="Problem Solver" 
                variant="outlined" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  px: 3,
                  py: 1,
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  borderWidth: 2
                }} 
              />
            </Box>
          </Box>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
                      },
                      minHeight: { xs: 140, sm: 180 },
                      width: '100%',
                      maxWidth: 420,
                      mx: 'auto'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 60% 40%, ${getStatColor(stat.icon)} 60%, #222b 100%)`,
                        mx: 'auto',
                        mb: 2,
                        color: 'white',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        color: '#e2e8f0',
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        fontWeight: 600
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* Personal Info Card with Photo */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  height: '100%',
                  minHeight: { xs: 140, sm: 180 },
                  width: '100%',
                  maxWidth: 420,
                  mx: 'auto'
                }}
              >
                <Box component={motion.div} animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} sx={{ position: 'relative', width: { xs: 140, md: 160 }, height: { xs: 140, md: 160 }, mx: 'auto', mb: 3 }}>
                  <Box component={motion.div} animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} sx={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #38BDF8, #818CF8, #38BDF8)',
                    filter: 'blur(6px)', opacity: 0.7
                  }} />
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
                  <Avatar
                    src={getImageUrl(about?.photoUrl || about?.user?.avatar || '')}
                    alt={about?.name || 'Profile Photo'}
                    sx={{
                      width: '100%', height: '100%',
                      mx: 'auto',
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      border: '3px solid rgba(255,255,255,0.2)',
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiAvatar-img': {
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }
                    }}
                  >
                    {about?.name ? about.name.charAt(0).toUpperCase() : ''}
                  </Avatar>
                  </motion.div>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#1e293b',
                    mb: 1
                  }}
                >
                  {about.name || 'Your Name'}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#3b82f6',
                    fontWeight: 700,
                    mb: 3
                  }}
                >
                  Full Stack Developer
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {about.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                      <LocationIcon sx={{ color: '#64748b' }} />
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        {about.location}
                      </Typography>
                    </Box>
                  )}
                  {about.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                      <WebsiteIcon sx={{ color: '#3b82f6' }} />
                      <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 500 }}>
                        {about.website}
                      </Typography>
                    </Box>
                  )}
                  {about?.resumeUrl ? (
                    <Button
                      component="a"
                      href={getImageUrl(about.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, mx: 'auto' }}
                    >
                      View Resume
                    </Button>
                  ) : (
                    <Button component={Link} to="/login" variant="outlined" size="small" sx={{ mt: 1, mx: 'auto' }}>
                      Login to view resume
                    </Button>
                  )}
                </Box>
                
                <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: 'rgba(255,255,255,0.08)' }} />
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748b',
                    lineHeight: 1.7,
                    fontWeight: 500
                  }}
                >
                  {about.bio || 'I love building beautiful, functional, and user-centered digital experiences. With a strong foundation in both frontend and backend development, I enjoy turning complex problems into simple, intuitive solutions.'}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Skills Card */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  height: '100%',
                  minHeight: { xs: 140, sm: 180 },
                  width: '100%'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#1e293b',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <CodeIcon sx={{ color: '#3b82f6' }} />
                  Technical Skills
                </Typography>
                {about.skills && about.skills.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {about.skills.map((skill, index) => (
                      <Grid item xs={6} sm={4} md={3} key={`${skill}-${index}`}>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.03 }}>
                          <Chip
                            label={skill}
                            sx={{
                              width: '100%',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              px: 2,
                              py: 1,
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: '#3b82f6',
                              borderRadius: 2.5,
                              border: '1px solid rgba(59, 130, 246, 0.35)'
                            }}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    Skills information not available.
                  </Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Education Card */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  height: '100%',
                  minHeight: { xs: 140, sm: 180 },
                  width: '100%',
                  maxWidth: 420,
                  mx: 'auto'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#1e293b',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <SchoolIcon sx={{ color: '#10b981' }} />
                  Education
                </Typography>
                {about.education && about.education.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {about.education.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#10b981',
                              fontWeight: 700,
                              mb: 1
                            }}
                          >
                            {edu.degree}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748b',
                              fontWeight: 600,
                              mb: 1
                            }}
                          >
                            {edu.school} • {edu.year}
                          </Typography>
                          {edu.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#64748b',
                                lineHeight: 1.6
                              }}
                            >
                              {edu.description}
                            </Typography>
                          )}
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    Education information not available.
                  </Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Achievements Card */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  height: '100%',
                  minHeight: { xs: 140, sm: 180 },
                  width: '100%',
                  maxWidth: 420,
                  mx: 'auto'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#1e293b',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <TrophyIcon sx={{ color: '#f59e0b' }} />
                  Achievements
                </Typography>
                {about.achievements && about.achievements.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {about.achievements.map((ach, idx) => (
                      <Grid item xs={12} key={idx}>
                        <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: idx * 0.05 }}>
                          <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <StarIcon sx={{ color: '#f59e0b', mt: 0.5, fontSize: 20 }} />
                            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600, lineHeight: 1.6 }}>
                              {ach}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    Achievements information not available.
                  </Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Mini Timeline (Experience/Education) */}
        {(experiences && experiences.length > 0) && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, background: 'linear-gradient(90deg, #38BDF8, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Timeline
            </Typography>
            <Grid container spacing={3}>
              {experiences.map((exp, idx) => (
                <Grid item xs={12} md={6} key={exp._id || idx}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', position: 'relative', transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 44px rgba(0,0,0,0.4)', borderColor: 'rgba(56,189,248,0.35)' } }}>
                    <Box sx={{ position: 'absolute', left: 16, top: 24, bottom: 24, width: 3, background: 'linear-gradient(180deg, #38BDF8, #818CF8)', borderRadius: 2, opacity: 0.6 }} />
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#e2e8f0' }}>{exp.title}</Typography>
                      <Typography variant="subtitle2" sx={{ color: '#93c5fd', fontWeight: 700 }}>{exp.company}</Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                        {new Date(exp.from).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </Typography>
                      {exp.description && (
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{exp.description}</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Chip label="Open to opportunities" sx={{ mr: 2, background: 'linear-gradient(90deg, #38BDF8, #818CF8)', color: 'white', fontWeight: 700 }} />
          <Chip label="View Projects" component={Link} to="/projects" clickable sx={{ borderColor: 'rgba(59,130,246,0.4)', color: '#3b82f6', fontWeight: 700 }} variant="outlined" />
        </Box>
      </Container>
    </Box>
  );
};

export default About;
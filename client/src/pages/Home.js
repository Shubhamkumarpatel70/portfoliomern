import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Tooltip,
  Skeleton,
  Fab
} from '@mui/material';
import {
  Code as CodeIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Brush as BrushIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Launch as LaunchIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { api } from '../api';

const Home = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || '';
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    return url;
  };
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [about, setAbout] = useState(null);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchFeaturedProjects();
    fetchSkills();
    fetchAbout();
  }, []);

  // Handle scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchFeaturedProjects = async () => {
    try {
      const response = await api.get(`/api/projects?featured=true&limit=3`);
      const projects = Array.isArray(response.data) ? response.data : (response.data.projects || []);
      setFeaturedProjects(projects);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      setFeaturedProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbout = async () => {
    try {
      const res = await api.get(`/api/about/public`);
      setAbout(res.data.about || null);
    } catch (err) {
      setAbout(null);
    } finally {
      setAboutLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get(`/api/skills`);
      const list = Array.isArray(res.data) ? res.data : (res.data.skills || res.data || []);
      setSkills(list);
    } catch (err) {
      setSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

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
      icon: <EmailIcon />,
      url: 'mailto:your.email@example.com',
      label: 'Email',
      color: '#ea4335'
    }
  ];

  const stats = [
    { icon: <WorkIcon />, value: '4+', label: 'Years Experience', color: '#3b82f6' },
    { icon: <CodeIcon />, value: '50+', label: 'Projects Completed', color: '#10b981' },
    { icon: <SpeedIcon />, value: '15+', label: 'Technologies', color: '#f59e0b' },
    { icon: <PsychologyIcon />, value: '100%', label: 'Problem Solver', color: '#8b5cf6' }
  ];

  const expertiseAreas = [
    { title: 'Frontend Development', icon: <CodeIcon />, color: '#3b82f6' },
    { title: 'Backend Development', icon: <CodeIcon />, color: '#10b981' },
    { title: 'Database Design', icon: <CodeIcon />, color: '#f59e0b' },
    { title: 'UI/UX Design', icon: <CodeIcon />, color: '#8b5cf6' }
  ];

  return (
    <Box sx={{ background: '#0f172a', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: '#e2e8f0',
          py: { xs: 6, sm: 8, md: 12 },
          minHeight: { xs: '85vh', sm: '88vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4} alignItems="center" direction={{ xs: 'column', sm: 'row' }} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <Grid item xs={12} sm={7}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? 'h4' : 'h2'}
                  component="h1"
                  gutterBottom
                  sx={{ 
                    fontWeight: 900,
                    mb: 1.5,
                    fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3rem', lg: '3.6rem' },
                    lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                    background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 6px 14px rgba(0,0,0,0.25)',
                    wordBreak: 'break-word'
                  }}
                >
                  {aboutLoading ? 'Loading…' : `Hi, I'm ${about?.name || 'Your Name'}`}
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    opacity: 0.95,
                    fontWeight: 700,
                    color: '#94a3b8',
                    lineHeight: { xs: 1.3, sm: 1.4 }
                  }}
                >
                  Full Stack Developer
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9, 
                    lineHeight: { xs: 1.6, sm: 1.7 },
                    color: '#cbd5e1',
                    maxWidth: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    textAlign: { xs: 'left', sm: 'left' }
                  }}
                >
                  {aboutLoading
                    ? 'Building delightful digital experiences with a focus on quality and impact.'
                    : (about?.bio || 'I create beautiful, functional, and user-centered digital experiences. Passionate about clean code and innovative solutions that make a difference.')}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1.5, sm: 2 }, 
                  flexWrap: 'wrap', 
                  mb: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'flex-start' }
                }}>
                  <Button
                    component={Link}
                    to="/projects"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                      color: '#0F172A',
                      fontWeight: 800,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      borderRadius: 3,
                      boxShadow: '0 8px 18px rgba(56,189,248,0.25)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    View My Work
                  </Button>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(90deg, #22c55e 0%, #38BDF8 100%)',
                      color: '#0F172A',
                      fontWeight: 800,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      borderRadius: 3,
                      boxShadow: '0 8px 18px rgba(34,197,94,0.25)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #38BDF8 0%, #22c55e 100%)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Hire Me
                  </Button>
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(148, 163, 184, 0.5)',
                      color: '#e2e8f0',
                      fontWeight: 700,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#e2e8f0',
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    About Me
                  </Button>
                </Box>
                
                {/* Social Links */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 1.5 }, 
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Tooltip title={social.label} arrow>
                        <IconButton
                          component="a"
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#e2e8f0',
                            bgcolor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(148,163,184,0.3)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.12)',
                              color: '#fff',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 18px rgba(2,6,23,0.35)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </Tooltip>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={5}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ textAlign: 'center' }}
              >
                <Box component={motion.div} animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} sx={{ 
                  position: 'relative', 
                  width: { xs: 140, sm: 180, md: 220, lg: 240 }, 
                  height: { xs: 140, sm: 180, md: 220, lg: 240 }, 
                  mx: { xs: 'auto', sm: 0 }, 
                  mb: 0,
                  mt: { xs: 3, sm: 0 }
                }}>
                  <Box component={motion.div} animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} sx={{
                    position: 'absolute', inset: -10, borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #38BDF8, #818CF8, #38BDF8)',
                    filter: 'blur(10px)', opacity: 0.6
                  }} />
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
                  <Avatar
                    src={getImageUrl(about?.photoUrl || about?.user?.avatar || '')}
                    alt={about?.name || 'Profile'}
                    sx={{
                      width: '100%', height: '100%',
                      mx: 'auto',
                      border: '3px solid rgba(255,255,255,0.2)',
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiAvatar-img': {
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }
                    }}
                  >
                    {about?.name ? about.name.charAt(0).toUpperCase() : <CodeIcon sx={{ fontSize: 'inherit' }} />}
                  </Avatar>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, sm: 8 }, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={6} md={3} key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        minHeight: { xs: 120, sm: 140, md: 180 },
                        width: '100%',
                        maxWidth: 420,
                        mx: 'auto',
                        p: { xs: 2, sm: 2.5, md: 4 },
                        borderRadius: { xs: 2, sm: 3, md: 4 },
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                          background: 'rgba(255, 255, 255, 0.08)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { xs: 50, sm: 60 },
                          height: { xs: 50, sm: 60 },
                          borderRadius: '50%',
                          background: `radial-gradient(circle at 60% 40%, ${stat.color}cc 60%, #222b 100%)`,
                          mx: 'auto',
                          mb: { xs: 1.5, sm: 2 },
                          color: 'white',
                          boxShadow: `0 8px 25px ${stat.color}40`
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          mb: 1,
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#cbd5e1',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          lineHeight: { xs: 1.2, sm: 1.4 }
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
        </Container>
      </Box>

      {/* Expertise Areas */}
      <Box sx={{ py: { xs: 6, sm: 8 }, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 800,
                mb: { xs: 3, sm: 4, md: 5 },
                color: 'white',
                letterSpacing: 1.5,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
              }}
            >
              Areas of Expertise
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {expertiseAreas.map((area, index) => (
                <Grid item xs={12} sm={6} md={3} key={area.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        minHeight: { xs: 120, sm: 140, md: 180 },
                        width: '100%',
                        maxWidth: 420,
                        mx: 'auto',
                        p: { xs: 2, sm: 2.5, md: 4 },
                        borderRadius: { xs: 2, sm: 3, md: 4 },
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                          background: 'rgba(255, 255, 255, 0.08)'
                        }
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
                          background: `radial-gradient(circle at 60% 40%, ${area.color}cc 60%, #222b 100%)`,
                          mx: 'auto',
                          mb: 2,
                          color: 'white',
                          boxShadow: `0 8px 25px ${area.color}40`
                        }}
                      >
                        {area.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'white'
                        }}
                      >
                        {area.title}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={{ py: { xs: 6, sm: 8 }, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontWeight: 800,
              mb: { xs: 3, sm: 4, md: 5 },
              color: 'white',
              letterSpacing: 1.5,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
            }}
          >
            Skills & Technologies
          </Typography>
          {skillsLoading ? (
            <Typography align="center" color="#cbd5e1">Loading skills...</Typography>
          ) : (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 },
              justifyContent: 'center',
              mb: 2,
              px: { xs: 1, sm: 0 }
            }}>
              {skills.map(skill => (
                <Button
                  key={skill._id}
                  variant={selectedSkill === skill._id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSkill(skill._id)}
                  sx={{
                    borderRadius: 2.5,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.8, sm: 1, md: 1.2 },
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.15rem' },
                    color: selectedSkill === skill._id ? theme.palette.primary.main : theme.palette.text.secondary,
                    background: selectedSkill === skill._id ? theme.palette.accent.main : 'transparent',
                    borderColor: selectedSkill === skill._id ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: selectedSkill === skill._id ? '0 4px 16px rgba(59, 130, 246, 0.4)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: selectedSkill === skill._id ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)',
                      color: selectedSkill === skill._id ? theme.palette.primary.contrastText : 'white',
                      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                >
                  {skill.name}
                </Button>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Featured Projects Section */}
      <Box sx={{ py: { xs: 6, sm: 8 }, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{ 
                mb: { xs: 3, sm: 4, md: 6 },
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
              }}
            >
              Featured Projects
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography variant="h6" color="#cbd5e1">Loading featured projects...</Typography>
              </Box>
            ) : featuredProjects.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {featuredProjects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-10px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            background: 'rgba(255, 255, 255, 0.08)'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height={{ xs: 160, sm: 180, md: 200 }}
                          image={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'}
                          alt={project.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <StarIcon sx={{ color: '#f59e0b', mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            <Typography variant="h5" component="h3" sx={{ 
                              fontWeight: 700, 
                              color: 'white', 
                              flex: 1,
                              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                              lineHeight: { xs: 1.3, sm: 1.4 }
                            }}>
                              {project.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            mb: 2, 
                            lineHeight: { xs: 1.5, sm: 1.6 }, 
                            color: '#cbd5e1',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}>
                            {project.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {project.technologies && project.technologies.slice(0, 3).map((tech) => (
                              <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#3b82f6',
                                  color: '#3b82f6',
                                  fontWeight: 500,
                                  bgcolor: 'rgba(59, 130, 246, 0.1)'
                                }}
                              />
                            ))}
                            {project.technologies && project.technologies.length > 3 && (
                              <Chip
                                label={`+${project.technologies.length - 3} more`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#64748b',
                                  color: '#64748b'
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            {project.githubUrl && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<GitHubIcon />}
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                  flex: 1,
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  color: '#e2e8f0',
                                  '&:hover': {
                                    borderColor: 'white',
                                    color: 'white'
                                  }
                                }}
                              >
                                Code
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<LaunchIcon />}
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                  flex: 1,
                                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)'
                                  }
                                }}
                              >
                                Live Demo
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="#cbd5e1" sx={{ mb: 2 }}>
                  No featured projects available
                </Typography>
                <Typography variant="body1" color="#94a3b8">
                  Check back later for featured projects or visit the Projects page to see all projects.
                </Typography>
              </Box>
            )}
            
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                component={Link}
                to="/projects"
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                View All Projects
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ 
              mb: { xs: 3, sm: 4, md: 6 },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
            }}
          >
            Let's Connect
          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ 
              mb: { xs: 3, sm: 4, md: 6 }, 
              maxWidth: 600, 
              mx: 'auto', 
              color: '#cbd5e1',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: { xs: 1.4, sm: 1.5 }
            }}
          >
            I'm always interested in new opportunities and exciting projects.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: { xs: 2, sm: 3 }, 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' }
          }}>
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={social.icon}
                size="large"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#e2e8f0',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  width: { xs: '200px', sm: 'auto' },
                  '&:hover': {
                    borderColor: 'white',
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {social.label}
              </Button>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
            '&:hover': {
              background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
              transform: 'translateY(-2px)'
            },
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)'
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Home;
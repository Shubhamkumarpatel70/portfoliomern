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
  Fab,
  alpha,
  Skeleton
} from '@mui/material';
import {
  Code as CodeIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Work as WorkIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Launch as LaunchIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.07) 0%, transparent 40%)',
        pointerEvents: 'none'
      }
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: '90vh', sm: '95vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 4, sm: 6, md: 0 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Typography
                  variant={isMobile ? 'h4' : 'h2'}
                  component="h1"
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { 
                      xs: '2rem', 
                      sm: '2.5rem', 
                      md: '3rem', 
                      lg: '3.5rem' 
                    },
                    lineHeight: 1.2,
                    background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: { xs: 'center', md: 'left' }
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
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    color: '#94a3b8',
                    fontWeight: 600,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Full Stack Developer
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 4, 
                    color: '#cbd5e1',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    maxWidth: 600,
                    textAlign: { xs: 'center', md: 'left' },
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  {aboutLoading
                    ? 'Building delightful digital experiences with a focus on quality and impact.'
                    : (about?.bio || 'I create beautiful, functional, and user-centered digital experiences. Passionate about clean code and innovative solutions that make a difference.')}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap', 
                  mb: 4,
                  justifyContent: { xs: 'center', md: 'flex-start' }
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
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(56, 189, 248, 0.6)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    View My Work
                  </Button>
                  
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: '#e2e8f0',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#e2e8f0',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Contact Me
                  </Button>
                </Box>
                
                {/* Social Links */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  justifyContent: { xs: 'center', md: 'flex-start' }
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
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              transform: 'translateY(-2px)'
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
            
            <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 2 }, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ 
                  position: 'relative', 
                  width: { xs: 200, sm: 280, md: 320 }, 
                  height: { xs: 200, sm: 280, md: 320 }, 
                  mx: 'auto',
                  mb: { xs: 4, md: 0 }
                }}>
                  <Box 
                    component={motion.div}
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity }
                    }}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      right: -10,
                      bottom: -10,
                      borderRadius: '50%',
                      border: '2px solid rgba(56, 189, 248, 0.3)',
                      animation: 'pulse 3s infinite'
                    }}
                  />
                  
                  <Avatar
                    src={getImageUrl(about?.photoUrl || about?.user?.avatar || '')}
                    alt={about?.name || 'Profile'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: '4px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                      backgroundColor: 'primary.main',
                      fontSize: '4rem'
                    }}
                  >
                    {about?.name ? about.name.charAt(0).toUpperCase() : <CodeIcon />}
                  </Avatar>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, position: 'relative' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={6} md={3} key={stat.label}>
                  <motion.div variants={fadeIn}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                          mb: 2,
                          color: 'white'
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          mb: 1
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#cbd5e1',
                          fontWeight: 500
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

      {/* Skills Section */}
      <Box sx={{ py: 8, background: 'rgba(15, 23, 42, 0.7)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 6,
                color: 'white'
              }}
            >
              Skills & Technologies
            </Typography>
            
            {skillsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                {[...Array(12)].map((_, i) => (
                  <Skeleton 
                    key={i} 
                    variant="rounded" 
                    width={100} 
                    height={40} 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'center',
                maxWidth: 800,
                mx: 'auto'
              }}>
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Chip
                      label={skill.name}
                      variant={selectedSkill === skill._id ? "filled" : "outlined"}
                      onClick={() => setSelectedSkill(selectedSkill === skill._id ? null : skill._id)}
                      sx={{
                        borderRadius: 2,
                        py: 2,
                        fontWeight: 600,
                        backgroundColor: selectedSkill === skill._id ? 'primary.main' : 'transparent',
                        color: selectedSkill === skill._id ? '#0f172a' : '#e2e8f0',
                        borderColor: selectedSkill === skill._id ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: selectedSkill === skill._id ? 'primary.dark' : 'rgba(255, 255, 255, 0.1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Featured Projects Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 6,
                color: 'white'
              }}
            >
              Featured Projects
            </Typography>

            {loading ? (
              <Grid container spacing={3}>
                {[...Array(3)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton 
                      variant="rounded" 
                      width="100%" 
                      height={300} 
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : featuredProjects.length > 0 ? (
              <Grid container spacing={3}>
                {featuredProjects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'}
                            alt={project.title}
                            sx={{
                              objectFit: 'cover',
                              borderTopLeftRadius: 2,
                              borderTopRightRadius: 2
                            }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12
                          }}>
                            <StarIcon sx={{ color: '#f59e0b' }} />
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Typography 
                            variant="h6" 
                            component="h3" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'white', 
                              mb: 2,
                              minHeight: 64
                            }}
                          >
                            {project.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#cbd5e1', 
                              mb: 3,
                              minHeight: 72,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
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
                                  borderColor: 'rgba(56, 189, 248, 0.5)',
                                  color: '#38BDF8',
                                  fontWeight: 500,
                                  backgroundColor: 'rgba(56, 189, 248, 0.1)'
                                }}
                              />
                            ))}
                            {project.technologies && project.technologies.length > 3 && (
                              <Chip
                                label={`+${project.technologies.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'rgba(255, 255, 255, 0.7)'
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
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
                                  background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                                  color: '#0F172A',
                                  '&:hover': {
                                    background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)'
                                  }
                                }}
                              >
                                Demo
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
                <Typography variant="body2" color="#94a3b8">
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
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
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
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'white'
              }}
            >
              Let's Connect
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                mb: 5,
                color: '#cbd5e1',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.7
              }}
            >
              I'm always interested in new opportunities and exciting projects.
              Let's build something amazing together!
            </Typography>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mb: 5
            }}>
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Button
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
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {social.label}
                  </Button>
                </motion.div>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={Link}
                to="/contact"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                  color: '#0F172A',
                  fontWeight: 600,
                  px: 5,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(56, 189, 248, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get In Touch
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)'
            }
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Home;
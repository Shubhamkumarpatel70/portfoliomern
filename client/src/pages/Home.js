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
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Palette as PaletteIcon,
  ViewQuilt as ViewQuiltIcon,
  Storage as StorageIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { TypeAnimation } from 'react-type-animation';
import Tilt from 'react-parallax-tilt';

const Home = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || '';
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Use a more robust check for local vs. remote URLs
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    return url;
  };
  
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
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
      setProjectsLoading(false);
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

  const socialLinks = [];
  if (about?.user?.social?.github) {
    socialLinks.push({
      icon: <GitHubIcon />,
      url: about.user.social.github,
      label: 'GitHub'
    });
  }
  if (about?.user?.social?.linkedin) {
    socialLinks.push({
      icon: <LinkedInIcon />,
      url: about.user.social.linkedin,
      label: 'LinkedIn'
    });
  }
  if (about?.user?.email) {
    socialLinks.push({
      icon: <EmailIcon />,
      url: `mailto:${about.user.email}`,
      label: 'Email'
    });
  }

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
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-20%',
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 40%)',
        pointerEvents: 'none'
      }
    }}>
      {aboutLoading || projectsLoading || skillsLoading ? (
        <LoadingSpinner message="Building the future..." />
      ) : (
        <>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          py: { xs: 4, sm: 6, md: 0 },
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
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                      lineHeight: 1.1,
                      color: 'white',
                      mb: 1,
                    }}
                  >
                    {about?.name || 'Your Name'}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 3,
                      height: { xs: 60, sm: 40 },
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                    }}
                  >
                    <TypeAnimation
                      sequence={[
                        'Full Stack Developer', 2000,
                        'React Specialist', 2000,
                        'Node.js Expert', 2000,
                        'Creative Problem Solver', 2000,
                      ]}
                      wrapper="span"
                      cursor={true}
                      repeat={Infinity}
                    />
                  </Typography>
                </Box>
                
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 4, 
                    color: '#94a3b8',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    maxWidth: 600,
                    textAlign: { xs: 'center', md: 'left' },
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  {about?.bio || 'I create beautiful, functional, and user-centered digital experiences. Passionate about clean code and innovative solutions that make a difference.'}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap', 
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <Button
                    component="a"
                    href="#contact"
                    variant="contained"
                    size="large"
                    endIcon={<EmailIcon />}
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
                    }}
                  >
                    Contact Me
                  </Button>
                  
                  {about?.resumeUrl && (
                    <Button
                      component="a"
                      href={getImageUrl(about.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="large"
                      startIcon={<GetAppIcon />}
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
                        },
                      }}
                    >
                      My Resume
                    </Button>
                  )}
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
                  width: { xs: 240, sm: 300, md: 360 }, 
                  height: { xs: 240, sm: 300, md: 360 }, 
                  mx: 'auto',
                  mb: { xs: 4, md: 0 },
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
                      border: '2px dashed rgba(56, 189, 248, 0.3)',
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

      {/* Services Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'rgba(15, 23, 42, 0.7)' }}>
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
              sx={{ fontWeight: 700, mb: 1, color: 'white' }}
            >
              What I Do
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: '#94a3b8', mb: 6, maxWidth: '600px', mx: 'auto' }}
            >
              I specialize in creating high-quality web applications, from the user interface to the server-side logic.
            </Typography>
            <ServicesSection />
          </motion.div>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <SkillsSection skills={skills} />
          </motion.div>
        </Container>
      </Box>

      {/* Featured Projects Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'rgba(15, 23, 42, 0.7)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <FeaturedProjectsSection projects={featuredProjects} />
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }} id="contact">
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <CTASection />
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
      </>
      )}
    </Box>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <ViewQuiltIcon sx={{ fontSize: 36, color: 'white' }} />,
      title: 'Frontend Development',
      description: 'I specialize in building beautiful and performant user interfaces. From single-page applications to complex dashboards, I bring designs to life with clean, efficient code.',
      color: '#3b82f6',
      tech: ['React', 'Next.js', 'Redux', 'MUI']
    },
    {
      icon: <StorageIcon sx={{ fontSize: 36, color: 'white' }} />,
      title: 'Backend Development',
      description: 'I architect and develop robust, scalable server-side applications, RESTful APIs, and database systems.',
      color: '#10b981',
      tech: ['Node.js', 'Express', 'MongoDB', 'JWT']
    },
    {
      icon: <PaletteIcon sx={{ fontSize: 36, color: 'white' }} />,
      title: 'UI/UX Design',
      description: 'I create visually appealing and user-friendly designs, focusing on a clean user experience and accessibility.',
      color: '#f59e0b',
      tech: ['Figma', 'MUI', 'Prototyping', 'User Research']
    },
  ];

  return (
    <Grid container spacing={4}>
      {services.map((service, index) => (
        <Grid item xs={12} md={4} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  background: 'rgba(51, 65, 85, 0.8)',
                  borderColor: service.color,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.25), 0 0 25px ${alpha(service.color, 0.2)}`,
                },
              }}
            >
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                background: `linear-gradient(135deg, ${service.color} 0%, ${alpha(service.color, 0.7)} 100%)`,
                boxShadow: `0 4px 20px ${alpha(service.color, 0.3)}`
              }}>
                {service.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1.5 }}>
                {service.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, flexGrow: 1, mb: 3 }}>
                {service.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                {service.tech.map(t => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    sx={{
                      bgcolor: alpha(service.color, 0.1),
                      color: service.color,
                      fontWeight: 600,
                      border: `1px solid ${alpha(service.color, 0.2)}`
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

const SkillsSection = ({ skills }) => (
  <>
    <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6, color: 'white' }}>
      Skills & Technologies
    </Typography>
    <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
      {skills.map((skill, index) => (
        <Grid item xs={4} sm={3} md={2} key={skill._id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            style={{ height: '100%' }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar
                src={skill.icon}
                alt={skill.name}
                sx={{
                  width: { xs: 40, sm: 48, md: 56 },
                  height: { xs: 40, sm: 48, md: 56 },
                  p: 1,
                  bgcolor: 'transparent',
                  '& .MuiAvatar-img': {
                    objectFit: 'contain',
                  },
                }}
              />
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#cbd5e1',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                {skill.name}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </>
);

const FeaturedProjectsSection = ({ projects, loading }) => {
  const projectSkeletons = Array.from(new Array(3));

  return (
    <>
      <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6, color: 'white' }}>
        Featured Projects
      </Typography>
      <Grid container spacing={4}>
        {(loading ? projectSkeletons : projects).map((project, index) => (
          <Grid item xs={12} md={4} key={project?._id || index}>
            {project ? (
              <Tilt 
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                scale={1.02}
                transitionSpeed={400}
                perspective={1000}
                style={{ height: '100%', width: '100%' }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                  }
                }}>
                  <CardMedia component="img" image={project.image} alt={project.title} sx={{ height: 200, objectFit: 'cover' }} />
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, flexGrow: 1 }}>
                      {project.description.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {project.technologies?.slice(0, 3).map(tech => (
                        <Chip key={tech} label={tech} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', fontWeight: 500 }} />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                      {project.githubUrl && <Button size="small" variant="outlined" startIcon={<GitHubIcon />} href={project.githubUrl} target="_blank">Code</Button>}
                      {project.liveUrl && <Button size="small" variant="contained" startIcon={<LaunchIcon />} href={project.liveUrl} target="_blank">Demo</Button>}
                    </Box>
                  </CardContent>
                </Card>
              </Tilt>
            ) : (
              <Skeleton variant="rectangular" sx={{ borderRadius: 4, bgcolor: 'grey.900' }} height={400} />
            )}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          component={Link}
          to="/projects"
          variant="outlined"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{ borderRadius: '10px' }}>
          View All Projects
        </Button>
      </Box>
    </>
  );
};

const CTASection = () => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 4, md: 6 },
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(129, 140, 248, 0.1) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
    }}
  >
    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
      Have a project in mind?
    </Typography>
    <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4, maxWidth: '600px', mx: 'auto' }}>
      I'm currently available for freelance work and open to discussing new projects. Let's create something amazing together.
    </Typography>
    <Button
      component={Link}
      to="/contact"
      variant="contained"
      size="large"
      endIcon={<ArrowForwardIcon />}
      sx={{
        background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
        color: '#0F172A',
        fontWeight: 700,
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
  </Paper>
);

export default Home;
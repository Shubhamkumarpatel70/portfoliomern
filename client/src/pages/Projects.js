import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Paper,
  Skeleton,
  IconButton,
  Tooltip,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  Star as StarIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { api } from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    category: 'web'
  });

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'desktop', label: 'Desktop Apps' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      const projectsData = response.data.projects || response.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image || '',
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        category: project.category || 'web'
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        category: 'web'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      if (editingProject) {
        await api.put(`/api/projects/${editingProject._id}`, projectData);
      } else {
        await api.post('/api/projects', projectData);
      }
      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${projectId}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterProjects = () => {
    if (!Array.isArray(projects)) return [];
    
    return projects.filter(project => {
      if (!project) return false;
      
      const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (Array.isArray(project.technologies) && project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredProjects = filterProjects();

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        py: { xs: 4, sm: 6, md: 8, lg: 10 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
            <Skeleton variant="text" width={{ xs: '80%', sm: '60%' }} height={{ xs: 40, sm: 50, md: 60 }} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton variant="text" width={{ xs: '90%', sm: '80%' }} height={{ xs: 30, sm: 35, md: 40 }} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </Box>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={item}>
                <Skeleton variant="rectangular" height={{ xs: 280, sm: 300, md: 320 }} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)' }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'transparent',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8, lg: 10 },
          textAlign: 'center',
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
            opacity: 0.35,
          }
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3.25rem', xl: '3.75rem' },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                px: { xs: 1, sm: 0 }
              }}
            >
              My Projects
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: { xs: '100%', sm: 600, md: 700 }, 
                mx: 'auto',
                fontWeight: 600,
                color: '#cbd5e1',
                mb: { xs: 3, sm: 4, md: 5 },
                lineHeight: 1.4,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              A collection of my work showcasing various technologies and innovative solutions
            </Typography>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Chip 
                  label="Admin Mode" 
                  icon={<StarIcon />}
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }} 
                />
              </motion.div>
            )}
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: { xs: 4, sm: 5, md: 6 },
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: { xs: 2, sm: 3 }
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }}>
              {/* Search Field */}
              <Box sx={{ flex: { xs: '1', md: '1' } }}>
                <TextField
                  fullWidth
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: '#94a3b8' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 2, sm: 3 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0',
                      '&:hover': { background: 'rgba(255,255,255,0.1)' },
                      '&.Mui-focused': { background: 'rgba(255,255,255,0.12)' }
                    }
                  }}
                />
              </Box>

              {/* Category Filters */}
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 1.5 }, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                {isSmallMobile ? (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: '#94a3b8' }}>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                      sx={{
                        color: '#e2e8f0',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: { xs: 2, sm: 3 },
                          background: 'rgba(255,255,255,0.06)',
                        }
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  categories.map((category) => (
                    <Chip
                      key={category.value}
                      label={category.label}
                      onClick={() => setSelectedCategory(category.value)}
                      variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 2,
                        px: { xs: 1, sm: 1.5 },
                        color: selectedCategory === category.value ? '#0F172A' : '#cbd5e1',
                        bgcolor: selectedCategory === category.value ? '#38BDF8' : 'transparent',
                        borderColor: 'rgba(148,163,184,0.3)',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        '&:hover': { bgcolor: selectedCategory === category.value ? '#38BDF8' : 'rgba(255,255,255,0.06)' }
                      }}
                    />
                  ))
                )}
              </Box>

              {/* Add Project Button */}
              {isAdmin && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  minWidth: { xs: '100%', md: 'auto' }
                }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                      background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                      fontWeight: 800,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      borderRadius: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: '#0F172A',
                      boxShadow: '0 8px 25px rgba(56, 189, 248, 0.25)',
                      '&:hover': { background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)', transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease',
                      width: { xs: '100%', md: 'auto' }
                    }}
                  >
                    Add Project
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>
        </motion.div>

        {/* Projects Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
              }}
            >
              Showing {filteredProjects.length} of {projects.length} projects
            </Typography>
          </Box>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {filteredProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={project._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: { xs: 2, sm: 3 },
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                        '& .project-image': {
                          transform: 'scale(1.05)'
                        }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height={{ xs: 180, sm: 200, md: 220 }}
                        image={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'}
                        alt={project.title}
                        className="project-image"
                        sx={{
                          transition: 'transform 0.3s ease',
                          objectFit: 'cover'
                        }}
                      />
                      {isAdmin && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: 8, sm: 12 },
                            right: { xs: 8, sm: 12 },
                            display: 'flex',
                            gap: { xs: 0.5, sm: 1 }
                          }}
                        >
                          <Tooltip title="Edit Project">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(project)}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                color: '#38BDF8',
                                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)', transform: 'scale(1.1)' },
                                transition: 'all 0.3s ease',
                                width: { xs: 28, sm: 32 },
                                height: { xs: 28, sm: 32 }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Project">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(project._id)}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                color: '#ef4444',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)', transform: 'scale(1.1)' },
                                transition: 'all 0.3s ease',
                                width: { xs: 28, sm: 32 },
                                height: { xs: 28, sm: 32 }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#e2e8f0',
                          mb: { xs: 1.5, sm: 2 },
                          lineHeight: 1.3,
                          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' }
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: { xs: 2, sm: 3 }, 
                          lineHeight: 1.6,
                          color: '#94a3b8',
                          fontSize: { xs: '0.875rem', sm: '0.95rem' }
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: { xs: 2, sm: 3 } }}>
                        {project.technologies && project.technologies.slice(0, isSmallMobile ? 3 : 4).map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: '#93c5fd',
                              fontWeight: 600,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              border: '1px solid rgba(59, 130, 246, 0.35)',
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                        ))}
                        {project.technologies && project.technologies.length > (isSmallMobile ? 3 : 4) && (
                          <Chip
                            label={`+${project.technologies.length - (isSmallMobile ? 3 : 4)} more`}
                            size="small"
                            sx={{
                              background: 'rgba(100, 116, 139, 0.15)',
                              color: '#cbd5e1',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 1, sm: 1.5 }, 
                        mt: 'auto',
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        {project.githubUrl && (
                          <Button
                            size="small"
                            variant="outlined"
                            component="a"
                            href={project.githubUrl}
                            target="_blank"
                            startIcon={<GitHubIcon />}
                            sx={{ 
                              flex: 1,
                              borderColor: '#38BDF8',
                              color: '#38BDF8',
                              fontWeight: 600,
                              borderRadius: { xs: 1.5, sm: 2 },
                              '&:hover': {
                                borderColor: '#7dd3fc',
                                backgroundColor: 'rgba(56, 189, 248, 0.12)'
                              },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            Code
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button
                            size="small"
                            variant="contained"
                            component="a"
                            href={project.liveUrl}
                            target="_blank"
                            startIcon={<LaunchIcon />}
                            sx={{ 
                              flex: 1,
                              background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                              fontWeight: 700,
                              borderRadius: { xs: 1.5, sm: 2 },
                              color: '#0F172A',
                              '&:hover': { background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)' },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 6, lg: 8 },
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: { xs: 2, sm: 3 },
                color: '#e2e8f0'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #64748b, #94a3b8)',
                  mx: 'auto',
                  mb: { xs: 2, sm: 3 },
                  color: 'white'
                }}
              >
                <CodeIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                No projects found
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: { xs: 3, sm: 4 },
                  color: '#cbd5e1',
                  maxWidth: { xs: '100%', sm: 500 },
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 2, sm: 0 }
                }}
              >
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                  : isAdmin 
                    ? 'No projects have been added yet. Start by adding your first project!'
                    : 'Projects will be displayed here when added by an admin.'
                }
              </Typography>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    fontWeight: 700,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Add First Project
                </Button>
              )}
            </Paper>
          </motion.div>
        )}
      </Container>

      {/* Add/Edit Project Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            borderRadius: isSmallMobile ? 0 : 3,
            background: 'rgba(15, 23, 42, 0.96)',
            color: '#e2e8f0',
            backdropFilter: 'blur(10px)',
            m: isSmallMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 800,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          p: { xs: 2, sm: 3 }
        }}>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Project Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  multiline
                  rows={isSmallMobile ? 4 : 3}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="image"
                  label="Image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="technologies"
                  label="Technologies (comma-separated)"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="githubUrl"
                  label="GitHub URL"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="liveUrl"
                  label="Live Demo URL"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#94a3b8' }}>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: { xs: 1.5, sm: 2 },
                        background: 'rgba(255,255,255,0.06)',
                        color: '#e2e8f0'
                      } 
                    }}
                  >
                    <MenuItem value="web">Web Development</MenuItem>
                    <MenuItem value="mobile">Mobile Apps</MenuItem>
                    <MenuItem value="desktop">Desktop Apps</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={handleCloseDialog} 
              sx={{ 
                fontWeight: 700,
                color: '#94a3b8'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                color: '#0F172A',
                fontWeight: 800,
                px: { xs: 3, sm: 4 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: { xs: 1.5, sm: 2 },
                '&:hover': { background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)' }
              }}
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects; 
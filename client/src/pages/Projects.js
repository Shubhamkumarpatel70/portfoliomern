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
  Divider,
  Fade
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
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
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
  const isExtraSmall = useMediaQuery('(max-width:400px)');

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

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        py: { xs: 3, sm: 4, md: 6 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
            <Skeleton 
              variant="rounded" 
              width={{ xs: '70%', sm: '50%', md: '40%' }} 
              height={60} 
              sx={{ mx: 'auto', mb: 2, borderRadius: 3 }} 
            />
            <Skeleton 
              variant="rounded" 
              width={{ xs: '90%', sm: '70%', md: '60%' }} 
              height={40} 
              sx={{ mx: 'auto', borderRadius: 3 }} 
            />
          </Box>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton 
                  variant="rectangular" 
                  height={320} 
                  sx={{ borderRadius: 3 }} 
                />
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
      minHeight: '100vh',
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            color: 'white',
            py: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            mb: { xs: 3, sm: 4, md: 5 }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
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
                mb: { xs: 2, sm: 3 },
                fontSize: { 
                  xs: '2rem', 
                  sm: '2.5rem', 
                  md: '3rem', 
                  lg: '3.5rem' 
                },
                lineHeight: 1.2
              }}
            >
              My Projects
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: 600, 
                mx: 'auto',
                fontWeight: 400,
                color: '#cbd5e1',
                mb: { xs: 3, sm: 4 },
                lineHeight: 1.6,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              A collection of my work showcasing various technologies and innovative solutions
            </Typography>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Chip 
                  label="Admin Mode" 
                  icon={<StarIcon />}
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem',
                    borderRadius: 2
                  }} 
                />
              </motion.div>
            )}
          </motion.div>
        </Box>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: { xs: 4, sm: 5 },
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 3
            }}
          >
            <Stack 
              spacing={2} 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              {/* Search Field */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#94a3b8' }} />,
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  maxWidth: { sm: 300 },
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.06)',
                    color: '#e2e8f0',
                    '&:hover': { background: 'rgba(255,255,255,0.1)' },
                    '&.Mui-focused': { background: 'rgba(255,255,255,0.12)' }
                  }
                }}
              />

              {/* Category Filters */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                {isExtraSmall ? (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: '#94a3b8' }}>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                      sx={{
                        color: '#e2e8f0',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.2)'
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
                        color: selectedCategory === category.value ? '#0F172A' : '#cbd5e1',
                        bgcolor: selectedCategory === category.value ? '#38BDF8' : 'transparent',
                        borderColor: 'rgba(148,163,184,0.3)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        '&:hover': { 
                          bgcolor: selectedCategory === category.value ? '#38BDF8' : 'rgba(255,255,255,0.06)' 
                        }
                      }}
                    />
                  ))
                )}
              </Box>

              {/* Add Project Button */}
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    color: '#0F172A',
                    boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
                    '&:hover': { 
                      background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(56, 189, 248, 0.4)'
                    },
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto'
                  }}
                >
                  Add Project
                </Button>
              )}
            </Stack>
          </Paper>
        </motion.div>

        {/* Projects Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                fontWeight: 500
              }}
            >
              Showing {filteredProjects.length} of {projects.length} projects
            </Typography>
          </Box>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                        '& .project-image': {
                          transform: 'scale(1.05)'
                        }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'}
                        alt={project.title}
                        className="project-image"
                        sx={{
                          transition: 'transform 0.5s ease',
                          objectFit: 'cover'
                        }}
                      />
                      {isAdmin && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            gap: 1
                          }}
                        >
                          <Tooltip title="Edit Project">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(project)}
                              sx={{
                                bgcolor: 'rgba(15, 23, 42, 0.7)',
                                backdropFilter: 'blur(10px)',
                                color: '#38BDF8',
                                '&:hover': { 
                                  bgcolor: 'rgba(56, 189, 248, 0.2)',
                                  transform: 'scale(1.1)' 
                                },
                                transition: 'all 0.3s ease',
                                borderRadius: 2
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
                                bgcolor: 'rgba(15, 23, 42, 0.7)',
                                backdropFilter: 'blur(10px)',
                                color: '#ef4444',
                                '&:hover': { 
                                  bgcolor: 'rgba(239, 68, 68, 0.2)',
                                  transform: 'scale(1.1)' 
                                },
                                transition: 'all 0.3s ease',
                                borderRadius: 2
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#e2e8f0',
                          mb: 2,
                          lineHeight: 1.3
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 3, 
                          lineHeight: 1.6,
                          color: '#94a3b8'
                        }}
                      >
                        {project.description.length > 100 
                          ? `${project.description.substring(0, 100)}...` 
                          : project.description
                        }
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5, 
                        mb: 3 
                      }}>
                        {project.technologies && project.technologies.slice(0, 4).map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: '#93c5fd',
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              height: 24,
                              borderRadius: 1.5
                            }}
                          />
                        ))}
                        {project.technologies && project.technologies.length > 4 && (
                          <Chip
                            label={`+${project.technologies.length - 4}`}
                            size="small"
                            sx={{
                              background: 'rgba(100, 116, 139, 0.15)',
                              color: '#cbd5e1',
                              fontSize: '0.7rem',
                              height: 24,
                              borderRadius: 1.5
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        mt: 'auto'
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
                              borderColor: 'rgba(56, 189, 248, 0.5)',
                              color: '#38BDF8',
                              fontWeight: 500,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: '#7dd3fc',
                                backgroundColor: 'rgba(56, 189, 248, 0.1)'
                              }
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
                              fontWeight: 600,
                              borderRadius: 2,
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 3
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
                  background: 'linear-gradient(45deg, #64748b, #94a3b8)',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <CodeIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  mb: 2
                }}
              >
                No projects found
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  color: '#cbd5e1',
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.6
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
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
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
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            m: isSmallMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {editingProject ? 'Edit Project' : 'Add New Project'}
          <IconButton 
            onClick={handleCloseDialog}
            sx={{ color: '#94a3b8' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
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
                      borderRadius: 2,
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
                  rows={3}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
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
                      borderRadius: 2,
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
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="githubUrl"
                  label="GitHub URL"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0'
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="liveUrl"
                  label="Live Demo URL"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
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
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': { 
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
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog} 
              sx={{ 
                fontWeight: 500,
                color: '#94a3b8',
                borderRadius: 2
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
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': { 
                  background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)' 
                }
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

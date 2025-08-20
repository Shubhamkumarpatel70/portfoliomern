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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  Star as StarIcon
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
      const response = await api.get('/projects');
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
        await api.put(`/projects/${editingProject._id}`, projectData);
      } else {
        await api.post('/projects', projectData);
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
        await api.delete(`/projects/${projectId}`);
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
        py: { xs: 6, md: 10 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </Box>
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)' }} />
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
          py: { xs: 6, md: 10 },
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
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              My Projects
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: 700, 
                mx: 'auto',
                fontWeight: 600,
                color: '#cbd5e1',
                mb: 4,
                lineHeight: 1.4
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
                    px: 2,
                    py: 1,
                    fontSize: '1rem'
                  }} 
                />
              </motion.div>
            )}
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 6,
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 3
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={5}>
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
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0',
                      '&:hover': { background: 'rgba(255,255,255,0.1)' },
                      '&.Mui-focused': { background: 'rgba(255,255,255,0.12)' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {categories.map((category) => (
                    <Chip
                      key={category.value}
                      label={category.label}
                      onClick={() => setSelectedCategory(category.value)}
                      variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 2,
                        px: 1.5,
                        color: selectedCategory === category.value ? '#0F172A' : '#cbd5e1',
                        bgcolor: selectedCategory === category.value ? '#38BDF8' : 'transparent',
                        borderColor: 'rgba(148,163,184,0.3)',
                        fontWeight: 700,
                        '&:hover': { bgcolor: selectedCategory === category.value ? '#38BDF8' : 'rgba(255,255,255,0.06)' }
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              {isAdmin ? (
                <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                      background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                      fontWeight: 800,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      color: '#0F172A',
                      boxShadow: '0 8px 25px rgba(56, 189, 248, 0.25)',
                      '&:hover': { background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)', transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Add Project
                  </Button>
                </Grid>
              ) : isAuthenticated && (
                <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Admin access required to add projects
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Paper>
        </motion.div>

        {/* Projects Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                fontWeight: 600
              }}
            >
              Showing {filteredProjects.length} of {projects.length} projects
            </Typography>
          </Box>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <Grid container spacing={4}>
            {filteredProjects.map((project, index) => (
              <Grid item xs={12} md={6} lg={4} key={project._id}>
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
                      borderRadius: 3,
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
                        height="220"
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
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                color: '#38BDF8',
                                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)', transform: 'scale(1.1)' },
                                transition: 'all 0.3s ease'
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
                                transition: 'all 0.3s ease'
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
                        variant="h5" 
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
                          color: '#94a3b8',
                          fontSize: '0.95rem'
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {project.technologies && project.technologies.slice(0, 4).map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: '#93c5fd',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              border: '1px solid rgba(59, 130, 246, 0.35)'
                            }}
                          />
                        ))}
                        {project.technologies && project.technologies.length > 4 && (
                          <Chip
                            label={`+${project.technologies.length - 4} more`}
                            size="small"
                            sx={{
                              background: 'rgba(100, 116, 139, 0.15)',
                              color: '#cbd5e1',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
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
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: '#7dd3fc',
                                backgroundColor: 'rgba(56, 189, 248, 0.12)'
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
                              fontWeight: 700,
                              borderRadius: 2,
                              color: '#0F172A',
                              '&:hover': { background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)' }
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
                p: { xs: 4, md: 8 },
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 3,
                color: '#e2e8f0'
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
                  mb: 3,
                  color: 'white'
                }}
              >
                <CodeIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
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
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(15, 23, 42, 0.96)',
            color: '#e2e8f0',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 800,
          fontSize: '1.5rem'
        }}>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
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
                px: 4,
                py: 1,
                borderRadius: 2,
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
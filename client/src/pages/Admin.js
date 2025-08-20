import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
  Tabs,
  Tab,
  Avatar,
  TableSortLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { api } from '../api';

const emptyProject = {
  title: '',
  description: '',
  image: '',
  technologies: '',
  category: 'web',
  githubUrl: '',
  liveUrl: '',
  status: 'completed',
  featured: false,
  tags: '',
};
const emptyExperience = {
  title: '',
  company: '',
  location: '',
  from: '',
  to: '',
  current: false,
  description: '',
  industry: '',
  employmentType: 'full-time',
  companyWebsite: '',
};
const emptyAbout = {
  name: '',
  bio: '',
  location: '',
  website: '',
  skills: '',
};

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [about, setAbout] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '', name: '' });
  const [projectDialog, setProjectDialog] = useState({ open: false, edit: false, data: emptyProject });
  const [experienceDialog, setExperienceDialog] = useState({ open: false, edit: false, data: emptyExperience });
  const [aboutDialog, setAboutDialog] = useState({ open: false, data: emptyAbout });
  const [skillDialog, setSkillDialog] = useState({ 
    open: false, 
    edit: false, 
    data: { _id: '', name: '', category: '', level: 'Beginner', icon: '', order: 0, percent: '' } 
  });
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');
  const [contactStatusFilter, setContactStatusFilter] = useState('All');
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, projectsRes, experiencesRes, skillsRes, contactsRes, aboutRes] = await Promise.all([
        api.get('/api/auth/users'),
        api.get('/api/projects'),
        api.get('/api/experiences'),
        api.get('/api/skills'),
        api.get('/api/contacts'),
        api.get('/api/about/me').catch(() => ({ data: null }))
      ]);

      setUsers(usersRes.data);
      setProjects(projectsRes.data.projects || projectsRes.data);
      setExperiences(experiencesRes.data.experiences || experiencesRes.data);
      setSkills(skillsRes.data.skills || skillsRes.data);
      setContacts(contactsRes.data.contacts || contactsRes.data);
      setAbout(aboutRes.data?.about || null);

      // Calculate stats
      const totalUsers = usersRes.data.length;
      const totalProjects = projectsRes.data.projects?.length || projectsRes.data.length;
      const totalExperiences = experiencesRes.data.experiences?.length || experiencesRes.data.length;
      const activeUsers = usersRes.data.filter(u => u.isActive).length;

      setStats({
        totalUsers,
        activeUsers,
        totalProjects,
        totalExperiences,
        inactiveUsers: totalUsers - activeUsers
      });
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { type, id } = deleteDialog;
      let endpoint = '';
      
      switch (type) {
        case 'user':
          endpoint = `/api/auth/users/${id}`;
          break;
        case 'project':
          endpoint = `/api/projects/${id}`;
          break;
        case 'experience':
          endpoint = `/api/experiences/${id}`;
          break;
        default:
          return;
      }

      await api.delete(endpoint);
      setDeleteDialog({ open: false, type: '', id: '', name: '' });
      fetchData(); // Refresh data
    } catch (error) {
      setError('Failed to delete item');
      console.error('Error deleting:', error);
    }
  };

  // Project handlers
  const handleProjectDialogOpen = (edit = false, data = emptyProject) => {
    setProjectDialog({ open: true, edit, data: edit ? { ...data, technologies: data.technologies?.join(', ') ?? '' , tags: data.tags?.join(', ') ?? '' } : emptyProject });
  };
  const handleProjectDialogClose = () => setProjectDialog({ open: false, edit: false, data: emptyProject });
  const handleProjectChange = e => setProjectDialog(d => ({ ...d, data: { ...d.data, [e.target.name]: e.target.value } }));
  const handleProjectSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...projectDialog.data,
        user: user._id,
      };
      if (projectDialog.edit) {
        await api.put(`/api/projects/${projectDialog.data._id}`, payload);
      } else {
        await api.post('/api/projects', payload);
      }
      handleProjectDialogClose();
      fetchData();
    } catch (err) {
      setError('Failed to save project');
    }
  };

  // Experience handlers
  const handleExperienceDialogOpen = (edit = false, data = emptyExperience) => {
    setExperienceDialog({ open: true, edit, data: edit ? { ...data, from: data.from?.slice(0,10) ?? '', to: data.to?.slice(0,10) ?? '' } : emptyExperience });
  };
  const handleExperienceDialogClose = () => setExperienceDialog({ open: false, edit: false, data: emptyExperience });
  const handleExperienceChange = e => setExperienceDialog(d => ({ ...d, data: { ...d.data, [e.target.name]: e.target.value } }));
  const handleExperienceSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...experienceDialog.data,
        from: new Date(experienceDialog.data.from),
        to: experienceDialog.data.to ? new Date(experienceDialog.data.to) : null,
        user: user._id,
      };
      if (experienceDialog.edit) {
        await api.put(`/api/experiences/${experienceDialog.data._id}`, payload);
      } else {
        await api.post('/api/experiences', payload);
      }
      handleExperienceDialogClose();
      fetchData();
    } catch (err) {
      setError('Failed to save experience');
    }
  };

  // About handlers
  const handleAboutDialogOpen = () => {
    if (about) {
      setAboutDialog({ 
        open: true, 
        data: { 
          ...about, 
          skills: about.skills?.join(', ') ?? '',
          achievements: about.achievements?.join(', ') ?? ''
        } 
      });
    } else {
      setAboutDialog({ open: true, data: emptyAbout });
    }
  };
  const handleAboutDialogClose = () => setAboutDialog({ open: false, data: emptyAbout });
  const handleAboutChange = e => setAboutDialog(d => ({ ...d, data: { ...d.data, [e.target.name]: e.target.value } }));
  const handleAboutSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...aboutDialog.data,
      };
      if (about) {
        await api.put('/api/about/me', payload);
      } else {
        await api.post('/api/about/me', payload);
      }
      handleAboutDialogClose();
      fetchData();
    } catch (err) {
      setError('Failed to update about info');
    }
  };

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const form = new FormData();
      form.append('avatar', file);
      // include auth token header already set in context
      await api.put('/api/auth/profile/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchData();
    } catch (err) {
      setError('Failed to upload avatar');
    }
  };

  // Resume upload (PDF)
  const handleResumeUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const form = new FormData();
      form.append('resume', file);
      await api.put('/api/about/me/resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchData();
    } catch (err) {
      setError('Failed to upload resume');
    }
  };

  // Skill category options
  const skillCategories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const filteredSkills = skillCategoryFilter === 'All' ? skills : (Array.isArray(skills) ? skills.filter(s => s.category === skillCategoryFilter) : []);

  // Contact status options
  const contactStatuses = ['All', 'new', 'read', 'archived'];
  const filteredContacts = contactStatusFilter === 'All' ? contacts : (Array.isArray(contacts) ? contacts.filter(c => c.status === contactStatusFilter) : []);

  const handleContactStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/contacts/${id}`, { status });
      fetchData();
    } catch (err) {
      setError('Failed to update contact status');
    }
  };

  const handleContactDelete = async (id) => {
    try {
      await api.delete(`/api/contacts/${id}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  // Skill handlers
  const handleSkillDialogOpen = (edit = false, data = { _id: '', name: '', category: '', level: 'Beginner', icon: '', order: 0, percent: '' }) => {
    setSkillDialog({
      open: true,
      edit,
      data: edit ? {
        _id: data._id || '',
        name: data.name || '',
        category: data.category || '',
        level: data.level || 'Beginner',
        icon: data.icon || '',
        order: typeof data.order === 'number' ? data.order : 0,
        percent: data.percent !== undefined && data.percent !== null ? data.percent : ''
      } : { _id: '', name: '', category: '', level: 'Beginner', icon: '', order: 0, percent: '' }
    });
  };

  const handleSkillDialogClose = () => setSkillDialog({ 
    open: false, 
    edit: false, 
    data: { _id: '', name: '', category: '', level: 'Beginner', icon: '', order: 0, percent: '' } 
  });

  const handleSkillChange = e => setSkillDialog(d => ({ ...d, data: { ...d.data, [e.target.name]: e.target.value } }));

  const handleSkillSubmit = async e => {
    e.preventDefault();
    try {
      // Build payload with only valid percent
      const { _id, name, category, level, icon, order, percent } = skillDialog.data;
      const payload = {
        name: name || '',
        category: category || '',
        level: level || 'Beginner',
        icon: icon || '',
        order: typeof order === 'number' ? order : 0,
        user: user._id
      };
      if (percent !== '' && percent !== undefined && percent !== null && !isNaN(Number(percent))) {
        payload.percent = Math.max(0, Math.min(100, Number(percent)));
      } else {
        payload.percent = null;
      }
      if (skillDialog.edit) {
        await api.put(`/api/skills/${_id}`, payload);
      } else {
        await api.post('/api/skills', payload);
      }
      handleSkillDialogClose();
      fetchData();
    } catch (err) {
      setError('Failed to save skill');
    }
  };

  const handleSkillDelete = async (id) => {
    try {
      await api.delete(`/api/skills/${id}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete skill');
    }
  };

  const handleToggleFeatured = async (projectId, currentFeatured) => {
    try {
      await api.put(`/api/projects/${projectId}/feature`);
      fetchData(); // Refresh data to show updated status
    } catch (err) {
      setError('Failed to toggle featured status');
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          color: 'white',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {value}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {title}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
              )}
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {trend > 0 ? '+' : ''}{trend}% from last month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, projects, and experiences
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} lg={3}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<PeopleIcon sx={{ fontSize: '2rem' }} />}
                color="#667eea"
                trend={5}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StatCard
                title="Active Users"
                value={stats.activeUsers}
                icon={<PeopleIcon sx={{ fontSize: '2rem' }} />}
                color="#10b981"
                trend={12}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={<WorkIcon sx={{ fontSize: '2rem' }} />}
                color="#f59e0b"
                trend={8}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StatCard
                title="Total Experiences"
                value={stats.totalExperiences}
                icon={<BusinessIcon sx={{ fontSize: '2rem' }} />}
                color="#ef4444"
                trend={-2}
              />
            </Grid>
          </Grid>

          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }
              }}
            >
              <Tab label="Users" />
              <Tab label="Projects" />
              <Tab label="Experiences" />
              <Tab label="Skills" />
              <Tab label="Contacts" />
              <Tab label="About" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {tabValue === 0 && (
            <>
              {user && user.role === 'admin' && (
                <Button variant="contained" color="secondary" sx={{ mb: 2 }} onClick={handleAboutDialogOpen}>
                  Edit About
                </Button>
              )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={user.avatar || undefined} 
                              sx={{ 
                                bgcolor: theme.palette.primary.main,
                                width: 40,
                                height: 40,
                                '& .MuiAvatar-img': {
                                  objectFit: 'cover',
                                  width: '100%',
                                  height: '100%',
                                }
                              }}
                            >
                              {user.name ? user.name.charAt(0).toUpperCase() : ''}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={user.role === 'admin' ? 'error' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isActive ? 'Active' : 'Inactive'}
                            color={user.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => setDeleteDialog({
                              open: true,
                              type: 'user',
                              id: user._id,
                              name: user.name
                            })}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                          {user._id === (user && user._id) && (
                            <>
                              <input id={`avatar-input`} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                              <label htmlFor={`avatar-input`}>
                                <Button component="span" size="small" variant="outlined" sx={{ ml: 1 }}>Upload Avatar</Button>
                              </label>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 1 && (
            <>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => handleProjectDialogOpen(false)}>
                Add Project
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Featured</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project._id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {project.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={project.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.status}
                            color={project.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleToggleFeatured(project._id, project.featured)}
                            color={project.featured ? 'warning' : 'default'}
                            size="small"
                            title={project.featured ? 'Unfeature' : 'Feature'}
                          >
                            {project.featured ? <StarIcon /> : <StarBorderIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{project.views || 0}</TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleProjectDialogOpen(true, project)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => setDeleteDialog({
                                open: true,
                                type: 'project',
                                id: project._id,
                                name: project.title
                              })}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 2 && (
            <>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => handleExperienceDialogOpen(false)}>
                Add Experience
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Position</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {experiences.map((experience) => (
                      <TableRow key={experience._id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {experience.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{experience.company}</TableCell>
                        <TableCell>{experience.dateRange}</TableCell>
                        <TableCell>
                          <Chip
                            label={experience.current ? 'Current' : 'Past'}
                            color={experience.current ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(experience.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleExperienceDialogOpen(true, experience)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => setDeleteDialog({
                                open: true,
                                type: 'experience',
                                id: experience._id,
                                name: experience.title
                              })}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 3 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleSkillDialogOpen(false)}>
                  Add Skill
                </Button>
                <FormControl size="small">
                  <InputLabel>Category</InputLabel>
                  <Select value={skillCategoryFilter} label="Category" onChange={e => setSkillCategoryFilter(e.target.value)}>
                    {skillCategories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Icon</TableCell>
                      <TableCell>Order</TableCell>
                      <TableCell>Percent</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(filteredSkills) && filteredSkills.map((skill) => (
                      <TableRow key={skill._id}>
                        <TableCell>{skill.name}</TableCell>
                        <TableCell>{skill.category}</TableCell>
                        <TableCell>{skill.level}</TableCell>
                        <TableCell>{skill.icon ? <img src={skill.icon} alt={skill.name} style={{ width: 32, height: 32 }} /> : '-'}</TableCell>
                        <TableCell>{skill.order}</TableCell>
                        <TableCell>{skill.percent}%</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleSkillDialogOpen(true, skill)} color="primary" size="small"><EditIcon /></IconButton>
                          <IconButton onClick={() => handleSkillDelete(skill._id)} color="error" size="small"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 4 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <FormControl size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={contactStatusFilter} label="Status" onChange={e => setContactStatusFilter(e.target.value)}>
                    {contactStatuses.map(st => (
                      <MenuItem key={st} value={st}>{st}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(filteredContacts) && filteredContacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.message}</TableCell>
                        <TableCell>
                          <Select
                            value={contact.status}
                            onChange={e => handleContactStatusUpdate(contact._id, e.target.value)}
                            size="small"
                          >
                            <MenuItem value="new">new</MenuItem>
                            <MenuItem value="read">read</MenuItem>
                            <MenuItem value="archived">archived</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(contact.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleContactDelete(contact._id)} color="error" size="small"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 5 && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="secondary" onClick={handleAboutDialogOpen}>
                  Edit About
                </Button>
                <input id="resume-input" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleResumeUpload} />
                <label htmlFor="resume-input">
                  <Button component="span" variant="outlined">Upload Resume (PDF)</Button>
                </label>
                {about?.resume && (
                  <Button 
                    variant="contained" 
                    onClick={() => window.open(about.resume, '_blank')}
                  >
                    View Resume
                  </Button>
                )}
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Bio</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Website</TableCell>
                      <TableCell>Skills</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{about?.name}</TableCell>
                      <TableCell>{about?.bio}</TableCell>
                      <TableCell>{about?.location}</TableCell>
                      <TableCell>{about?.website}</TableCell>
                      <TableCell>{about?.skills?.join(', ')}</TableCell>
                      <TableCell>
                        <IconButton onClick={handleAboutDialogOpen} color="primary" size="small"><EditIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this {deleteDialog.type}?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {deleteDialog.name}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Project Dialog */}
        <Dialog open={projectDialog.open} onClose={handleProjectDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>{projectDialog.edit ? 'Edit Project' : 'Add Project'}</DialogTitle>
          <form onSubmit={handleProjectSubmit}>
            <DialogContent>
              <TextField margin="normal" label="Title" name="title" value={projectDialog.data.title} onChange={handleProjectChange} fullWidth required />
              <TextField margin="normal" label="Description" name="description" value={projectDialog.data.description} onChange={handleProjectChange} fullWidth required multiline rows={3} />
              <TextField margin="normal" label="Image URL" name="image" value={projectDialog.data.image} onChange={handleProjectChange} fullWidth required />
              <TextField margin="normal" label="Technologies (comma separated)" name="technologies" value={projectDialog.data.technologies} onChange={handleProjectChange} fullWidth required />
              <TextField margin="normal" label="Category" name="category" value={projectDialog.data.category} onChange={handleProjectChange} fullWidth />
              <TextField margin="normal" label="GitHub URL" name="githubUrl" value={projectDialog.data.githubUrl} onChange={handleProjectChange} fullWidth />
              <TextField margin="normal" label="Live URL" name="liveUrl" value={projectDialog.data.liveUrl} onChange={handleProjectChange} fullWidth />
              <TextField margin="normal" label="Status" name="status" value={projectDialog.data.status} onChange={handleProjectChange} fullWidth />
              <TextField margin="normal" label="Tags (comma separated)" name="tags" value={projectDialog.data.tags} onChange={handleProjectChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleProjectDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">{projectDialog.edit ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* Experience Dialog */}
        <Dialog open={experienceDialog.open} onClose={handleExperienceDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>{experienceDialog.edit ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          <form onSubmit={handleExperienceSubmit}>
            <DialogContent>
              <TextField margin="normal" label="Title" name="title" value={experienceDialog.data.title} onChange={handleExperienceChange} fullWidth required />
              <TextField margin="normal" label="Company" name="company" value={experienceDialog.data.company} onChange={handleExperienceChange} fullWidth required />
              <TextField margin="normal" label="Location" name="location" value={experienceDialog.data.location} onChange={handleExperienceChange} fullWidth />
              <TextField margin="normal" label="From" name="from" type="date" value={experienceDialog.data.from} onChange={handleExperienceChange} fullWidth InputLabelProps={{ shrink: true }} required />
              <TextField margin="normal" label="To" name="to" type="date" value={experienceDialog.data.to} onChange={handleExperienceChange} fullWidth InputLabelProps={{ shrink: true }} />
              <TextField margin="normal" label="Description" name="description" value={experienceDialog.data.description} onChange={handleExperienceChange} fullWidth multiline rows={3} />
              <TextField margin="normal" label="Industry" name="industry" value={experienceDialog.data.industry} onChange={handleExperienceChange} fullWidth />
              <TextField margin="normal" label="Employment Type" name="employmentType" value={experienceDialog.data.employmentType} onChange={handleExperienceChange} fullWidth />
              <TextField margin="normal" label="Company Website" name="companyWebsite" value={experienceDialog.data.companyWebsite} onChange={handleExperienceChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleExperienceDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">{experienceDialog.edit ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* About Dialog */}
        <Dialog open={aboutDialog.open} onClose={handleAboutDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>Edit About</DialogTitle>
          <form onSubmit={handleAboutSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField margin="normal" label="Name" name="name" value={aboutDialog.data.name} onChange={handleAboutChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField margin="normal" label="Location" name="location" value={aboutDialog.data.location} onChange={handleAboutChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" label="Bio" name="bio" value={aboutDialog.data.bio} onChange={handleAboutChange} fullWidth multiline rows={3} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" label="Website" name="website" value={aboutDialog.data.website} onChange={handleAboutChange} fullWidth placeholder="https://example.com" />
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" label="Skills (comma separated)" name="skills" value={aboutDialog.data.skills} onChange={handleAboutChange} fullWidth placeholder="React, Node.js, MongoDB, etc." />
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" label="Achievements (comma separated)" name="achievements" value={aboutDialog.data.achievements} onChange={handleAboutChange} fullWidth multiline rows={3} placeholder="Led development of 10+ successful web applications, Mentored 5 junior developers, etc." />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAboutDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">Update</Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* Skill Dialog */}
        <Dialog open={skillDialog.open} onClose={handleSkillDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>{skillDialog.edit ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          <form onSubmit={handleSkillSubmit}>
            <DialogContent>
              <TextField margin="normal" label="Name" name="name" value={skillDialog.data.name || ''} onChange={handleSkillChange} fullWidth required />
              <TextField margin="normal" label="Category" name="category" value={skillDialog.data.category || ''} onChange={handleSkillChange} fullWidth required />
              <FormControl fullWidth margin="normal">
                <InputLabel>Level</InputLabel>
                <Select name="level" value={skillDialog.data.level || 'Beginner'} label="Level" onChange={handleSkillChange} required>
                  {skillLevels.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField margin="normal" label="Icon URL" name="icon" value={skillDialog.data.icon || ''} onChange={handleSkillChange} fullWidth />
              <TextField margin="normal" label="Order" name="order" type="number" value={typeof skillDialog.data.order === 'number' ? skillDialog.data.order : 0} onChange={handleSkillChange} fullWidth />
              <TextField margin="normal" label="Percent" name="percent" type="number" inputProps={{ min: 0, max: 100 }} value={skillDialog.data.percent} onChange={handleSkillChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSkillDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">{skillDialog.edit ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Admin;
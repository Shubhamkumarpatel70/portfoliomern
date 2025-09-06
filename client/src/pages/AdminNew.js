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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  LinearProgress,
  CircularProgress,
  Tooltip,
  Badge,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Switch,
  FormControlLabel,
  useMediaQuery
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
  StarBorder as StarBorderIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Code as CodeIcon,
  ContactMail as ContactMailIcon,
  Person as PersonIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import NewsletterManagement from '../components/NewsletterManagement';

const AdminNew = () => {
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
  const [success, setSuccess] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [socials, setSocials] = useState({ github: '', linkedin: '', twitter: '', instagram: '' });
  const [savingSocials, setSavingSocials] = useState(false);
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '', name: '' });
  const [projectDialog, setProjectDialog] = useState({ open: false, edit: false, data: {} });
  const [experienceDialog, setExperienceDialog] = useState({ open: false, edit: false, data: {} });
  const [skillDialog, setSkillDialog] = useState({ open: false, edit: false, data: {} });
  const [aboutDialog, setAboutDialog] = useState({ open: false, data: {} });
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      if (aboutRes.data?.about?.user?.social) {
        setSocials(aboutRes.data.about.user.social);
      }

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

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    setError(''); // Clear any previous errors

    try {
      console.log('Uploading avatar:', file.name, file.size, file.type);
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.put('/api/auth/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Avatar upload response:', response.data);

      // Update local user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        
        // Show success message
        setError(''); // Clear any errors
        setSuccess('Avatar uploaded successfully!');
        console.log('Avatar uploaded successfully:', response.data.avatar);
        
        // Refresh the page to update UI
        window.location.reload();
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      
      let errorMessage = 'Failed to upload avatar';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your connection';
        console.error('Network error:', error.request);
      } else {
        // Other error
        errorMessage = error.message || errorMessage;
        console.error('Other error:', error);
      }
      
      setError(errorMessage);
    } finally {
      setUploadingAvatar(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file for the resume.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB');
      return;
    }

    setUploadingResume(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/api/about/me/resume', formData);
      setSuccess('Resume uploaded successfully!');
      fetchData(); // Refresh data to get the new resume URL
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSocialsChange = (e) => {
    const { name, value } = e.target;
    setSocials(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSocials = async () => {
    if (!about?.user?._id) {
      setError('User information is not available to save social links.');
      return;
    }
    setSavingSocials(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/auth/users/${about.user._id}/socials`, socials);
      setSuccess('Social links updated successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update social links.');
    } finally {
      setSavingSocials(false);
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
        case 'skill':
          endpoint = `/api/skills/${id}`;
          break;
        default:
          return;
      }

      await api.delete(endpoint);
      setDeleteDialog({ open: false, type: '', id: '', name: '' });
      fetchData(); // Refresh data
    } catch (error) {
      setError('Failed to delete item: ' + (error.response?.data?.message || error.message));
      console.error('Error deleting:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette[color].main}15, ${theme.palette[color].light}15)`,
          border: `1px solid ${theme.palette[color].main}20`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${theme.palette[color].main}25`,
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
                color: 'white'
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>
            {trend && (
              <Chip
                icon={trend > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${Math.abs(trend)}%`}
                size="small"
                color={trend > 0 ? 'success' : 'error'}
                variant="outlined"
              />
            )}
          </Box>
          <Typography variant="h4" component="div" fontWeight="bold" color="text.primary" mb={1}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading Dashboard..." />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Professional Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <DashboardIcon sx={{ mr: { xs: 1, sm: 2 }, color: 'white' }} />
            <Typography 
              variant={isSmallMobile ? "h6" : "h6"} 
              component="div" 
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {isSmallMobile ? 'Admin' : 'Admin Dashboard'}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={fetchData} 
                sx={{ color: 'white' }}
                disabled={loading}
                size={isSmallMobile ? "small" : "medium"}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={uploadingAvatar ? "Uploading..." : "Upload Avatar"}>
              <IconButton 
                component="label" 
                sx={{ 
                  color: 'white',
                  opacity: uploadingAvatar ? 0.6 : 1,
                  '&:hover': {
                    opacity: uploadingAvatar ? 0.6 : 0.8
                  }
                }}
                disabled={uploadingAvatar}
                size={isSmallMobile ? "small" : "medium"}
              >
                {uploadingAvatar ? (
                  <Box sx={{ width: 20, height: 20 }}>
                    <CircularProgress size={20} color="inherit" />
                  </Box>
                ) : (
                  <UploadIcon />
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </IconButton>
            </Tooltip>
            
            {!isSmallMobile && (
              <Tooltip title="Account Settings">
                <IconButton sx={{ color: 'white' }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ color: 'white' }} size={isSmallMobile ? "small" : "medium"}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: { xs: 2, sm: 3 }, display: { xs: 'none', sm: 'flex' } }}>
          <Link 
            color="inherit" 
            href="/" 
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </Link>
          <Typography color="text.primary">Admin Dashboard</Typography>
        </Breadcrumbs>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={PeopleIcon}
              trend={5}
              color="primary"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers || 0}
              icon={PersonIcon}
              trend={12}
              color="success"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              title="Total Projects"
              value={stats.totalProjects || 0}
              icon={WorkIcon}
              trend={8}
              color="info"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              title="Total Experiences"
              value={stats.totalExperiences || 0}
              icon={BusinessIcon}
              trend={-2}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Card sx={{ borderRadius: { xs: 2, sm: 3 }, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {/* Enhanced Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                '& .MuiTab-root': {
                  minHeight: { xs: 48, sm: 64 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab 
                icon={<PeopleIcon />} 
                label={isSmallMobile ? "Users" : "Users"} 
                iconPosition="start"
              />
              <Tab 
                icon={<WorkIcon />} 
                label={isSmallMobile ? "Projects" : "Projects"} 
                iconPosition="start"
              />
              <Tab 
                icon={<BusinessIcon />} 
                label={isSmallMobile ? "Exp" : "Experiences"} 
                iconPosition="start"
              />
              <Tab 
                icon={<CodeIcon />} 
                label={isSmallMobile ? "Skills" : "Skills"} 
                iconPosition="start"
              />
              <Tab 
                icon={<ContactMailIcon />} 
                label={isSmallMobile ? "Contact" : "Contacts"} 
                iconPosition="start"
              />
              <Tab 
                icon={<PersonIcon />} 
                label={isSmallMobile ? "About" : "About"} 
                iconPosition="start"
              />
              <Tab 
                icon={<EmailIcon />} 
                label={isSmallMobile ? "Newsletter" : "Newsletter"} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {tabValue === 0 && (
              <UsersTab 
                users={users} 
                onRefresh={fetchData} 
                onDelete={(id, name) => setDeleteDialog({ open: true, type: 'user', id, name })}
              />
            )}
            {tabValue === 1 && (
              <ProjectsTab 
                projects={projects} 
                onRefresh={fetchData}
                onEdit={(data) => setProjectDialog({ open: true, edit: !!data, data: data || {} })}
                onDelete={(id, name) => setDeleteDialog({ open: true, type: 'project', id, name })}
              />
            )}
            {tabValue === 2 && (
              <ExperiencesTab 
                experiences={experiences} 
                onRefresh={fetchData}
                onEdit={(data) => setExperienceDialog({ open: true, edit: !!data, data: data || {} })}
                onDelete={(id, name) => setDeleteDialog({ open: true, type: 'experience', id, name })}
              />
            )}
            {tabValue === 3 && (
              <SkillsTab 
                skills={skills} 
                onRefresh={fetchData}
                onEdit={(data) => setSkillDialog({ open: true, edit: !!data, data: data || {} })}
                onDelete={(id, name) => setDeleteDialog({ open: true, type: 'skill', id, name })}
              />
            )}
            {tabValue === 4 && (
              <ContactsTab contacts={contacts} onRefresh={fetchData} />
            )}
            {tabValue === 5 && (
              <AboutTab 
                about={about} 
                onRefresh={fetchData}
                onEdit={(data) => setAboutDialog({ open: true, data: data || {} })}
                onResumeUpload={handleResumeUpload}
                uploadingResume={uploadingResume}
                socials={socials}
                onSocialsChange={handleSocialsChange}
                onSaveSocials={handleSaveSocials}
                savingSocials={savingSocials}
              />
            )}
            {tabValue === 6 && (
              <NewsletterManagement />
            )}
          </Box>
        </Card>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.name}"? This action cannot be undone.
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
      <ProjectDialog 
        open={projectDialog.open}
        edit={projectDialog.edit}
        data={projectDialog.data}
        onClose={() => setProjectDialog({ open: false, edit: false, data: {} })}
        onSubmit={async (data) => {
          try {
            if (projectDialog.edit) {
              await api.put(`/api/projects/${data._id}`, data);
            } else {
              await api.post('/api/projects', data);
            }
            setProjectDialog({ open: false, edit: false, data: {} });
            fetchData();
          } catch (error) {
            setError('Failed to save project: ' + (error.response?.data?.message || error.message));
          }
        }}
      />

      {/* Experience Dialog */}
      <ExperienceDialog 
        open={experienceDialog.open}
        edit={experienceDialog.edit}
        data={experienceDialog.data}
        onClose={() => setExperienceDialog({ open: false, edit: false, data: {} })}
        onSubmit={async (data) => {
          try {
            if (experienceDialog.edit) {
              await api.put(`/api/experiences/${data._id}`, data);
            } else {
              await api.post('/api/experiences', data);
            }
            setExperienceDialog({ open: false, edit: false, data: {} });
            fetchData();
          } catch (error) {
            setError('Failed to save experience: ' + (error.response?.data?.message || error.message));
          }
        }}
      />

      {/* About Dialog */}
      <AboutDialog 
        open={aboutDialog.open}
        data={aboutDialog.data}
        onClose={() => setAboutDialog({ open: false, data: {} })}
        onSubmit={async (data) => {
          try {
            if (about) {
              await api.put('/api/about/me', data);
            } else {
              await api.post('/api/about/me', data);
            }
            setAboutDialog({ open: false, data: {} });
            fetchData();
          } catch (error) {
            setError('Failed to save about information: ' + (error.response?.data?.message || error.message));
          }
        }}
      />

      {/* Skill Dialog */}
      <SkillDialog 
        open={skillDialog.open}
        edit={skillDialog.edit}
        data={skillDialog.data}
        onClose={() => setSkillDialog({ open: false, edit: false, data: {} })}
        onSubmit={async (data) => {
          try {
            if (skillDialog.edit) {
              await api.put(`/api/skills/${data._id}`, data);
            } else {
              await api.post('/api/skills', data);
            }
            setSkillDialog({ open: false, edit: false, data: {} });
            fetchData();
          } catch (error) {
            setError('Failed to save skill: ' + (error.response?.data?.message || error.message));
          }
        }}
      />
    </Box>
  );
};

// Tab Components
const UsersTab = ({ users, onRefresh, onDelete }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        User Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
      >
        Refresh
      </Button>
    </Box>
    
    <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                    {user.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight={500}>
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
                  variant="outlined"
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
                <Tooltip title="Delete User">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(user._id, user.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const ProjectsTab = ({ projects, onRefresh, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box>
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }} 
        gap={{ xs: 2, sm: 0 }}
        mb={3}
      >
        <Typography 
          variant={isSmallMobile ? "h6" : "h5"} 
          fontWeight="bold"
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          Project Management
        </Typography>
        <Box 
          display="flex" 
          gap={2} 
          flexDirection={{ xs: 'column', sm: 'row' }}
          width={{ xs: '100%', sm: 'auto' }}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            fullWidth={isSmallMobile}
            size={isSmallMobile ? "small" : "medium"}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onEdit(null)}
            fullWidth={isSmallMobile}
            size={isSmallMobile ? "small" : "medium"}
          >
            Add Project
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
            <Card sx={{ 
              height: '100%', 
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <Box
                sx={{
                  height: { xs: 160, sm: 180, md: 200 },
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <Tooltip title="Edit Project">
                    <IconButton
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                      onClick={() => onEdit(project)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Project">
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                      onClick={() => onDelete(project._id, project.title)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                {project.featured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Featured
                  </Box>
                )}
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography 
                  variant={isSmallMobile ? "h6" : "h6"} 
                  fontWeight="bold" 
                  mb={1}
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    lineHeight: { xs: 1.3, sm: 1.4 }
                  }}
                >
                  {project.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  mb={2}
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: { xs: 1.4, sm: 1.5 }
                  }}
                >
                  {project.description}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {project.technologies?.slice(0, isSmallMobile ? 2 : 3).map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    />
                  ))}
                  {project.technologies?.length > (isSmallMobile ? 2 : 3) && (
                    <Chip 
                      label={`+${project.technologies.length - (isSmallMobile ? 2 : 3)}`} 
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ExperiencesTab = ({ experiences, onRefresh, onEdit, onDelete }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        Experience Management
      </Typography>
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onEdit(null)}
        >
          Add Experience
        </Button>
      </Box>
    </Box>
    
    <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {experiences.map((experience) => (
            <TableRow key={experience._id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {experience.title}
                </Typography>
              </TableCell>
              <TableCell>{experience.company}</TableCell>
              <TableCell>{experience.location}</TableCell>
              <TableCell>
                {new Date(experience.from).toLocaleDateString()} - 
                {experience.current ? 'Present' : new Date(experience.to).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip
                  label={experience.current ? 'Current' : 'Past'}
                  color={experience.current ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="Edit Experience">
                    <IconButton size="small" onClick={() => onEdit(experience)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Experience">
                    <IconButton size="small" color="error" onClick={() => onDelete(experience._id, experience.title)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const SkillsTab = ({ skills, onRefresh, onEdit, onDelete }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        Skills Management
      </Typography>
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onEdit(null)}
        >
          Add Skill
        </Button>
      </Box>
    </Box>
    
    <Grid container spacing={3}>
      {skills.map((skill) => (
        <Grid item xs={12} sm={6} md={4} key={skill._id}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'white'
              }}
            >
              <Typography variant="h4">{skill.name.charAt(0)}</Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              {skill.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {skill.category} • {skill.level}
            </Typography>
            <Box display="flex" justifyContent="center" gap={1}>
              <Tooltip title="Edit Skill">
                <IconButton size="small" onClick={() => onEdit(skill)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Skill">
                <IconButton size="small" color="error" onClick={() => onDelete(skill._id, skill.name)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const ContactsTab = ({ contacts, onRefresh }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        Contact Messages
      </Typography>
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
      >
        Refresh
      </Button>
    </Box>
    
    <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact._id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {contact.name}
                </Typography>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.subject}</TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {contact.message}
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(contact.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const AboutTab = ({ about, onRefresh, onEdit, onResumeUpload, uploadingResume, socials, onSocialsChange, onSaveSocials, savingSocials }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        About Information
      </Typography>
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEdit(about || {})}
        >
          Edit About
        </Button>
      </Box>
    </Box>
    
    {about ? (
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Personal Information
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {about.name}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Bio
              </Typography>
              <Typography variant="body1">
                {about.bio}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">
                {about.location}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Website
              </Typography>
              <Typography variant="body1">
                {about.website}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Skills
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {about.skills?.map((skill, index) => (
                <Chip key={index} label={skill} variant="outlined" />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" mb={2}>
              Resume
            </Typography>
            {about.resumeUrl && (
              <Box mb={2}>
                <Link href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
                  View Current Resume
                </Link>
              </Box>
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={uploadingResume ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
              disabled={uploadingResume}
            >
              {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={onResumeUpload}
              />
            </Button>
            <Typography variant="caption" display="block" mt={1} color="text.secondary">
              Upload a new PDF to replace the existing one.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" mb={2}>
              Social Media Links
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub URL"
                  name="github"
                  value={socials?.github || ''}
                  onChange={onSocialsChange}
                  InputProps={{
                    startAdornment: <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  name="linkedin"
                  value={socials?.linkedin || ''}
                  onChange={onSocialsChange}
                  InputProps={{
                    startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twitter URL"
                  name="twitter"
                  value={socials?.twitter || ''}
                  onChange={onSocialsChange}
                  InputProps={{
                    startAdornment: <TwitterIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Instagram URL"
                  name="instagram"
                  value={socials?.instagram || ''}
                  onChange={onSocialsChange}
                  InputProps={{
                    startAdornment: <InstagramIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>
            <Box mt={3} textAlign="right">
              <Button
                variant="contained"
                onClick={onSaveSocials}
                disabled={savingSocials}
                startIcon={savingSocials ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              >
                {savingSocials ? 'Saving...' : 'Save Social Links'}
              </Button>
            </Box>

          </Grid>
        </Grid>
      </Card>
    ) : (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" mb={2}>
          No about information found
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onEdit({})}
        >
          Add About Information
        </Button>
      </Card>
    )}
  </Box>
);

// Dialog Components (simplified versions)
const ProjectDialog = ({ open, edit, data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(data);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          m: { xs: 2, sm: 3 },
          maxHeight: { xs: '90vh', sm: '80vh' }
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: { xs: '1.25rem', sm: '1.5rem' },
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 }
      }}>
        {edit ? 'Edit Project' : 'Add Project'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '10px' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={isMobile ? 2 : 3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '10px' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '10px' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Technologies (comma separated)"
                value={formData.technologies || ''}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '10px' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '10px' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Live URL"
                value={formData.liveUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '10px' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label="Featured Project"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 2, sm: 2.5 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={onClose}
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            {edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ExperienceDialog = ({ open, edit, data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{edit ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Position Title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={formData.from || ''}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={formData.to || ''}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                InputLabelProps={{ shrink: true }}
                disabled={formData.current}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.current || false}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  />
                }
                label="Current Position"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const AboutDialog = ({ open, data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit About Information</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={formData.skills || ''}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                helperText="Enter skills separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const SkillDialog = ({ open, edit, data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{edit ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={formData.level || 'Beginner'}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  label="Level"
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icon (optional)"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                helperText="Enter an icon name or emoji"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminNew;

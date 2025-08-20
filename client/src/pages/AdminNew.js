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
  Tooltip,
  Badge,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Switch,
  FormControlLabel
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
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
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

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.put('/api/auth/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.reload(); // Refresh to update UI
      }
    } catch (error) {
      setError('Failed to upload avatar');
      console.error('Avatar upload error:', error);
    } finally {
      setUploadingAvatar(false);
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
                borderRadius: 2,
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
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" textAlign="center" mt={2}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
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
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <DashboardIcon sx={{ mr: 2, color: 'white' }} />
            <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={fetchData} 
                sx={{ color: 'white' }}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Upload Avatar">
              <IconButton 
                component="label" 
                sx={{ color: 'white' }}
                disabled={uploadingAvatar}
              >
                <UploadIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account Settings">
              <IconButton sx={{ color: 'white' }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
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
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={PeopleIcon}
              trend={5}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers || 0}
              icon={PersonIcon}
              trend={12}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Projects"
              value={stats.totalProjects || 0}
              icon={WorkIcon}
              trend={8}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
        <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {/* Enhanced Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.875rem',
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
                label="Users" 
                iconPosition="start"
              />
              <Tab 
                icon={<WorkIcon />} 
                label="Projects" 
                iconPosition="start"
              />
              <Tab 
                icon={<BusinessIcon />} 
                label="Experiences" 
                iconPosition="start"
              />
              <Tab 
                icon={<CodeIcon />} 
                label="Skills" 
                iconPosition="start"
              />
              <Tab 
                icon={<ContactMailIcon />} 
                label="Contacts" 
                iconPosition="start"
              />
              <Tab 
                icon={<PersonIcon />} 
                label="About" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <UsersTab users={users} onRefresh={fetchData} />
            )}
            {tabValue === 1 && (
              <ProjectsTab projects={projects} onRefresh={fetchData} />
            )}
            {tabValue === 2 && (
              <ExperiencesTab experiences={experiences} onRefresh={fetchData} />
            )}
            {tabValue === 3 && (
              <SkillsTab skills={skills} onRefresh={fetchData} />
            )}
            {tabValue === 4 && (
              <ContactsTab contacts={contacts} onRefresh={fetchData} />
            )}
            {tabValue === 5 && (
              <AboutTab about={about} onRefresh={fetchData} />
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

// Tab Components
const UsersTab = ({ users, onRefresh }) => (
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
    
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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

const ProjectsTab = ({ projects, onRefresh }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        Project Management
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
        >
          Add Project
        </Button>
      </Box>
    </Box>
    
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project._id}>
          <Card sx={{ height: '100%', position: 'relative' }}>
            <Box
              sx={{
                height: 200,
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
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Project">
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
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
                    fontSize: '0.75rem'
                  }}
                >
                  Featured
                </Box>
              )}
            </Box>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {project.description}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {project.technologies?.slice(0, 3).map((tech, index) => (
                  <Chip key={index} label={tech} size="small" variant="outlined" />
                ))}
                {project.technologies?.length > 3 && (
                  <Chip label={`+${project.technologies.length - 3}`} size="small" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const ExperiencesTab = ({ experiences, onRefresh }) => (
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
        >
          Add Experience
        </Button>
      </Box>
    </Box>
    
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Experience">
                    <IconButton size="small" color="error">
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

const SkillsTab = ({ skills, onRefresh }) => (
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
                <IconButton size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Skill">
                <IconButton size="small" color="error">
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
    
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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

const AboutTab = ({ about, onRefresh }) => (
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
        >
          Add About Information
        </Button>
      </Card>
    )}
  </Box>
);

export default AdminNew;

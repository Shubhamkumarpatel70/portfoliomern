import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  useTheme
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { api } from '../api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/api/experiences');
      // Handle different response formats
      const experiencesData = response.data.experiences || response.data || [];
      setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (experience = null) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        title: experience.title,
        company: experience.company,
        location: experience.location || '',
        from: experience.from.split('T')[0],
        to: experience.to ? experience.to.split('T')[0] : '',
        current: experience.current,
        description: experience.description || ''
      });
    } else {
      setEditingExperience(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExperience(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExperience) {
        await api.put(`/api/experiences/${editingExperience._id}`, formData);
      } else {
        await api.post('/api/experiences', formData);
      }
      fetchExperiences();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Loading experiences...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'transparent',
          color: 'white',
          py: { xs: 6, md: 8 },
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
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              Professional Experience
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: 600, 
                mx: 'auto',
                fontWeight: 600,
                color: '#cbd5e1'
              }}
            >
              My journey through the world of technology and development
            </Typography>
            {isAdmin && (
              <Chip 
                label="Admin Mode" 
                color="success" 
                size="small" 
                sx={{ 
                  mt: 2, 
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: 'white'
                }} 
              />
            )}
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Add Experience Button */}
        {isAdmin ? (
          <Box sx={{ mb: 6, textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add Experience
            </Button>
          </Box>
        ) : isAuthenticated && (
          <Box sx={{ mb: 6, textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Admin access required to add experiences
            </Typography>
          </Box>
        )}

        {/* Experience Timeline */}
        {Array.isArray(experiences) && experiences.length > 0 ? (
          <Box>
            {experiences.map((experience, index) => (
              <motion.div
                key={experience._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    mb: 4,
                    position: 'relative',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 24px 56px rgba(0,0,0,0.45)',
                      borderColor: 'rgba(129,140,248,0.35)',
                      '& .timeline-dot': {
                        transform: 'scale(1.2)',
                        boxShadow: '0 0 24px rgba(99, 102, 241, 0.65)'
                      }
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      left: { xs: 20, md: 40 },
                      top: 60,
                      bottom: -20,
                      width: 3,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      opacity: index === experiences.length - 1 ? 0 : 0.6,
                      borderRadius: 2
                    }
                  }}
                >
                  <CardContent sx={{ pl: { xs: 6, md: 8 }, p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Timeline Dot */}
                      <Box
                        className="timeline-dot"
                        sx={{
                          position: 'absolute',
                          left: { xs: 16, md: 36 },
                          top: 24,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          border: '4px solid white',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                          zIndex: 1,
                          transition: 'all 0.3s ease'
                        }}
                      />
                      
                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Box>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                              {experience.title}
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#93c5fd' }}>
                              {experience.company}
                            </Typography>
                          </Box>
                          {isAdmin && (
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenDialog(experience)}
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                '&:hover': {
                                  bgcolor: 'rgba(99, 102, 241, 0.1)'
                                }
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 3, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {experience.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {experience.current 
                                ? `${formatDate(experience.from)} - Present`
                                : `${formatDate(experience.from)} - ${formatDate(experience.to)}`
                              }
                            </Typography>
                          </Box>
                          {experience.current && (
                            <Chip 
                              label="Current" 
                              color="success" 
                              size="small" 
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Box>
                        
                        {experience.description && (
                          <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                            {experience.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h4" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
              No experience entries yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {isAdmin 
                ? 'Add your first work experience to get started!'
                : 'Experience details will be displayed here when added by an admin.'
              }
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add First Experience
              </Button>
            )}
          </Box>
        )}
      </Container>

      {/* Add/Edit Experience Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingExperience ? 'Edit Experience' : 'Add New Experience'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Job Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="company"
                  label="Company"
                  value={formData.company}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="from"
                  label="From Date"
                  type="date"
                  value={formData.from}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="to"
                  label="To Date"
                  type="date"
                  value={formData.to}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={formData.current}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="current"
                      checked={formData.current}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="I currently work here"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5b21b6, #7c3aed)'
                }
              }}
            >
              {editingExperience ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Experience; 
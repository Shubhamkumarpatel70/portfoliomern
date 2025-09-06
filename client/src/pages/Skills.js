import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Card,
  Avatar,
  LinearProgress,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const levelColor = {
  Beginner: '#94a3b8',
  Intermediate: '#60a5fa',
  Advanced: '#34d399',
  Expert: '#f59e0b'
};

const levelValue = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100,
};

const levelColorHex = {
  Beginner: '#9e9e9e',
  Intermediate: '#2196f3',
  Advanced: '#4caf50',
  Expert: '#ff9800',
};

const Skills = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/api/skills');
        const list = Array.isArray(res.data) ? res.data : (res.data.skills || res.data || []);
        setSkills(list);
        const cats = Array.from(new Set(list.map(s => s.category)));
        setCategories(['All Skills', ...cats]);
      } catch (err) {
        setSkills([]);
        setCategories(['All Skills']);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = selectedCategory === 'All Skills'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  const getSkillPercent = (skill) => {
    if (typeof skill.percent === 'number' && !isNaN(skill.percent)) {
      return Math.max(0, Math.min(100, skill.percent));
    }
    return levelValue[skill.level] || 0;
  };

  // Animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Skills..." />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white', 
      py: { xs: 3, sm: 4, md: 6, lg: 8 },
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.05) 0%, transparent 50%)',
        zIndex: 0
      },
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 1.5, sm: 2 } }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
            <Typography variant={isMobile ? "h4" : "h2"} sx={{ 
              fontWeight: 900, 
              mb: 2, 
              background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 1,
              px: { xs: 1, sm: 2 }
            }}>
              Technical Skills
            </Typography>
            <Typography variant={isMobile ? "body2" : "h6"} sx={{ 
              color: '#94a3b8', 
              mb: { xs: 3, sm: 4 }, 
              fontWeight: 500,
              px: { xs: 1, sm: 2 },
              maxWidth: '600px',
              mx: 'auto'
            }}>
              My expertise across different technologies and frameworks
            </Typography>
            
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                color: '#0F172A',
                fontWeight: 800,
                borderRadius: '10px',
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                boxShadow: '0 6px 18px rgba(56,189,248,0.25)',
                '&:hover': { 
                  background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(56,189,248,0.35)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              View Projects
            </Button>
          </Box>
          
          {/* Category Filter */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: { xs: 3, sm: 4, md: 5 }, 
            flexWrap: 'wrap', 
            gap: 1,
            px: { xs: 0.5, sm: 1 },
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            mx: 'auto',
            maxWidth: '95vw'
          }}>
            {categories.map(cat => (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === cat ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 700,
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.5, sm: 0.75 },
                    background: selectedCategory === cat 
                      ? 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)' 
                      : alpha('#ffffff', 0.08),
                    color: selectedCategory === cat ? '#0F172A' : 'white',
                    boxShadow: selectedCategory === cat 
                      ? '0 6px 20px rgba(56,189,248,0.25)' 
                      : 'none',
                    border: selectedCategory === cat 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.15)',
                    minWidth: 'fit-content',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover': {
                      background: selectedCategory === cat 
                        ? 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)' 
                        : alpha('#ffffff', 0.15),
                      boxShadow: selectedCategory === cat 
                        ? '0 8px 24px rgba(56,189,248,0.35)' 
                        : '0 4px 12px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </Button>
              </motion.div>
            ))}
          </Box>
          
          {/* Skills Grid */}
          {filteredSkills.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid 
                container 
                spacing={{ xs: 1.5, sm: 2, md: 2.5 }} 
                justifyContent="center"
                sx={{ px: { xs: 0.5, sm: 1 } }}
              >
                <AnimatePresence mode="wait">
                  {filteredSkills.map((skill) => (
                    <Grid 
                      item 
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={skill._id}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <motion.div
                        variants={itemVariants}
                        layout
                        style={{ width: '100%', display: 'flex' }}
                      >
                        <Card 
                          sx={{
                            background: alpha('#0f172a', 0.7),
                            borderRadius: { xs: 2, sm: 3 },
                            boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
                            color: 'white',
                            p: { xs: 1.5, sm: 2, md: 2.5 },
                            height: '100%',
                            width: '100%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.38)',
                              borderColor: alpha('#ffffff', 0.2)
                            }
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: { xs: 1.5, sm: 2 },
                            gap: { xs: 1, sm: 1.5 }
                          }}>
                            <Avatar
                              sx={{
                                width: { xs: 36, sm: 44, md: 48 },
                                height: { xs: 36, sm: 44, md: 48 },
                                background: alpha('#ffffff', 0.08),
                                border: `2.5px solid ${levelColorHex[skill.level] || '#9e9e9e'}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                              }}
                            >
                              {skill.icon ? (
                                <img 
                                  src={skill.icon} 
                                  alt={skill.name} 
                                  style={{ 
                                    width: '70%', 
                                    height: '70%', 
                                    objectFit: 'contain'
                                  }} 
                                />
                              ) : (
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {skill.name.charAt(0).toUpperCase()}
                                </Typography>
                              )}
                            </Avatar>
                            <Typography 
                              variant={isMobile ? "body1" : "h6"} 
                              sx={{ 
                                fontWeight: 800, 
                                flex: 1, 
                                letterSpacing: 0.5,
                                fontSize: { 
                                  xs: '0.9rem', 
                                  sm: '1rem', 
                                  md: '1.1rem' 
                                }
                              }}
                            >
                              {skill.name}
                            </Typography>
                            <Chip
                              label={skill.level}
                              size={isSmallMobile ? "small" : "medium"}
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' },
                                px: { xs: 0.5, sm: 1 },
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                backgroundColor: levelColorHex[skill.level] || '#9e9e9e',
                                color: '#0f172a'
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ width: '100%', mb: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={getSkillPercent(skill)}
                              sx={{
                                height: { xs: 6, sm: 8, md: 10 },
                                borderRadius: 4,
                                background: alpha('#ffffff', 0.08),
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(90deg, ${levelColorHex[skill.level] || '#9e9e9e'}, ${alpha(levelColorHex[skill.level] || '#9e9e9e', 0.8)})`,
                                  borderRadius: 4,
                                }
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mt: 1,
                            gap: 0.5
                          }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontWeight: 600, 
                                letterSpacing: 0.5,
                                color: '#94a3b8',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            >
                              Proficiency • {getSkillPercent(skill)}%
                            </Typography>
                            {skill.category && (
                              <Chip
                                label={skill.category}
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  borderColor: alpha('#ffffff', 0.25), 
                                  color: '#e2e8f0',
                                  fontSize: { xs: '0.6rem', sm: '0.65rem' },
                                  height: { xs: 20, sm: 24 }
                                }}
                              />
                            )}
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                No skills found for this category.
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Skills;
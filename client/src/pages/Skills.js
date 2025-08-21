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
  CardContent,
  Avatar,
  LinearProgress,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { api } from '../api';

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
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white', 
      py: { xs: 4, md: 8 },
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.03) 0%, transparent 50%)',
        opacity: 0.5,
        zIndex: 0
      },
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant={isMobile ? "h3" : "h2"} sx={{ 
            fontWeight: 900, 
            mb: 2, 
            textAlign: 'center', 
            background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1,
            px: 2
          }}>
            Technical Skills
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} sx={{ 
            color: '#94a3b8', 
            mb: 5, 
            textAlign: 'center', 
            fontWeight: 500,
            px: 2
          }}>
            My expertise across different technologies and frameworks
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: { xs: 3, md: 4 },
            px: 2
          }}>
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
                color: '#0F172A',
                fontWeight: 800,
                borderRadius: 3,
                px: 3,
                py: 1.25,
                boxShadow: '0 6px 18px rgba(56,189,248,0.25)',
                '&:hover': { 
                  background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              View Projects
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: { xs: 3, md: 5 }, 
            flexWrap: 'wrap', 
            gap: 1.5,
            px: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              display: 'none'
            }
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
                    borderRadius: 3,
                    fontWeight: 700,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.5, sm: 1 },
                    background: selectedCategory === cat 
                      ? 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)' 
                      : 'rgba(255,255,255,0.08)',
                    color: selectedCategory === cat ? '#0F172A' : 'white',
                    boxShadow: selectedCategory === cat 
                      ? '0 6px 20px rgba(56,189,248,0.25)' 
                      : 'none',
                    border: selectedCategory === cat 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.15)',
                    minWidth: 'fit-content',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      background: selectedCategory === cat 
                        ? 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)' 
                        : 'rgba(255,255,255,0.15)',
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
          
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px'
            }}>
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: '#38BDF8',
                  animationDuration: '800ms'
                }} 
              />
            </Box>
          ) : (
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }} 
              justifyContent="center"
              sx={{ px: { xs: 1, sm: 2 } }}
            >
              <AnimatePresence>
                {filteredSkills.map((skill, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    key={skill._id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <Card 
                      sx={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: 4,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
                        color: 'white',
                        p: { xs: 2, sm: 3 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.38)',
                          borderColor: 'rgba(255,255,255,0.2)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        gap: { xs: 1, sm: 2 }
                      }}>
                        <Avatar
                          sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            background: 'rgba(255,255,255,0.08)',
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
                                objectFit: 'contain', 
                                borderRadius: '50%' 
                              }} 
                            />
                          ) : (
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {skill.name.charAt(0).toUpperCase()}
                            </Typography>
                          )}
                        </Avatar>
                        <Typography 
                          variant={isMobile ? "body1" : "h5"} 
                          sx={{ 
                            fontWeight: 900, 
                            flex: 1, 
                            letterSpacing: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        >
                          {skill.name}
                        </Typography>
                        <Chip
                          label={skill.level}
                          color={levelColor[skill.level] || 'default'}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1, sm: 2 },
                            borderRadius: 2.5,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={getSkillPercent(skill)}
                          sx={{
                            height: { xs: 8, sm: 10 },
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.08)',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${levelColorHex[skill.level] || '#9e9e9e'}, ${(levelColorHex[skill.level] || '#9e9e9e')}dd)`,
                              borderRadius: 6,
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mt: 1,
                        gap: 1
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600, 
                            letterSpacing: 0.6,
                            color: '#94a3b8'
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
                              borderColor: 'rgba(255,255,255,0.25)', 
                              color: '#e2e8f0',
                              fontSize: '0.65rem'
                            }}
                          />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Skills;
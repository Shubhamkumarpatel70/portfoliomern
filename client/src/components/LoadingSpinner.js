import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(5px)'
      }}
      open={true}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {message}
          </Typography>
        </Box>
      </motion.div>
    </Backdrop>
  );
};

export default LoadingSpinner;
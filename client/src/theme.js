import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B3F72', // Deep Indigo
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A69CAC', // Soft Purple Gray
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#FF6B6B', // Vibrant Coral
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA', // Off-White
      paper: '#FFFFFF',   // Pure White
    },
    text: {
      primary: '#333333', // Dark Charcoal
      secondary: '#7D7D7D', // Cool Gray
    },
  },
});

export default theme; 
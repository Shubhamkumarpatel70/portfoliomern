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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: '16px',
            sm: '24px',
            md: '32px',
          },
          paddingRight: {
            xs: '16px',
            sm: '24px',
            md: '32px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: {
            xs: '12px',
            sm: '16px',
            md: '20px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: {
            xs: '8px',
            sm: '12px',
            md: '16px',
          },
          fontSize: {
            xs: '0.875rem',
            sm: '1rem',
            md: '1.125rem',
          },
          padding: {
            xs: '8px 16px',
            sm: '10px 20px',
            md: '12px 24px',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: {
            xs: '2rem',
            sm: '2.5rem',
            md: '3rem',
            lg: '3.5rem',
          },
        },
        h2: {
          fontSize: {
            xs: '1.75rem',
            sm: '2rem',
            md: '2.5rem',
            lg: '3rem',
          },
        },
        h3: {
          fontSize: {
            xs: '1.5rem',
            sm: '1.75rem',
            md: '2rem',
            lg: '2.25rem',
          },
        },
        h4: {
          fontSize: {
            xs: '1.25rem',
            sm: '1.5rem',
            md: '1.75rem',
            lg: '2rem',
          },
        },
        h5: {
          fontSize: {
            xs: '1.125rem',
            sm: '1.25rem',
            md: '1.5rem',
            lg: '1.75rem',
          },
        },
        h6: {
          fontSize: {
            xs: '1rem',
            sm: '1.125rem',
            md: '1.25rem',
            lg: '1.5rem',
          },
        },
      },
    },
  },
});

export default theme; 
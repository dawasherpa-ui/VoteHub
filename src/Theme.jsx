import { createTheme } from '@mui/material/styles';

// Light Theme
const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#0077B6', // Primary color
    },
    secondary: {
      main: '#00A699', // Secondary color 1
      second:'#94C2E5',
    },
    error: {
      main: '#FF6B6B', // Secondary color 2 (error/red)
    },
    background: {
      default: '#FFFFFF', // Paper background (white)
      paper: ' #F0F0F0', 
    },
    text: {
      primary: '#333333', // Text color for light theme (dark gray or black)
    },
  }
});
const customBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900, // Modify the medium breakpoint
    lg: 1200, // Modify the large breakpoint
    xl: 1600, // Modify the extra-large breakpoint
  },
};

// Dark Theme
const darkTheme = createTheme({
  breakpoints: customBreakpoints,
  palette: {
    primary: {
      main: '#0077B6', // Dark theme's primary color
    },
    secondary: {
      main: '#00A699', // Dark theme's secondary color 1
      second:'rgba(12,112,187,0.2)'
    },
    error: {
      main: '#FF6B6B', // Dark theme's secondary color 2 (error/red)
    },
    background: {
      default: 'black', // Dark theme's background color (dark gray)
      paper: 'rgba(19, 18, 19, 1)', // Dark theme's paper background (darker gray)
    },
    text: {
      primary: '#FFFFFF', // Text color for dark theme
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif', 
    color:"white"// Define your preferred font
  },components: {
    MuiButton: {
      styleOverrides: {
        // Add your default button styles here
        root: {
          '&:focus': {
            outline: 'none',
          },color:"white"
          // Add more styles as needed
        },
      },
    },
  },
});

export { lightTheme, darkTheme };

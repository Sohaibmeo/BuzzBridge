import { createTheme } from '@mui/material/styles';
const defaultColor = '#000';

export const defaultButton = {
  borderRadius: '16px',
  border: `1px solid ${defaultColor}`,
  color: defaultColor,
  height: 40,
  padding: '0 30px',
  // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};

//TODO: create a theme which has like fonts for all h1-h6 and other stuff i.e body1 body2 etc
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        // root: {
        //   color: '#fff',
        // },
        body1: {
          color: '#000',
        },
      },
    },
  },
});

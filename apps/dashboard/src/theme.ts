// FILE: theme.ts
// PURPOSE: This file holds ALL the colors and styles for your dashboard
// ANALOGY: Like a paint color palette for your entire house

import { createTheme } from '@mui/material';

export const dashboardTheme = createTheme({
    // palette = all the colors we will use
    palette: {
        mode: 'dark',  // dark mode looks better with your gradient!
        primary: {
            main: '#fuchsia',  // bright pink-purple
            light: '#fuchsia-400',
            dark: '#fuchsia-600',
        },
        secondary: {
            main: '#emerald',  // rich green
        },
        background: {
            default: 'transparent',  // let the gradient show through
            paper: 'rgba(255, 255, 255, 0.05)',  // semi-transparent white
        },
    },
    // typography = how text looks
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
        h4: {
            fontWeight: 700,
            background: 'linear-gradient(135deg, #fuchsia, #emerald)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
        },
    },
    // components = how Material UI components look
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
    },
});
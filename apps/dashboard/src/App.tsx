
import './App.css'
// FILE: apps/dashboard/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import EventsTable from './pages/EventsTable';
import Sessions from './pages/Sessions';

// Create a beautiful theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1', // Modern indigo
            light: '#818cf8',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#ec4899', // Pink accent
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <DashboardLayout>
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/events" element={<EventsTable />} />
                        <Route path="/sessions" element={<Sessions />} />
                    </Routes>
                </DashboardLayout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
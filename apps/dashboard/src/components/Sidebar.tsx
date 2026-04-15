// FILE: apps/dashboard/src/components/Sidebar.tsx
import { 
    Box, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Typography, 
    Divider,
    Avatar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

// Navigation items configuration
const navItems = [
    { path: '/', label: 'Overview', icon: '📊' },
    { path: '/events', label: 'Events Log', icon: '📋' },
    { path: '/sessions', label: 'Sessions', icon: '👥' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo / Brand Area */}
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Analytics Hub
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Real-time Insights
                </Typography>
            </Box>

            <Divider />

            {/* Admin Profile Section */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    👨‍💻
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Kelly Besong
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Administrator
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Navigation Menu */}

<List sx={{ flexGrow: 1 }}> {/* Added px: 2 for breathing room */}
    {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
            <ListItem key={item.path} disablePadding>
                <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                        // borderRadius: '10px', // Rounding makes gradients look more modern
                        mb: 1,
                        // Apply gradient only when active
                        background: isActive 
                            ? 'linear-gradient(90deg, #d946ef 0%, #059669 100%)' 
                            : 'transparent',
                        color: isActive ? 'white' : 'text.primary',
                        // Add a soft neon glow when active
                        boxShadow: isActive 
                            ? '0px 4px 12px rgba(217, 70, 239, 0.25)' 
                            : 'none',
                        transition: 'all 0.2s ease-in-out', // Smooth transition
                        '&:hover': {
                            background: isActive 
                                ? 'linear-gradient(90deg, #d946ef 20%, #059669 110%)' 
                                : 'rgba(255, 255, 255, 0.05)',
                            transform: !isActive ? 'translateX(4px)' : 'none', // Tiny shift for non-active
                        },
                    }}
                >
                    <ListItemIcon sx={{ 
                        color: isActive ? 'white' : 'inherit',
                        minWidth: '40px' 
                    }}>
                        <Typography fontSize="1.5rem">{item.icon}</Typography>
                    </ListItemIcon>
                    <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.95rem',
                            letterSpacing: '0.02em'
                        }}
                    />
                </ListItemButton>
            </ListItem>
        );
    })}
</List>

            {/* <List sx={{ flexGrow: 1 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    // borderRadius: 2,
                                    mb: 1,
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                                    <Typography fontSize="1.5rem">{item.icon}</Typography>
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List> */}

            {/* Footer */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                    © 2026 Analytics Dashboard
                </Typography>
            </Box>
        </Box>
    );
}
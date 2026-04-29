// FILE: Navbar.tsx
// PURPOSE: The top bar - simple and clean

import React from 'react';
import { 
    IconButton, 
    Typography, 
    Box, 
    Badge,
    Tooltip,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';

interface NavbarProps {
    onMenuClick: () => void;
    isMobile: boolean;
}

export default function Navbar({ onMenuClick, isMobile }: NavbarProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        // SIMPLE navbar - no extra styling here, the AppBar handles it
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%',
        }}>
            {/* Left side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isMobile && (
                    <IconButton onClick={onMenuClick} edge="start" sx={{ color: '#1e293b' }}>
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #fuchsia, #10b981)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Analytics Dashboard
                </Typography>
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Refresh Data">
                    <IconButton onClick={handleRefresh} sx={{ color: '#1e293b' }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Notifications">
                    <IconButton onClick={handleNotifOpen} sx={{ color: '#1e293b' }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Admin Profile">
                    <IconButton onClick={handleMenuOpen}>
                        <Avatar sx={{ 
                            width: 40, 
                            height: 40, 
                            background: 'linear-gradient(135deg, #fuchsia, #10b981)'
                        }}>
                            KB
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Menus */}
            <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifClose}
            >
                <MenuItem onClick={handleNotifClose}>🔔 New event recorded</MenuItem>
                <MenuItem onClick={handleNotifClose}>📊 Dashboard ready</MenuItem>
                <MenuItem onClick={handleNotifClose}>✅ System healthy</MenuItem>
            </Menu>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>👤 My Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>⚙️ Settings</MenuItem>
                <MenuItem onClick={handleMenuClose}>🚪 Logout</MenuItem>
            </Menu>
        </Box>
    );
}

// // FILE: Navbar.tsx
// // PURPOSE: The top bar with YOUR EXACT STYLES: bg-white/80 backdrop-blur-md

// import React from 'react';
// import { 
//     IconButton, 
//     Typography, 
//     Box, 
//     Badge,
//     Tooltip,
//     Menu,
//     MenuItem,
//     Avatar
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import RefreshIcon from '@mui/icons-material/Refresh';

// interface NavbarProps {
//     onMenuClick: () => void;
//     isMobile: boolean;
// }

// export default function Navbar({ onMenuClick, isMobile }: NavbarProps) {
//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//     const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(null);

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setNotifAnchorEl(event.currentTarget);
//     };

//     const handleNotifClose = () => {
//         setNotifAnchorEl(null);
//     };

//     const handleRefresh = () => {
//         window.location.reload();
//     };

//     return (
//         // THIS IS YOUR EXACT REQUEST: bg-white/80 backdrop-blur-md
//         <Box 
//             sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'space-between', 
//                 width: '100%',
//                 backgroundColor: 'rgba(255, 255, 255, 0.8)',  // bg-white/80
//                 backdropFilter: 'blur(12px)',                 // backdrop-blur-md
//                 borderRadius: '20px',
//                 padding: '8px 20px',
//                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                 border: '1px solid rgba(255, 255, 255, 0.3)',
//             }}
//         >
//             {/* Left side - Menu button and title */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 {isMobile && (
//                     <IconButton onClick={onMenuClick} edge="start" sx={{ color: '#1e293b' }}>
//                         <MenuIcon />
//                     </IconButton>
//                 )}
//                 <Typography 
//                     variant="h6" 
//                     sx={{ 
//                         fontWeight: 700,
//                         background: 'linear-gradient(135deg, #fuchsia, #10b981)',
//                         backgroundClip: 'text',
//                         WebkitBackgroundClip: 'text',
//                         color: 'transparent',
//                     }}
//                 >
//                     Analytics Dashboard
//                 </Typography>
//             </Box>

//             {/* Right side - Actions */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Tooltip title="Refresh Data">
//                     <IconButton onClick={handleRefresh} sx={{ color: '#1e293b' }}>
//                         <RefreshIcon />
//                     </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Notifications">
//                     <IconButton onClick={handleNotifOpen} sx={{ color: '#1e293b' }}>
//                         <Badge badgeContent={3} color="error">
//                             <NotificationsIcon />
//                         </Badge>
//                     </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Admin Profile">
//                     <IconButton onClick={handleMenuOpen}>
//                         <Avatar sx={{ 
//                             width: 40, 
//                             height: 40, 
//                             background: 'linear-gradient(135deg, #fuchsia, #10b981)'
//                         }}>
//                             KB
//                         </Avatar>
//                     </IconButton>
//                 </Tooltip>
//             </Box>

//             {/* Notifications Menu */}
//             <Menu
//                 anchorEl={notifAnchorEl}
//                 open={Boolean(notifAnchorEl)}
//                 onClose={handleNotifClose}
//                 PaperProps={{
//                     sx: {
//                         background: 'rgba(255, 255, 255, 0.95)',
//                         backdropFilter: 'blur(8px)',
//                         borderRadius: '16px',
//                         mt: 1,
//                     }
//                 }}
//             >
//                 <MenuItem onClick={handleNotifClose}>🔔 New event recorded</MenuItem>
//                 <MenuItem onClick={handleNotifClose}>📊 Dashboard ready</MenuItem>
//                 <MenuItem onClick={handleNotifClose}>✅ System healthy</MenuItem>
//             </Menu>

//             {/* Profile Menu */}
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 PaperProps={{
//                     sx: {
//                         background: 'rgba(255, 255, 255, 0.95)',
//                         backdropFilter: 'blur(8px)',
//                         borderRadius: '16px',
//                         mt: 1,
//                     }
//                 }}
//             >
//                 <MenuItem onClick={handleMenuClose}>👤 My Profile</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>⚙️ Settings</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>🚪 Logout</MenuItem>
//             </Menu>
//         </Box>
//     );
// }

// // FILE: Navbar.tsx
// // PURPOSE: Top navigation bar with glass morphism effect

// import React from 'react';
// import { 
//     IconButton, 
//     Typography, 
//     Box, 
//     Badge,
//     Tooltip,
//     Menu,
//     MenuItem,
//     Avatar
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import RefreshIcon from '@mui/icons-material/Refresh';

// interface NavbarProps {
//     onMenuClick: () => void;
//     isMobile: boolean;
// }

// export default function Navbar({ onMenuClick, isMobile }: NavbarProps) {
//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//     const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(null);

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setNotifAnchorEl(event.currentTarget);
//     };

//     const handleNotifClose = () => {
//         setNotifAnchorEl(null);
//     };

//     const handleRefresh = () => {
//         window.location.reload();
//     };

//     return (
//         // YOUR REQUESTED STYLES: bg-white/80 backdrop-blur-md
//         <Box 
//             sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'space-between', 
//                 width: '100%',
//                 // This is the glass effect you wanted!
//                 backgroundColor: 'rgba(255, 255, 255, 0.8)',  // bg-white/80
//                 backdropFilter: 'blur(12px)',                 // backdrop-blur-md
//                 borderRadius: '16px',
//                 padding: '8px 16px',
//                 border: '1px solid rgba(255, 255, 255, 0.2)',
//             }}
//         >
//             {/* Left side - Menu button and title */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 {isMobile && (
//                     <IconButton onClick={onMenuClick} edge="start" sx={{ color: '#1e293b' }}>
//                         <MenuIcon />
//                     </IconButton>
//                 )}
//                 <Typography 
//                     variant="h6" 
//                     sx={{ 
//                         fontWeight: 700,
//                         background: 'linear-gradient(135deg, #fuchsia, #emerald)',
//                         backgroundClip: 'text',
//                         WebkitBackgroundClip: 'text',
//                         color: 'transparent',
//                     }}
//                 >
//                     Analytics Dashboard
//                 </Typography>
//             </Box>

//             {/* Right side - Actions */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Tooltip title="Refresh Data">
//                     <IconButton onClick={handleRefresh} sx={{ color: '#1e293b' }}>
//                         <RefreshIcon />
//                     </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Notifications">
//                     <IconButton onClick={handleNotifOpen} sx={{ color: '#1e293b' }}>
//                         <Badge badgeContent={3} color="error">
//                             <NotificationsIcon />
//                         </Badge>
//                     </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Admin Profile">
//                     <IconButton onClick={handleMenuOpen}>
//                         <Avatar sx={{ 
//                             width: 40, 
//                             height: 40, 
//                             background: 'linear-gradient(135deg, #fuchsia, #emerald)'
//                         }}>
//                             KB
//                         </Avatar>
//                     </IconButton>
//                 </Tooltip>
//             </Box>

//             {/* Notifications Menu */}
//             <Menu
//                 anchorEl={notifAnchorEl}
//                 open={Boolean(notifAnchorEl)}
//                 onClose={handleNotifClose}
//                 PaperProps={{
//                     sx: {
//                         background: 'rgba(255, 255, 255, 0.9)',
//                         backdropFilter: 'blur(8px)',
//                         borderRadius: '16px',
//                     }
//                 }}
//             >
//                 <MenuItem onClick={handleNotifClose}>🔔 New event recorded</MenuItem>
//                 <MenuItem onClick={handleNotifClose}>📊 Dashboard ready</MenuItem>
//                 <MenuItem onClick={handleNotifClose}>✅ System healthy</MenuItem>
//             </Menu>

//             {/* Profile Menu */}
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 PaperProps={{
//                     sx: {
//                         background: 'rgba(255, 255, 255, 0.9)',
//                         backdropFilter: 'blur(8px)',
//                         borderRadius: '16px',
//                     }
//                 }}
//             >
//                 <MenuItem onClick={handleMenuClose}>👤 My Profile</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>⚙️ Settings</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>🚪 Logout</MenuItem>
//             </Menu>
//         </Box>
//     );
// }



// // FILE: apps/dashboard/src/components/Navbar.tsx

// import React from 'react';
// import { 
//     IconButton, 
//     Typography, 
//     Box, 
//     Badge,
//     Tooltip,
//     Menu,
//     MenuItem,
//     Avatar
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import RefreshIcon from '@mui/icons-material/Refresh';

// interface NavbarProps {
//     onMenuClick: () => void;
//     isMobile: boolean;
// }

// export default function Navbar({ onMenuClick, isMobile }: NavbarProps) {
//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//     const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(null);

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setNotifAnchorEl(event.currentTarget);
//     };

//     const handleNotifClose = () => {
//         setNotifAnchorEl(null);
//     };

//     const handleRefresh = () => {
//         window.location.reload();
//     };

//     return (
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//             {/* Left side - Menu button and title */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 {isMobile && (
//                     <IconButton onClick={onMenuClick} edge="start" color="inherit">
//                         <MenuIcon />
//                     </IconButton>
//                 )}
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                     Analytics Dashboard
//                 </Typography>
//             </Box>

//             {/* Right side - Actions */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Tooltip title="Refresh Data">
//                     <IconButton onClick={handleRefresh} color="inherit">
//                         <RefreshIcon />
//                     </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Notifications">
//                     <IconButton onClick={handleNotifOpen} color="inherit">
//                         <Badge badgeContent={3} color="error">
//                             <NotificationsIcon />
//                         </Badge>
//                     </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Admin Profile">
//                     <IconButton onClick={handleMenuOpen} color="inherit">
//                         <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
//                             KB
//                         </Avatar>
//                     </IconButton>
//                 </Tooltip>
//             </Box>

//             {/* Notifications Menu */}
//             <Menu
//                 anchorEl={notifAnchorEl}
//                 open={Boolean(notifAnchorEl)}
//                 onClose={handleNotifClose}
//                 sx={{ mt: 2 }}
//             >
//                 <MenuItem onClick={handleNotifClose}>🔔 New event recorded</MenuItem>
//                 <MenuItem onClick={handleNotifClose}>📊 Dashboard ready</MenuItem>
//                 <MenuItem onClick={handleNotifClose}>✅ System healthy</MenuItem>
//             </Menu>

//             {/* Profile Menu */}
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 sx={{ mt: 2 }}
//             >
//                 <MenuItem onClick={handleMenuClose}>👤 My Profile</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>⚙️ Settings</MenuItem>
//                 <MenuItem onClick={handleMenuClose}>🚪 Logout</MenuItem>
//             </Menu>
//         </Box>
//     );
// }
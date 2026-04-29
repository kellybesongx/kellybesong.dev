// FILE: DashboardLayout.tsx
// PURPOSE: The main layout with fixed navbar and gradient background

import * as React from 'react';
import { Box, Drawer, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh',
            // YOUR HOMEPAGE GRADIENT - blue to indigo
            // background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            background: "linear-gradient(to top right, #d946ef, #059669, #020617)",
        }}>
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        // backgroundColor: 'rgba(13, 17, 23, 0.9)', // Dark slate like your homepage
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/80
                        // background: "linear-gradient(to top right, #d946ef, #059669, #020617)",
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                <Sidebar />
            </Drawer>

            {/* Main content */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* FIXED NAVBAR - stays at top when scrolling */}
                <AppBar 
                    position="fixed"  // This makes it stay at the top
                    elevation={0}
                    sx={{
                        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, // Don't cover sidebar
                        ml: { md: `${DRAWER_WIDTH}px` },
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/80
                        backdropFilter: 'blur(12px)', // backdrop-blur-md
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Toolbar>
                        <Navbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
                    </Toolbar>
                </AppBar>
                
                {/* SPACER - prevents content from hiding under fixed navbar */}
                <Toolbar />  {/* This adds empty space the same height as the navbar */}

                {/* Page content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}


// // FILE: DashboardLayout.tsx
// // PURPOSE: The frame that holds everything together

// import * as React from 'react';
// import { Box, Drawer, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';

// const DRAWER_WIDTH = 280;

// interface DashboardLayoutProps {
//     children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [mobileOpen, setMobileOpen] = React.useState(false);

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     return (
//         // THIS IS THE BACKGROUND WALL - your beautiful gradient ONLY here
//         <Box sx={{ 
//             display: 'flex', 
//             minHeight: '100vh',
//             // YOUR GRADIENT - ONLY on the background!
//             // background: 'linear-gradient(135deg, #fuchsia 0%, #10b981 50%, #0f172a 100%)',
//             // background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
//             background: "linear-gradient(to top right, #d946ef, #059669, #020617)",
//         }}>
//             {/* Sidebar - the menu on the left */}
//             <Drawer
//                 variant={isMobile ? 'temporary' : 'permanent'}
//                 open={isMobile ? mobileOpen : true}
//                 onClose={handleDrawerToggle}
//                 sx={{
//                     width: DRAWER_WIDTH,
//                     flexShrink: 0,
//                     '& .MuiDrawer-paper': {
//                         width: DRAWER_WIDTH,
//                         boxSizing: 'border-box',
//                         // Make sidebar slightly see-through so gradient shows
//                         backgroundColor: 'rgba(15, 23, 42, 0.9)', // dark slate, mostly solid
//                         borderRight: '1px solid rgba(255, 255, 255, 0.1)',
//                     },
//                 }}
//             >
//                 <Sidebar />
//             </Drawer>

//             {/* Main content area */}
//             <Box sx={{ 
//                 flexGrow: 1, 
//                 display: 'flex', 
//                 flexDirection: 'column',
//                 overflowX: 'hidden', // Prevent sideways scrolling
//             }}>
//                 {/* TOP BAR - Navbar goes HERE, not floating */}
//              <AppBar 
//                                 position="fixed"  // CHANGE THIS from "sticky" to "fixed"
//                                 sx={{
//                                     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                                     backdropFilter: 'blur(12px)',
//                                     boxShadow: 'none',  // Remove shadow for cleaner look
//                                     borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
//                                 }}
//                 >
//                     <Toolbar>
//                         <Navbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
//                     </Toolbar>
//                 </AppBar>

//                 <Toolbar />  {/* This creates empty space the same height as the navbar */}

//                 {/* Page content - where the charts go */}
//                 <Box
//                     component="main"
//                     sx={{
//                         flexGrow: 1,
//                         p: { xs: 2, sm: 3, md: 4 },
//                     }}
//                 >
//                     {children}
//                 </Box>
//             </Box>
//         </Box>
//     );
// }

// // FILE: DashboardLayout.tsx
// // PURPOSE: The main layout with YOUR EXACT GRADIENT

// import * as React from 'react';
// import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';

// const DRAWER_WIDTH = 280;

// interface DashboardLayoutProps {
//     children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [mobileOpen, setMobileOpen] = React.useState(false);

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     return (
//         // THIS IS YOUR EXACT GRADIENT: from-fuchsia-500 via-emerald-600 to-slate-950
//         <Box sx={{ 
//             display: 'flex', 
//             minHeight: '100vh',
//             background: 'linear-gradient(135deg, #fuchsia 0%, #10b981 50%, #0f172a 100%)',
//         }}>
//             {/* Sidebar */}
//             <Drawer
//                 variant={isMobile ? 'temporary' : 'permanent'}
//                 open={isMobile ? mobileOpen : true}
//                 onClose={handleDrawerToggle}
//                 sx={{
//                     width: DRAWER_WIDTH,
//                     flexShrink: 0,
//                     '& .MuiDrawer-paper': {
//                         width: DRAWER_WIDTH,
//                         boxSizing: 'border-box',
//                         background: 'rgba(255, 255, 255, 0.1)',
//                         backdropFilter: 'blur(12px)',
//                         borderRight: '1px solid rgba(255, 255, 255, 0.2)',
//                     },
//                 }}
//             >
//                 <Sidebar />
//             </Drawer>

//             {/* Main content */}
//             <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//                 {/* Navbar with padding */}
//                 <Box sx={{ p: 2 }}>
//                     <Navbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
//                 </Box>

//                 {/* Page content */}
//                 <Box
//                     component="main"
//                     sx={{
//                         flexGrow: 1,
//                         p: { xs: 2, sm: 3, md: 4 },
//                     }}
//                 >
//                     {children}
//                 </Box>
//             </Box>
//         </Box>
//     );
// }

// // FILE: DashboardLayout.tsx
// // PURPOSE: The main layout with your beautiful gradient background

// import * as React from 'react';
// import { Box, Drawer, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';

// const DRAWER_WIDTH = 280;

// interface DashboardLayoutProps {
//     children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [mobileOpen, setMobileOpen] = React.useState(false);

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     return (
//         // THIS IS YOUR BEAUTIFUL GRADIENT!
//         <Box sx={{ 
//             display: 'flex', 
//             minHeight: '100vh',
//             // Your requested gradient
//             background: 'linear-gradient(135deg, #fuchsia 0%, #10b981 50%, #0f172a 100%)',
//         }}>
//             {/* Sidebar */}
//             <Drawer
//                 variant={isMobile ? 'temporary' : 'permanent'}
//                 open={isMobile ? mobileOpen : true}
//                 onClose={handleDrawerToggle}
//                 sx={{
//                     width: DRAWER_WIDTH,
//                     flexShrink: 0,
//                     '& .MuiDrawer-paper': {
//                         width: DRAWER_WIDTH,
//                         boxSizing: 'border-box',
//                         background: 'rgba(255, 255, 255, 0.1)',
//                         backdropFilter: 'blur(12px)',
//                         borderRight: '1px solid rgba(255, 255, 255, 0.2)',
//                     },
//                 }}
//             >
//                 <Sidebar />
//             </Drawer>

//             {/* Main content */}
//             <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//                 {/* Navbar - no background here, it's handled by Navbar component */}
//                 <Box sx={{ p: 2 }}>
//                     <Navbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
//                 </Box>

//                 {/* Page content */}
//                 <Box
//                     component="main"
//                     sx={{
//                         flexGrow: 1,
//                         p: { xs: 2, sm: 3, md: 4 },
//                     }}
//                 >
//                     {children}
//                 </Box>
//             </Box>
//         </Box>
//     );
// }

// // FILE: apps/dashboard/src/layouts/DashboardLayout.tsx

// import React, { useState } from 'react';
// import { Box, Drawer, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';

// const DRAWER_WIDTH = 280; // Width of the sidebar in pixels

// interface DashboardLayoutProps {
//     children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if screen is mobile
//     const [mobileOpen, setMobileOpen] = useState(false);

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     return (
//         <Box sx={{ display: 'flex', minHeight: '100vh'}}>
//             {/* Sidebar - permanent on desktop, drawer on mobile */}
//             <Drawer
//                 variant={isMobile ? 'temporary' : 'permanent'}
//                 open={isMobile ? mobileOpen : true}
//                 onClose={handleDrawerToggle}
//                 sx={{
//                     width: DRAWER_WIDTH,
//                     flexShrink: 0,
//                     '& .MuiDrawer-paper': {
//                         width: DRAWER_WIDTH,
//                         boxSizing: 'border-box',
//                         borderRight: '1px solid',
//                         borderColor: 'divider',
//                         bgcolor: 'background.paper',
//                     },
//                 }}
//             >
//                 <Sidebar />
//             </Drawer>

//             {/* Main content area */}
//             <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//                 {/* Top navigation bar */}
//                 <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
//                     <Toolbar>
//                         <Navbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
//                     </Toolbar>
//                 </AppBar>

//                 {/* Page content */}
//                 <Box
//                     component="main"
//                     sx={{
//                         flexGrow: 1,
//                         p: { xs: 2, sm: 3, md: 4 },
//                         bgcolor: 'background.default',
//                     }}
//                 >
//                     {children}
//                 </Box>
//             </Box>
//         </Box>
//     );
// }
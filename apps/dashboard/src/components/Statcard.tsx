// FILE: StatCard.tsx
// PURPOSE: The little cards at the top showing quick numbers
// ANALOGY: Like a dashboard in a car showing speed, fuel, temperature

import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    loading?: boolean;
}

export default function StatCard({ title, value, icon, loading = false }: StatCardProps) {
    // Shared styles to keep the "Glassmorphism" consistent
    const cardStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%', // Fills the Grid item height
        display: 'flex', // Crucial for vertical alignment
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: loading ? 'none' : 'translateY(-6px)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
        }
    };

    if (loading) {
        return (
            <Card sx={cardStyles}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography color="rgba(255,255,255,0.5)" variant="body2" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        ...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={cardStyles}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:"space-between" }}>
              
                    <Box>
                        <Typography color="rgba(255,255,255,0.7)" variant="body2" sx={{ mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                            {value}
                        </Typography>
                    </Box>
                    
                    <Typography sx={{ 
                        fontSize: '2.5rem', 
                        filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.2))' 
                    }}>
                        {icon}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

// // FILE: apps/dashboard/src/components/StatCard.tsx

// import React from 'react';
// import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
// import { motion } from 'framer-motion';

// interface StatCardProps {
//     title: string;
//     value: number | string;
//     icon: string;
//     color?: string;
//     loading?: boolean;
//     trend?: {
//         value: number;
//         isPositive: boolean;
//     };
// }

// export default function StatCard({ title, value, icon, color = 'primary.main', loading = false, trend }: StatCardProps) {
//     if (loading) {
//         return (
//             <Card>
//                 <CardContent>
//                     <Skeleton variant="text" width="60%" />
//                     <Skeleton variant="text" width="40%" height={40} />
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//         >
//             <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
//                 <CardContent>
//                     <Box display="flex" alignItems="center" justifyContent="space-between">
//                         <Box>
//                             <Typography color="textSecondary" gutterBottom variant="body2">
//                                 {title}
//                             </Typography>
//                             <Typography variant="h3" sx={{ fontWeight: 700 }}>
//                                 {value}
//                             </Typography>
//                             {trend && (
//                                 <Typography variant="caption" color={trend.isPositive ? 'success.main' : 'error.main'}>
//                                     {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
//                                 </Typography>
//                             )}
//                         </Box>
//                         <Typography fontSize="3rem">{icon}</Typography>
//                     </Box>
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// }
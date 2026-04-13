// FILE: Overview.tsx
// PURPOSE: The main dashboard page with stat cards and charts

import { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Toolbar} from '@mui/material';
import StatCard from '../components/StatCard';
import { fetchAnalyticsEvents, fetchAnalyticsSummary } from '../services/analyticsService';
import type { AnalyticsEvent } from '../types/analytics';
import AnalyticsChart from '../components/Charts/AnalyticsChart'


export default function Overview() {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [summary, setSummary] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [eventsData, summaryData] = await Promise.all([
                fetchAnalyticsEvents(1000),
                fetchAnalyticsSummary()
            ]);
            setEvents(eventsData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics for the stat cards
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    const eventTypes = Object.keys(summary).length;
    const avgEventsPerSession = totalEvents / uniqueSessions || 0;

    // Prepare data for bar chart
    const barChartData = Object.entries(summary).map(([name, count]) => {
         // rate calculation 
        const rate = (count / totalEvents) * 100;
      return {
           name,
        count,
        rate
      }  
    });

    return (
        <Box>
            {/* Page Title */}
            <Toolbar /> 
            <Typography variant="h4" gutterBottom sx={{ 
                mb: 4, 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #fff, #a5f3fc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
            }}>
                Analytics Overview
            </Typography>
            {/* <Toolbar />  */}

            {/* STAT CARDS - The little cards at the top */}
         <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
                    <StatCard
                        title="Total Events"
                        value={totalEvents}
                        icon="📊"
                        loading={loading}
                        sx={{ width: '100%', height: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Unique Sessions"
                        value={uniqueSessions}
                        icon="👥"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Event Types"
                        value={eventTypes}
                        icon="🏷️"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Avg Events/Session"
                        value={avgEventsPerSession.toFixed(1)}
                        icon="📈"
                        loading={loading}
                    />
                </Grid>
            </Grid>
            <Toolbar /> 
            {/* <Toolbar />  */}

            {/* CHARTS SECTION */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress sx={{ color: 'white' }} />
                </Box>
            ) : (

              <AnalyticsChart 
               data={barChartData}
                title="Analytics Overview"/>        
                    
            )}

            {/* Empty State - when no data */}
            {!loading && events.length === 0 && (
                <Box sx={{ 
                    mt: 4, 
                    p: 4, 
                    textAlign: 'center', 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        No events yet. Visit your portfolio to generate analytics events!
                    </Typography>
                </Box>
            )}
        </Box>
    );
}


// // FILE: Overview.tsx
// // PURPOSE: The main dashboard page with all charts

// import React, { useEffect, useState } from 'react';
// import { Grid, Box, Typography, CircularProgress } from '@mui/material';
// import EventBarChart from '../components/Charts/EventBarChart';
// import EventLineChart from '../components/Charts/EventLineChart';
// import EventPieChart from '../components/Charts/EventPieChart';
// import { fetchAnalyticsEvents, fetchAnalyticsSummary } from '../services/analyticsService';
// import type { AnalyticsEvent } from '../types/analytics';

// export default function Overview() {
//     const [events, setEvents] = useState<AnalyticsEvent[]>([]);
//     const [summary, setSummary] = useState<Record<string, number>>({});
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         setLoading(true);
//         try {
//             const [eventsData, summaryData] = await Promise.all([
//                 fetchAnalyticsEvents(1000),
//                 fetchAnalyticsSummary()
//             ]);
//             setEvents(eventsData);
//             setSummary(summaryData);
//         } catch (error) {
//             console.error('Failed to load data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     // Prepare data for bar chart
//     const barChartData = Object.entries(summary).map(([name, count]) => ({
//         name,
//         count
//     }));

//     // Prepare data for pie chart
//     const pieChartData = Object.entries(summary).map(([name, value]) => ({
//         name,
//         value
//     }));

//     // Prepare data for line chart (events per day)
//     const eventsByDate = events.reduce((acc: Record<string, number>, event) => {
//         const date = new Date(event.createdAt).toLocaleDateString();
//         acc[date] = (acc[date] || 0) + 1;
//         return acc;
//     }, {});

//     const lineChartData = Object.entries(eventsByDate)
//         .map(([date, count]) => ({ date, count }))
//         .slice(-14); // Last 14 days

//     return (
//         <Box>
//             <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 700, color: 'white' }}>
//                 Dashboard Overview
//             </Typography>

//             {/* Charts Grid - each chart gets its own space */}
//             <Grid container spacing={3}>
//                 {/* Bar Chart - takes half the width on medium screens */}
//                 <Grid item xs={12} md={6}>
//                     <EventBarChart data={barChartData} title="Event Distribution" />
//                 </Grid>
                
//                 {/* Pie Chart - takes half the width */}
//                 <Grid item xs={12} md={6}>
//                     <EventPieChart data={pieChartData} title="Event Percentage" />
//                 </Grid>
                
//                 {/* Line Chart - takes full width */}
//                 <Grid item xs={12}>
//                     <EventLineChart data={lineChartData} title="Events Trend (Last 14 Days)" />
//                 </Grid>
//             </Grid>

//             {/* Show message if no data */}
//             {events.length === 0 && (
//                 <Box sx={{ mt: 4, p: 4, textAlign: 'center', bgcolor: 'white', borderRadius: 2 }}>
//                     <Typography color="textSecondary">
//                         No events yet. Visit your portfolio to generate analytics events!
//                     </Typography>
//                 </Box>
//             )}
//         </Box>
//     );
// }

// // FILE: apps/dashboard/src/pages/Overview.tsx

// import React, { useEffect, useState } from 'react';
// import { Grid, Box, Typography } from '@mui/material';
// import StatCard from '../components/StatCard';
// import EventBarChart from '../components/Charts/EventBarChart';
// import EventLineChart from '../components/Charts/EventLineChart';
// import EventPieChart from '../components/Charts/EventPieChart';
// import { fetchAnalyticsEvents, fetchAnalyticsSummary } from '../services/analyticsService';
// import type { AnalyticsEvent } from '../types/analytics';

// export default function Overview() {
//     const [events, setEvents] = useState<AnalyticsEvent[]>([]);
//     const [summary, setSummary] = useState<Record<string, number>>({});
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         setLoading(true);
//         try {
//             const [eventsData, summaryData] = await Promise.all([
//                 fetchAnalyticsEvents(1000),
//                 fetchAnalyticsSummary()
//             ]);
//             setEvents(eventsData);
//             setSummary(summaryData);
//         } catch (error) {
//             console.error('Failed to load data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Calculate statistics
//     const totalEvents = events.length;
//     const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
//     const eventTypes = Object.keys(summary).length;
//     const avgEventsPerSession = totalEvents / uniqueSessions || 0;

//     // Prepare data for bar chart
//     const barChartData = Object.entries(summary).map(([name, count]) => ({
//         name,
//         count
//     }));

//     // Prepare data for pie chart
//     const pieChartData = Object.entries(summary).map(([name, value]) => ({
//         name,
//         value
//     }));

//     // Prepare data for line chart (events per day)
//     const eventsByDate = events.reduce((acc: Record<string, number>, event) => {
//         const date = new Date(event.createdAt).toLocaleDateString();
//         acc[date] = (acc[date] || 0) + 1;
//         return acc;
//     }, {});

//     const lineChartData = Object.entries(eventsByDate)
//         .map(([date, count]) => ({ date, count }))
//         .slice(-14); // Last 14 days

//     return (
//         <Box>
//             <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
//                 Dashboard Overview
//             </Typography>

//             {/* KPI Cards */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <StatCard
//                         title="Total Events"
//                         value={totalEvents}
//                         icon="📊"
//                         loading={loading}
//                         trend={{ value: 12, isPositive: true }}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <StatCard
//                         title="Unique Sessions"
//                         value={uniqueSessions}
//                         icon="👥"
//                         loading={loading}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <StatCard
//                         title="Event Types"
//                         value={eventTypes}
//                         icon="🏷️"
//                         loading={loading}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <StatCard
//                         title="Avg Events/Session"
//                         value={avgEventsPerSession.toFixed(1)}
//                         icon="📈"
//                         loading={loading}
//                     />
//                 </Grid>
//             </Grid>

//             {/* Charts Row 1 */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12} md={6}>
//                     <EventBarChart data={barChartData} title="Event Distribution" />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <EventPieChart data={pieChartData} title="Event Percentage" />
//                 </Grid>
//             </Grid>

//             {/* Charts Row 2 */}
//             <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                     <EventLineChart data={lineChartData} title="Events Trend (Last 14 Days)" />
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }
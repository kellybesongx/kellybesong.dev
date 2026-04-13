// FILE: apps/dashboard/src/pages/AnalyticsDashboard.tsx

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Grid,
    Chip,
    CircularProgress,
    Box
} from '@mui/material';
import { 
    Analytics as AnalyticsIcon,
    Event as EventIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { fetchAnalyticsEvents, fetchAnalyticsSummary } from '../services/analyticsService';
import type { AnalyticsEvent } from '../types/analytics';

export default function AnalyticsDashboard() {
    // State management
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [summary, setSummary] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data when component mounts
    useEffect(() => {
        loadAnalyticsData();
    }, []);

    const loadAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Fetch both events and summary in parallel
            const [eventsData, summaryData] = await Promise.all([
                fetchAnalyticsEvents(100),
                fetchAnalyticsSummary()
            ]);
            
            setEvents(eventsData);
            setSummary(summaryData);
        } catch (err) {
            setError('Failed to load analytics data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total unique sessions
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    
    // Calculate total events
    const totalEvents = events.length;

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" variant="h6">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AnalyticsIcon fontSize="large" />
                Analytics Dashboard
            </Typography>
            
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Events
                                    </Typography>
                                    <Typography variant="h3">
                                        {totalEvents}
                                    </Typography>
                                </Box>
                                <EventIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Unique Sessions
                                    </Typography>
                                    <Typography variant="h3">
                                        {uniqueSessions}
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Event Types
                                    </Typography>
                                    <Typography variant="h3">
                                        {Object.keys(summary).length}
                                    </Typography>
                                </Box>
                                <TimelineIcon sx={{ fontSize: 48, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Top Event
                            </Typography>
                            <Typography variant="h6" noWrap>
                                {Object.entries(summary).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {Object.entries(summary).sort((a,b) => b[1] - a[1])[0]?.[1] || 0} occurrences
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {/* Event Type Breakdown */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Event Breakdown
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(summary).map(([eventName, count]) => (
                        <Chip
                            key={eventName}
                            label={`${eventName}: ${count}`}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Box>
            </Paper>
            
            {/* Events Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Payload</TableCell>
                            <TableCell>Session ID</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id} hover>
                                <TableCell>{event.id}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={event.eventName} 
                                        size="small"
                                        color={event.eventName === 'page_view' ? 'primary' : 'secondary'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {JSON.stringify(event.payload).substring(0, 50)}
                                        {JSON.stringify(event.payload).length > 50 ? '...' : ''}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                        {event.sessionId.substring(0, 20)}...
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatDate(event.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Empty State */}
            {events.length === 0 && !loading && (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                    <Typography color="textSecondary">
                        No analytics events yet. Visit your portfolio to generate events!
                    </Typography>
                </Paper>
            )}
        </Container>
    );
}
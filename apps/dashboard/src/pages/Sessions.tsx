// FILE: apps/dashboard/src/pages/Sessions.tsx
// PURPOSE: Show all user sessions (like seeing how many people visited your store)
// ANALOGY: Like a guest book that shows when each person arrived and left

// LINE 1: Import React (the foundation of our app)
// 'use client' tells React this runs in the browser, not on a server
'use client';

// LINE 2-4: Import specific components from React
// useState = creates variables that can change
// useEffect = runs code when the page loads
import React, { useState, useEffect } from 'react';

// LINE 5-12: Import Material UI components (pre-made LEGO pieces)
import {
    Paper,        // Like a piece of paper - white background with shadow
    Table,        // A grid with rows and columns
    TableBody,    // The main part of the table (where data goes)
    TableCell,    // One box in the table (like one cell in a spreadsheet)
    TableContainer, // A wrapper that makes the table scrollable
    TableHead,    // The top row of the table (headers like "Name", "Date")
    TableRow,     // One horizontal line in the table
    Typography,   // Text with special styling
    Box,          // A generic container (like a <div>)
    Card,         // A box with rounded corners and shadow
    CardContent,  // The inside of a card
    Grid,         // A layout system (like a checkerboard)
    Chip          // A small label (like a price tag)
} from '@mui/material';

// LINE 13: Import our service that talks to the backend
import { fetchAnalyticsEvents } from '../services/analyticsService';

// LINE 14: Import the type definition (like a blueprint)
import type { AnalyticsEvent } from '../types/analytics';

// LINE 15-22: Define what a Session looks like (like a form you fill out)
interface SessionData {
    sessionId: string;    // A unique ID for this visit (like a guest number)
    eventCount: number;   // How many actions they took (like how many cookies they bought)
    firstSeen: string;    // When they first arrived (timestamp)
    lastSeen: string;     // When they left (timestamp)
    events: AnalyticsEvent[]; // All their actions (like a list of what they did)
}

// LINE 23: This is the MAIN function that creates the Sessions page
export default function Sessions() {
    // LINE 24: useState creates a place to store our sessions
    // sessions = the actual data (starts as empty array [])
    // setSessions = function to change the data
    const [sessions, setSessions] = useState<SessionData[]>([]);
    
    // LINE 25: loading = true means "we are fetching data"
    // setLoading = function to change loading state
    const [loading, setLoading] = useState(true);

    // LINE 26: useEffect runs when the page FIRST loads
    // [] empty array means "run this only once when page opens"
    useEffect(() => {
        loadSessions();  // Call the function that gets data
    }, []);

    // LINE 27: This function GETS all the events from the backend
    const loadSessions = async () => {
        // async = "this function might take time" (like waiting for mail)
        
        // LINE 28: Set loading to true (show "loading..." spinner)
        setLoading(true);
        
        // LINE 29: try = "attempt to do this, but watch for errors"
        try {
            // LINE 30: fetchAnalyticsEvents gets ALL events from database
            const events = await fetchAnalyticsEvents(10000);
            // await = "wait for this to finish before moving on"
            
            // LINE 31-34: GROUP events by session ID
            // Map is like a dictionary: key = sessionId, value = list of events
            const sessionMap = new Map<string, AnalyticsEvent[]>();
            
            // LINE 35: For each event in the events list
            events.forEach(event => {
                // LINE 36: If this session ID is not in the map yet
                if (!sessionMap.has(event.sessionId)) {
                    // LINE 37: Add it with an empty array
                    sessionMap.set(event.sessionId, []);
                }
                // LINE 38: Add this event to the session's array
                sessionMap.get(event.sessionId)!.push(event);
            });

            // LINE 39-51: Convert the map into an array of SessionData objects
            const sessionData: SessionData[] = Array.from(sessionMap.entries()).map(([sessionId, events]) => {
                // Sort events by time (oldest first)
                const sortedEvents = events.sort((a, b) => 
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                
                // Return a Session object
                return {
                    sessionId,                          // The ID
                    eventCount: events.length,          // How many events
                    firstSeen: sortedEvents[0].createdAt,  // First event time
                    lastSeen: sortedEvents[sortedEvents.length - 1].createdAt, // Last event time
                    events: sortedEvents                // All events
                };
            });

            // LINE 52: Sort by most recent activity (newest first)
            sessionData.sort((a, b) => 
                new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
            );

            // LINE 53: Save the data to state (so React shows it)
            setSessions(sessionData);
            
        // LINE 54: catch = "if something went wrong, do this instead"
        } catch (error) {
            // LINE 55: Print error to console (for debugging)
            console.error('Failed to load sessions:', error);
            
        // LINE 56: finally = "no matter what, do this at the end"
        } finally {
            // LINE 57: Set loading to false (hide the spinner)
            setLoading(false);
        }
    };

    // LINE 58: Helper function to format dates nicely
    // Example: "2026-04-08T07:21:31Z" becomes "4/8/2026, 7:21:31 AM"
    const formatDate = (dateString: string): string => {
        // new Date() creates a date object from the string
        // toLocaleString() converts to local time format
        return new Date(dateString).toLocaleString();
    };

    // LINE 59: Helper function to calculate how long a session lasted
    const getSessionDuration = (firstSeen: string, lastSeen: string): string => {
        // Calculate difference in milliseconds
        const duration = new Date(lastSeen).getTime() - new Date(firstSeen).getTime();
        // Convert to minutes (60000 milliseconds = 1 minute)
        const minutes = Math.floor(duration / 60000);
        
        // Return a human-readable string
        if (minutes < 1) return '< 1 minute';      // Less than 1 minute
        if (minutes === 1) return '1 minute';       // Exactly 1 minute
        return `${minutes} minutes`;                // X minutes
    };

    // LINE 60-65: Calculate summary statistics
    const totalSessions = sessions.length;                          // Total number of sessions
    const totalEvents = sessions.reduce((sum, s) => sum + s.eventCount, 0); // Sum of all events
    const avgEventsPerSession = totalEvents / totalSessions || 0;   // Average (or 0 if no sessions)

    // LINE 66: This is what gets SHOWN on the screen
    return (
        // LINE 67: Box is a container (like a box to hold everything)
        <Box>
            {/* LINE 68-70: Page Title */}
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'white' }}>
                Session Analysis
            </Typography>

            {/* LINE 71-98: Summary Cards (like little billboards showing numbers) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Card 1: Total Sessions */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Sessions
                            </Typography>
                            <Typography variant="h3">
                                {totalSessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Card 2: Total Events */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Events
                            </Typography>
                            <Typography variant="h3">
                                {totalEvents}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Card 3: Average Events Per Session */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Avg Events/Session
                            </Typography>
                            <Typography variant="h3">
                                {avgEventsPerSession.toFixed(1)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* LINE 99-133: Sessions Table (shows all sessions in a grid) */}
            <TableContainer component={Paper}>
                <Table>
                    {/* Table Header - the top row with column names */}
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell>Session ID</TableCell>
                            <TableCell align="center">Event Count</TableCell>
                            <TableCell>First Seen</TableCell>
                            <TableCell>Last Seen</TableCell>
                            <TableCell>Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    
                    {/* Table Body - all the data rows */}
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.sessionId} hover>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {session.sessionId.substring(0, 20)}...
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body2" fontWeight={600}>
                                        {session.eventCount}
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatDate(session.firstSeen)}</TableCell>
                                <TableCell>{formatDate(session.lastSeen)}</TableCell>
                                <TableCell>{getSessionDuration(session.firstSeen, session.lastSeen)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* LINE 134-140: Show this message if there are no sessions */}
            {sessions.length === 0 && !loading && (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                    <Typography color="textSecondary">
                        No sessions found. Visit your portfolio to generate events!
                    </Typography>
                </Paper>
            )}
        </Box>  // ← THIS WAS MISSING! The closing Box tag
    );  // ← Closing parenthesis for return
}  // ← Closing curly brace for the function
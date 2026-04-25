// FILE: apps/dashboard/src/pages/EventsTable.tsx

import { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    Box,
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAnalyticsEvents } from '../services/analyticsService';
import type { AnalyticsEvent } from '../types/analytics';

export default function EventsTable() {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<AnalyticsEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        // Filter events based on search term
        const filtered = events.filter(event =>
            event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(event.payload).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
        setPage(0);
    }, [searchTerm, events]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await fetchAnalyticsEvents(1000);
            setEvents(data);
            setFilteredEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'white' }}>
                Events Log
            </Typography>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
<TextField
fullWidth
  variant="outlined"
  placeholder="Search events by name or payload..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{
    // 1. Target the Border (fieldset)
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3)", // Initial border color
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.5)", // Hover state
      },
      "&.Mui-focused fieldset": {
        borderColor: "linear-gradient(to top right, #d946ef, #059669, #020617)", // Focused state
        
      },
    },
    // 2. Target the Placeholder text
    "& .MuiInputBase-input::placeholder": {
      color: "rgba(255, 255, 255, 0.5)",
      opacity: 1,
    },
    // 3. Target the actual Typed text and Icon color
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: "rgba(255, 255, 255, 0.5)", // Makes the Search icon match
    },
  }}
    slotProps={{
        input: {
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon/>
                </InputAdornment>
            )
        }
    }}
/>
            </Paper>

            {/* Events Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Payload</TableCell>
                            <TableCell>Session ID</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedEvents.map((event) => (
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
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: 300, overflow: 'auto' }}>
                                        {JSON.stringify(event.payload, null, 2)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                        {event.sessionId.substring(0, 16)}...
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatDate(event.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={filteredEvents.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {filteredEvents.length === 0 && !loading && (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                    <Typography color="textSecondary">
                        No events found matching your search.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}


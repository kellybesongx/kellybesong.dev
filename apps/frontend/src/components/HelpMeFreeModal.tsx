// FILE: HelpMeFreeModal.tsx - FIXED VERSION

import { useState, useEffect, useRef } from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import helpMeFreeData from '../config/helpMeFree.json';
import type { FreeOption, SelectedFreeOption } from '../types/helpMeFree';
import {trackEvent} from '../utils/analytics';

interface HelpMeFreeModalProps {
    open: boolean;
    onClose: () => void;
    onSelectOption: (option: SelectedFreeOption) => void;
}

export default function HelpMeFreeModal({ 
    open, 
    onClose, 
    onSelectOption 
}: HelpMeFreeModalProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [options, setOptions] = useState<FreeOption[]>([]);
    const [_hoveredId, setHoveredId]   = useState<string | null>(null);


       // Stores the exact millisecond the modal opened
        // Used to calculate "time spent in modal" on close
        const openTimeRef = useRef<number | null>(null);

            // Stores the setTimeout ID for the hover delay timer
            // We need to cancel it if the user moves away before 500ms
            const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setOptions(helpMeFreeData.freeOptions);
    }, [open]);

     useEffect(() => {
            if (!open) return;
            // Guard: if open is false, exit early — nothing to track
    
            // Record the exact moment this modal became visible
            // We'll subtract this from Date.now() on close to get duration
            openTimeRef.current = Date.now();
    
            try {
                trackEvent('modal_open', {
                    modal: 'Help_me_free',
                    // Identifies WHICH modal — useful when you have multiple modals
                    timestamp: new Date().toISOString(),
                    // ISO format: "2024-01-15T10:30:00.000Z"
                    // Timezone-safe, works everywhere in the world
                    referrer: document.referrer || 'direct',
                    // document.referrer = URL of page user came from
                    // 'direct' = typed URL, bookmark, or no referrer available
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                    // "1440x900" — helps you see if mobile/desktop users behave differently
                    isMobile,
                    // The MUI breakpoint result — more reliable than manual pixel math
                });
            } catch (err) {
                // Never let analytics crash the modal
                console.warn('[Analytics] modal_open failed silently:', err);
            }
        }, [open, isMobile]);

     // ── ANALYTICS EVENT 2: MODAL CLOSE ───────────────────────────────────────
        // Wraps onClose to fire before actually closing
        // Calculates time_spent_seconds — a powerful engagement metric
        // "Did people browse for 30 seconds or immediately close?" 
        const handleClose = () => {
            try {
                const timeSpentMs = openTimeRef.current
                    ? Date.now() - openTimeRef.current
                    : 0;
                // Date.now() = current time in milliseconds
                // openTimeRef.current = time when modal opened
                // Difference = duration they had the modal open
    
                trackEvent('modal_close', {
                    modal: 'Help_me_free',
                    timeSpentSeconds: Math.round(timeSpentMs / 1000),
                    // Math.round: 4700ms → 5 seconds (cleaner than 4.7)
                    closedWithoutSelection: true,
                    // true here because handleoptionClick fires BEFORE handleClose
                    // if they clicked a card — so reaching here means no selection
                    timestamp: new Date().toISOString(),
                });
            } catch (err) {
                console.warn('[Analytics] modal_close failed silently:', err);
            }
    
            // ALWAYS call onClose — even if analytics threw an error above
            onClose();
        };
    
        // ── ANALYTICS EVENT 3: option HOVER ────────────────────────────────────
        // Fires only after 500ms of continuous hovering on a card
        // This filters out accidental mouse-overs (mouse just passing through)
        // 500ms = long enough to be intentional, short enough to capture real interest
        // Like the difference between glancing at a menu vs actually reading it
        const handleCardMouseEnter = (option: FreeOption) => {
            setHoveredId(option.id);
    
            // Cancel any previous hover timer
            // Prevents duplicate events if mouse moves between cards quickly
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
    
            // Start a 500ms countdown
            // If mouse stays → fires event. If mouse leaves → gets cancelled below
            hoverTimerRef.current = setTimeout(() => {
                try {
                    trackEvent('option_hover', {
                        modal: 'work_with_me',
                        optionId: option.id,
                        // 'deliver' | 'work' | 'coffee' — for filtering in dashboard
                        optionTitle: option.title,
                        // Human readable: "Deliver My Project" — easier to read
                        minimumHoverMs: 500,
                        // Documents that this only fires after 500ms
                        timestamp: new Date().toISOString(),
                        isMobile,
                        // On mobile, "hover" = touch hold — different interaction
                    });
                } catch (err) {
                    console.warn('[Analytics] option_hover failed silently:', err);
                }
            }, 500);
        };
    
        // ── HOVER CLEANUP ─────────────────────────────────────────────────────────
        // Cancels the hover timer when mouse leaves
        // Prevents phantom events from firing after user has moved away
        const handleCardMouseLeave = () => {
            setHoveredId(null);
    
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
                // Set to null after clearing so we can check "is there a timer?" reliably
            }
        };
    
        // ── ANALYTICS EVENT 4: option CLICK ────────────────────────────────────
        // The most important event — user chose a service and moved to next step!
        // This is a funnel progression event: modal_open → option_click → form_submit
        // Tracking time_to_decide tells you if users know what they want immediately
        // or need time to compare options
        const handleOptionClick = (option: FreeOption) => {
            try {
                const timeToDecideMs = openTimeRef.current
                    ? Date.now() - openTimeRef.current
                    : 0;
                // How long from "modal opened" to "card clicked"?
                // Fast decision (< 5s) = knew exactly what they wanted
                // Slow decision (> 30s) = compared options carefully
    
                trackEvent('option_click', {
                    modal: 'work_with_me',
                    optionId:option.id,
                    optionTitle: option.title,
                    timeToDecideSeconds: Math.round(timeToDecideMs / 1000),
                    timestamp: new Date().toISOString(),
                    isMobile,
                });
            } catch (err) {
                console.warn('[Analytics] option_click failed silently:', err);
            }
            
                  const selected: SelectedFreeOption = {
            id: option.id,
            title: option.title,
            icon: option.icon,
            color: option.color,
            formType: option.formType
        };

        onSelectOption(selected);
    };

        // ── COMPONENT UNMOUNT CLEANUP ─────────────────────────────────────────────
        // When this component is removed from the DOM entirely,
        // cancel any pending timers to prevent memory leaks
        // Like turning off the lights when you leave a room
        useEffect(() => {
            return () => {
                // This return function runs ONLY when component unmounts
                // The [] dependency array ensures it never re-runs during the life
                // of the component — only on the final cleanup
                if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current);
                }
            };
        }, []);
   

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md"
            fullWidth={true} 
            fullScreen={isMobile}
            slotProps={{
                paper: {
                sx: {
                    borderRadius: isMobile ? 0 : '20px',
                    background: 'linear-gradient(135deg, #d946ef 0%, #059669 50%, #020617 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    margin: isMobile ? 0 : '16px',
                }
            }
            }}
        >
            {/* MODAL HEADER - FIXED: No nested heading conflict */}
            <DialogTitle 
                component="div"  // This prevents the h2 from being created
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    py: 1.5,
                    px: { xs: 2, sm: 3 },
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                }}
            >
                <Typography component="div" variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'white',
                }}>
                    Free Help ✨
                </Typography>
                <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* MODAL CONTENT - unchanged */}
            <DialogContent sx={{ 
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 3 }
            }}>
                <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    mb: 3,
                    mt: 3,
                    textAlign: 'center',
                }}>
                    Choose how I can help you for free
                </Typography>

                {/* Three cards side by side */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                        xs: '1fr', 
                        sm: 'repeat(2, 1fr)', 
                        md: 'repeat(3, 1fr)' 
                    },
                    gap: 3,
                }}>
                    {options.map((option) => (
                        <Card
                            key={option.id}
                            onClick={() => handleOptionClick(option)}

                            onMouseEnter={() => handleCardMouseEnter(option)}
                                // ↑ EVENT 3: option_hover (fires after 500ms)

                            onMouseLeave={handleCardMouseLeave}
                                // ↑ Cancels hover timer if mouse leaves before 500ms
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                                    borderColor: option.color,
                                }
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Typography fontSize="3rem" sx={{ mb: 1.5 }}>
                                    {option.icon}
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 600, 
                                    color: 'white', 
                                    mb: 1,
                                }}>
                                    {option.title}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: 'rgba(255,255,255,0.7)',
                                }}>
                                    {option.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
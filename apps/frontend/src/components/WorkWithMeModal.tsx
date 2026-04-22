// FILE: WorkWithMeModal.tsx
// ANALYTICS EVENTS TRACKED:
// ─────────────────────────────────────────────────────────────
// 1. modal_open      → fires when dialog becomes visible
// 2. modal_close     → fires when dialog is dismissed + time spent
// 3. category_hover  → fires after 500ms hover on a card (genuine interest)
// 4. category_click  → fires when user selects a service card
// ─────────────────────────────────────────────────────────────
// GOLDEN RULE: every trackEvent call is wrapped in try/catch
// Analytics MUST never crash the UI — silent failure always

import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../utils/analytics';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import plansData from '../config/plans.json';
import type { Category, SelectedCategory } from '../types/WorkWithMe';

// ── IMAGE URLS ────────────────────────────────────────────────────────────────
const getCategoryImage = (categoryId: string): string => {
    switch (categoryId) {
        case 'deliver': return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop&crop=center';
        case 'work':    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&crop=faces';
        case 'coffee':  return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop&crop=center';
        default:        return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop';
    }
};

// ── ACCENT COLORS ─────────────────────────────────────────────────────────────
const getCategoryAccent = (categoryId: string): string => {
    switch (categoryId) {
        case 'deliver': return '#818cf8';
        case 'work':    return '#34d399';
        case 'coffee':  return '#f59e0b';
        default:        return '#d946ef';
    }
};

// ── CATEGORY GRADIENTS ────────────────────────────────────────────────────────
const getCategoryGradient = (categoryId: string): string => {
    switch (categoryId) {
        case 'deliver': return 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.2) 100%)';
        case 'work':    return 'linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(5,150,105,0.2) 100%)';
        case 'coffee':  return 'linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(217,119,6,0.2) 100%)';
        default:        return 'linear-gradient(135deg, rgba(217,70,239,0.4) 0%, rgba(168,85,247,0.2) 100%)';
    }
};

// ── PROPS INTERFACE ───────────────────────────────────────────────────────────
interface WorkWithMeModalProps {
    open: boolean;
    onClose: () => void;
    onSelectCategory: (category: SelectedCategory) => void;
}

export default function WorkWithMeModal({ 
    open, 
    onClose, 
    onSelectCategory 
}: WorkWithMeModalProps) {

    // ── RESPONSIVE HOOKS ──────────────────────────────────────────────────────
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // ── STATE ─────────────────────────────────────────────────────────────────
    const [categories, setCategories] = useState<Category[]>([]);
    const [hoveredId, setHoveredId]   = useState<string | null>(null);

    // ── ANALYTICS REFS ────────────────────────────────────────────────────────
    // useRef stores values that persist between renders WITHOUT causing re-renders
    // Perfect for timestamps and timers — we just need to read them, not display them
    // Think of refs like sticky notes: you write on them privately, check them later

    // Stores the exact millisecond the modal opened
    // Used to calculate "time spent in modal" on close
    const openTimeRef = useRef<number | null>(null);

    // Stores the setTimeout ID for the hover delay timer
    // We need to cancel it if the user moves away before 500ms
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── LOAD CATEGORIES FROM JSON ─────────────────────────────────────────────
    useEffect(() => {
        setCategories(plansData.categories);
    }, [open]);

    // ── ANALYTICS EVENT 1: MODAL OPEN ─────────────────────────────────────────
    // Dependency: [open] — only runs when open value changes
    // When open goes false → true: records timestamp + fires event
    // When open goes true → false: does nothing (close has its own handler)
    useEffect(() => {
        if (!open) return;
        // Guard: if open is false, exit early — nothing to track

        // Record the exact moment this modal became visible
        // We'll subtract this from Date.now() on close to get duration
        openTimeRef.current = Date.now();

        try {
            trackEvent('modal_open', {
                modal: 'work_with_me',
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
                modal: 'work_with_me',
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                // Math.round: 4700ms → 5 seconds (cleaner than 4.7)
                closedWithoutSelection: true,
                // true here because handleCategoryClick fires BEFORE handleClose
                // if they clicked a card — so reaching here means no selection
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] modal_close failed silently:', err);
        }

        // ALWAYS call onClose — even if analytics threw an error above
        onClose();
    };

    // ── ANALYTICS EVENT 3: CATEGORY HOVER ────────────────────────────────────
    // Fires only after 500ms of continuous hovering on a card
    // This filters out accidental mouse-overs (mouse just passing through)
    // 500ms = long enough to be intentional, short enough to capture real interest
    // Like the difference between glancing at a menu vs actually reading it
    const handleCardMouseEnter = (category: Category) => {
        setHoveredId(category.id);

        // Cancel any previous hover timer
        // Prevents duplicate events if mouse moves between cards quickly
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
        }

        // Start a 500ms countdown
        // If mouse stays → fires event. If mouse leaves → gets cancelled below
        hoverTimerRef.current = setTimeout(() => {
            try {
                trackEvent('category_hover', {
                    modal: 'work_with_me',
                    categoryId: category.id,
                    // 'deliver' | 'work' | 'coffee' — for filtering in dashboard
                    categoryTitle: category.title,
                    // Human readable: "Deliver My Project" — easier to read
                    minimumHoverMs: 500,
                    // Documents that this only fires after 500ms
                    timestamp: new Date().toISOString(),
                    isMobile,
                    // On mobile, "hover" = touch hold — different interaction
                });
            } catch (err) {
                console.warn('[Analytics] category_hover failed silently:', err);
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

    // ── ANALYTICS EVENT 4: CATEGORY CLICK ────────────────────────────────────
    // The most important event — user chose a service and moved to next step!
    // This is a funnel progression event: modal_open → category_click → form_submit
    // Tracking time_to_decide tells you if users know what they want immediately
    // or need time to compare options
    const handleCategoryClick = (category: Category) => {
        try {
            const timeToDecideMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;
            // How long from "modal opened" to "card clicked"?
            // Fast decision (< 5s) = knew exactly what they wanted
            // Slow decision (> 30s) = compared options carefully

            trackEvent('category_click', {
                modal: 'work_with_me',
                categoryId: category.id,
                categoryTitle: category.title,
                timeToDecideSeconds: Math.round(timeToDecideMs / 1000),
                timestamp: new Date().toISOString(),
                isMobile,
            });
        } catch (err) {
            console.warn('[Analytics] category_click failed silently:', err);
        }

        // Build the SelectedCategory object the parent component needs
        const selected: SelectedCategory = {
            id: category.id,
            title: category.title,
            icon: category.icon,
            color: category.color
        };

        // ALWAYS call the selection handler — even if analytics failed
        onSelectCategory(selected);
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

    // ── JSX ───────────────────────────────────────────────────────────────────
    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            // ↑ handleClose not onClose — fires modal_close analytics
            // This also catches backdrop clicks and Escape key presses!
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '28px',
                    background: 'linear-gradient(to top right, #d946ef, #059669, #020617)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    margin: isMobile ? 0 : '32px',
                    overflow: 'hidden',
                    width: '100%',
                    height: '65%',
                    maxWidth: '900px',
                }
            }}
        >
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                py: 2,
                px: 3,
                mb: 7,
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Box>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        color: 'white',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        mb: 0.4,
                    }}>
                        Work With Me
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    }}>
                        Choose your path
                    </Typography>
                </Box>

                {/* Close button — fires modal_close via handleClose */}
                <IconButton 
                    onClick={handleClose}
                    size="small" 
                    sx={{ 
                        color: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        width: 32, height: 32,
                        '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white'
                        }
                    }}
                >
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
            </DialogTitle>

            {/* ── CONTENT ─────────────────────────────────────────────────── */}
            <DialogContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mt: 6, 
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: { xs: 2.5, sm: 2 },
                    maxWidth: '700px',
                    margin: '0 auto',
                }}>
                    {categories.map((category, index) => {
                        const accent    = getCategoryAccent(category.id);
                        const gradient  = getCategoryGradient(category.id);
                        const isHovered = hoveredId === category.id;

                        return (
                            <Box
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                // ↑ EVENT 4: category_click

                                onMouseEnter={() => handleCardMouseEnter(category)}
                                // ↑ EVENT 3: category_hover (fires after 500ms)

                                onMouseLeave={handleCardMouseLeave}
                                // ↑ Cancels hover timer if mouse leaves before 500ms

                                sx={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: isHovered
                                        ? `1px solid ${accent}60`
                                        : '1px solid rgba(255,255,255,0.08)',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(20px)',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                    boxShadow: isHovered
                                        ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accent}30`
                                        : '0 2px 8px rgba(0,0,0,0.2)',
                                    animationName: 'fadeSlideUp',
                                    animationDuration: '0.4s',
                                    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                    animationFillMode: 'both',
                                    animationDelay: `${index * 0.08}s`,
                                    '@keyframes fadeSlideUp': {
                                        from: { opacity: 0, transform: 'translateY(12px)' },
                                        to:   { opacity: 1, transform: 'translateY(0)' },
                                    },
                                }}
                            >
                                {/* ── CONTAINED IMAGE ───────────────────── */}
                                <Box sx={{
                                    position: 'relative',
                                    mx: 2, mt: 2,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    height: { xs: '140px', sm: '110px' },
                                }}>
                                    <Box
                                        component="img"
                                        src={getCategoryImage(category.id)}
                                        alt={category.title}
                                        sx={{
                                            width: '100%', height: '100%',
                                            objectFit: 'cover', objectPosition: 'center',
                                            display: 'block',
                                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                                        }}
                                    />
                                    <Box sx={{
                                        position: 'absolute', inset: 0,
                                        background: gradient,
                                        opacity: isHovered ? 0.6 : 0.4,
                                        transition: 'opacity 0.25s ease',
                                    }} />
                                    <Box sx={{
                                        position: 'absolute', top: 8, left: 8,
                                        width: 32, height: 32,
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(0,0,0,0.45)',
                                        backdropFilter: 'blur(8px)',
                                        border: `1px solid ${accent}50`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem',
                                    }}>
                                        {category.icon}
                                    </Box>
                                </Box>

                                {/* ── TEXT ──────────────────────────────── */}
                                <Box sx={{ p: 2, pb: 2.5 }}>
                                    <Typography sx={{ 
                                        fontWeight: 700,
                                        fontSize: { xs: '0.95rem', sm: '0.875rem' },
                                        color: 'white',
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.2, mb: 0.75,
                                    }}>
                                        {category.title}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: { xs: '0.75rem', sm: '0.7rem' },
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 1.5,
                                    }}>
                                        {category.description}
                                    </Typography>

                                    {/* Hover reveal — slides in from left */}
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', gap: 0.5,
                                        opacity: isHovered ? 1 : 0,
                                        transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                                        transition: 'all 0.2s ease',
                                    }}>
                                        <Box sx={{
                                            width: 16, height: 2,
                                            borderRadius: '1px',
                                            backgroundColor: accent,
                                        }} />
                                        <Typography sx={{
                                            fontSize: '0.65rem', fontWeight: 600,
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            color: accent,
                                        }}>
                                            Select
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                <Typography sx={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    mt: 3, mb: 0.5,
                }}>
                    You'll choose a plan on the next step
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
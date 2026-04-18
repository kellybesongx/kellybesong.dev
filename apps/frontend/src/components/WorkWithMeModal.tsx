

// FILE: WorkWithMeModal.tsx
// REDESIGNED: Compact, elegant cards with contained images, 
// refined typography, and polished micro-interactions

import { useState, useEffect } from 'react';

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
// Square crop (1:1) at small size — fits neatly inside the contained image box
// Tighter crop looks more intentional and editorial than wide landscape crops
const getCategoryImage = (categoryId: string): string => {
    switch (categoryId) {
        case 'deliver':
            return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop&crop=center';
        case 'work':
            return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&crop=faces';
        case 'coffee':
            return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop&crop=center';
        default:
            return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop';
    }
};

// ── CATEGORY ACCENT COLORS ────────────────────────────────────────────────────
// Each card has its own accent color for the icon ring and hover glow
// This gives each option a distinct identity without being garish
const getCategoryAccent = (categoryId: string): string => {
    switch (categoryId) {
        case 'deliver': return '#34d399'; // soft indigo
        case 'work':    return '#34d399'; // emerald
        case 'coffee':  return '#34d399'; // warm amber
        default:        return '#d946ef';
    }
};

// ── CATEGORY GRADIENT ─────────────────────────────────────────────────────────
// Subtle gradient overlay on the image container per category
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
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    // hoveredId tracks which card the mouse is over
    // Used to apply the glow ring effect on the image container

    useEffect(() => {
        setCategories(plansData.categories);
    }, [open]);

    // ── CATEGORY SELECT HANDLER ───────────────────────────────────────────────
    const handleCategoryClick = (category: Category) => {
        const selected: SelectedCategory = {
            id: category.id,
            title: category.title,
            icon: category.icon,
            color: category.color
        };
        onSelectCategory(selected);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm"
            // sm = 600px max — tighter than md (960px)
            // Three compact cards fit perfectly in a smaller dialog
            // Feels more intentional and less empty on desktop
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                      borderRadius: isMobile ? 0 : '28px', // slightly bigger = more premium
                      background: 'linear-gradient(to top right, #d946ef, #059669, #020617)', // 👈 your gradient
                      border: '1px solid rgba(255,255,255,0.08)',
                      margin: isMobile ? 0 : '32px', // 👈 more breathing room
                      overflow: 'hidden',
                      width: '100%',
                      height: '65%',
                      maxWidth: '900px', // 👈 extra control over size
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
                        // Tight letter spacing = editorial, refined feeling
                        lineHeight: 1,
                        mb: 0.4,
                    }}>
                        Work With Me
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        // Small uppercase subtitle = luxury brand aesthetic
                    }}>
                        Choose your path
                    </Typography>
                </Box>
                <IconButton 
                    onClick={onClose} 
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
            <DialogContent sx={{ 
                py: 3,
                px: { xs: 2, sm: 3 },
                
            }}>
                {/* Cards container — vertical stack on mobile, horizontal on desktop */}
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mt: 6, 
                    justifyContent: 'center',   // 👈 centers horizontally
                    alignItems: 'center',
                    gap: { xs: 2.5, sm: 2 },
                    maxWidth: '700px',          // 👈 keeps them grouped
                    margin: '0 auto',           // 👈 centers the whole block
                }}>
                    {categories.map((category, index) => {
                        const accent  = getCategoryAccent(category.id);
                        const gradient = getCategoryGradient(category.id);
                        const isHovered = hoveredId === category.id;

                        return (
                            <Box
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                onMouseEnter={() => setHoveredId(category.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                sx={{
                                    flex: 1,
                                    // flex: 1 = all three cards share width equally
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: isHovered
                                        ? `1px solid ${accent}60`
                                        // 60 = 37.5% opacity in hex — subtle glow border
                                        : '1px solid rgba(255,255,255,0.08)',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(20px)',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    // cubic-bezier easing = smooth, natural motion
                                    // Much better than the default linear transition
                                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                    boxShadow: isHovered
                                        ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accent}30`
                                        // Double shadow: depth shadow + accent glow ring
                                        : '0 2px 8px rgba(0,0,0,0.2)',

                                    // Staggered entrance animation using CSS
                                    // Each card fades in slightly after the previous one
                                    // Creates an elegant "reveal" effect when modal opens
                                    animationName: 'fadeSlideUp',
                                    animationDuration: '0.4s',
                                    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                    animationFillMode: 'both',
                                    animationDelay: `${index * 0.08}s`,
                                    // 0s, 0.08s, 0.16s — each card appears after the last

                                    '@keyframes fadeSlideUp': {
                                        from: { 
                                            opacity: 0, 
                                            transform: 'translateY(12px)' 
                                        },
                                        to: { 
                                            opacity: 1, 
                                            transform: 'translateY(0)' 
                                        },
                                    },
                                }}
                            >
                                {/* ── IMAGE CONTAINER ───────────────────── */}
                                {/* 
                                    The image is contained inside a fixed-height box
                                    with its own border radius — it no longer bleeds
                                    to the card edges. This is what "contained" looks
                                    like: image → rounded box → card body below it.
                                    Like a photo in a frame vs a photo AS the frame.
                                */}
                                <Box sx={{
                                    position: 'relative',
                                    mx: 2,
                                    // mx: 2 = 16px horizontal margin
                                    // Creates visible card body around the image
                                    mt: 2,
                                    // mt: 2 = 16px top margin
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    height: { xs: '140px', sm: '110px' },
                                    // Shorter height than before — more compact
                                    // The image becomes a "thumbnail" not the hero
                                }}>
                                    {/* Photo */}
                                    <Box
                                        component="img"
                                        src={getCategoryImage(category.id)}
                                        alt={category.title}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            display: 'block',
                                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                                            // Subtle zoom on hover — Ken Burns effect
                                            // Adds life without being distracting
                                        }}
                                    />

                                    {/* Gradient overlay on image */}
                                    {/* Creates color-coded tint per category */}
                                    {/* Also darkens bottom so text above is readable */}
                                    <Box sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        // inset: 0 = top/right/bottom/left all 0
                                        // Shorthand to cover the entire parent
                                        background: gradient,
                                        opacity: isHovered ? 0.6 : 0.4,
                                        transition: 'opacity 0.25s ease',
                                        // Overlay becomes more visible on hover
                                        // Gives a "lit up" feeling on interaction
                                    }} />

                                    {/* Category icon floating on image — top left corner */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        width: 32,
                                        height: 32,
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(0,0,0,0.45)',
                                        backdropFilter: 'blur(8px)',
                                        border: `1px solid ${accent}50`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem',
                                        // Small icon badge — editorial detail
                                        // Feels like a magazine category tag
                                    }}>
                                        {category.icon}
                                    </Box>
                                </Box>

                                {/* ── TEXT CONTENT ──────────────────────── */}
                                <Box sx={{
                                    p: 2,
                                    // Uniform padding around text content
                                    pb: 2.5,
                                }}>
                                    {/* Category title */}
                                    <Typography sx={{ 
                                        fontWeight: 700,
                                        fontSize: { xs: '0.95rem', sm: '0.875rem' },
                                        color: 'white',
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.2,
                                        mb: 0.75,
                                    }}>
                                        {category.title}
                                    </Typography>

                                    {/* Description */}
                                    <Typography sx={{ 
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: { xs: '0.75rem', sm: '0.7rem' },
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        // Line clamp caps at 2 lines — keeps cards
                                        // the same height regardless of description length
                                        mb: 1.5,
                                    }}>
                                        {category.description}
                                    </Typography>

                                    {/* "Select →" indicator */}
                                    {/* Appears on hover to signal interactivity */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        opacity: isHovered ? 1 : 0,
                                        transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                                        transition: 'all 0.2s ease',
                                        // Slides in from left on hover
                                        // Hidden at rest — appears as a reward for hovering
                                    }}>
                                        <Box sx={{
                                            width: 16,
                                            height: 2,
                                            borderRadius: '1px',
                                            backgroundColor: accent,
                                            // Small colored line before the text
                                            // Like a typographic bullet point
                                        }} />
                                        <Typography sx={{
                                            fontSize: '0.65rem',
                                            fontWeight: 600,
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

                {/* ── BOTTOM HINT ──────────────────────────────────────────── */}
                {/* Small footer text — sets expectations, feels polished */}
                <Typography sx={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em',
                    mt: 3,
                    mb: 0.5,
                }}>
                    You'll choose a plan on the next step
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
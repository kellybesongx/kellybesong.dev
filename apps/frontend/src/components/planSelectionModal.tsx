// FILE: PlanSelectionModal.tsx
// PURPOSE: Shows 3 plans side by side - click ANY card to open form
// COLORS: All cards use SAME consistent colors

import { useState, useEffect } from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Chip,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import plansData from '../config/plans.json';  // Make sure path is correct
import type { SelectedCategory, SelectedPlan, Plan } from '../types/WorkWithMe';

interface PlanSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    onSelectPlan: (plan: SelectedPlan) => void;  // Called when ANY card is clicked
    selectedCategory: SelectedCategory | null;
}

export default function PlanSelectionModal({ 
    open, 
    onClose, 
    onBack, 
    onSelectPlan,
    selectedCategory 
}: PlanSelectionModalProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [plans, setPlans] = useState<Plan[]>([]);

    // When modal opens, load the plans for this category
    useEffect(() => {
        if (selectedCategory && open) {
            const categoryData = plansData.categories.find(
                cat => cat.id === selectedCategory.id
            );
            setPlans(categoryData?.plans || []);
        }
    }, [selectedCategory, open]);

    // When a plan card is clicked, IMMEDIATELY go to form
    const handlePlanClick = (plan: Plan) => {
        if (selectedCategory) {
            const planData: SelectedPlan = {
                categoryId: selectedCategory.id,
                plan: plan
            };
            onSelectPlan(planData);  // This opens the third modal (form)
        }
    };

    // SAME color for ALL cards (your fuchsia)
    const cardColor = '#d946ef';  // fuchsia - consistent for all

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg"
            fullWidth={true} 
            fullScreen={isMobile}
            slotProps={{
             paper: {
                    sx: {
                        borderRadius: isMobile ? 0 : '20px',
                        // YOUR GRADIENT for modal background
                        background: 'linear-gradient(135deg, #d946ef 0%, #059669 50%, #020617 100%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        margin: isMobile ? 0 : '16px',
                        width: isMobile ? '100%' : 'auto',
                    }
                }
            }}
        >
            {/* MODAL HEADER */}
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                py: 1.5,
                px: { xs: 2, sm: 3 },
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onBack} size="small" sx={{ color: 'white' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        color: 'white',
                    }}>
                        {selectedCategory?.title} - Choose Plan
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* MODAL CONTENT */}
            <DialogContent sx={{ 
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 3 }
            }}>
                <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    mb: { xs: 3, sm: 4 },
                    mt: 3,
                    textAlign: 'center',
                    fontWeight: 500,
                }}>
                    Select a plan below to get started
                </Typography>

                {/* THREE CARDS SIDE BY SIDE */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                        xs: '1fr',           // Mobile: 1 card per row
                        sm: 'repeat(2, 1fr)', // Tablet: 2 cards
                        md: 'repeat(3, 1fr)'   // Desktop: 3 cards side by side
                    },
                    gap: 3,
                }}>
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            onClick={() => handlePlanClick(plan)}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                                    borderColor: cardColor,
                                    boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                {/* Plan Name */}
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 700, 
                                    color: 'white', 
                                    mb: 1,
                                    textAlign: 'center'
                                }}>
                                    {plan.name}
                                </Typography>
                                
                                {/* Price - SAME color for all cards */}
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 800, 
                                    color: cardColor,  // SAME fuchsia for all
                                    textAlign: 'center',
                                    mb: 2,
                                    fontSize: { xs: '2rem', sm: '2.5rem' }
                                }}>
                                    {plan.price}
                                </Typography>

                                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                {/* What You Get section */}
                                <Typography variant="subtitle2" sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    What's Included
                                </Typography>
                                {plan.value.map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}

                                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                {/* Technical Specs section */}
                                <Typography variant="subtitle2" sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    fontWeight: 600,
                                    mb: 1.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    Technical Specs
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {plan.specs.map((spec, idx) => (
                                        <Chip
                                            key={idx}
                                            label={spec}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.08)',
                                                color: 'rgba(255,255,255,0.8)',
                                                fontSize: '0.7rem',
                                                height: '26px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
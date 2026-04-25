// FILE: WorkWithMeButton.tsx
// PURPOSE: Manages the flow between all three modals

import { useState } from 'react';
import { Button } from '@mui/material';
import WorkWithMeModal from '../WorkWithMeModal';
import PlanSelectionModal from '../planSelectionModal';
import InquiryFormModal from '../InquiryFormModal';  // We'll create this next
import type { SelectedCategory, SelectedPlan } from '../../types/WorkWithMe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

export default function WorkWithMeButton() {
    // Track which modals are open
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [planModalOpen, setPlanModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    
    // Store user selections
    const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

    // STEP 1: User selects a category (Deliver, Work, Coffee)
    const handleSelectCategory = (category: SelectedCategory) => {
        setSelectedCategory(category);
        setCategoryModalOpen(false);   // Close first modal
        setPlanModalOpen(true);         // Open second modal (plans)
    };

    // STEP 2: User clicks ANY plan card - immediately go to form
    const handleSelectPlan = (plan: SelectedPlan) => {
        setSelectedPlan(plan);
        setPlanModalOpen(false);        // Close second modal
        setFormModalOpen(true);          // Open third modal (form)
    };

    // Go back from plan modal to category modal
    const handleBackToCategories = () => {
        setPlanModalOpen(false);
        setCategoryModalOpen(true);
    };

    // Go back from form modal to plan modal
    const handleBackToPlans = () => {
        setFormModalOpen(false);
        setPlanModalOpen(true);
    };

    return (
        <>
            {/* THE BUTTON on the homepage */}
            <Button
                onClick={() => setCategoryModalOpen(true)}
                variant="contained"
                disableElevation
                sx={{
                    background: 'linear-gradient(135deg, #d946ef 0%, #059669 100%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: '9999px',
                    display: 'flex',
                    gap: 3,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                        background: 'linear-gradient(135deg, #e879f9 0%, #10b981 100%)',
                    },
                }}
            >
                Work With Me   <FontAwesomeIcon icon={faAnglesRight} />
            </Button>

            {/* MODAL 1: Category Selection */}
            <WorkWithMeModal
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSelectCategory={handleSelectCategory}
            />

            {/* MODAL 2: Plan Selection (3 cards side by side) */}
            <PlanSelectionModal
                open={planModalOpen}
                onClose={() => setPlanModalOpen(false)}
                onBack={handleBackToCategories}
                onSelectPlan={handleSelectPlan}
                selectedCategory={selectedCategory}
            />

            {/* MODAL 3: Inquiry Form - We will build this next */}
               <InquiryFormModal
                open={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onBack={handleBackToPlans}
                selectedCategory={selectedCategory}
                selectedPlan={selectedPlan}
            /> 
        </>
    );
}
// // FILE: HelpMeFreeButton.tsx
// // PURPOSE: The button that opens the free help modal
// // COLORS: Uses your fuchsia → emerald gradient

// import React, { useState } from 'react';
// import { Button } from '@mui/material';
// import HelpMeFreeModal from '../HelpMeFreeModal';
// import type { SelectedFreeOption } from '../types/helpMeFree';

// export default function HelpMeFreeButton() {
//     // State: is the modal open?
//     const [modalOpen, setModalOpen] = useState(false);
    
//     // State: which free option did the user select?
//     const [selectedOption, setSelectedOption] = useState<SelectedFreeOption | null>(null);

//     // When user clicks an option in the first modal
//     const handleSelectOption = (option: SelectedFreeOption) => {
//         setSelectedOption(option);
//         setModalOpen(false);  // Close first modal
//         // TODO: Open the specific form modal based on formType
//         console.log('Selected free option:', option);
//     };

//     // Close the modal
//     const handleCloseModal = () => {
//         setModalOpen(false);
//     };

//     return (
//         <>
//             {/* THE BUTTON - with your brand gradient */}
//             <Button
//                 onClick={() => setModalOpen(true)}
//                 variant="outlined"  // Outlined to distinguish from Work With Me button
//                 sx={{
//     color: 'white',
//     px: 4,
//     py: 1.5,
//     fontSize: { xs: '0.875rem', sm: '1rem' },
//     fontWeight: 600,
//     textTransform: 'none',
//     transition: 'all 0.3s ease',
//     borderRadius: '9999px', // This will work now!

//     // --- THE MAGIC BORDER TRICK ---
//     border: '2px solid transparent', // Make a "gap" for the gradient
//     background: 
//         'linear-gradient(#0f172a, #0f172a) padding-box, ' + // Your button color (matches your modal)
//         'linear-gradient(135deg, #d946ef, #059669) border-box', // Your gradient
    
//     backgroundClip: 'padding-box, border-box',
//     // ------------------------------

//     '&:hover': {
//         transform: 'scale(1.05)',
//         // Lighter version for hover
//         background: 
//             'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)) padding-box, ' +
//             'linear-gradient(135deg, #e879f9, #10b981) border-box',
//     },
// }}
//             >
//                 Help Me Free ✨
//             </Button>

//             {/* FIRST MODAL - Shows 3 free options */}
//             <HelpMeFreeModal
//                 open={modalOpen}
//                 onClose={handleCloseModal}
//                 onSelectOption={handleSelectOption}
//             />
//         </>
//     );
// }

// FILE: HelpMeFreeButton.tsx

import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

interface HelpMeFreeButtonProps {
    onClick: () => void;
}

export default function HelpMeFreeButton({ onClick }: HelpMeFreeButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant="outlined"
    sx={{
    px: 4,
    py: 1.5,
    borderRadius: '9999px',
    fontWeight: 800,
    textTransform: 'none',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    display: 'flex',
    gap: 3,

    // 1. DEFAULT STATE: Solid White
    backgroundColor: '#ffffff',
    color: 'inherit', // Pulls the background color if parent text is set, 
                      // but better to use your EXACT site bg hex here.
    border: '2px solid #ffffff',

    '&:hover': {
        // 2. HOVER STATE: Total Transparency
        backgroundColor: 'transparent', 
        color: '#ffffff', // Text turns white
        
        // Use your background-clip trick
        background: 
            'linear-gradient(transparent, transparent) padding-box, ' + 
            'linear-gradient(135deg, #d946ef, #059669) border-box',
        backgroundClip: 'padding-box, border-box',
        
        // Remove MUI's default hover grey tint
        '@media (hover: hover)': {
            '&:hover': {
                backgroundColor: 'transparent',
            }
        }
    },
}}
        >
            Help Me Free   <FontAwesomeIcon icon={faAnglesRight} />
        </Button>
    );
}
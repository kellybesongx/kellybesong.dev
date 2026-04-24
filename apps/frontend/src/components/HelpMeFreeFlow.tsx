// FILE: HelpMeFreeFlow.tsx

import { useState, useCallback } from 'react';
import HelpMeFreeButton from './ui/HelpMeFreeButton';
import HelpMeFreeModal from './HelpMeFreeModal';
import QuickChatForm from './QuickChatForm';
import WebsiteAuditForm from './WebsiteAuditForm';
import TechCatchupForm from './TechCatchupForm';
import { trackEvent } from '@/utils/analytics'; 
import type { SelectedFreeOption } from '../types/helpMeFree';

export default function HelpMeFreeFlow() {
    const [activeModal, setActiveModal] = useState<'options' | 'quickChat' | 'audit' | 'techCatchup' | null>(null);
    const [selectedOption, setSelectedOption] = useState<SelectedFreeOption | null>(null);

    const openOptionsModal = useCallback(() => {
        setActiveModal('options');
        // 👇 User clicked the main CTA button
        trackEvent('help_me_free_opened', {});
    }, []);

    const closeModal = useCallback(() => {
        // 👇 Track abandonment — which stage did they leave from?
        trackEvent('help_me_free_abandoned', {
            abandonedAt: activeModal,
            hadSelectedOption: !!selectedOption,
            selectedOptionTitle: selectedOption?.title ?? null,
        });
        setActiveModal(null);
        setSelectedOption(null);
    }, [activeModal, selectedOption]);

    const handleSelectOption = useCallback((option: SelectedFreeOption) => {
        setSelectedOption(option);
        setActiveModal(null);

        // 👇 User picked an option — core funnel event
        trackEvent('help_me_free_option_selected', {
            formType: option.formType,
            optionTitle: option.title,
        });

        setTimeout(() => {
            switch (option.formType) {
                case 'quick_chat':
                    setActiveModal('quickChat');
                    break;
                case 'website_audit':
                    setActiveModal('audit');
                    break;
                case 'tech_catchup':
                    setActiveModal('techCatchup');
                    break;
                default:
                    console.error('Unknown form type:', option.formType);
            }
        }, 50);
    }, []);

    const handleBackToOptions = useCallback(() => {
        // 👇 User went back — which form did they back out of?
        trackEvent('help_me_free_back_to_options', {
            backFrom: activeModal,
            selectedOptionTitle: selectedOption?.title ?? null,
        });
        setActiveModal('options');
    }, [activeModal, selectedOption]);

    return (
        <>
            <HelpMeFreeButton onClick={openOptionsModal} />

            <HelpMeFreeModal
                open={activeModal === 'options'}
                onClose={closeModal}
                onSelectOption={handleSelectOption}
            />

            <QuickChatForm
                open={activeModal === 'quickChat'}
                onClose={closeModal}
                onBack={handleBackToOptions}
                optionTitle={selectedOption?.title || '15-Minute Chat'}
            />

            <WebsiteAuditForm
                open={activeModal === 'audit'}
                onClose={closeModal}
                onBack={handleBackToOptions}
                optionTitle={selectedOption?.title || 'Website Audit'}
            />

            <TechCatchupForm
                open={activeModal === 'techCatchup'}
                onClose={closeModal}
                onBack={handleBackToOptions}
                optionTitle={selectedOption?.title || 'Tech Catch-up'}
            />
        </>
    );
}
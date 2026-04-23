// FILE: InquiryFormModal.tsx
// ANALYTICS EVENTS TRACKED:
// ─────────────────────────────────────────────────────────────────────────────
// 1. form_modal_open        → fires when dialog becomes visible
// 2. form_modal_close       → fires on X button close + time spent
// 3. form_back_click        → fires when back arrow is clicked
// 4. form_field_focus       → fires when user clicks into a field (engagement)
// 5. form_validation_error  → fires when submit fails validation
// 6. form_submit_attempt    → fires when submit button is clicked
// 7. form_submit_success    → fires only on confirmed success (THE conversion!)
// 8. form_submit_error      → fires when API call fails
// 9. urgency_selected       → fires when coffee urgency card is picked
// ─────────────────────────────────────────────────────────────────────────────
// GOLDEN RULE: every trackEvent is wrapped in try/catch
// Analytics MUST never crash the UI — always silent failure

import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../utils/analytics';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Alert,
    CircularProgress
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { SelectedCategory, SelectedPlan } from '../types/WorkWithMe';

// ── INTERFACE ─────────────────────────────────────────────────────────────────
interface InquiryFormModalProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    selectedCategory: SelectedCategory | null;
    selectedPlan: SelectedPlan | null;
}

export default function InquiryFormModal({ 
    open, 
    onClose, 
    onBack, 
    selectedCategory, 
    selectedPlan 
}: InquiryFormModalProps) {

    // ── RESPONSIVE HOOKS ──────────────────────────────────────────────────────
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // ── UI STATE ──────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ── SHARED FORM FIELDS ────────────────────────────────────────────────────
    const [name, setName]             = useState('');
    const [email, setEmail]           = useState('');
    const [emailError, setEmailError] = useState('');

    // ── DELIVER FORM FIELDS ───────────────────────────────────────────────────
    const [projectType, setProjectType]               = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    // ── WORK / MENTOR FORM FIELDS ─────────────────────────────────────────────
    const [currentLevel, setCurrentLevel]         = useState('');
    const [primaryGoal, setPrimaryGoal]           = useState('');
    const [goalsDescription, setGoalsDescription] = useState('');

    // ── COFFEE FORM FIELDS ────────────────────────────────────────────────────
    const [urgency, setUrgency] = useState('');
    const [details, setDetails] = useState('');

    // ── ANALYTICS REFS ────────────────────────────────────────────────────────
    // useRef = stores values between renders WITHOUT triggering re-renders
    // Perfect for timestamps and counters we just need to READ, not display

    // Records the exact millisecond this modal opened
    // Used to calculate "time_spent_seconds" when modal closes
    const openTimeRef = useRef<number | null>(null);

    // Tracks which fields the user has interacted with
    // Stored as a Set so each field is only counted once
    // A Set is like an array that automatically prevents duplicates
    // fieldsTouched.add('name') → fieldsTouched.add('name') → still just one 'name'
    const fieldsTouchedRef = useRef<Set<string>>(new Set());

    // Counts how many times the user has tried to submit
    // Multiple submit attempts = they're struggling with validation
    const submitAttemptsRef = useRef<number>(0);

    // ── SELECT OPTIONS ────────────────────────────────────────────────────────
    const projectTypes = [
        'E-commerce Website', 'Portfolio Website', 'Business Website',
        'Web Application', 'Mobile App', 'Dashboard / Admin Panel',
        'API Development', 'CMS Integration', 'Other'
    ];

    const levelOptions = [
        'Beginner (0-6 months)',
        'Intermediate (6 months - 2 years)',
        'Advanced (2+ years)'
    ];

    const goalOptions = [
        'Learn programming', 'Build personal projects', 'Get a job in tech',
        'Advance my career', 'Start my own business', 'Other'
    ];

    // ── ANALYTICS EVENT 1: FORM MODAL OPEN ───────────────────────────────────
    // Fires when open prop changes to true
    // Records timestamp so we can calculate time-on-form later
    useEffect(() => {
        if (!open) return;
        // Guard: if modal is closing (open = false), do nothing here

        // Stamp the exact moment the form became visible
        openTimeRef.current = Date.now();

        // Reset the fields-touched tracker for this new session
        // If user opens → closes → opens again, we start fresh
        fieldsTouchedRef.current = new Set();
        submitAttemptsRef.current = 0;

        try {
            trackEvent('form_modal_open', {
                modal: 'inquiry_form',
                // Which modal — useful if you have multiple forms
                category: selectedCategory?.id ?? 'unknown',
                // 'deliver' | 'work' | 'coffee'
                categoryTitle: selectedCategory?.title ?? 'unknown',
                planId: selectedPlan?.plan.id ?? 'unknown',
                planName: selectedPlan?.plan.name ?? 'unknown',
                // Which plan were they looking at?
                // Very useful — "do Starter users actually fill out the form?"
                planPrice: selectedPlan?.plan.price ?? 0,
                timestamp: new Date().toISOString(),
                isMobile,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
            });
        } catch (err) {
            console.warn('[Analytics] form_modal_open failed silently:', err);
        }
    }, [open]);
    // [open] dependency = only runs when modal opens or closes
    // NOT on every render — very important for performance

    // ── ANALYTICS EVENT 2: FORM MODAL CLOSE ──────────────────────────────────
    // Wraps onClose to capture time spent + engagement depth before closing
    // "Did they read the form carefully or immediately close?"
    const handleCloseAndReset = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;

            trackEvent('form_modal_close', {
                modal: 'inquiry_form',
                category: selectedCategory?.id ?? 'unknown',
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                // Math.round: 4700ms → 5 seconds — clean numbers in dashboard
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Convert Set to array for JSON serialisation
                // ["name", "email"] — shows how far they got before closing
                fieldsTouchedCount: fieldsTouchedRef.current.size,
                // Quick count — "they touched 2 out of 4 fields"
                submitAttempts: submitAttemptsRef.current,
                // Did they try to submit before giving up?
                closedAfterSuccess: success,
                // True = they submitted successfully and are now auto-closing
                // False = they abandoned the form
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] form_modal_close failed silently:', err);
        }

        // Reset all form state
        setName(''); setEmail(''); setEmailError('');
        setProjectType(''); setProjectDescription('');
        setCurrentLevel(''); setPrimaryGoal(''); setGoalsDescription('');
        setUrgency(''); setDetails('');
        setError(null); setSuccess(false);

        // ALWAYS call onClose — even if analytics threw an error
        onClose();
    };

    // ── ANALYTICS EVENT 3: BACK BUTTON CLICK ─────────────────────────────────
    // Fires when user clicks the back arrow to go to previous modal
    // This tells you: did they change their mind about the plan?
    // High back_click rate on a specific plan = that plan has issues
    const handleBack = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;

            trackEvent('form_back_click', {
                modal: 'inquiry_form',
                category: selectedCategory?.id ?? 'unknown',
                planId: selectedPlan?.plan.id ?? 'unknown',
                planName: selectedPlan?.plan.name ?? 'unknown',
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                // How long before they decided to go back?
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Did they start filling in fields before going back?
                // "They typed their name then changed their mind"
                submitAttempts: submitAttemptsRef.current,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] form_back_click failed silently:', err);
        }

        // ALWAYS call onBack — analytics is secondary to UX
        onBack();
    };

    // ── ANALYTICS EVENT 4: FIELD FOCUS ───────────────────────────────────────
    // Fires the FIRST TIME a user clicks into a specific field
    // Tells you: which fields do users engage with first?
    // Are they reaching the description field or giving up earlier?
    // fieldName parameter = 'name' | 'email' | 'projectType' | etc.
    const handleFieldFocus = (fieldName: string) => {
        // Only track the FIRST focus on each field
        // hasTracked prevents spam events from repeatedly focusing the same field
        const hasTracked = fieldsTouchedRef.current.has(fieldName);

        if (!hasTracked) {
            // Add to our Set — prevents duplicate tracking
            fieldsTouchedRef.current.add(fieldName);

            try {
                trackEvent('form_field_focus', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    fieldName,
                    // 'name', 'email', 'projectType', 'projectDescription' etc
                    fieldOrder: fieldsTouchedRef.current.size,
                    // 1 = first field they touched, 2 = second, etc.
                    // "Most users reach field 2 but not field 3" = drop-off insight
                    timestamp: new Date().toISOString(),
                });
            } catch (err) {
                console.warn('[Analytics] form_field_focus failed silently:', err);
            }
        }
    };

    // ── EMAIL VALIDATION ──────────────────────────────────────────────────────
    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (newEmail && !validateEmail(newEmail)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    // ── ANALYTICS EVENT 5, 6, 7, 8: FORM SUBMISSION ──────────────────────────
    // Four possible outcomes when user clicks Submit:
    // A) Validation fails  → form_validation_error
    // B) API call starts   → form_submit_attempt (always)
    // C) API succeeds      → form_submit_success (THE conversion event!)
    // D) API fails         → form_submit_error
    const handleSubmit = async () => {

        // Count this attempt regardless of outcome
        submitAttemptsRef.current += 1;
        // += 1 increments the counter
        // ref.current lets us mutate without re-render

        // ── VALIDATION ────────────────────────────────────────────────────
        if (!name.trim()) {
            setError('Please enter your name');

            try {
                // EVENT 5: form_validation_error
                trackEvent('form_validation_error', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    failedField: 'name',
                    // WHICH field caused the failure
                    errorMessage: 'Name is required',
                    submitAttemptNumber: submitAttemptsRef.current,
                    // Is this their 1st or 3rd failed attempt?
                    timestamp: new Date().toISOString(),
                });
            } catch (err) {
                console.warn('[Analytics] form_validation_error failed silently:', err);
            }
            return;
        }

        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');

            try {
                trackEvent('form_validation_error', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    failedField: 'email',
                    errorMessage: email ? 'Invalid email format' : 'Email is required',
                    // Two different errors for the same field
                    // Empty vs invalid format = different UX problems
                    submitAttemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) {
                console.warn('[Analytics] form_validation_error failed silently:', err);
            }
            return;
        }

        setLoading(true);
        setError(null);

        // ── EVENT 6: FORM SUBMIT ATTEMPT ──────────────────────────────────
        // Fires for every submit click that passed basic validation
        // This is the START of the conversion funnel within the form
        try {
            trackEvent('form_submit_attempt', {
                modal: 'inquiry_form',
                category: selectedCategory?.id ?? 'unknown',
                categoryTitle: selectedCategory?.title ?? 'unknown',
                planId: selectedPlan?.plan.id ?? 'unknown',
                planName: selectedPlan?.plan.name ?? 'unknown',
                planPrice: selectedPlan?.plan.price ?? 0,
                attemptNumber: submitAttemptsRef.current,
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Full picture of engagement before they hit submit
                timestamp: new Date().toISOString(),
                isMobile,
            });
        } catch (err) {
            console.warn('[Analytics] form_submit_attempt failed silently:', err);
        }

        try {
            let formData = {};

            if (selectedCategory?.id === 'deliver') {
                if (!projectType) {
                    setError('Please select a project type');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form',
                            category: 'deliver',
                            failedField: 'projectType',
                            errorMessage: 'Project type is required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                if (!projectDescription.trim()) {
                    setError('Please describe your project');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form',
                            category: 'deliver',
                            failedField: 'projectDescription',
                            errorMessage: 'Project description is required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                formData = {
                    name, email, projectType, projectDescription,
                    planId: selectedPlan?.plan.id,
                    planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price,
                    createdAt: new Date().toISOString(),
                    category: 'deliver'
                };

            } else if (selectedCategory?.id === 'work') {
                if (!currentLevel) {
                    setError('Please select your current level');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form', category: 'work',
                            failedField: 'currentLevel',
                            errorMessage: 'Current level is required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                if (!primaryGoal) {
                    setError('Please select your primary goal');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form', category: 'work',
                            failedField: 'primaryGoal',
                            errorMessage: 'Primary goal is required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                if (!goalsDescription.trim()) {
                    setError('Please describe your goals');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form', category: 'work',
                            failedField: 'goalsDescription',
                            errorMessage: 'Goals description is required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                formData = {
                    name, email, currentLevel, primaryGoal, goalsDescription,
                    planId: selectedPlan?.plan.id,
                    planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price,
                    createdAt: new Date().toISOString(),
                    category: 'work'
                };

            } else if (selectedCategory?.id === 'coffee') {
                if (!urgency) {
                    setError('Please select urgency level');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form', category: 'coffee',
                            failedField: 'urgency',
                            errorMessage: 'Urgency level is required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                if (!details.trim()) {
                    setError('Please provide more details');
                    try {
                        trackEvent('form_validation_error', {
                            modal: 'inquiry_form', category: 'coffee',
                            failedField: 'details',
                            errorMessage: 'Details are required',
                            submitAttemptNumber: submitAttemptsRef.current,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                    setLoading(false); return;
                }
                formData = {
                    name, email, urgency, details,
                    planId: selectedPlan?.plan.id,
                    planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price,
                    createdAt: new Date().toISOString(),
                    category: 'coffee'
                };
            }

            // TODO: Replace with real API call to your backend
            console.log('Submitting form data:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // ── EVENT 7: FORM SUBMIT SUCCESS ──────────────────────────────
            // THIS IS THE CONVERSION EVENT — the most valuable in your funnel
            // Only fires on confirmed success, never on attempts
            // Use this to calculate: form_submit_success / cta_click = conversion rate
            try {
                const timeSpentMs = openTimeRef.current
                    ? Date.now() - openTimeRef.current
                    : 0;

                trackEvent('form_submit_success', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    categoryTitle: selectedCategory?.title ?? 'unknown',
                    planId: selectedPlan?.plan.id ?? 'unknown',
                    planName: selectedPlan?.plan.name ?? 'unknown',
                    planPrice: selectedPlan?.plan.price ?? 0,
                    // Revenue potential data — "which plans convert best?"
                    totalTimeSpentSeconds: Math.round(timeSpentMs / 1000),
                    // How long did it take from form open → successful submit?
                    totalSubmitAttempts: submitAttemptsRef.current,
                    // Did they submit on first try or needed multiple attempts?
                    fieldsTouched: Array.from(fieldsTouchedRef.current),
                    timestamp: new Date().toISOString(),
                    isMobile,
                });
            } catch (err) {
                console.warn('[Analytics] form_submit_success failed silently:', err);
            }

            setSuccess(true);

            // Auto close after showing success message for 2 seconds
            setTimeout(() => { handleCloseAndReset(); }, 2000);

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);

            // ── EVENT 8: FORM SUBMIT ERROR ────────────────────────────────
            // Fires only when the API itself fails (network error, server error)
            // Different from validation_error — this is a TECHNICAL failure
            // "How often does my backend fail?" = reliability metric
            try {
                trackEvent('form_submit_error', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    planId: selectedPlan?.plan.id ?? 'unknown',
                    errorMessage: err instanceof Error ? err.message : 'Unknown error',
                    // Captures the actual error message for debugging
                    attemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (analyticsErr) {
                console.warn('[Analytics] form_submit_error failed silently:', analyticsErr);
            }
        } finally {
            setLoading(false);
        }
    };

    // ── ANALYTICS EVENT 9: URGENCY SELECTED ──────────────────────────────────
    // Only relevant for the Coffee form — tracks which urgency level users pick
    // "Do most coffee chats feel urgent or relaxed?"
    const handleUrgencySelect = (level: string) => {
        setUrgency(level);

        try {
            trackEvent('urgency_selected', {
                modal: 'inquiry_form',
                category: 'coffee',
                urgencyLevel: level,
                // 'Low' | 'Medium' | 'High'
                previousUrgency: urgency || null,
                // Did they change their mind? null = first selection
                // 'Low' then 'High' = they reconsidered
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] urgency_selected failed silently:', err);
        }
    };

    // ── FORM TITLE ────────────────────────────────────────────────────────────
    const getFormTitle = () => {
        if (selectedCategory && selectedPlan) {
            return `${selectedCategory.title} - ${selectedPlan.plan.name}`;
        }
        return 'Complete Your Request';
    };

    // ── SHARED SX STYLES ──────────────────────────────────────────────────────
    const rowSx = {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' } as const,
        gap: 2.5,
    };

    const textFieldSx = {
        flex: 1,
        '& input': { color: 'white' },
        '& textarea': { color: 'white' },
        '& label': { 
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-focused': { color: 'white' }
        },
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
            '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.5)',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.85)',
        },
    };

    const selectSx = {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
        '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.85)' },
        '& .MuiSvgIcon-root': { color: 'white' },
    };

    const formControlSx = {
        flex: 1,
        '& .MuiInputLabel-root': {
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-focused': { color: 'white' },
        },
    };

    // ── SHARED NAME + EMAIL ROW ───────────────────────────────────────────────
    // handleFieldFocus('name') tracks when user first clicks the name field
    // Same for email — tells us engagement depth before drop-off
    const nameEmailRow = (
        <Box sx={rowSx}>
            <TextField
                fullWidth label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleFieldFocus('name')}
                // ↑ EVENT 4: form_field_focus — fires on first focus only
                required sx={textFieldSx}
            />
            <TextField
                fullWidth label="Email Address"
                type="email" value={email}
                onChange={handleEmailChange}
                onFocus={() => handleFieldFocus('email')}
                // ↑ EVENT 4: form_field_focus
                error={!!emailError}
                helperText={emailError}
                required sx={textFieldSx}
            />
        </Box>
    );

    // ── DYNAMIC FORM FIELDS ───────────────────────────────────────────────────
    const renderFormFields = () => {

        const FormWrapper = ({ children }: { children: React.ReactNode }) => (
            <Box sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                p: { xs: 2, sm: 3 },
                mt: 2,
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                {children}
            </Box>
        );

        // ── DELIVER FORM ──────────────────────────────────────────────────────
        if (selectedCategory?.id === 'deliver') {
            return (
                <FormWrapper>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {nameEmailRow}
                        <FormControl fullWidth required>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } }}>
                                Project Type
                            </InputLabel>
                            <Select
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                                onOpen={() => handleFieldFocus('projectType')}
                                // ↑ EVENT 4: tracks when dropdown is opened
                                label="Project Type"
                                sx={selectSx}
                            >
                                {projectTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth label="Project Description"
                            multiline rows={4}
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            onFocus={() => handleFieldFocus('projectDescription')}
                            // ↑ EVENT 4: the textarea is the deepest field
                            // "Did they reach the description?" = strong intent signal
                            placeholder="Describe what you want your project to look like, features you need, timeline, etc."
                            required sx={textFieldSx}
                        />
                    </Box>
                </FormWrapper>
            );
        }

        // ── WORK / MENTOR FORM ────────────────────────────────────────────────
        if (selectedCategory?.id === 'work') {
            return (
                <FormWrapper>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {nameEmailRow}
                        <Box sx={rowSx}>
                            <FormControl fullWidth required sx={formControlSx}>
                                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } }}>
                                    Current Level
                                </InputLabel>
                                <Select
                                    value={currentLevel}
                                    onChange={(e) => setCurrentLevel(e.target.value)}
                                    onOpen={() => handleFieldFocus('currentLevel')}
                                    label="Current Level" sx={selectSx}
                                >
                                    {levelOptions.map((level) => (
                                        <MenuItem key={level} value={level}>{level}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth required sx={formControlSx}>
                                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } }}>
                                    Primary Goal
                                </InputLabel>
                                <Select
                                    value={primaryGoal}
                                    onChange={(e) => setPrimaryGoal(e.target.value)}
                                    onOpen={() => handleFieldFocus('primaryGoal')}
                                    label="Primary Goal" sx={selectSx}
                                >
                                    {goalOptions.map((goal) => (
                                        <MenuItem key={goal} value={goal}>{goal}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField
                            fullWidth label="Your Goals"
                            multiline rows={4}
                            value={goalsDescription}
                            onChange={(e) => setGoalsDescription(e.target.value)}
                            onFocus={() => handleFieldFocus('goalsDescription')}
                            placeholder="Tell me more about what you want to achieve, what you're building, and how I can help..."
                            required sx={textFieldSx}
                        />
                    </Box>
                </FormWrapper>
            );
        }

        // ── COFFEE FORM ───────────────────────────────────────────────────────
        if (selectedCategory?.id === 'coffee') {
            return (
                <FormWrapper>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {nameEmailRow}
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                                How urgent is this? *
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <Card
                                        key={level}
                                        onClick={() => handleUrgencySelect(level)}
                                        // ↑ EVENT 9: urgency_selected — uses our
                                        //   wrapped handler instead of setUrgency directly
                                        sx={{
                                            cursor: 'pointer',
                                            flex: 1,
                                            minWidth: { xs: '100%', sm: '80px' },
                                            backgroundColor: urgency === level 
                                                ? 'rgba(217, 70, 239, 0.3)'
                                                : 'rgba(0, 0, 0, 0.25)',
                                            backdropFilter: 'blur(8px)',
                                            border: urgency === level 
                                                ? '2px solid #d946ef'
                                                : '1px solid rgba(255,255,255,0.15)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(217, 70, 239, 0.2)',
                                                transform: 'translateY(-2px)',
                                                border: '1px solid rgba(217, 70, 239, 0.5)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                                                {level}
                                            </Typography>
                                            {level === 'Low' && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Within 2 weeks</Typography>}
                                            {level === 'Medium' && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Within 1 week</Typography>}
                                            {level === 'High' && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Within 2-3 days</Typography>}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                        <TextField
                            fullWidth label="Additional Details"
                            multiline rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            onFocus={() => handleFieldFocus('details')}
                            placeholder="What would you like to discuss? Any specific topics or questions?"
                            required sx={textFieldSx}
                        />
                    </Box>
                </FormWrapper>
            );
        }

        return null;
    };

    // ── JSX RETURN ─────────────────────────────────────────────────────────────
    return (
        <Dialog 
            open={open} 
            onClose={handleCloseAndReset}
            // ↑ handleCloseAndReset wraps onClose — fires form_modal_close analytics
            // This also catches Escape key and backdrop click automatically
            maxWidth="md"
            fullWidth
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
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <DialogTitle sx={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                py: 1.5, px: { xs: 2, sm: 3 },
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Back button — fires form_back_click analytics */}
                    <IconButton 
                        onClick={handleBack}
                        // ↑ handleBack not onBack — fires EVENT 3
                        size="small" 
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        color: 'white',
                    }}>
                        Complete Your Request
                    </Typography>
                </Box>
                {/* Close button — fires form_modal_close analytics */}
                <IconButton 
                    onClick={handleCloseAndReset}
                    // ↑ handleCloseAndReset not onClose — fires EVENT 2
                    size="small" 
                    sx={{ color: 'white' }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* ── CONTENT ─────────────────────────────────────────────────── */}
            <DialogContent sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" sx={{ 
                    fontWeight: 700, color: 'white',
                    textAlign: 'center', mb: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                    {getFormTitle()}
                </Typography>
                <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    textAlign: 'center', mb: 3,
                }}>
                    Please fill out the information below
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                        Thank you! Your request has been submitted. I'll get back to you within 24 hours.
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {!success && renderFormFields()}

                {!success && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            // ↑ handleSubmit fires Events 5, 6, 7, or 8
                            // depending on validation result and API outcome
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(135deg, #d946ef, #059669)',
                                color: 'white',
                                px: 5, py: 1.25,
                                borderRadius: '9999px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minWidth: '200px',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    background: 'linear-gradient(135deg, #e879f9, #10b981)',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'rgba(255,255,255,0.5)',
                                }
                            }}
                        >
                            {loading 
                                ? <CircularProgress size={24} color="inherit" /> 
                                : 'Submit Request →'
                            }
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
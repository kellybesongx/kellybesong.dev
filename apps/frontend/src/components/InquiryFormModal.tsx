// FILE: InquiryFormModal.tsx
// BUG FIX: FormWrapper moved outside the component function
//          It was previously defined inside renderFormFields() which caused
//          React to create a brand new component on every keystroke,
//          unmounting and remounting the form fields and losing focus instantly.
//
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

// ── FORM WRAPPER — defined at MODULE LEVEL (outside the component) ─────────────
// ⚠️ CRITICAL: This MUST live outside InquiryFormModal.
// If defined inside the component or inside renderFormFields(), React creates a
// brand new component reference on every re-render (every keystroke).
// When React sees a new component reference, it unmounts the old one and mounts
// the new one — destroying all internal DOM state including input focus.
// At module level it is created ONCE and never changes — React reuses it safely.
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

// ── PROPS INTERFACE ───────────────────────────────────────────────────────────
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
    // useRef stores values between renders WITHOUT triggering re-renders
    // Perfect for timestamps and counters we just need to READ, not display

    // Records the exact millisecond this modal opened
    const openTimeRef = useRef<number | null>(null);

    // Tracks which fields the user has interacted with
    // Set automatically prevents duplicates — each field counted once only
    const fieldsTouchedRef = useRef<Set<string>>(new Set());

    // Counts total submit attempts — multiple attempts = struggling with form
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

    // ── SHARED SX STYLES ──────────────────────────────────────────────────────
    // Defined once — reused on every field (DRY principle)

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

    // ── ANALYTICS EVENT 1: FORM MODAL OPEN ───────────────────────────────────
    useEffect(() => {
        if (!open) return;

        openTimeRef.current = Date.now();
        fieldsTouchedRef.current = new Set();
        submitAttemptsRef.current = 0;

        try {
            trackEvent('form_modal_open', {
                modal: 'inquiry_form',
                category: selectedCategory?.id ?? 'unknown',
                categoryTitle: selectedCategory?.title ?? 'unknown',
                planId: selectedPlan?.plan.id ?? 'unknown',
                planName: selectedPlan?.plan.name ?? 'unknown',
                planPrice: selectedPlan?.plan.price ?? 0,
                timestamp: new Date().toISOString(),
                isMobile,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
            });
        } catch (err) {
            console.warn('[Analytics] form_modal_open failed silently:', err);
        }
    }, [open]);

    // ── ANALYTICS EVENT 2: FORM MODAL CLOSE ──────────────────────────────────
    const handleCloseAndReset = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;

            trackEvent('form_modal_close', {
                modal: 'inquiry_form',
                category: selectedCategory?.id ?? 'unknown',
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                fieldsTouchedCount: fieldsTouchedRef.current.size,
                submitAttempts: submitAttemptsRef.current,
                closedAfterSuccess: success,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] form_modal_close failed silently:', err);
        }

        setName(''); setEmail(''); setEmailError('');
        setProjectType(''); setProjectDescription('');
        setCurrentLevel(''); setPrimaryGoal(''); setGoalsDescription('');
        setUrgency(''); setDetails('');
        setError(null); setSuccess(false);
        onClose();
    };

    // ── ANALYTICS EVENT 3: BACK BUTTON CLICK ─────────────────────────────────
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
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                submitAttempts: submitAttemptsRef.current,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] form_back_click failed silently:', err);
        }

        onBack();
    };

    // ── ANALYTICS EVENT 4: FIELD FOCUS ───────────────────────────────────────
    // Fires only the FIRST time each field is focused — not on every click
    const handleFieldFocus = (fieldName: string) => {
        if (fieldsTouchedRef.current.has(fieldName)) return;
        // Guard: already tracked this field — skip to prevent duplicate events

        fieldsTouchedRef.current.add(fieldName);

        try {
            trackEvent('form_field_focus', {
                modal: 'inquiry_form',
                category: selectedCategory?.id ?? 'unknown',
                fieldName,
                fieldOrder: fieldsTouchedRef.current.size,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] form_field_focus failed silently:', err);
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

    // ── ANALYTICS EVENT 9: URGENCY SELECTED ──────────────────────────────────
    const handleUrgencySelect = (level: string) => {
        setUrgency(level);
        try {
            trackEvent('urgency_selected', {
                modal: 'inquiry_form',
                category: 'coffee',
                urgencyLevel: level,
                previousUrgency: urgency || null,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] urgency_selected failed silently:', err);
        }
    };

    // ── ANALYTICS EVENTS 5, 6, 7, 8: FORM SUBMISSION ─────────────────────────
    const handleSubmit = async () => {
        submitAttemptsRef.current += 1;

        // Validation checks
        if (!name.trim()) {
            setError('Please enter your name');
            try {
                trackEvent('form_validation_error', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    failedField: 'name',
                    errorMessage: 'Name is required',
                    submitAttemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] validation error silent:', err); }
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
                    submitAttemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] validation error silent:', err); }
            return;
        }

        setLoading(true);
        setError(null);

        // EVENT 6: submit attempt (passed basic validation)
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
                timestamp: new Date().toISOString(),
                isMobile,
            });
        } catch (err) { console.warn('[Analytics] form_submit_attempt silent:', err); }

        try {
            let formData = {};

            if (selectedCategory?.id === 'deliver') {
                if (!projectType) {
                    setError('Please select a project type');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'deliver', failedField: 'projectType', errorMessage: 'Project type is required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                if (!projectDescription.trim()) {
                    setError('Please describe your project');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'deliver', failedField: 'projectDescription', errorMessage: 'Project description is required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                formData = {
                    name, email, projectType, projectDescription,
                    planId: selectedPlan?.plan.id, planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price, createdAt: new Date().toISOString(), category: 'deliver'
                };

            } else if (selectedCategory?.id === 'work') {
                if (!currentLevel) {
                    setError('Please select your current level');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'work', failedField: 'currentLevel', errorMessage: 'Current level is required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                if (!primaryGoal) {
                    setError('Please select your primary goal');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'work', failedField: 'primaryGoal', errorMessage: 'Primary goal is required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                if (!goalsDescription.trim()) {
                    setError('Please describe your goals');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'work', failedField: 'goalsDescription', errorMessage: 'Goals description is required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                formData = {
                    name, email, currentLevel, primaryGoal, goalsDescription,
                    planId: selectedPlan?.plan.id, planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price, createdAt: new Date().toISOString(), category: 'work'
                };

            } else if (selectedCategory?.id === 'coffee') {
                if (!urgency) {
                    setError('Please select urgency level');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'coffee', failedField: 'urgency', errorMessage: 'Urgency level is required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                if (!details.trim()) {
                    setError('Please provide more details');
                    try { trackEvent('form_validation_error', { modal: 'inquiry_form', category: 'coffee', failedField: 'details', errorMessage: 'Details are required', submitAttemptNumber: submitAttemptsRef.current, timestamp: new Date().toISOString() }); } catch (e) { /* silent */ }
                    setLoading(false); return;
                }
                formData = {
                    name, email, urgency, details,
                    planId: selectedPlan?.plan.id, planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price, createdAt: new Date().toISOString(), category: 'coffee'
                };
            }

            // TODO: Replace with real API call to your backend
            console.log('Submitting form data:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // EVENT 7: success — THE conversion event
            try {
                const timeSpentMs = openTimeRef.current ? Date.now() - openTimeRef.current : 0;
                trackEvent('form_submit_success', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    categoryTitle: selectedCategory?.title ?? 'unknown',
                    planId: selectedPlan?.plan.id ?? 'unknown',
                    planName: selectedPlan?.plan.name ?? 'unknown',
                    planPrice: selectedPlan?.plan.price ?? 0,
                    totalTimeSpentSeconds: Math.round(timeSpentMs / 1000),
                    totalSubmitAttempts: submitAttemptsRef.current,
                    fieldsTouched: Array.from(fieldsTouchedRef.current),
                    timestamp: new Date().toISOString(),
                    isMobile,
                });
            } catch (err) { console.warn('[Analytics] form_submit_success silent:', err); }

            setSuccess(true);
            setTimeout(() => { handleCloseAndReset(); }, 2000);

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);

            // EVENT 8: API/network failure
            try {
                trackEvent('form_submit_error', {
                    modal: 'inquiry_form',
                    category: selectedCategory?.id ?? 'unknown',
                    planId: selectedPlan?.plan.id ?? 'unknown',
                    errorMessage: err instanceof Error ? err.message : 'Unknown error',
                    attemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (analyticsErr) { console.warn('[Analytics] form_submit_error silent:', analyticsErr); }
        } finally {
            setLoading(false);
        }
    };

    // ── FORM TITLE ────────────────────────────────────────────────────────────
    const getFormTitle = () => {
        if (selectedCategory && selectedPlan) {
            return `${selectedCategory.title} - ${selectedPlan.plan.name}`;
        }
        return 'Complete Your Request';
    };

    // ── SHARED NAME + EMAIL ROW ───────────────────────────────────────────────
    // Defined as JSX variable — reused in all three forms (DRY principle)
    const nameEmailRow = (
        <Box sx={rowSx}>
            <TextField
                fullWidth label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleFieldFocus('name')}
                required sx={textFieldSx}
            />
            <TextField
                fullWidth label="Email Address"
                type="email" value={email}
                onChange={handleEmailChange}
                onFocus={() => handleFieldFocus('email')}
                error={!!emailError}
                helperText={emailError}
                required sx={textFieldSx}
            />
        </Box>
    );

    // ── DYNAMIC FORM FIELDS ───────────────────────────────────────────────────
    // FormWrapper is imported from module scope above — NOT redefined here
    // This is the fix: renderFormFields() uses the stable module-level FormWrapper
    const renderFormFields = () => {

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
                    <IconButton 
                        onClick={handleBack}
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
                <IconButton 
                    onClick={handleCloseAndReset}
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
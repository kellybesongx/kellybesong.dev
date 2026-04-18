// FILE: InquiryFormModal.tsx
// UPDATED: 
// - Name + Email side by side (stack on mobile)
// - Select fields side by side (stack on mobile)
// - Textarea always full width at bottom
// - Elevated field backgrounds with glassmorphism
// - Uses Box flex instead of Grid (Grid v9 has breaking changes)

import { useState } from 'react';

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
    // isMobile = true on screens smaller than 600px (phones)
    // isMobile = false on tablets and desktops

    // ── UI STATE ──────────────────────────────────────────────────────────────
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState<string | null>(null);
    const [success, setSuccess]   = useState(false);

    // ── SHARED FIELDS (all three forms use these) ─────────────────────────────
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

    // ── SELECT OPTIONS ────────────────────────────────────────────────────────
    const projectTypes = [
        'E-commerce Website',
        'Portfolio Website',
        'Business Website',
        'Web Application',
        'Mobile App',
        'Dashboard / Admin Panel',
        'API Development',
        'CMS Integration',
        'Other'
    ];

    const levelOptions = [
        'Beginner (0-6 months)',
        'Intermediate (6 months - 2 years)',
        'Advanced (2+ years)'
    ];

    const goalOptions = [
        'Learn programming',
        'Build personal projects',
        'Get a job in tech',
        'Advance my career',
        'Start my own business',
        'Other'
    ];

    // ── SHARED SX STYLES ──────────────────────────────────────────────────────
    // Defined ONCE and reused on every field — DRY principle
    // One change here updates every single field simultaneously

    // rowSx — the "side by side" wrapper applied to every pair of fields
    // xs: 'column' = phones stack vertically
    // sm: 'row'    = tablets and above go side by side
    const rowSx = {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' } as const,
        gap: 2.5,
    };

    // textFieldSx — elevation + white text + responsive border states
    const textFieldSx = {
        flex: 1,
        // flex: 1 = "take equal share of available row width"
        // Two siblings with flex: 1 each → they split 50/50
        // Like two friends sharing a bench equally

        '& input': { color: 'white' },
        '& textarea': { color: 'white' },

        '& label': { 
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-focused': { color: 'white' }
            // Label turns fully white when field is actively focused
        },

        // ── ELEVATED BACKGROUND ────────────────────────────────────────────
        // Three layers of depth to match the modal background:
        // Resting:  rgba(0,0,0,0.25) — dark glass card floating on gradient
        // Hover:    rgba(0,0,0,0.35) — slightly darker = "this is interactive"
        // Focused:  rgba(0,0,0,0.45) — darkest = "you are here right now"
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            // backdropFilter blurs whatever is BEHIND the input field
            // Combined with semi-transparent background = glassmorphism
            borderRadius: '8px',
            transition: 'background-color 0.2s ease',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
            },
            '&.Mui-focused': {
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
            },
        },

        // Border: three states matching the background states
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.5)',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.85)',
            // Bright border on focus — strong "you are here" signal
        },
    };

    // selectSx — same elevation effect applied directly to Select component
    const selectSx = {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
        '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.5)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.85)',
        },
        '& .MuiSvgIcon-root': {
            color: 'white',
            // Forces dropdown arrow icon to white
            // Without this it turns dark and vanishes on dark backgrounds
        },
    };

    // formControlSx — gives FormControl flex: 1 so Select fields share row space
    const formControlSx = {
        flex: 1,
        '& .MuiInputLabel-root': {
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-focused': { color: 'white' },
        },
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

    // ── FORM SUBMISSION ───────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!name.trim()) { setError('Please enter your name'); return; }
        if (!email || !validateEmail(email)) { setError('Please enter a valid email address'); return; }

        setLoading(true);
        setError(null);

        try {
            let formData = {};

            if (selectedCategory?.id === 'deliver') {
                if (!projectType) { setError('Please select a project type'); setLoading(false); return; }
                if (!projectDescription.trim()) { setError('Please describe your project'); setLoading(false); return; }
                formData = {
                    name, email, projectType, projectDescription,
                    planId: selectedPlan?.plan.id, planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price, createdAt: new Date().toISOString(), category: 'deliver'
                };
            } else if (selectedCategory?.id === 'work') {
                if (!currentLevel) { setError('Please select your current level'); setLoading(false); return; }
                if (!primaryGoal) { setError('Please select your primary goal'); setLoading(false); return; }
                if (!goalsDescription.trim()) { setError('Please describe your goals'); setLoading(false); return; }
                formData = {
                    name, email, currentLevel, primaryGoal, goalsDescription,
                    planId: selectedPlan?.plan.id, planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price, createdAt: new Date().toISOString(), category: 'work'
                };
            } else if (selectedCategory?.id === 'coffee') {
                if (!urgency) { setError('Please select urgency level'); setLoading(false); return; }
                if (!details.trim()) { setError('Please provide more details'); setLoading(false); return; }
                formData = {
                    name, email, urgency, details,
                    planId: selectedPlan?.plan.id, planName: selectedPlan?.plan.name,
                    price: selectedPlan?.plan.price, createdAt: new Date().toISOString(), category: 'coffee'
                };
            }

            // TODO: Replace with real API call to your backend
            console.log('Submitting form data:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
            setTimeout(() => { handleCloseAndReset(); }, 2000);

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── RESET ─────────────────────────────────────────────────────────────────
    // Clears every field back to empty — called on close or after success
    const handleCloseAndReset = () => {
        setName(''); setEmail(''); setEmailError('');
        setProjectType(''); setProjectDescription('');
        setCurrentLevel(''); setPrimaryGoal(''); setGoalsDescription('');
        setUrgency(''); setDetails('');
        setError(null); setSuccess(false);
        onClose();
    };

    // ── FORM TITLE ────────────────────────────────────────────────────────────
    const getFormTitle = () => {
        if (selectedCategory && selectedPlan) {
            return `${selectedCategory.title} - ${selectedPlan.plan.name}`;
        }
        return 'Complete Your Request';
    };

    // ── SHARED NAME + EMAIL ROW ───────────────────────────────────────────────
    // Defined ONCE as a variable — reused in all three forms (DRY principle)
    // flex: 1 on textFieldSx makes both fields share the row 50/50
    const nameEmailRow = (
        <Box sx={rowSx}>
            <TextField
                fullWidth
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={textFieldSx}
            />
            <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                required
                sx={textFieldSx}
            />
        </Box>
    );

    // ── DYNAMIC FORM FIELDS ───────────────────────────────────────────────────
    // Layout pattern all three forms follow:
    // ROW 1: Name + Email    → side by side, stack on mobile
    // ROW 2: Select fields   → side by side, stack on mobile
    // ROW 3: Textarea        → always full width
    const renderFormFields = () => {

        // Elevated wrapper around the whole form section
        // Creates a "sunken panel" effect above the modal gradient
        const FormWrapper = ({ children }: { children: React.ReactNode }) => (
            <Box sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                // This dark overlay sits between the gradient and the fields
                // Gradient → dark panel → elevated fields = three depth layers
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

                        {/* ROW 1 — Name + Email side by side */}
                        {nameEmailRow}

                        {/* ROW 2 — Project Type full width (only one select here) */}
                        <FormControl fullWidth required>
                            <InputLabel sx={{ 
                                color: 'rgba(255,255,255,0.7)',
                                '&.Mui-focused': { color: 'white' }
                            }}>
                                Project Type
                            </InputLabel>
                            <Select
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                                label="Project Type"
                                sx={selectSx}
                            >
                                {projectTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* ROW 3 — Description textarea full width at bottom */}
                        <TextField
                            fullWidth
                            label="Project Description"
                            multiline
                            rows={4}
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Describe what you want your project to look like, features you need, timeline, etc."
                            required
                            sx={textFieldSx}
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

                        {/* ROW 1 — Name + Email side by side */}
                        {nameEmailRow}

                        {/* ROW 2 — Current Level + Primary Goal side by side */}
                        <Box sx={rowSx}>
                            {/* 
                                formControlSx adds flex: 1 so each FormControl
                                takes exactly half the row width.
                                Without it, fullWidth prop would make each one 100%
                                and they'd overflow and stack regardless of flex row
                            */}
                            <FormControl fullWidth required sx={formControlSx}>
                                <InputLabel sx={{ 
                                    color: 'rgba(255,255,255,0.7)',
                                    '&.Mui-focused': { color: 'white' }
                                }}>
                                    Current Level
                                </InputLabel>
                                <Select
                                    value={currentLevel}
                                    onChange={(e) => setCurrentLevel(e.target.value)}
                                    label="Current Level"
                                    sx={selectSx}
                                >
                                    {levelOptions.map((level) => (
                                        <MenuItem key={level} value={level}>{level}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth required sx={formControlSx}>
                                <InputLabel sx={{ 
                                    color: 'rgba(255,255,255,0.7)',
                                    '&.Mui-focused': { color: 'white' }
                                }}>
                                    Primary Goal
                                </InputLabel>
                                <Select
                                    value={primaryGoal}
                                    onChange={(e) => setPrimaryGoal(e.target.value)}
                                    label="Primary Goal"
                                    sx={selectSx}
                                >
                                    {goalOptions.map((goal) => (
                                        <MenuItem key={goal} value={goal}>{goal}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* ROW 3 — Goals textarea full width at bottom */}
                        <TextField
                            fullWidth
                            label="Your Goals"
                            multiline
                            rows={4}
                            value={goalsDescription}
                            onChange={(e) => setGoalsDescription(e.target.value)}
                            placeholder="Tell me more about what you want to achieve, what you're building, and how I can help..."
                            required
                            sx={textFieldSx}
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

                        {/* ROW 1 — Name + Email side by side */}
                        {nameEmailRow}

                        {/* ROW 2 — Urgency selector cards */}
                        <Box>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}
                            >
                                How urgent is this? *
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <Card
                                        key={level}
                                        onClick={() => setUrgency(level)}
                                        sx={{
                                            cursor: 'pointer',
                                            flex: 1,
                                            minWidth: { xs: '100%', sm: '80px' },
                                            // Mobile: each card full width (stacks vertically)
                                            // Tablet+: cards share the row equally
                                            backgroundColor: urgency === level 
                                                ? 'rgba(217, 70, 239, 0.3)'
                                                : 'rgba(0, 0, 0, 0.25)',
                                            // Unselected cards use same dark elevation as fields
                                            // Selected card gets purple highlight
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
                                            {level === 'Low' && (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    Within 2 weeks
                                                </Typography>
                                            )}
                                            {level === 'Medium' && (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    Within 1 week
                                                </Typography>
                                            )}
                                            {level === 'High' && (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    Within 2-3 days
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>

                        {/* ROW 3 — Details textarea full width at bottom */}
                        <TextField
                            fullWidth
                            label="Additional Details"
                            multiline
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="What would you like to discuss? Any specific topics or questions?"
                            required
                            sx={textFieldSx}
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
            // fullScreen on mobile = dialog covers entire phone screen
            // Much better UX than a tiny floating modal on a small screen
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '20px',
                    background: 'linear-gradient(135deg, #d946ef 0%, #059669 50%, #020617 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    margin: isMobile ? 0 : '16px',
                }
            }}
        >
            {/* ── HEADER ──────────────────────────────────────────────────── */}
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
                        Complete Your Request
                    </Typography>
                </Box>
                <IconButton onClick={handleCloseAndReset} size="small" sx={{ color: 'white' }}>
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

                {/* Success banner */}
                {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                        Thank you! Your request has been submitted. I'll get back to you within 24 hours.
                    </Alert>
                )}

                {/* Error banner */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Dynamic form fields */}
                {!success && renderFormFields()}

                {/* Submit button */}
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
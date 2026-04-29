// FILE: QuickChatForm.tsx
// ANALYTICS EVENTS TRACKED:
// ─────────────────────────────────────────────────────────────────────────────
// 1. quick_chat_modal_open      → fires when dialog becomes visible
// 2. quick_chat_modal_close     → fires on close + time spent + fields touched
// 3. quick_chat_back_click      → fires when back arrow is clicked
// 4. quick_chat_field_focus     → fires first time each field is focused
// 5. quick_chat_validation_error → fires when submit fails validation
// 6. quick_chat_submit_attempt  → fires when submit is clicked after validation
// 7. quick_chat_submit_success  → fires on confirmed success (THE conversion!)
// 8. quick_chat_submit_error    → fires when API/network call fails
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
    Alert,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface QuickChatFormProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    optionTitle: string;
}

export default function QuickChatForm({ open, onClose, onBack, optionTitle }: QuickChatFormProps) {

    // ── UI STATE ──────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ── FORM FIELDS ───────────────────────────────────────────────────────────
    const [name, setName]         = useState('');
    const [email, setEmail]       = useState('');
    const [question, setQuestion] = useState('');
    const [emailError, setEmailError] = useState('');

    // ── ANALYTICS REFS ────────────────────────────────────────────────────────
    // useRef stores values between renders WITHOUT triggering re-renders
    // openTimeRef → lets us calculate "time spent in modal" on close
    const openTimeRef = useRef<number | null>(null);

    // fieldsTouchedRef → Set that tracks which fields the user interacted with
    // Set automatically prevents duplicates — each field counted only once
    const fieldsTouchedRef = useRef<Set<string>>(new Set());

    // submitAttemptsRef → counts total submit clicks regardless of outcome
    // Multiple attempts = user is struggling with validation
    const submitAttemptsRef = useRef<number>(0);

    // ── ANALYTICS EVENT 1: MODAL OPEN ─────────────────────────────────────────
    // Dependency [open] = only fires when open changes, not on every render
    // Resets all tracking refs so each modal session starts fresh
    useEffect(() => {
        if (!open) return;
        // Guard: if open is false (modal closing), skip — nothing to track here

        // Stamp the exact moment the modal became visible
        openTimeRef.current = Date.now();

        // Fresh slate for this session
        fieldsTouchedRef.current = new Set();
        submitAttemptsRef.current = 0;

        try {
            trackEvent('quick_chat_modal_open', {
                form: 'quick_chat',
                // Identifies this specific form — useful if you have many forms
                optionTitle,
                // Which option title triggered this form
                // e.g. "15-Minute Chat" — comes from helpMeFree.json
                timestamp: new Date().toISOString(),
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                // Screen dimensions — tells you if mobile users use this more
            });
        } catch (err) {
            console.warn('[Analytics] quick_chat_modal_open failed silently:', err);
        }
    }, [open]);

    // ── ANALYTICS EVENT 2: MODAL CLOSE ────────────────────────────────────────
    // Wraps onClose to fire analytics before closing
    // Captures time spent + engagement depth = powerful abandonment insight
    const handleCloseAndReset = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;
            // Date.now() - open timestamp = milliseconds the modal was visible

            trackEvent('quick_chat_modal_close', {
                form: 'quick_chat',
                optionTitle,
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                // Math.round: 4700ms → 5s — cleaner numbers in dashboard
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Array.from converts Set → array for JSON serialisation
                // e.g. ["name", "email"] — shows how far they got before leaving
                fieldsTouchedCount: fieldsTouchedRef.current.size,
                // Quick number: "they touched 2 of 3 fields"
                submitAttempts: submitAttemptsRef.current,
                // Did they try to submit before abandoning?
                closedAfterSuccess: success,
                // true = auto-close after submission, false = user abandoned
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] quick_chat_modal_close failed silently:', err);
        }

        // Reset all form state
        setName(''); setEmail(''); setQuestion('');
        setEmailError(''); setError(null); setSuccess(false);

        // ALWAYS call onClose — even if analytics threw an error above
        onClose();
    };

    // ── ANALYTICS EVENT 3: BACK BUTTON CLICK ──────────────────────────────────
    // Fires when user navigates back to the HelpMeFreeModal
    // High back-click rate = users are reconsidering their option choice
    const handleBack = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;

            trackEvent('quick_chat_back_click', {
                form: 'quick_chat',
                optionTitle,
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                // How long before they changed their mind?
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Did they start filling in the form before going back?
                // "Typed name then went back" = they reconsidered the option
                submitAttempts: submitAttemptsRef.current,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] quick_chat_back_click failed silently:', err);
        }

        // ALWAYS call onBack — analytics is secondary to UX
        onBack();
    };

    // ── ANALYTICS EVENT 4: FIELD FOCUS ────────────────────────────────────────
    // Fires the FIRST TIME each field is focused — not on every click
    // Shows which fields users engage with before dropping off
    // "Most users fill name + email but never reach the question field"
    const handleFieldFocus = (fieldName: string) => {
        if (fieldsTouchedRef.current.has(fieldName)) return;
        // Guard: already tracked this field — skip to prevent duplicate events
        // has() checks if the Set already contains this string

        fieldsTouchedRef.current.add(fieldName);
        // add() inserts fieldName — Set ignores if already present (safe)

        try {
            trackEvent('quick_chat_field_focus', {
                form: 'quick_chat',
                fieldName,
                // 'name' | 'email' | 'question'
                fieldOrder: fieldsTouchedRef.current.size,
                // 1 = first field they touched, 2 = second, 3 = third
                // "Users reach field order 2 but rarely 3" = drop-off insight
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] quick_chat_field_focus failed silently:', err);
        }
    };

    // ── EMAIL VALIDATION ───────────────────────────────────────────────────────
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

    // ── ANALYTICS EVENTS 5, 6, 7, 8: FORM SUBMISSION ──────────────────────────
    // Four possible analytics outcomes on every submit click:
    // A) Validation fails  → quick_chat_validation_error (event 5)
    // B) API starts        → quick_chat_submit_attempt (event 6, always fires)
    // C) API succeeds      → quick_chat_submit_success (event 7, THE conversion)
    // D) API fails         → quick_chat_submit_error (event 8)
    const handleSubmit = async () => {

        // Count every click regardless of what happens next
        submitAttemptsRef.current += 1;
        // += 1 mutates the ref directly — no re-render needed or wanted

        // ── VALIDATION ─────────────────────────────────────────────────────
        if (!name.trim()) {
            setError('Please enter your name');
            try {
                // EVENT 5: validation_error — which field blocked submission?
                trackEvent('quick_chat_validation_error', {
                    form: 'quick_chat',
                    failedField: 'name',
                    errorMessage: 'Name is required',
                    submitAttemptNumber: submitAttemptsRef.current,
                    // Is this their 1st, 2nd, or 3rd failed attempt?
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] validation error silent:', err); }
            return;
        }

        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            try {
                trackEvent('quick_chat_validation_error', {
                    form: 'quick_chat',
                    failedField: 'email',
                    errorMessage: email ? 'Invalid email format' : 'Email is required',
                    // Two different errors for the same field:
                    // Empty vs wrong format = different UX problems to fix
                    submitAttemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] validation error silent:', err); }
            return;
        }

        if (!question.trim()) {
            setError('Please describe what you need help with');
            try {
                trackEvent('quick_chat_validation_error', {
                    form: 'quick_chat',
                    failedField: 'question',
                    errorMessage: 'Question is required',
                    submitAttemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] validation error silent:', err); }
            return;
        }

        setLoading(true);
        setError(null);

        // EVENT 6: submit attempt — passed all validation, API call starting
        // This is the START of the conversion in this form
        try {
            trackEvent('quick_chat_submit_attempt', {
                form: 'quick_chat',
                optionTitle,
                attemptNumber: submitAttemptsRef.current,
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Full engagement picture before they hit submit
                timestamp: new Date().toISOString(),
            });
        } catch (err) { console.warn('[Analytics] submit_attempt silent:', err); }

        try {
            const formData = {
                name, email, question, optionTitle,
                createdAt: new Date().toISOString(),
                type: 'quick_chat'
            };

            // TODO: Replace with real API call to your backend
            console.log('Quick Chat submission:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // EVENT 7: success — THE conversion event for this form
            // Only fires on confirmed success — never on attempts
            // Use this to measure: quick_chat_submit_success / modal_open = conversion rate
            try {
                const timeSpentMs = openTimeRef.current
                    ? Date.now() - openTimeRef.current
                    : 0;

                trackEvent('quick_chat_submit_success', {
                    form: 'quick_chat',
                    optionTitle,
                    totalTimeSpentSeconds: Math.round(timeSpentMs / 1000),
                    // How long from modal open → successful submit?
                    totalSubmitAttempts: submitAttemptsRef.current,
                    // Did they submit on first try or need multiple attempts?
                    fieldsTouched: Array.from(fieldsTouchedRef.current),
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] submit_success silent:', err); }

            setSuccess(true);
            setTimeout(() => { handleCloseAndReset(); }, 2000);

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);

            // EVENT 8: API/network failure — a TECHNICAL error, not a user error
            // "How reliable is my backend?" = this event answers that
            try {
                trackEvent('quick_chat_submit_error', {
                    form: 'quick_chat',
                    optionTitle,
                    errorMessage: err instanceof Error ? err.message : 'Unknown error',
                    // Captures actual error message for debugging
                    attemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (analyticsErr) { console.warn('[Analytics] submit_error silent:', analyticsErr); }
        } finally {
            setLoading(false);
        }
    };

    // ── SHARED INPUT STYLES ────────────────────────────────────────────────────
    const inputSx = {
        '& input': { color: 'white' },
        '& label': { color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } },
        '& textarea': { color: 'white' },
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
            '&.Mui-focused': { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.85)' },
        },
    };

    // ── ROW LAYOUT ─────────────────────────────────────────────────────────────
    // Side by side on tablet+, stacked on mobile
    const rowSx = {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' } as const,
        gap: 2.5,
    };

    // ── JSX RETURN ─────────────────────────────────────────────────────────────
    return (
        <Dialog
            open={open}
            onClose={handleCloseAndReset}
            // ↑ handleCloseAndReset not onClose — fires analytics before closing
            // Also catches backdrop click and Escape key automatically
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #d946ef 0%, #059669 50%, #020617 100%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }
                }
            }}
        >
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <DialogTitle
                component="div"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5, px: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Back button — fires quick_chat_back_click analytics */}
                    <IconButton
                        onClick={handleBack}
                        // ↑ handleBack not onBack — fires EVENT 3
                        size="small"
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography component="div" variant="h6" sx={{ color: 'white' }}>
                        👥 {optionTitle}
                    </Typography>
                </Box>
                {/* Close button — fires quick_chat_modal_close analytics */}
                <IconButton
                    onClick={handleCloseAndReset}
                    // ↑ handleCloseAndReset not onClose — fires EVENT 2
                    size="small"
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* ── CONTENT ─────────────────────────────────────────────────── */}
            <DialogContent sx={{ py: 3, px: 3 }}>
                <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                    mb: 3, mt: 3
                }}>
                    What's on your mind? I'll help in 15 minutes.
                </Typography>

                {/* Success banner */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                        ✓ Request sent! I'll email you within 24 hours.
                    </Alert>
                )}

                {/* Error banner */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {!success && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                        {/* ROW 1 — Name + Email side by side */}
                        <Box sx={rowSx}>
                            <TextField
                                fullWidth
                                label="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => handleFieldFocus('name')}
                                // ↑ EVENT 4: fires on first focus only
                                required
                                sx={inputSx}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onFocus={() => handleFieldFocus('email')}
                                // ↑ EVENT 4: fires on first focus only
                                error={!!emailError}
                                helperText={emailError}
                                required
                                sx={inputSx}
                            />
                        </Box>

                        {/* ROW 2 — Question textarea full width */}
                        <TextField
                            fullWidth
                            label="What do you need help with?"
                            multiline
                            rows={4}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onFocus={() => handleFieldFocus('question')}
                            // ↑ EVENT 4: "Did they reach the question field?"
                            // = strong intent signal, this is the deepest field
                            placeholder="Briefly describe what you'd like to discuss in 15 minutes..."
                            required
                            sx={inputSx}
                        />

                        {/* Submit button */}
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            // ↑ handleSubmit fires Events 5, 6, 7, or 8
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(135deg, #d946ef, #059669)',
                                color: 'white',
                                py: 1.5,
                                borderRadius: '9999px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { transform: 'scale(1.02)' },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'rgba(255,255,255,0.5)',
                                }
                            }}
                        >
                            {loading
                                ? <CircularProgress size={24} color="inherit" />
                                : 'Send Request →'
                            }
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
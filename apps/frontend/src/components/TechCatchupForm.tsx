// FILE: TechCatchupForm.tsx
// ANALYTICS EVENTS TRACKED:
// ─────────────────────────────────────────────────────────────────────────────
// 1. tech_catchup_modal_open        → fires when dialog becomes visible
// 2. tech_catchup_modal_close       → fires on close + time spent + engagement
// 3. tech_catchup_back_click        → fires when back arrow is clicked
// 4. tech_catchup_field_focus       → fires first time each field is focused
// 5. tech_catchup_validation_error  → fires when submit fails validation
// 6. tech_catchup_submit_attempt    → fires when submit is clicked after validation
// 7. tech_catchup_submit_success    → fires on confirmed success (THE conversion!)
// 8. tech_catchup_submit_error      → fires when API/network call fails
// 9. tech_catchup_meeting_selected  → fires when user picks a meeting method
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
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TechCatchupFormProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    optionTitle: string;
}

export default function TechCatchupForm({ open, onClose, onBack, optionTitle }: TechCatchupFormProps) {

    // ── UI STATE ──────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ── FORM FIELDS ───────────────────────────────────────────────────────────
    const [name, setName]                 = useState('');
    const [email, setEmail]               = useState('');
    const [description, setDescription]   = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [meetingMethod, setMeetingMethod] = useState('');
    const [emailError, setEmailError]     = useState('');

    // Today in YYYY-MM-DD format — used as min date on the date picker
    // Prevents users from selecting dates in the past
    const today = new Date().toISOString().split('T')[0];

    // ── ANALYTICS REFS ────────────────────────────────────────────────────────
    // useRef stores values between renders WITHOUT causing re-renders
    // Perfect for timestamps and counters we just need to READ, not display

    // Records the exact millisecond this modal opened
    // Used to calculate "time_spent_seconds" on close
    const openTimeRef = useRef<number | null>(null);

    // Tracks which fields the user has interacted with
    // Set automatically prevents duplicates — each field counted only once
    // Like a checklist where each item can only be checked once
    const fieldsTouchedRef = useRef<Set<string>>(new Set());

    // Counts total submit button clicks regardless of outcome
    // Multiple attempts = user is struggling with the form
    const submitAttemptsRef = useRef<number>(0);

    // ── ANALYTICS EVENT 1: MODAL OPEN ─────────────────────────────────────────
    // Runs when open changes to true — not on every render
    // Resets all analytics refs so each modal session starts clean
    useEffect(() => {
        if (!open) return;
        // Guard: if open is false (closing), skip this block entirely

        // Stamp the exact moment this modal became visible
        openTimeRef.current = Date.now();

        // Fresh tracking for this new session
        // If user opens → closes → opens again, everything resets
        fieldsTouchedRef.current = new Set();
        submitAttemptsRef.current = 0;

        try {
            trackEvent('tech_catchup_modal_open', {
                form: 'tech_catchup',
                // Identifies this specific form in the dashboard
                optionTitle,
                // Which option triggered this — from helpMeFree.json
                timestamp: new Date().toISOString(),
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                // Screen size — tells you if mobile users engage with this form
            });
        } catch (err) {
            console.warn('[Analytics] tech_catchup_modal_open failed silently:', err);
        }
    }, [open]);

    // ── ANALYTICS EVENT 2: MODAL CLOSE ────────────────────────────────────────
    // Wraps onClose to fire analytics first
    // Captures rich abandonment data: time spent, how far they got, attempt count
    const handleCloseAndReset = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;
            // Milliseconds the modal was open → converted to seconds below

            trackEvent('tech_catchup_modal_close', {
                form: 'tech_catchup',
                optionTitle,
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                // Math.round: 4700ms → 5s — cleaner numbers in dashboard
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // Array.from converts Set → plain array for JSON serialisation
                // e.g. ["name", "email", "description"] — shows drop-off point
                fieldsTouchedCount: fieldsTouchedRef.current.size,
                // Quick number: "they touched 3 of 6 fields"
                submitAttempts: submitAttemptsRef.current,
                // Did they try to submit before abandoning?
                closedAfterSuccess: success,
                // true = auto-close after success, false = user abandoned
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] tech_catchup_modal_close failed silently:', err);
        }

        // Reset all form state regardless of analytics outcome
        setName(''); setEmail(''); setDescription('');
        setPreferredDate(''); setPreferredTime(''); setMeetingMethod('');
        setEmailError(''); setError(null); setSuccess(false);

        // ALWAYS call onClose — analytics is secondary to functionality
        onClose();
    };

    // ── ANALYTICS EVENT 3: BACK BUTTON ────────────────────────────────────────
    // Fires when user clicks the back arrow to return to HelpMeFreeModal
    // High back-click rate on this form = users reconsidering option choice
    // or finding the scheduling fields too complex
    const handleBack = () => {
        try {
            const timeSpentMs = openTimeRef.current
                ? Date.now() - openTimeRef.current
                : 0;

            trackEvent('tech_catchup_back_click', {
                form: 'tech_catchup',
                optionTitle,
                timeSpentSeconds: Math.round(timeSpentMs / 1000),
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                // "They filled name + email but went back before scheduling"
                // = scheduling fields are a friction point
                submitAttempts: submitAttemptsRef.current,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] tech_catchup_back_click failed silently:', err);
        }

        // ALWAYS call onBack — analytics is secondary to UX
        onBack();
    };

    // ── ANALYTICS EVENT 4: FIELD FOCUS ────────────────────────────────────────
    // Fires the FIRST TIME each specific field is focused — never again
    // This form has 6 fields (name, email, description, date, time, meeting)
    // Tracking which fields users reach reveals exactly where they drop off
    // "Most users fill name + email but never reach preferredDate" = scheduling friction
    const handleFieldFocus = (fieldName: string) => {
        if (fieldsTouchedRef.current.has(fieldName)) return;
        // Guard: already tracked this field — skip to prevent duplicate events

        fieldsTouchedRef.current.add(fieldName);
        // Add to Set — Set ignores duplicates automatically (safe to call anywhere)

        try {
            trackEvent('tech_catchup_field_focus', {
                form: 'tech_catchup',
                fieldName,
                // 'name'|'email'|'description'|'preferredDate'|'preferredTime'|'meetingMethod'
                fieldOrder: fieldsTouchedRef.current.size,
                // 1 = first field they touched, up to 6 for this form
                // "Most users reach field 3 but not field 4" = drop-off at date picker
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] tech_catchup_field_focus failed silently:', err);
        }
    };

    // ── ANALYTICS EVENT 9: MEETING METHOD SELECTED ────────────────────────────
    // Extra event specific to this form — tracks which meeting method users prefer
    // "80% choose video call, 15% phone, 5% in person" = informs your availability
    // Also tracks if they change their mind (previousMethod !== null)
    const handleMeetingMethodChange = (value: string) => {
        const previousMethod = meetingMethod || null;
        setMeetingMethod(value);

        // Also track as a field focus (first time the select is opened)
        handleFieldFocus('meetingMethod');

        try {
            trackEvent('tech_catchup_meeting_selected', {
                form: 'tech_catchup',
                meetingMethod: value,
                // 'video' | 'phone' | 'in_person'
                previousMethod,
                // null = first selection, 'video' = they changed from video
                // "Did they switch from video to phone?" = preference insight
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[Analytics] tech_catchup_meeting_selected failed silently:', err);
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
    // Four possible analytics outcomes when submit is clicked:
    // A) Validation fails → tech_catchup_validation_error (event 5)
    // B) API starts       → tech_catchup_submit_attempt (event 6, always)
    // C) API succeeds     → tech_catchup_submit_success (event 7, THE conversion)
    // D) API fails        → tech_catchup_submit_error (event 8)
    const handleSubmit = async () => {

        // Count every submit click — even ones that fail validation
        submitAttemptsRef.current += 1;
        // += 1 mutates ref directly — no re-render triggered or needed

        // ── VALIDATION ─────────────────────────────────────────────────────
        // Each validation failure fires event 5 with the specific failing field
        // This tells you EXACTLY which field causes the most friction
        const validationChecks = [
            { condition: !name.trim(), field: 'name', message: 'Name is required' },
            { condition: !email || !validateEmail(email), field: 'email', message: email ? 'Invalid email format' : 'Email is required' },
            { condition: !description.trim(), field: 'description', message: 'Description is required' },
            { condition: !preferredDate, field: 'preferredDate', message: 'Preferred date is required' },
            { condition: !preferredTime, field: 'preferredTime', message: 'Preferred time is required' },
            { condition: !meetingMethod, field: 'meetingMethod', message: 'Meeting method is required' },
        ];
        // Array of checks = cleaner than 6 separate if blocks
        // Each object has the condition, which field failed, and what to tell the user

        for (const check of validationChecks) {
            // Loop through each check one at a time
            // for...of = reads like English: "for each check in validationChecks"
            if (check.condition) {
                setError(check.message);
                try {
                    // EVENT 5: fires for whichever field blocked submission
                    trackEvent('tech_catchup_validation_error', {
                        form: 'tech_catchup',
                        failedField: check.field,
                        errorMessage: check.message,
                        submitAttemptNumber: submitAttemptsRef.current,
                        // Is this their 1st or 4th failed attempt?
                        timestamp: new Date().toISOString(),
                    });
                } catch (err) { console.warn('[Analytics] validation error silent:', err); }
                return;
                // return stops the function here — no point continuing
            }
        }

        setLoading(true);
        setError(null);

        // EVENT 6: passed all validation — API call is starting
        try {
            trackEvent('tech_catchup_submit_attempt', {
                form: 'tech_catchup',
                optionTitle,
                meetingMethod,
                // Which meeting type did they choose?
                preferredDate,
                // What day did they request?
                // Useful: "Most people request Tuesdays"
                attemptNumber: submitAttemptsRef.current,
                fieldsTouched: Array.from(fieldsTouchedRef.current),
                timestamp: new Date().toISOString(),
            });
        } catch (err) { console.warn('[Analytics] submit_attempt silent:', err); }

        try {
            const formData = {
                name, email, description,
                preferredDate, preferredTime, meetingMethod,
                optionTitle,
                createdAt: new Date().toISOString(),
                type: 'tech_catchup'
            };

            // TODO: Replace with real API call to your backend
            console.log('Tech Catch-up submission:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // EVENT 7: THE conversion — confirmed success
            // Only fires on verified success — never on attempts
            // Use: tech_catchup_submit_success / modal_open = conversion rate
            try {
                const timeSpentMs = openTimeRef.current
                    ? Date.now() - openTimeRef.current
                    : 0;

                trackEvent('tech_catchup_submit_success', {
                    form: 'tech_catchup',
                    optionTitle,
                    meetingMethod,
                    // Which meeting type converted? "Video calls convert better"
                    preferredDate,
                    totalTimeSpentSeconds: Math.round(timeSpentMs / 1000),
                    // How long from modal open → successful submit?
                    totalSubmitAttempts: submitAttemptsRef.current,
                    // Did they submit first try or needed multiple?
                    fieldsTouched: Array.from(fieldsTouchedRef.current),
                    timestamp: new Date().toISOString(),
                });
            } catch (err) { console.warn('[Analytics] submit_success silent:', err); }

            setSuccess(true);
            setTimeout(handleCloseAndReset, 2000);

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);

            // EVENT 8: technical failure — API or network problem
            // Different from validation_error — this is YOUR system's fault
            try {
                trackEvent('tech_catchup_submit_error', {
                    form: 'tech_catchup',
                    optionTitle,
                    errorMessage: err instanceof Error ? err.message : 'Unknown error',
                    // Captures the actual error for debugging your backend
                    attemptNumber: submitAttemptsRef.current,
                    timestamp: new Date().toISOString(),
                });
            } catch (analyticsErr) { console.warn('[Analytics] submit_error silent:', analyticsErr); }
        } finally {
            setLoading(false);
        }
    };

    // ── SHARED INPUT STYLES ────────────────────────────────────────────────────
    // Elevated glassmorphism — consistent with other forms in the app
    const inputSx = {
        '& input': { color: 'white', padding: '14px 12px' },
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
            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.85)' },
        },
        '& .MuiInputLabel-root': { transform: 'translate(14px, 14px) scale(1)' },
        '& .MuiInputLabel-shrink': { transform: 'translate(14px, -8px) scale(0.75)' },
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
        '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
    };

    // Side by side on tablet+, stacked on mobile — no Grid needed
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
            // Also catches backdrop click and Escape key presses
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
                    px: 3, py: 1.5,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Back button — fires tech_catchup_back_click analytics */}
                    <IconButton
                        onClick={handleBack}
                        // ↑ handleBack not onBack — fires EVENT 3
                        size="small"
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography component="div" variant="h6" sx={{ color: 'white' }}>
                        🧑🏿‍💻 {optionTitle}
                    </Typography>
                </Box>
                {/* Close button — fires tech_catchup_modal_close analytics */}
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
            <DialogContent sx={{ px: 3, py: 3 }}>
                <Typography sx={{
                    color: 'rgba(255,255,255,0.8)',
                    mb: 3, mt: 3,
                    textAlign: 'center'
                }}>
                    Schedule a relaxed chat about tech, career, or ideas.
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                        ✓ Meeting requested! I'll confirm via email within 24 hours.
                    </Alert>
                )}
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
                                fullWidth label="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => handleFieldFocus('name')}
                                // ↑ EVENT 4: fires on first focus only
                                required sx={inputSx}
                            />
                            <TextField
                                fullWidth label="Email Address"
                                type="email" value={email}
                                onChange={handleEmailChange}
                                onFocus={() => handleFieldFocus('email')}
                                // ↑ EVENT 4
                                error={!!emailError}
                                helperText={emailError}
                                required sx={inputSx}
                            />
                        </Box>

                        {/* ROW 2 — Discussion textarea */}
                        <TextField
                            fullWidth
                            label="What would you like to discuss?"
                            multiline rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => handleFieldFocus('description')}
                            // ↑ EVENT 4: did they reach the description field?
                            placeholder="Tell me what's on your mind — tech topics, career advice, project ideas, etc."
                            required sx={inputSx}
                        />

                        {/* ROW 3 — Date + Time side by side */}
                        <Box sx={rowSx}>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: 'white', mb: 0.5, fontSize: '0.85rem' }}>
                                    Preferred Date
                                </Typography>
                                <TextField
                                    fullWidth type="date"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    onFocus={() => handleFieldFocus('preferredDate')}
                                    // ↑ EVENT 4: scheduling fields are friction points
                                    // "Did users reach date selection?" = key insight
                                    inputProps={{ min: today }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={inputSx}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: 'white', mb: 0.5, fontSize: '0.85rem' }}>
                                    Preferred Time
                                </Typography>
                                <TextField
                                    fullWidth type="time"
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                    onFocus={() => handleFieldFocus('preferredTime')}
                                    // ↑ EVENT 4
                                    InputLabelProps={{ shrink: true }}
                                    sx={inputSx}
                                />
                            </Box>
                        </Box>

                        {/* ROW 4 — Meeting method dropdown */}
                        <FormControl fullWidth required>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } }}>
                                How would you like to meet?
                            </InputLabel>
                            <Select
                                value={meetingMethod}
                                onChange={(e) => handleMeetingMethodChange(e.target.value)}
                                // ↑ handleMeetingMethodChange fires EVENT 9
                                //   (meeting_selected) AND EVENT 4 (field_focus)
                                label="How would you like to meet?"
                                sx={selectSx}
                            >
                                <MenuItem value="video">📹 Video Call (Zoom / Google Meet)</MenuItem>
                                <MenuItem value="phone">📞 Phone Call</MenuItem>
                                <MenuItem value="in_person">🏢 In Person (if local)</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Submit button */}
                        <Button
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
                                : 'Schedule Catch-up →'
                            }
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
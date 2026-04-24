// FILE: WebsiteAuditForm.tsx
// PURPOSE: Form for free website audit requests

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
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { trackEvent } from '@/utils/analytics'; // 👈 adjust path to your analytics file

interface WebsiteAuditFormProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    optionTitle: string;
}

export default function WebsiteAuditForm({ open, onClose, onBack, optionTitle }: WebsiteAuditFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [emailError, setEmailError] = useState('');
    const [urlError, setUrlError] = useState('');

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateUrl = (url: string): boolean => {
        const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return regex.test(url);
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

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setWebsiteUrl(newUrl);
        if (newUrl && !validateUrl(newUrl)) {
            setUrlError('Please enter a valid URL (e.g., https://example.com)');
        } else {
            setUrlError('');
        }
    };

    // 👇 Track modal open
    const handleOpen = () => {
        trackEvent('website_audit_modal_opened', {
            optionTitle,
        });
    };

    // 👇 Track back button
    const handleBack = () => {
        trackEvent('website_audit_modal_back', {
            optionTitle,
            formPartiallyFilled: !!(name || email || websiteUrl),
        });
        onBack();
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            // 👇 Track validation failure
            trackEvent('website_audit_submit_failed', {
                optionTitle,
                reason: 'missing_name',
            });
            return;
        }
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            trackEvent('website_audit_submit_failed', {
                optionTitle,
                reason: 'invalid_email',
            });
            return;
        }
        if (!websiteUrl.trim()) {
            setError('Please enter your website URL');
            trackEvent('website_audit_submit_failed', {
                optionTitle,
                reason: 'missing_url',
            });
            return;
        }
        if (!validateUrl(websiteUrl)) {
            setError('Please enter a valid URL (e.g., https://example.com)');
            trackEvent('website_audit_submit_failed', {
                optionTitle,
                reason: 'invalid_url',
            });
            return;
        }

        setLoading(true);
        setError(null);

        // 👇 Track submit attempt
        trackEvent('website_audit_submit_attempted', {
            optionTitle,
        });

        try {
            const formData = {
                name,
                email,
                websiteUrl,
                optionTitle,
                createdAt: new Date().toISOString(),
                type: 'website_audit'
            };
            
            console.log('Website Audit submission:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 👇 Track successful submission
            trackEvent('website_audit_submit_success', {
                optionTitle,
                websiteDomain: new URL(
                    websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
                ).hostname,
            });

            setSuccess(true);
            setTimeout(() => {
                handleCloseAndReset();
            }, 2000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            // 👇 Track submission error
            trackEvent('website_audit_submit_error', {
                optionTitle,
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAndReset = () => {
        // 👇 Track modal close (only if not after a success, to avoid double-counting)
        if (!success) {
            trackEvent('website_audit_modal_dismissed', {
                optionTitle,
                formPartiallyFilled: !!(name || email || websiteUrl),
            });
        }

        setName('');
        setEmail('');
        setWebsiteUrl('');
        setEmailError('');
        setUrlError('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    const inputSx = {
        '& input': { color: 'white' }, 
        '& label': { color: 'rgba(255,255,255,0.7)' },
        '& textarea': { color: 'white' },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
        }
    };

    return (
        <Dialog 
            open={open}
            onClose={handleCloseAndReset}
            onTransitionEnter={handleOpen} // 👈 fires once when dialog finishes opening
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
            {/* MODAL HEADER */}
            <DialogTitle 
                component="div"
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    py: 1.5, 
                    px: 3, 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={handleBack} size="small" sx={{ color: 'white' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography component="div" variant="h6" sx={{ color: 'white' }}>
                        💻 {optionTitle}
                    </Typography>
                </Box>
                <IconButton onClick={handleCloseAndReset} size="small" sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* MODAL CONTENT */}
            <DialogContent sx={{ py: 3, px: 3 }}>
                <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    textAlign: 'center', 
                    mb: 3,
                    mt: 3
                }}>
                    Get a free performance and UX audit of your website. I'll send you a detailed report.
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                        ✓ Request sent! I'll audit your website and email you the report within 3-5 business days.
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {!success && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    sx={inputSx}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={!!emailError}
                                    helperText={emailError}
                                    required
                                    sx={inputSx}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Website URL"
                            value={websiteUrl}
                            onChange={handleUrlChange}
                            error={!!urlError}
                            helperText={urlError || "Example: https://mywebsite.com"}
                            placeholder="https://yourwebsite.com"
                            required
                            sx={inputSx}
                        />

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(135deg, #d946ef, #059669)',
                                color: 'white',
                                py: 1.5,
                                borderRadius: '9999px',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Request Audit →'}
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
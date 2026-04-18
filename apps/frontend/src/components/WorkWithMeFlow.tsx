import { useState, ChangeEvent } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';

interface FormDataType {
    name: string;
    email: string; // Added Email (Industry Standard)
    description: string;
}

interface Plan { id: string; title: string; price: string; features: string[]; }

const CATEGORIES = [
  { id: 'development', title: 'Software Development', description: 'Building scalable web applications.', icon: '💻' },
  { id: 'design', title: 'UI/UX Design', description: 'Intuitive design systems and interfaces.', icon: '🎨' },
  { id: 'consulting', title: 'Consultation', description: 'Technical strategy and architecture.', icon: '🧠' }
];

const PLANS_DATA: Record<string, Plan[]> = {
  development: [
    { id: 'd1', title: 'MVP Development', price: '$2,000+', features: ['Next.js Build', 'Supabase Integration'] },
    { id: 'd2', title: 'Scale-Up', price: '$5,000+', features: ['Custom Features', 'Performance Audit'] },
    { id: 'd3', title: 'Enterprise', price: 'Contact', features: ['Microservices', '24/7 Support'] }
  ],
  design: [
    { id: 'de1', title: 'Visual Identity', price: '$800', features: ['Brand Guidelines', 'Logo Pack'] },
    { id: 'de2', title: 'Product Design', price: '$2,500', features: ['Prototype', 'Component Library'] },
    { id: 'de3', title: 'Mobile First', price: '$1,500', features: ['iOS/Android UI', 'Handoff Docs'] }
  ],
  consulting: [
    { id: 'c1', title: 'Intro Call', price: 'Free', features: ['15 Min Sync', 'Project Scoping'] },
    { id: 'c2', title: 'Deep Dive', price: '$150/hr', features: ['Tech Stack Review', 'Security Audit'] },
    { id: 'c3', title: 'Project Management', price: 'Weekly', features: ['Sprint Planning', 'Team Mentorship'] }
  ]
};

export default function WorkWithMeFlow() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataType>({ name: '', email: '', description: '' });

    const handleOpen = () => { setStep(1); setIsOpen(true); };
    const handleClose = () => setIsOpen(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isFormValid = formData.name.length > 2 && formData.email.includes('@') && formData.description.length > 5;

    return (
        <>
            <Button onClick={handleOpen} variant="contained" sx={{ background: 'linear-gradient(to right, #0070f3, #d946ef)', fontWeight: 800, borderRadius: '50px', px: 5, py: 2, textTransform: 'none' }}>
                Work With Me
            </Button>

            <Modal open={isOpen} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', md: 800 }, bgcolor: '#000', borderRadius: '32px', p: 4, outline: 'none', border: '1px solid #333'
                }}>
                    {step === 1 && (
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textAlign: 'center' }}>How can I help you?</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                {CATEGORIES.map(cat => (
                                    <Box key={cat.id} component="button" onClick={() => { setSelectedCategory(cat.id); setStep(2); }} sx={{ p: 3, bgcolor: '#111', borderRadius: '24px', border: '1px solid #333', cursor: 'pointer', transition: '0.2s', '&:hover': { borderColor: '#d946ef', transform: 'scale(1.05)' } }}>
                                        <Typography sx={{ fontSize: '2rem', mb: 1 }}>{cat.icon}</Typography>
                                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{cat.title}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {step === 2 && selectedCategory && (
                        <Box>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 4, textAlign: 'center' }}>Select Your Project Size</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                                {PLANS_DATA[selectedCategory].map(plan => (
                                    <Box key={plan.id} component="button" onClick={() => setStep(3)} sx={{ p: 3, bgcolor: '#111', borderRadius: '24px', border: '1px solid #333', cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: '#0070f3' } }}>
                                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{plan.title}</Typography>
                                        <Typography sx={{ color: '#0070f3', fontWeight: 900, fontSize: '1.5rem', my: 1 }}>{plan.price}</Typography>
                                        {plan.features.map((f, i) => <Typography key={i} sx={{ color: '#666', fontSize: '0.75rem' }}>• {f}</Typography>)}
                                    </Box>
                                ))}
                            </Box>
                            <Button onClick={() => setStep(1)} sx={{ color: '#666' }}>← Change Category</Button>
                        </Box>
                    )}

                    {step === 3 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, textAlign: 'center' }}>Let's talk details</Typography>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full bg-[#111] border border-[#333] rounded-xl p-4 text-white outline-none focus:border-[#d946ef]" />
                            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-[#111] border border-[#333] rounded-xl p-4 text-white outline-none focus:border-[#d946ef]" />
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell me about your project vision..." rows={4} className="w-full bg-[#111] border border-[#333] rounded-xl p-4 text-white outline-none focus:border-[#d946ef] resize-none" />
                            <Button variant="contained" disabled={!isFormValid} onClick={() => alert("Ready for the Backend!")} sx={{ py: 2, borderRadius: '12px', fontWeight: 800, bgcolor: isFormValid ? '#0070f3' : '#222' }}>
                                {isFormValid ? 'Send Inquiry 🚀' : 'Please Complete Form'}
                            </Button>
                            <Button onClick={() => setStep(2)} sx={{ color: '#666' }}>← Back to Plans</Button>
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
}
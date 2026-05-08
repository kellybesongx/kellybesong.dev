/**
 * Quick replies with dynamic rendering from INTENTS array
 * Following the implementation plan: INTENTS.map(intent => <Button />)
 */

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { INTENTS } from './chatConfig';
import type { Intent } from '../../types/chat';

interface QuickRepliesProps {
  onSelect: (intent: Intent) => void;
  disabled?: boolean;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, disabled = false }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Choose an option:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {/* Dynamic rendering from INTENTS array */}
        {INTENTS.map((intent) => (
          <Button
            key={intent.id}
            variant="contained"
            onClick={() => onSelect(intent.id)}
            disabled={disabled}
            startIcon={<span>{intent.emoji}</span>}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s',
              },
            }}
          >
            {intent.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default QuickReplies;
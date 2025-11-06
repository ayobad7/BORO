import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { ui } from '../lib/uiTokens';

export interface MetaRowProps {
  icon?: ReactNode;
  label: string;
  value?: ReactNode;
  labelColor?: string;
  valueColor?: string;
}

export default function MetaRow({
  icon,
  label,
  value,
  labelColor = ui.subtext,
  valueColor = ui.text,
}: MetaRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
      {icon}
      <Typography
        variant='body2'
        sx={{
          fontSize: 14,
          color: labelColor,
          whiteSpace: 'nowrap',
          mr: 0.5,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      {value !== undefined && (
        <Typography
          variant='body2'
          sx={{
            fontSize: 14,
            color: valueColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}

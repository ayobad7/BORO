import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PiPackageLight, PiHandArrowDown, PiHandArrowUp } from 'react-icons/pi';
import { ACCENTS } from '../../lib/accents';

interface SummaryCardProps {
  storage: number;
  borrowed: number;
  lent: number;
}

export default function SummaryCards({ storage, borrowed, lent }: SummaryCardProps) {
  const ACTIVITY_COLORS = {
    storage: ACCENTS.storage,
    borrowed: ACCENTS.borrowed,
    lent: ACCENTS.lent,
    favorite: ACCENTS.favorite,
  };

  return (
    <Box
      sx={{
        mb: 2,
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
      }}
    >
      {[
        {
          icon: <PiPackageLight size={26} />,
          label: 'Storage',
          count: storage,
          color: ACTIVITY_COLORS.storage,
        },
        {
          icon: <PiHandArrowDown size={26} />,
          label: 'Borrowed',
          count: borrowed,
          color: ACTIVITY_COLORS.borrowed,
        },
        {
          icon: <PiHandArrowUp size={26} />,
          label: 'Lent',
          count: lent,
          color: ACTIVITY_COLORS.lent,
        },
      ].map((card) => (
        <Box
          key={card.label}
          sx={{
            '--r': '18px',
            position: 'relative',
            background: `linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)) , #14171f`,
            border: '1px solid #23293a',
            borderRadius: 'var(--r)',
            px: '14px',
            pt: '16px',
            pb: '16px',
            boxShadow: '0 8px 26px rgba(0,0,0,0.34)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
            <Box
              sx={{
                color: card.color,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {card.icon}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
              }}
            >
              <Typography
                variant='body2'
                sx={{ color: '#a7b3c7', lineHeight: 1, fontSize: 13 }}
              >
                {card.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                  color: '#e9eef7',
                  mt: 0.5,
                }}
              >
                {card.count} items
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
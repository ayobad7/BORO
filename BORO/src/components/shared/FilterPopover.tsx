import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import type { BorrowMode } from '../../types';
import { ACCENTS } from '../../lib/accents';

interface FilterPopoverProps {
  filterAnchor: HTMLElement | null;
  onClose: () => void;
  typeFilters: Set<'storage' | 'borrowed' | 'lent'>;
  modeFilters: Set<BorrowMode>;
  favOnly: boolean;
  overdueOnly: boolean;
  dueSoonOnly: boolean;
  showPeople: boolean;
  onToggleType: (type: 'storage' | 'borrowed' | 'lent') => void;
  onToggleMode: (mode: BorrowMode) => void;
  onToggleFavOnly: () => void;
  onToggleOverdueOnly: () => void;
  onToggleDueSoonOnly: () => void;
  onToggleShowPeople: () => void;
}

export default function FilterPopover({
  filterAnchor,
  onClose,
  typeFilters,
  modeFilters,
  favOnly,
  overdueOnly,
  dueSoonOnly,
  showPeople,
  onToggleType,
  onToggleMode,
  onToggleFavOnly,
  onToggleOverdueOnly,
  onToggleDueSoonOnly,
  onToggleShowPeople,
}: FilterPopoverProps) {
  // shared button styles
  const restBtn: any = {
    border: '1px solid #2a3144',
    // force visual values to override theme styles
    background: 'transparent !important',
    backgroundColor: 'transparent !important',
    color: '#a2b3c7 !important',
    textTransform: 'none',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: '999px',
    px: 1.4,
    minHeight: 30,
    '&:hover': { borderColor: '#3b465f', color: '#d1dbe6' },
  };

  const activeBtn: any = {
    // force the 'borrow' style even if theme alters contained/outlined buttons
    background: `${ACCENTS.storage} !important`,
    backgroundColor: `${ACCENTS.storage} !important`,
    color: '#0a0a0a !important',
    textTransform: 'none',
    fontSize: 12,
    fontWeight: 800,
    borderRadius: 2,
    px: 1.5,
    minHeight: 34,
    height: 34,
    lineHeight: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    '&:hover': { background: `${ACCENTS.storage} !important` },
  };
  return (
    <Popover
      open={Boolean(filterAnchor)}
      anchorEl={filterAnchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      sx={{ mt: 1 }}
      PaperProps={{
        // style + sx to be extra robust against theme overrides
        style: { backgroundColor: '#141a26' },
        sx: {
          background: '#141a26 !important',
          backgroundColor: '#141a26 !important',
          border: '1px solid #23293a',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          p: 2,
          minWidth: 280,
        },
      }}
    >
      <Typography
        variant='caption'
        sx={{ color: '#8ca2ba', fontWeight: 600, display: 'block', mb: 1 }}
      >
        Filter by
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {/* Type filters */}
        <Box>
          <Typography variant='caption' sx={{ color: '#7d8799', mb: 0.5, display: 'block', fontSize: 11 }}>
            Type
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {([
              { key: 'storage', label: 'Storage' },
              { key: 'borrowed', label: 'Borrowed' },
              { key: 'lent', label: 'Lent' },
            ] as const).map((t) => (
              <Button
                key={t.key}
                size='small'
                onClick={() => onToggleType(t.key)}
                sx={typeFilters.has(t.key) ? activeBtn : restBtn}
              >
                {t.label}
              </Button>
            ))}
            <Button
              size='small'
              onClick={onToggleShowPeople}
                sx={showPeople ? activeBtn : restBtn}
            >
              People
            </Button>
          </Box>
        </Box>
        {/* Status filters */}
        <Box>
          <Typography variant='caption' sx={{ color: '#7d8799', mb: 0.5, display: 'block', fontSize: 11 }}>
            Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            <Button size='small' onClick={onToggleFavOnly} sx={favOnly ? activeBtn : restBtn}>
              Favorites
            </Button>
            <Button
              size='small'
              onClick={onToggleOverdueOnly}
              sx={overdueOnly ? activeBtn : restBtn}
            >
              Overdue
            </Button>
            <Button
              size='small'
              onClick={onToggleDueSoonOnly}
              sx={dueSoonOnly ? activeBtn : restBtn}
            >
              Due soon
            </Button>
          </Box>
        </Box>
        {/* Mode filters */}
        <Box>
          <Typography variant='caption' sx={{ color: '#7d8799', mb: 0.5, display: 'block', fontSize: 11 }}>
            Borrow Mode
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            <Button size='small' onClick={() => onToggleMode('free')} sx={modeFilters.has('free') ? activeBtn : restBtn}>
              Free
            </Button>
            <Button
              size='small'
              onClick={() => onToggleMode('request')}
              sx={modeFilters.has('request') ? activeBtn : restBtn}
            >
              Request
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}
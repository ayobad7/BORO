import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import type { BorrowMode } from '../../types';

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
  return (
    <Popover
      open={Boolean(filterAnchor)}
      anchorEl={filterAnchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      sx={{
        mt: 1,
        '& .MuiPopover-paper': {
          bgcolor: '#14171f',
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
                sx={{
                  border: '1px solid #2a3144',
                  bgcolor: typeFilters.has(t.key) ? '#20283a' : 'transparent',
                  color: '#e8efff',
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: '999px',
                  px: 1.4,
                  minHeight: 30,
                  '&:hover': { bgcolor: '#20283a' },
                }}
              >
                {t.label}
              </Button>
            ))}
            <Button
              size='small'
              onClick={onToggleShowPeople}
              sx={{
                border: '1px solid #2a3144',
                bgcolor: showPeople ? '#20283a' : 'transparent',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.4,
                minHeight: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
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
            <Button
              size='small'
              onClick={onToggleFavOnly}
              sx={{
                border: '1px solid #2a3144',
                bgcolor: favOnly ? '#20283a' : 'transparent',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.4,
                minHeight: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
            >
              Favorites
            </Button>
            <Button
              size='small'
              onClick={onToggleOverdueOnly}
              sx={{
                border: '1px solid #2a3144',
                bgcolor: overdueOnly ? '#20283a' : 'transparent',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.4,
                minHeight: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
            >
              Overdue
            </Button>
            <Button
              size='small'
              onClick={onToggleDueSoonOnly}
              sx={{
                border: '1px solid #2a3144',
                bgcolor: dueSoonOnly ? '#20283a' : 'transparent',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.4,
                minHeight: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
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
            <Button
              size='small'
              onClick={() => onToggleMode('free')}
              sx={{
                border: '1px solid #2a3144',
                bgcolor: modeFilters.has('free') ? '#20283a' : 'transparent',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.4,
                minHeight: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
            >
              Free
            </Button>
            <Button
              size='small'
              onClick={() => onToggleMode('request')}
              sx={{
                border: '1px solid #2a3144',
                bgcolor: modeFilters.has('request') ? '#20283a' : 'transparent',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.4,
                minHeight: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
            >
              Request
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}
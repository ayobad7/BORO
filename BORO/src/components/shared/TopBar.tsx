import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { LuFilter } from 'react-icons/lu';
import { ui } from '../../lib/uiTokens';

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  onResetFilters: () => void;
}

export default function TopBar({
  search,
  onSearchChange,
  hasActiveFilters,
  onFilterClick,
  onResetFilters,
}: TopBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: { xs: '100%', sm: 'auto' } }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'linear-gradient(180deg,#9cf07c,#62d24b)',
          }}
        />
        <Typography
          variant='h5'
          fontWeight={900}
          color={ui.text}
          sx={{ letterSpacing: '.25px' }}
        >
          Activity Feed
        </Typography>
      </Box>

      {/* Search + filters - center on desktop, full width on mobile */}
      <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flex: { xs: 0, sm: 1 },
          mx: { xs: 0, sm: 2 },
          maxWidth: { xs: '100%', sm: 520 },
          width: { xs: '100%', sm: 'auto' },
          order: { xs: 2, sm: 0 },
        }}
      >
        <TextField
          size='small'
          placeholder='Search items'
          fullWidth
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 0.5 }}>
                <FiSearch size={16} color='#8ca2ba' />
              </Box>
            ),
          }}
          sx={{
            // base input container
            '& .MuiOutlinedInput-root': {
              bgcolor: '#141a26',
              borderRadius: 2,
              // ensure native focus outline doesn't show
              outline: 'none',
            },
            // hide the default notched outline so we can draw our own gradient border
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
              // make sure any stronger rules (error / theme) are overridden
              borderWidth: 1,
              borderStyle: 'solid',
              // use !important to beat MUI runtime focus rules
              // (sx doesn't support !important directly on values, so we add a selector below)
            },
            '&:hover .MuiOutlinedInput-root': {
              // subtle hover tint
              background: '#161a22',
            },
            // focused state: blue gradient border
            '& .MuiOutlinedInput-root.Mui-focused': {
              background: 'linear-gradient(#141a26,#141a26) padding-box, linear-gradient(90deg,#6bd6ff,#7f8cff) border-box',
              border: '1px solid transparent',
              // ensure our gradient-border rendering is respected
              WebkitBackgroundClip: 'padding-box, border-box',
              backgroundClip: 'padding-box, border-box',
              // fallback subtle blue halo in case the gradient border isn't applied
              boxShadow: '0 0 0 3px rgba(127,140,255,0.10)',
            },
            // stronger selector to override MUI's focused-notchedOutline rule (which can set primary/error color)
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent !important',
            },
            // remove any native focus outlines on the input element itself
            '& .MuiOutlinedInput-input': {
              '&:focus': { outline: 'none !important', boxShadow: 'none !important' },
            },
          }}
        />
        <Button
          variant='outlined'
          size='small'
          onClick={onFilterClick}
          sx={{
            borderColor: '#2a3144',
            bgcolor: 'transparent',
            color: hasActiveFilters ? '#7f8cff' : '#e8efff',
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 700,
            height: 40,
            px: { xs: 1.2, sm: 1.8 },
            minWidth: { xs: 40, sm: 'auto' },
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#3b465f',
              bgcolor: '#20283a',
            },
          }}
        >
          <LuFilter size={16} style={{ marginRight: 0 }} />
          <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>
            Filter
          </Box>
        </Button>
        {hasActiveFilters && (
          <Button
            variant='outlined'
            size='small'
            onClick={onResetFilters}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderColor: '#2a3144',
              color: '#a2b3c7',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 700,
              height: 40,
              px: 1.8,
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#3b465f',
                bgcolor: '#20283a',
                color: '#e8efff',
              },
            }}
          >
            Reset
          </Button>
        )}
        <Button
          component={RouterLink}
          to='/storage'
          variant='outlined'
          size='small'
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
            borderColor: '#2a3144',
            color: '#e8efff',
            '&:hover': {
              borderColor: '#3b465f',
              bgcolor: '#20283a',
            },
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 700,
            height: 40,
            px: 1.8,
          }}
        >
          Storage
        </Button>
      </Box>

      <Button
        component={RouterLink}
        to='/storage'
        variant='outlined'
        size='small'
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          borderColor: '#2a3144',
          color: '#e8efff',
          '&:hover': {
            borderColor: '#3b465f',
            bgcolor: '#20283a',
          },
          textTransform: 'none',
          borderRadius: 2,
          fontWeight: 700,
          height: 34,
          px: 1.8,
        }}
      >
        View Storage
      </Button>
    </Box>
  );
}
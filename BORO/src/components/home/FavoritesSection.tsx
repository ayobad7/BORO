import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { ui } from '../../lib/uiTokens';

export function FavoritesSection() {
  return (
    <Box>
      <Typography variant='h4' fontWeight={700} color={ui.text} sx={{ mb: 2 }}>
        Favorites
      </Typography>
      <Card
        sx={{
          bgcolor: '#0f0f10',
          background: '#0f0f10',
          backgroundImage: 'none',
          p: 3,
          borderRadius: 2,
          boxShadow: 'none',
          border: `1px solid ${ui.border}`,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: ui.text,
        }}
      >
        <Typography variant='body2' sx={{ color: ui.subtext }} align='center'>
          Quick access to storages you follow.
        </Typography>
        <Button
          component={RouterLink}
          to='/favorites'
          variant='contained'
          sx={{
            bgcolor: ui.primary,
            color: '#0A0A0A',
            '&:hover': { bgcolor: ui.primaryHover },
            textTransform: 'none',
            borderRadius: 2,
            mt: 2,
          }}
        >
          Open Favorites
        </Button>
      </Card>
    </Box>
  );
}

export default FavoritesSection;

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

export function FavoritesSection() {
  return (
    <Box>
      <Typography variant='h4' fontWeight={700} color='#000' sx={{ mb: 2 }}>
        FAVORITES
      </Typography>
      <Card
        sx={{
          bgcolor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e7e9ef',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='body2' color='text.secondary' align='center'>
          Quick access to storages you follow.
        </Typography>
        <Button
          component={RouterLink}
          to='/favorites'
          variant='contained'
          sx={{
            bgcolor: '#ff5722',
            '&:hover': { bgcolor: '#f4511e' },
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

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import type { StorageItem } from '../../types';
import { GrLocation } from 'react-icons/gr';
import { BiCategoryAlt } from 'react-icons/bi';

export function LentSection({ items }: { items: StorageItem[] }) {
  const hasLent = items.length > 0;
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant='h4' fontWeight={700} color='#000'>
          LENT
        </Typography>
        <Button
          component={RouterLink}
          to='/storage'
          variant='outlined'
          size='small'
          sx={{
            borderColor: '#ff5722',
            color: '#ff5722',
            '&:hover': {
              borderColor: '#f4511e',
              bgcolor: 'rgba(255,87,34,0.04)',
            },
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          View All
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {hasLent ? (
          items.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              sx={{
                bgcolor: '#fff',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #e7e9ef',
                display: 'flex',
                gap: 2,
              }}
            >
              <Box
                component={RouterLink}
                to={`/item/${item.id}`}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1.2,
                  bgcolor: '#424242',
                  backgroundImage: item.imageUrls?.[0]
                    ? `url(${item.imageUrls[0]})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  textDecoration: 'none',
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant='subtitle2'
                  fontWeight={700}
                  sx={{
                    fontSize: 22,
                    color: '#000',
                    mb: 0.75,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 0.25,
                  }}
                >
                  <BiCategoryAlt style={{ fontSize: 14, color: '#888888' }} />
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      color: '#888888',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.category}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <GrLocation style={{ fontSize: 14, color: '#888888' }} />
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      color: '#888888',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.location || '—'}
                  </Typography>
                </Box>
              </Box>
              <Button
                component={RouterLink}
                to={`/item/${item.id}`}
                variant='contained'
                size='small'
                sx={{
                  bgcolor: '#ff5722',
                  '&:hover': { bgcolor: '#f4511e' },
                  textTransform: 'none',
                  borderRadius: 2,
                  alignSelf: 'center',
                }}
              >
                View
              </Button>
            </Card>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            You haven't lent anything yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LentSection;

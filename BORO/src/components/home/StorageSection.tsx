import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import type { StorageItem } from '../../types';
import { GrLocation } from 'react-icons/gr';
import { BiCategoryAlt } from 'react-icons/bi';
import { LuShare2 } from 'react-icons/lu';

export function StorageSection({ items }: { items: StorageItem[] }) {
  const hasRecent = items.length > 0;
  return (
    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant='h4' fontWeight={700} color='#000'>
            STORAGE
          </Typography>
          <Typography variant='body2' sx={{ color: '#000', fontSize: 24 }}>
            Recently added stuff
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={RouterLink}
            to='/item/new'
            variant='contained'
            size='small'
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#f4511e' },
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Add Item
          </Button>
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
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {hasRecent ? (
          items.slice(0, 4).map((item) => (
            <Card
              key={item.id}
              sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #e7e9ef',
              }}
            >
              <Box sx={{ p: 1.5 }}>
                <Box
                  component={RouterLink}
                  to={`/item/${item.id}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      border: '1px solid #e7e9ef',
                      borderRadius: 1.2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        bgcolor: '#424242',
                        backgroundImage: item.imageUrls?.[0]
                          ? `url(${item.imageUrls[0]})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  pb: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                }}
              >
                <Typography
                  variant='subtitle2'
                  fontWeight={700}
                  sx={{
                    fontSize: 22,
                    color: '#000',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.75,
                  }}
                >
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <IconButton
                    size='small'
                    sx={{
                      bgcolor: '#ffe5d9',
                      color: '#ff5722',
                      height: 30.75,
                      width: 30.75,
                      '&:hover': { bgcolor: '#ffd5c4' },
                    }}
                  >
                    <LuShare2 style={{ fontSize: 16 }} />
                  </IconButton>
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
                    }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            No recent items
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default StorageSection;

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';
import type { StorageItem } from '../../types';
import { GrLocation } from 'react-icons/gr';
import { BiCategoryAlt } from 'react-icons/bi';
import { PiTimerBold } from 'react-icons/pi';
import { HiOutlineUser } from 'react-icons/hi';
import { getDaysLeft } from '../../lib/date';

export function BorrowedSection({ items }: { items: StorageItem[] }) {
  const hasBorrowed = items.length > 0;
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
          BORROWED
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
        {hasBorrowed ? (
          items.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              sx={{
                bgcolor: '#fff',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #e7e9ef',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  component={RouterLink}
                  to={`/item/${item.id}`}
                  sx={{
                    width: 144,
                    height: 144,
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
                    height: 144,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
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
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <BiCategoryAlt
                          style={{ fontSize: 14, color: '#888888' }}
                        />
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
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <GrLocation
                          style={{ fontSize: 14, color: '#888888' }}
                        />
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
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <HiOutlineUser
                          style={{ fontSize: 14, color: '#888888' }}
                        />
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
                          {item.ownerName || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      <Chip
                        icon={<PiTimerBold style={{ fontSize: 14 }} />}
                        label={
                          getDaysLeft(item.borrowedUntil) === 0
                            ? 'Due today'
                            : `${getDaysLeft(item.borrowedUntil)} days left`
                        }
                        size='small'
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: '#ffe5d9',
                          color: '#ff5722',
                          '& .MuiChip-icon': { color: '#ff5722' },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      mt: 'auto',
                    }}
                  >
                    <Button
                      variant='contained'
                      size='small'
                      sx={{
                        bgcolor: '#f5f5f5',
                        color: '#888888',
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: 'none',
                        border: '1px solid #888888',
                        '&:hover': {
                          bgcolor: '#ebebeb',
                          boxShadow: 'none',
                          borderColor: '#888888',
                        },
                      }}
                    >
                      Extend
                    </Button>
                    <Button
                      variant='outlined'
                      size='small'
                      sx={{
                        borderColor: '#ff5722',
                        color: '#ff5722',
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#f4511e',
                          bgcolor: 'rgba(255,87,34,0.04)',
                        },
                      }}
                    >
                      Return
                    </Button>
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
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            You're not borrowing anything yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default BorrowedSection;

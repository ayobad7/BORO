import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import type { StorageItem } from '../types';

export default function Home() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<StorageItem[]>([]);

  useEffect(() => {
    if (!user) {
      setRecent([]);
      return;
    }
    const q = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(2)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as StorageItem[];
        setRecent(arr);
      },
      (error) => {
        console.error('Error fetching recent items:', error);
        // If it's an index error, log helpful message
        if (error.code === 'failed-precondition') {
          console.warn(
            'Firestore index required. Check console for the index creation link.'
          );
        }
        setRecent([]);
      }
    );
    return () => unsub();
  }, [user]);

  const hasRecent = useMemo(() => recent && recent.length > 0, [recent]);
  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            width: 1000,
            maxWidth: '100%',
            mx: 'auto',
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 3,
              width: '100%',
              mb: 6,
              gridAutoRows: 'minmax(160px, auto)',
            }}
          >
            {/* Storage - spans full width (both columns) */}
            <Card
              sx={{
                bgcolor: '#D12128',
                color: '#FAE3AC',
                pt: 3,
                px: 3,
                pb: 1.5,
                gridColumn: '1 / -1',
                minHeight: 300,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '320px 1fr',
                  gap: 3,
                  alignItems: 'flex-start',
                }}
              >
                {/* Left column: title and actions */}
                <Box>
                  <Typography variant='h4' fontWeight={800} sx={{ mb: 1 }}>
                    STORAGE
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 3, maxWidth: 300 }}>
                    Keep a visual catalog of everything you own. Add, tag, and
                    locate items fast.
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      width: 220,
                    }}
                  >
                    <Button
                      component={RouterLink}
                      to='/storage'
                      variant='contained'
                      color='secondary'
                    >
                      View storage
                    </Button>
                    <Button
                      component={RouterLink}
                      to='/item/new'
                      variant='contained'
                      color='warning'
                    >
                      Add item
                    </Button>
                  </Box>
                </Box>

                {/* Right column: Recently added (20px rounded box) */}
                <Box
                  sx={{
                    bgcolor: '#FAE3AC',
                    color: '#1A1A1A',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    minHeight: 250,
                    pt: 2,
                    px: 2,
                    pb: 1,
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ color: '#01344F', fontWeight: 700, mb: 2 }}
                  >
                    Recently added
                  </Typography>

                  {/* Recent items (from Firestore) or placeholders when not signed in */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                      gap: 3.5,
                    }}
                  >
                    {hasRecent ? (
                      recent.map((it) => (
                        <Box
                          key={it.id}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '64px 1fr auto',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <Box sx={{ position: 'relative', width: 64, height: 64 }}>
                            {it.imageUrls && it.imageUrls[0] ? (
                              <Box
                                sx={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: 5,
                                  backgroundImage: `url(${it.imageUrls[0]})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 64,
                                  height: 64,
                                  bgcolor: '#D12128',
                                  borderRadius: 5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#1A1A1A',
                                  fontWeight: 700,
                                }}
                              >
                                IMG
                              </Box>
                            )}
                            {/* Status badge: green = available, red = borrowed */}
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 4,
                                right: 4,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: it.status === 'available' ? '#4ade80' : '#ef4444',
                                border: '2px solid #FAE3AC',
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant='subtitle1'
                              sx={{ fontWeight: 700, fontSize: '1rem' }}
                            >
                              {it.title}
                            </Typography>
                            <Typography variant='body2' sx={{ color: '#6b6b6b', fontSize: '0.8125rem' }}>
                              {it.category}
                            </Typography>
                            <Typography variant='body2' sx={{ color: '#6b6b6b', fontSize: '0.8125rem' }}>
                              {it.location || '—'}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IconButton
                              component={RouterLink}
                              to={`/item/${it.id}`}
                              sx={{
                                bgcolor: '#033252',
                                color: '#FAE3AC',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                  bgcolor: '#022540',
                                },
                              }}
                            >
                              <ArrowForwardIosIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant='body2' sx={{ color: '#072B36' }}>
                        {user
                          ? 'No items yet — add your first one.'
                          : 'Sign in to see your recent items.'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Borrowed - left column */}
            <Card sx={{ bgcolor: '#01344F', color: '#FAE3AC', p: 2 }}>
              <Typography variant='h6' fontWeight={800} gutterBottom>
                BORROWED
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Track what you’re borrowing and from whom. We’ll add due chips
                per item.
              </Typography>
              <Button
                component={RouterLink}
                to='/storage'
                variant='contained'
                color='primary'
              >
                View Borrowed
              </Button>
            </Card>

            {/* Favorites - right column spanning two rows */}
            <Card
              sx={{
                bgcolor: '#D12128',
                color: '#FAE3AC',
                p: 2,
                gridRow: 'span 2',
              }}
            >
              <Typography variant='h6' fontWeight={800} gutterBottom>
                FAVORITES
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Quick access to storages you follow.
              </Typography>
              <Button
                component={RouterLink}
                to='/favorites'
                variant='contained'
                color='secondary'
              >
                Open Favorites
              </Button>
            </Card>

            {/* Lent - left column below borrowed */}
            <Card sx={{ bgcolor: '#FAE3AC', color: '#1A1A1A', p: 2 }}>
              <Typography variant='h6' fontWeight={800} gutterBottom>
                LENT
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                See items you lent to friends and their status.
              </Typography>
              <Button
                component={RouterLink}
                to='/storage'
                variant='contained'
                color='secondary'
              >
                View Lent Items
              </Button>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}

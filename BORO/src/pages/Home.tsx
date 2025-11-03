import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
  const [borrowed, setBorrowed] = useState<StorageItem[]>([]);
  const [lent, setLent] = useState<StorageItem[]>([]);

  // Fetch recently added items
  useEffect(() => {
    if (!user) {
      setRecent([]);
      return;
    }
    const q = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
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

  // Fetch borrowed items (items I'm borrowing from others)
  useEffect(() => {
    if (!user) {
      setBorrowed([]);
      return;
    }
    const q = query(
      collection(db, 'items'),
      where('holderId', '==', user.uid),
      where('status', '==', 'borrowed'),
      orderBy('borrowedFrom', 'asc'),
      limit(3)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as StorageItem[];
        setBorrowed(arr);
      },
      (error) => {
        console.error('Error fetching borrowed items:', error);
        if (error.code === 'failed-precondition') {
          console.warn(
            'Firestore index required for borrowed items. Check console for the index creation link.'
          );
        }
        setBorrowed([]);
      }
    );
    return () => unsub();
  }, [user]);

  // Fetch lent items (items I own that others are borrowing)
  useEffect(() => {
    if (!user) {
      setLent([]);
      return;
    }
    const q = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'borrowed'),
      orderBy('borrowedFrom', 'asc'),
      limit(3)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as StorageItem[];
        setLent(arr);
      },
      (error) => {
        console.error('Error fetching lent items:', error);
        if (error.code === 'failed-precondition') {
          console.warn(
            'Firestore index required for lent items. Check console for the index creation link.'
          );
        }
        setLent([]);
      }
    );
    return () => unsub();
  }, [user]);

  const hasRecent = useMemo(() => recent && recent.length > 0, [recent]);
  const hasBorrowed = useMemo(
    () => borrowed && borrowed.length > 0,
    [borrowed]
  );
  const hasLent = useMemo(() => lent && lent.length > 0, [lent]);
  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1000,
            mx: 'auto',
            mt: 6,
            px: { xs: 2, sm: 3, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: { xs: 2, md: 3 },
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
                px: { xs: 2, md: 3 },
                pb: { xs: 2, md: 3 },
                gridColumn: { xs: '1', md: '1 / -1' },
                minHeight: { xs: 'auto', md: 300 },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
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
                    minHeight: { xs: 'auto', md: 230 },
                    pt: 2,
                    px: { xs: 2, md: 3 },
                    pb: 2,
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
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: { xs: 1.5, md: 3 },
                      overflowX: { xs: 'auto', md: 'visible' },
                    }}
                  >
                    {hasRecent ? (
                      recent.slice(0, 3).map((it) => (
                        <Box
                          key={it.id}
                          component={RouterLink}
                          to={`/item/${it.id}`}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            width: { xs: '120px', md: '170px' },
                            flexShrink: 0,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {/* Image container */}
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '1',
                              mb: 0.75,
                            }}
                          >
                            {it.imageUrls && it.imageUrls[0] ? (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 1,
                                  backgroundImage: `url(${it.imageUrls[0]})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  bgcolor: '#D12128',
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#1A1A1A',
                                  fontWeight: 700,
                                  fontSize: '2rem',
                                }}
                              >
                                IMG
                              </Box>
                            )}
                          </Box>
                          {/* Text content */}
                          <Box>
                            <Chip
                              label={it.category}
                              size='small'
                              color='secondary'
                              sx={{
                                fontSize: '0.7rem',
                                height: '20px',
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              variant='subtitle2'
                              sx={{
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                mb: 0.25,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {it.title}
                            </Typography>
                            <Typography
                              variant='caption'
                              sx={{
                                color: '#6b6b6b',
                                fontSize: '1.0rem',
                                display: 'block',
                              }}
                            >
                              {it.location || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant='body2'
                        sx={{
                          color: '#072B36',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant='h6' fontWeight={800}>
                  BORROWED
                </Typography>
                <Button
                  component={RouterLink}
                  to='/storage'
                  variant='contained'
                  size='small'
                  sx={{
                    bgcolor: '#D12128',
                    '&:hover': { bgcolor: '#b01820' },
                    textTransform: 'none',
                  }}
                >
                  View
                </Button>
              </Box>

              {/* Borrowed items cards */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2,
                  minHeight: { xs: 'auto', md: 180 },
                }}
              >
                {hasBorrowed ? (
                  borrowed.slice(0, 3).map((it) => (
                    <Box
                      key={it.id}
                      component={RouterLink}
                      to={`/item/${it.id}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        width: { xs: '100%', md: '100px' },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1',
                          mb: 0.5,
                        }}
                      >
                        {it.imageUrls && it.imageUrls[0] ? (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 2,
                              backgroundImage: `url(${it.imageUrls[0]})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: '#D12128',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#1A1A1A',
                              fontWeight: 700,
                              fontSize: '1.5rem',
                            }}
                          >
                            IMG
                          </Box>
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: '#ef4444',
                            border: '2px solid #FAE3AC',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            mb: 0.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {it.title}
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{
                            color: '#FAE3AC',
                            opacity: 0.7,
                            fontSize: '0.6875rem',
                            display: 'block',
                          }}
                        >
                          {it.category}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#FAE3AC',
                      opacity: 0.7,
                      textAlign: 'center',
                      width: '100%',
                      py: 4,
                    }}
                  >
                    {user
                      ? "You're not borrowing anything yet."
                      : 'Sign in to see borrowed items.'}
                  </Typography>
                )}
              </Box>
            </Card>

            {/* Favorites - right column spanning two rows */}
            <Card
              sx={{
                bgcolor: '#D12128',
                color: '#FAE3AC',
                p: 2,
                gridRow: { xs: 'auto', md: 'span 2' },
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant='h6' fontWeight={800}>
                  LENT
                </Typography>
                <Button
                  component={RouterLink}
                  to='/storage'
                  variant='contained'
                  size='small'
                  sx={{
                    bgcolor: '#033252',
                    '&:hover': { bgcolor: '#044a73' },
                    textTransform: 'none',
                  }}
                >
                  View
                </Button>
              </Box>

              {/* Lent items cards */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2,
                  minHeight: { xs: 'auto', md: 180 },
                }}
              >
                {hasLent ? (
                  lent.slice(0, 3).map((it) => (
                    <Box
                      key={it.id}
                      component={RouterLink}
                      to={`/item/${it.id}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        width: { xs: '100%', md: '100px' },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1',
                          mb: 0.5,
                        }}
                      >
                        {it.imageUrls && it.imageUrls[0] ? (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 2,
                              backgroundImage: `url(${it.imageUrls[0]})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: '#D12128',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#1A1A1A',
                              fontWeight: 700,
                              fontSize: '1.5rem',
                            }}
                          >
                            IMG
                          </Box>
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: '#ef4444',
                            border: '2px solid #FAE3AC',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            mb: 0.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {it.title}
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{
                            color: '#6b6b6b',
                            fontSize: '0.6875rem',
                            display: 'block',
                          }}
                        >
                          {it.category}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#6b6b6b',
                      textAlign: 'center',
                      width: '100%',
                      py: 4,
                    }}
                  >
                    {user
                      ? "You haven't lent anything yet."
                      : 'Sign in to see lent items.'}
                  </Typography>
                )}
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}

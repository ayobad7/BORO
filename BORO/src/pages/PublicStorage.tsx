import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import type { StorageItem, StorageHistory, FavoriteStorage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import ActivityCard from '../components/ActivityCard';
import { ACCENTS } from '../lib/accents';
import Masonry from 'react-masonry-css';
import './Home2.css';

export default function PublicStorage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [items, setItems] = useState<StorageItem[]>([]);
  const [ownerName, setOwnerName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // Fetch items owned by this user
    const q = query(collection(db, 'items'), where('ownerId', '==', userId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const toMs = (v: any) => {
          if (!v) return 0;
          if (typeof v === 'number') return v;
          if (typeof v === 'string') {
            const n = Date.parse(v);
            return isNaN(n) ? 0 : n;
          }
          if (v && typeof v.toMillis === 'function') return v.toMillis();
          if (v instanceof Date) return v.getTime();
          return 0;
        };
        const arr = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            ...data,
            createdAt: toMs(data.createdAt),
            updatedAt: toMs(data.updatedAt),
          } as StorageItem;
        });
        if (arr.length > 0 && arr[0].ownerName) {
          setOwnerName(arr[0].ownerName);
        }
        // sort newest first
        arr.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
        setItems(arr);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId]);

  // Track visit history
  useEffect(() => {
    if (!userId || !ownerName || userId === user?.uid) return;

    const historyStr = localStorage.getItem('storageHistory');
    let history: StorageHistory[] = [];
    if (historyStr) {
      try {
        history = JSON.parse(historyStr) as StorageHistory[];
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    // Remove duplicates of this user
    history = history.filter((h) => h.userId !== userId);

    // Add current visit
    history.unshift({
      userId,
      userName: ownerName,
      visitedAt: Date.now(),
    });

    // Keep only last 4
    history = history.slice(0, 4);

    localStorage.setItem('storageHistory', JSON.stringify(history));
  }, [userId, ownerName, user?.uid]);

  // Check if this storage is favorited
  useEffect(() => {
    if (!user || !userId || userId === user.uid) return;

    const q = query(
      collection(db, 'favoriteStorages'),
      where('userId', '==', user.uid),
      where('storageOwnerId', '==', userId)
    );

    const checkFavorite = async () => {
      const snap = await getDocs(q);
      if (!snap.empty) {
        setIsFavorited(true);
        setFavoriteId(snap.docs[0].id);
      } else {
        setIsFavorited(false);
        setFavoriteId(null);
      }
    };

    checkFavorite();
  }, [user, userId]);

  const toggleFavorite = async () => {
    if (!user || !userId || !ownerName) return;

    try {
      if (isFavorited && favoriteId) {
        // Remove favorite
        await deleteDoc(doc(db, 'favoriteStorages', favoriteId));
        setIsFavorited(false);
        setFavoriteId(null);
        setSnackbarMessage('Removed from favorites');
        setSnackbarOpen(true);
      } else {
        // Add favorite
        const newId = uuidv4();
        const fav: FavoriteStorage = {
          id: newId,
          userId: user.uid,
          storageOwnerId: userId,
          storageOwnerName: ownerName,
          createdAt: Date.now(),
        };
        await setDoc(doc(db, 'favoriteStorages', newId), {
          ...fav,
          createdAt: serverTimestamp(),
        });
        setIsFavorited(true);
        setFavoriteId(newId);
        setSnackbarMessage('Added to favorites');
        setSnackbarOpen(true);
      }
    } catch (e: any) {
      console.error('Failed to toggle favorite:', e);
      setSnackbarMessage('Failed to update favorites');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            width: '100vw',
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
            <CircularProgress />
          </Box>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            width: '100vw',
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
            <Alert severity='error'>{error}</Alert>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
  <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
          <Stack
            direction='row'
            spacing={2}
            alignItems='center'
            justifyContent='space-between'
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant='h5' gutterBottom>
                {ownerName ? `${ownerName}'s Storage` : 'Public Storage'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Browse available items to borrow
              </Typography>
            </Box>
            {user && userId && userId !== user.uid && (
              <Button
                variant={isFavorited ? 'contained' : 'outlined'}
                startIcon={
                  isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />
                }
                onClick={toggleFavorite}
              >
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
            )}
          </Stack>

          {items.length === 0 && (
            <Alert severity='info' sx={{ mt: 2 }}>
              No items in this storage yet.
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Masonry
              breakpointCols={{ default: 4, 1400: 3, 1024: 2, 640: 1 }}
              className='my-masonry-grid'
              columnClassName='my-masonry-grid_column'
            >
              {items.map((it) => {
                const viewerIdVal = user?.uid ?? null;
                // Determine card type relative to the current viewer
                // If item is borrowed:
                // - show 'borrowed' to the current holder
                // - show 'lent' to everyone else (including owner and other viewers)
                // Otherwise show 'storage'
                let cardType: 'storage' | 'borrowed' | 'lent' = 'storage';
                if (it.status === 'borrowed') {
                  if (viewerIdVal && it.holderId && viewerIdVal === it.holderId) {
                    cardType = 'borrowed';
                  } else {
                    cardType = 'lent';
                  }
                }
                const accent = cardType === 'borrowed' ? ACCENTS.borrowed : cardType === 'lent' ? ACCENTS.lent : ACCENTS.storage;
                const viewerIsOwner = user?.uid === userId;
                return (
                  <ActivityCard
                    key={it.id}
                    item={it}
                    type={cardType}
                    accentColor={accent}
                    viewerIsOwner={viewerIsOwner}
                    viewerId={viewerIdVal}
                  />
                );
              })}
            </Masonry>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />
        </Box>
      </Box>
    </>
  );
}

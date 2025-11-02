import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import { Link as RouterLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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
        const arr = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as StorageItem[];
        setItems(arr);
        if (arr.length > 0 && arr[0].ownerName) {
          setOwnerName(arr[0].ownerName);
        }
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
          <Box
            sx={{
              width: 1000,
              maxWidth: '100%',
              py: 3,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
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
          <Box sx={{ width: 1000, maxWidth: '100%', py: 3 }}>
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
        <Box sx={{ width: 1000, maxWidth: '100%', py: 3 }}>
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

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 2,
              mt: 2,
            }}
          >
            {items.map((it) => (
              <Card key={it.id}>
                <CardActionArea component={RouterLink} to={`/item/${it.id}`}>
                  <CardContent>
                    <Typography variant='subtitle1'>{it.title}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {it.category}
                      {it.location ? ` • ${it.location}` : ''}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Chip size='small' label={`Mode: ${it.borrowMode}`} />
                      {it.status === 'available' && (
                        <Chip
                          size='small'
                          label='Available'
                          color='success'
                          variant='outlined'
                        />
                      )}
                      {it.status === 'requested' && (
                        <Chip size='small' label='Requested' color='info' />
                      )}
                      {it.status === 'borrowed' && (
                        <Chip size='small' label='Borrowed' color='warning' />
                      )}
                    </Box>
                    {it.status === 'borrowed' && it.holderName && (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}
                      >
                        Borrowed by: {it.holderName}
                      </Typography>
                    )}
                    {it.borrowedUntil && (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 0.5 }}
                      >
                        Return by:{' '}
                        {new Date(it.borrowedUntil).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
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

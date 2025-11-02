import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import type { FavoriteStorage, StorageHistory } from '../types';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteStorage[]>([]);
  const [history, setHistory] = useState<StorageHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load favorites from Firestore
    const q = query(
      collection(db, 'favoriteStorages'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt:
            data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
        };
      }) as FavoriteStorage[];
      setFavorites(arr.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    // Load history from localStorage
    const historyStr = localStorage.getItem('storageHistory');
    if (historyStr) {
      try {
        const parsed = JSON.parse(historyStr) as StorageHistory[];
        setHistory(parsed.slice(0, 4));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const removeFavorite = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'favoriteStorages', id));
    } catch (e) {
      console.error('Failed to remove favorite:', e);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('storageHistory');
    setHistory([]);
  };

  if (!user) {
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
            <Alert severity='warning'>
              Please sign in to view favorites and history.
            </Alert>
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
          <Typography variant='h4' gutterBottom>
            Favorites & History
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant='h6' gutterBottom>
            Favorite Storage
          </Typography>
          {loading ? (
            <Typography variant='body2' color='text.secondary'>
              Loading...
            </Typography>
          ) : favorites.length === 0 ? (
            <Alert severity='info' sx={{ mb: 3 }}>
              No favorites yet. Visit someone's storage and click the "Add to
              Favorites" button.
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
                mb: 3,
              }}
            >
              {favorites.map((fav) => (
                <Card key={fav.id}>
                  <CardContent>
                    <Typography variant='subtitle1'>
                      {fav.storageOwnerName}'s Storage
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Added {new Date(fav.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size='small'
                      component={RouterLink}
                      to={`/storage/${fav.storageOwnerId}`}
                    >
                      View
                    </Button>
                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => removeFavorite(fav.id)}
                      sx={{ ml: 'auto' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant='h6'>Recently Browsed</Typography>
            {history.length > 0 && (
              <Button size='small' onClick={clearHistory}>
                Clear History
              </Button>
            )}
          </Box>

          {history.length === 0 ? (
            <Alert severity='info'>
              No browsing history yet. Visit someone's storage to see it here.
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
              }}
            >
              {history.map((item, idx) => (
                <Card key={`${item.userId}-${idx}`}>
                  <CardContent>
                    <Typography variant='subtitle1'>
                      {item.userName}'s Storage
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Visited {new Date(item.visitedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size='small'
                      component={RouterLink}
                      to={`/storage/${item.userId}`}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

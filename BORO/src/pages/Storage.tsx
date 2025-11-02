import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import type { StorageItem } from '../types';

export default function Storage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StorageItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'items'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as StorageItem[];
      setItems(arr);
    });
    return () => unsub();
  }, [user]);

  const markReturned = async (id: string) => {
    const ref = doc(db, 'items', id);
    await updateDoc(ref, { status: 'available', holderId: user?.uid });
  };

  const copyStorageLink = () => {
    if (!user) return;
    const link = `${window.location.origin}/storage/${user.uid}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
    });
  };

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
            <Typography variant='h5'>My Storage</Typography>
            <Stack direction='row' spacing={2}>
              {user && (
                <>
                  <Button
                    variant='contained'
                    component={RouterLink}
                    to='/item/new'
                  >
                    Add New Item
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<ContentCopyIcon />}
                    onClick={copyStorageLink}
                  >
                    Share Storage
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
          {!user && (
            <Typography color='text.secondary'>
              Sign in to view your items.
            </Typography>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 2,
              mt: 2,
            }}
          >
            {items.map((it) => (
              <Card key={it.id}>
                <CardContent>
                  <Typography variant='h6'>{it.title}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {it.category}
                    {it.location ? ` • ${it.location}` : ''}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}
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
                    {it.holderId !== it.ownerId && (
                      <Chip size='small' label='Lent out' variant='outlined' />
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
                <CardActions>
                  <Button
                    size='small'
                    component={RouterLink}
                    to={`/item/${it.id}`}
                  >
                    View
                  </Button>
                  {it.status === 'borrowed' && (
                    <Button size='small' onClick={() => markReturned(it.id)}>
                      Mark returned
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>

          <Snackbar
            open={copied}
            autoHideDuration={3000}
            onClose={() => setCopied(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              severity='success'
              onClose={() => setCopied(false)}
              sx={{ width: '100%' }}
            >
              Storage link copied to clipboard!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}

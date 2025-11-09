import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { StorageItem } from '../types';
import QuickAddCard from '../components/QuickAddCard';
import ActivityCard from '../components/ActivityCard';
import { ACCENTS } from '../lib/accents';
import Masonry from 'react-masonry-css';
import './Home2.css';

export default function Storage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StorageItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [favItemIds, setFavItemIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'items'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
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
      // sort by updatedAt or createdAt descending so newest appear first (left-most)
      arr.sort((a, b) => toMs((b as any).updatedAt || (b as any).createdAt) - toMs((a as any).updatedAt || (a as any).createdAt));
      setItems(arr);
    });
    return () => unsub();
  }, [user]);

  // Toggle favorite for an item (optimistic update + Firestore write)
  const toggleFavorite = async (id: string) => {
    if (!user) return;
    const wasFav = favItemIds.has(id);
    // optimistic
    setFavItemIds((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      const favRef = doc(collection(db, 'favoriteItems'), `${user.uid}_${id}`);
      if (wasFav) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          userId: user.uid,
          itemId: id,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error('Favorite toggle failed', e);
    }
  };

  // Listen for favorite items for current user so Storage can show heart state
  useEffect(() => {
    if (!user) {
      setFavItemIds(new Set());
      return;
    }
    const fq = query(collection(db, 'favoriteItems'), where('userId', '==', user.uid));
    const unsub = onSnapshot(fq, (snap) => {
      const ids = new Set<string>();
      for (const d of snap.docs) {
        const data = d.data() as any;
        if (data.itemId) ids.add(data.itemId as string);
      }
      setFavItemIds(ids);
    });
    return () => unsub();
  }, [user]);

  const copyStorageLink = () => {
    if (!user) return;
    const link = `${window.location.origin}/storage/${user.uid}`;
    navigator.clipboard.writeText(link).then(() => setCopied(true));
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mb: 2 }}>
          <Typography variant='h5'>My Storage</Typography>
          {user && (
            <Box>
              <Button variant='outlined' startIcon={<ContentCopyIcon />} onClick={copyStorageLink} sx={{ borderColor: '#2a3144', color: '#e8efff', textTransform: 'none' }}>
                Share Storage
              </Button>
            </Box>
          )}
        </Stack>

        {/* Masonry layout (same as Home) with Quick Add first */}
        <Box>
          <Masonry
            breakpointCols={{ default: 4, 1400: 3, 1024: 2, 640: 1 }}
            className='my-masonry-grid'
            columnClassName='my-masonry-grid_column'
          >
            {/* Quick Add first */}
            <QuickAddCard key='quick-add' />

            {items.map((it) => {
              const isLent = it.status === 'borrowed' && it.holderId && it.holderId !== it.ownerId;
              const cardType: 'storage' | 'lent' = isLent ? 'lent' : 'storage';
              const accent = isLent ? ACCENTS.lent : ACCENTS.storage;
              return (
                <ActivityCard
                  key={it.id}
                  item={it}
                  type={cardType}
                  accentColor={accent}
                  isFavorite={favItemIds.has(it.id)}
                  onToggleFavorite={() => toggleFavorite(it.id)}
                  viewerId={user?.uid}
                />
              );
            })}
          </Masonry>
        </Box>

        <Snackbar open={copied} autoHideDuration={3000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity='success' onClose={() => setCopied(false)} sx={{ width: '100%' }}>
            Storage link copied to clipboard!
          </Alert>
        </Snackbar>
        </Box>
      </Box>
    </>
  );
}

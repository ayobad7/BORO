import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import type { StorageItem } from '../types';
import StorageSection from '../components/home/StorageSection';
import BorrowedSection from '../components/home/BorrowedSection';
import LentSection from '../components/home/LentSection';
import FavoritesSection from '../components/home/FavoritesSection';

export default function Home() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<StorageItem[]>([]);
  const [borrowed, setBorrowed] = useState<StorageItem[]>([]);
  const [lent, setLent] = useState<StorageItem[]>([]);

  useEffect(() => {
    if (!user) {
      setRecent([]);
      return;
    }
    const q = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(4)
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
      () => setRecent([])
    );
    return () => unsub();
  }, [user]);

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
      () => setBorrowed([])
    );
    return () => unsub();
  }, [user]);

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
      () => setLent([])
    );
    return () => unsub();
  }, [user]);

  // Section components handle their own empty states

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1000,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 0 },
          }}
        >
          <StorageSection items={recent} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <BorrowedSection items={borrowed} />
              <LentSection items={lent} />
            </Box>
            <FavoritesSection />
          </Box>
        </Box>
      </Box>
    </>
  );
}

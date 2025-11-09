import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import type { StorageItem } from '../types';
import StorageSection from '../components/home/StorageSection';
import BorrowedSection from '../components/home/BorrowedSection';
import LentSection from '../components/home/LentSection';
import FavoritesSection from '../components/home/FavoritesSection';
import { ui } from '../lib/uiTokens';
import { PiPackageLight, PiHandArrowDown, PiHandArrowUp } from 'react-icons/pi';

export default function Home() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<StorageItem[]>([]);
  const [borrowed, setBorrowed] = useState<StorageItem[]>([]);
  const [lent, setLent] = useState<StorageItem[]>([]);
  const [counts, setCounts] = useState({ storage: 0, borrowed: 0, lent: 0 });

  // Fetch counts for the top summary bar
  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        const storageQ = query(
          collection(db, 'items'),
          where('ownerId', '==', user.uid)
        );
        const borrowedQ = query(
          collection(db, 'items'),
          where('holderId', '==', user.uid),
          where('status', '==', 'borrowed')
        );
        const lentQ = query(
          collection(db, 'items'),
          where('ownerId', '==', user.uid),
          where('status', '==', 'borrowed')
        );
        const [s, b, l] = await Promise.all([
          getCountFromServer(storageQ),
          getCountFromServer(borrowedQ),
          getCountFromServer(lentQ),
        ]);
        setCounts({
          storage: s.data().count,
          borrowed: b.data().count,
          lent: l.data().count,
        });
      } catch {
        // ignore count errors for now
      }
    };
    fetchCounts();
  }, [user]);

  // Recent items for Storage
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
      <Box sx={{ minHeight: '100vh', bgcolor: ui.bg, py: 4 }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1000,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 0 },
          }}
        >
          {/* Summary Bar */}
          <Card
            sx={{
              borderRadius: 9999,
              border: `1px solid ${ui.border}`,
              bgcolor: '#0f0f10',
              color: ui.text,
              boxShadow: 'none',
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // keep single row on mobile
                alignItems: 'stretch',
                justifyContent: 'space-between',
              }}
            >
              {[
                {
                  icon: <PiPackageLight size={28} />,
                  label: 'Storage',
                  value: `${counts.storage} items`,
                },
                {
                  icon: <PiHandArrowDown size={28} />,
                  label: 'Borrowed',
                  value: `${counts.borrowed} items`,
                },
                {
                  icon: <PiHandArrowUp size={28} />,
                  label: 'Lent',
                  value: `${counts.lent} items`,
                },
              ].map((s, idx, arr) => (
                <Box
                  key={s.label}
                  sx={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <Box sx={{ color: ui.text }}>{s.icon}</Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        color: ui.subtext,
                        lineHeight: 1,
                        fontSize: { xs: 12, sm: 14 },
                      }}
                    >
                      {s.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 15, sm: 18 },
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                        mt: 0.5,
                      }}
                    >
                      {s.value}
                    </Typography>
                  </Box>
                  {/* Vertical separator (desktop) */}
                  {idx < arr.length - 1 && (
                    <Box
                      sx={{
                        display: 'block',
                        position: 'absolute',
                        right: 0,
                        top: '20%',
                        height: '60%',
                        width: '1px',
                        bgcolor: ui.border,
                      }}
                    />
                  )}
                  {/* Horizontal separator (mobile) */}
                  {/* removed for mobile since layout stays in one row */}
                </Box>
              ))}
            </Box>
          </Card>

          <StorageSection items={recent} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
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

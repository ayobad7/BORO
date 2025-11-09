import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import Masonry from 'react-masonry-css';
import './Home2.css';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import type { StorageItem } from '../types';
import { ui } from '../lib/uiTokens';
import { PiPackageLight, PiHandArrowDown, PiHandArrowUp } from 'react-icons/pi';
import type { BorrowMode } from '../types';
// duplicate import removed
// Tabs/Sort controls removed in this revision
import { ACCENTS } from '../lib/accents';
import { FiSearch } from 'react-icons/fi';
import ActivityCard from '../components/ActivityCard.tsx';
import RecentActivityCard from '../components/RecentActivityCard';
import type { ActivityEvent } from '../components/RecentActivityCard';
import PeopleCard from '../components/PeopleCard';
import ImageUploader from '../components/ImageUploader';
import { v4 as uuidv4 } from 'uuid';
import { getDaysLeft, getOverdueDays } from '../lib/date';
import Popover from '@mui/material/Popover';
import { LuFilter } from 'react-icons/lu';

// Activity colors
// Activity colors now centralized in ACCENTS
const ACTIVITY_COLORS = {
  storage: ACCENTS.storage,
  borrowed: ACCENTS.borrowed,
  lent: ACCENTS.lent,
  favorite: ACCENTS.favorite,
};

interface ActivityItem extends StorageItem {
  activityType: 'storage' | 'borrowed' | 'lent';
  activityTimestamp: number;
}

export default function Home2() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [counts, setCounts] = useState({ storage: 0, borrowed: 0, lent: 0 });
  const [recentEvents, setRecentEvents] = useState<ActivityEvent[]>([]);
  const [favOwners, setFavOwners] = useState<
    { id: string; name: string; createdAt: number }[]
  >([]);
  const [latestFavAt, setLatestFavAt] = useState<number | null>(null);
  // filtering/sorting to be reintroduced later
  // Firestore-backed favorite items
  const [favItemIds, setFavItemIds] = useState<Set<string>>(new Set());
  // Search & filter state
  const [search, setSearch] = useState('');
  const [typeFilters, setTypeFilters] = useState<
    Set<ActivityItem['activityType']>
  >(new Set());
  const [modeFilters, setModeFilters] = useState<Set<BorrowMode>>(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [dueSoonOnly, setDueSoonOnly] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  // Quick Add (Home) state
  const [qTitle, setQTitle] = useState('');
  const [qCategory, setQCategory] = useState('');
  const [qLocation, setQLocation] = useState('');
  const [qNote, setQNote] = useState('');
  const qMode: BorrowMode = 'free';
  const [qFiles, setQFiles] = useState<File[]>([]);
  const [qSaving, setQSaving] = useState(false);

  const canQuickSubmit =
    !!user &&
    qTitle.trim().length > 0 &&
    qCategory.trim().length > 0 &&
    qLocation.trim().length > 0 &&
    qFiles.length > 0 &&
    !qSaving;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
      | string
      | undefined;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
      | string
      | undefined;
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined;

    if (!cloudName)
      throw new Error(
        'Cloudinary cloud name is missing. Set VITE_CLOUDINARY_CLOUD_NAME in .env.local.'
      );
    if (!uploadPreset)
      throw new Error(
        'Cloudinary upload preset is missing. Set VITE_CLOUDINARY_UPLOAD_PRESET in .env.local.'
      );

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);
    if (folder) form.append('folder', folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: form,
      }
    );
    if (!res.ok) {
      throw new Error('Upload failed');
    }
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleQuickAdd = async () => {
    if (!canQuickSubmit || !user) return;
    setQSaving(true);
    try {
      const urls: string[] = [];
      for (const f of qFiles.slice(0, 3)) {
        const url = await uploadToCloudinary(f);
        urls.push(url);
      }
      const id = uuidv4();
      const ref = doc(collection(db, 'items'), id);
      const docData: any = {
        id,
        ownerId: user.uid,
        ownerName: user.displayName || user.email || 'Unknown',
        ownerPhotoURL: user.photoURL || '',
        holderId: user.uid,
        holderName: user.displayName || user.email || 'Unknown',
        title: qTitle.trim(),
        category: qCategory.trim(),
        imageUrls: urls,
        borrowMode: qMode,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (qLocation.trim()) docData.location = qLocation.trim();
      if (qNote.trim()) docData.note = qNote.trim();
      await setDoc(ref, docData);
      // Clear form
      setQTitle('');
      setQCategory('');
      setQLocation('');
      setQNote('');
      setQFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setQSaving(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setFavItemIds(new Set());
      return;
    }

    // Queries
    const storageQ = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const borrowedQ = query(
      collection(db, 'items'),
      where('holderId', '==', user.uid),
      where('status', '==', 'borrowed'),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const lentQ = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'borrowed'),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );

    // Helpers & state holders
    const toMs = (v: any): number => {
      if (!v) return Date.now();
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = Date.parse(v);
        return isNaN(n) ? Date.now() : n;
      }
      if (v && typeof v.toMillis === 'function') return v.toMillis();
      if (v instanceof Date) return v.getTime();
      return Date.now();
    };

    let storageItems: ActivityItem[] = [];
    let borrowedItems: ActivityItem[] = [];
    let lentItems: ActivityItem[] = [];
    let prevBorrowedMap: Record<string, ActivityItem> = {};
    let prevLentMap: Record<string, ActivityItem> = {};
    let prevFavIds = new Set<string>();

    const STORAGE_KEY = `boro:recentEvents:${user.uid}`;

    // Preload any locally cached recent events so refresh keeps prior actions visible
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as ActivityEvent[];
        const fresh = parsed.filter(
          (e) => Number.isFinite(e.ts) && e.ts > Date.now() - 14 * 86400000
        );
        if (fresh.length) setRecentEvents(fresh);
      }
    } catch {}

    const pushEvents = (newEv: ActivityEvent[]) => {
      if (!newEv.length) return;
      setRecentEvents((curr) => {
        const merged = [...newEv, ...curr];
        const seen = new Set<string>();
        const dedup: ActivityEvent[] = [];
        for (const e of merged.sort((a, b) => b.ts - a.ts)) {
          if (!seen.has(e.id)) {
            seen.add(e.id);
            dedup.push(e);
          }
        }
        const final = dedup.slice(0, 20);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
        } catch {}
        return final;
      });
    };

    function recompute() {
      const merged = [...storageItems, ...borrowedItems, ...lentItems].sort(
        (a, b) => b.activityTimestamp - a.activityTimestamp
      );
      setActivities(merged);
      setCounts({
        storage: storageItems.length,
        borrowed: borrowedItems.length,
        lent: lentItems.length,
      });
      // Build baseline events but merge via pushEvents so we don't overwrite
      const baseline: ActivityEvent[] = [];
      for (const s of storageItems.slice(0, 20)) {
        const createdTs = toMs((s as any).createdAt);
        if (
          createdTs &&
          (createdTs === s.activityTimestamp ||
            createdTs > Date.now() - 7 * 86400000)
        ) {
          baseline.push({
            id: `add-${s.id}`,
            ts: createdTs,
            text: `You added “${s.title}” to Storage`,
          });
        }
      }
      for (const b of borrowedItems.slice(0, 20)) {
        baseline.push({
          id: `borrow-${b.id}`,
          ts: toMs(b.activityTimestamp),
          text: `You borrowed “${b.title}”`,
        });
      }
      for (const l of lentItems.slice(0, 20)) {
        baseline.push({
          id: `lent-${l.id}`,
          ts: toMs(l.activityTimestamp),
          text: `${l.holderName || 'Someone'} borrowed “${l.title}”`,
        });
      }
      for (const o of favOwners.slice(0, 10)) {
        baseline.push({
          id: `fav-${o.id}-${o.createdAt}`,
          ts: toMs(o.createdAt),
          text: `You favorited ${o.name}’s storage`,
        });
      }
      if (baseline.length) pushEvents(baseline);
    }

    const unsubStorage = onSnapshot(storageQ, (snap) => {
      storageItems = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            activityType: 'storage' as const,
            activityTimestamp: toMs(
              data.updatedAt || data.createdAt || Date.now()
            ),
            createdAt: toMs((data as any).createdAt),
          };
        })
        .filter((it: any) => {
          // Debug: log items with status borrowed
          if (it.status === 'borrowed') {
            console.log('🔍 Storage item with borrowed status:', {
              id: it.id,
              title: it.title,
              ownerId: it.ownerId,
              holderId: it.holderId,
              holderName: it.holderName,
              currentUserId: user.uid,
              isSelfLent: it.holderId === user.uid,
            });
          }
          // Exclude ALL borrowed items from storage feed (they'll show in lent feed)
          return it.status !== 'borrowed';
        }) as ActivityItem[];
      recompute();
    });

    const unsubBorrowed = onSnapshot(borrowedQ, (snap) => {
      const currentMap: Record<string, ActivityItem> = {};
      const currentItems = snap.docs.map((d) => {
        const data = d.data();
        const item: ActivityItem = {
          id: d.id,
          ...data,
          activityType: 'borrowed',
          activityTimestamp: toMs(
            data.updatedAt || data.borrowedFrom || Date.now()
          ),
        } as any;
        currentMap[item.id] = item;
        return item;
      });
      const ev: ActivityEvent[] = [];
      for (const item of currentItems) {
        const prev = prevBorrowedMap[item.id];
        if (
          prev &&
          prev.borrowedUntil &&
          item.borrowedUntil &&
          prev.borrowedUntil !== item.borrowedUntil
        ) {
          const diffMs =
            new Date(item.borrowedUntil).getTime() -
            new Date(prev.borrowedUntil).getTime();
          if (diffMs > 0) {
            const diffDays = Math.round(diffMs / 86400000);
            ev.push({
              id: `extend-b-${item.id}-${item.borrowedUntil}`,
              ts: Date.now(),
              text: `You extended “${item.title}” by ${diffDays} day${
                diffDays !== 1 ? 's' : ''
              }`,
            });
          }
        }
      }
      for (const prevId of Object.keys(prevBorrowedMap)) {
        if (!currentMap[prevId]) {
          const prevItem = prevBorrowedMap[prevId];
          ev.push({
            id: `return-b-${prevId}-${Date.now()}`,
            ts: Date.now(),
            text: `You returned “${prevItem.title}”`,
          });
        }
      }
      pushEvents(ev);
      prevBorrowedMap = currentMap;
      borrowedItems = currentItems;
      recompute();
    });

    const unsubLent = onSnapshot(lentQ, (snap) => {
      const currentMap: Record<string, ActivityItem> = {};
      const currentItems = snap.docs
        .map((d) => {
          const data = d.data();
          const item: ActivityItem = {
            id: d.id,
            ...data,
            activityType: 'lent',
            activityTimestamp: toMs(
              data.updatedAt || data.borrowedFrom || Date.now()
            ),
          } as any;
          return item;
        })
        .filter((it: any) => {
          // Debug: log what's being filtered
          const isSelfLent = it.holderId === user.uid;
          if (isSelfLent) {
            console.log('❌ Filtering out self-lent item:', {
              id: it.id,
              title: it.title,
              ownerId: it.ownerId,
              holderId: it.holderId,
              holderName: it.holderName,
              reason: 'holderId === currentUserId (you cannot lend to yourself)',
            });
          }
          return !isSelfLent;
        }) as ActivityItem[];
      for (const it of currentItems) currentMap[it.id] = it;
      const ev: ActivityEvent[] = [];
      for (const item of currentItems) {
        const prev = prevLentMap[item.id];
        if (
          prev &&
          prev.borrowedUntil &&
          item.borrowedUntil &&
          prev.borrowedUntil !== item.borrowedUntil
        ) {
          const diffMs =
            new Date(item.borrowedUntil).getTime() -
            new Date(prev.borrowedUntil).getTime();
          if (diffMs > 0) {
            const diffDays = Math.round(diffMs / 86400000);
            ev.push({
              id: `extend-l-${item.id}-${item.borrowedUntil}`,
              ts: Date.now(),
              text: `${item.holderName || 'Borrower'} extended “${
                item.title
              }” by ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
            });
          }
        }
      }
      for (const prevId of Object.keys(prevLentMap)) {
        if (!currentMap[prevId]) {
          const prevItem = prevLentMap[prevId];
          ev.push({
            id: `return-l-${prevId}-${Date.now()}`,
            ts: Date.now(),
            text: `${(prevItem as any).holderName || 'Borrower'} returned “${
              prevItem.title
            }”`,
          });
        }
      }
      pushEvents(ev);
      prevLentMap = currentMap;
      lentItems = currentItems;
      recompute();
    });

    const favStoragesQ = query(
      collection(db, 'favoriteStorages'),
      where('userId', '==', user.uid)
    );
    const unsubFavStorages = onSnapshot(favStoragesQ, (snap) => {
      const raw = snap.docs.map((d) => {
        const data: any = d.data();
        const ts = toMs(data.createdAt) || Date.now();
        return {
          id: data.storageOwnerId as string,
          name: data.storageOwnerName as string,
          createdAt: ts,
        };
      });
      const map = new Map<
        string,
        { id: string; name: string; createdAt: number }
      >();
      for (const o of raw.sort((a, b) => b.createdAt - a.createdAt)) {
        if (!map.has(o.id)) map.set(o.id, o);
      }
      const owners = Array.from(map.values());
      const ev: ActivityEvent[] = [];
      for (const o of owners) {
        if (!prevFavIds.has(o.id)) {
          ev.push({
            id: `fav-${o.id}-${o.createdAt}`,
            ts: o.createdAt,
            text: `You favorited ${o.name}’s storage`,
          });
        }
      }
      pushEvents(ev);
      prevFavIds = new Set(owners.map((o) => o.id));
      setFavOwners(owners);
      setLatestFavAt(owners.length ? owners[0].createdAt : null);
      recompute();
    });

    // Favorite items listener
    const favItemsQ = query(
      collection(db, 'favoriteItems'),
      where('userId', '==', user.uid)
    );
    const unsubFavItems = onSnapshot(favItemsQ, (snap) => {
      const ids = new Set<string>();
      for (const d of snap.docs) {
        const data = d.data() as any;
        if (data.itemId) ids.add(data.itemId as string);
      }
      setFavItemIds(ids);
    });

    return () => {
      unsubStorage();
      unsubBorrowed();
      unsubLent();
      unsubFavStorages();
      unsubFavItems();
    };
  }, [user]);

  // Toggle helpers
  const toggleType = (t: ActivityItem['activityType']) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };
  const toggleMode = (m: BorrowMode) => {
    setModeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };
  const resetFilters = () => {
    setSearch('');
    setTypeFilters(new Set());
    setModeFilters(new Set());
    setFavOnly(false);
    setOverdueOnly(false);
    setDueSoonOnly(false);
    setShowPeople(false);
  };

  const hasActiveFilters = (() => {
    return (
      typeFilters.size > 0 ||
      modeFilters.size > 0 ||
      favOnly ||
      overdueOnly ||
      dueSoonOnly ||
      showPeople
    );
  })();

  // Derived filtered list
  const filteredActivities = (() => {
    const term = search.trim().toLowerCase();
    return activities.filter((a) => {
      // type - if no type filters, show all types
      if (typeFilters.size > 0 && !typeFilters.has(a.activityType)) return false;
      // favorites
      if (favOnly && !favItemIds.has(a.id)) return false;
      // modes
      if (modeFilters.size > 0 && a.activityType === 'storage') {
        if (!a.borrowMode || !modeFilters.has(a.borrowMode)) return false;
      }
      if (modeFilters.size > 0 && (a.activityType === 'borrowed' || a.activityType === 'lent')) {
        if (!a.borrowMode || !modeFilters.has(a.borrowMode)) return false;
      }
      // due filters only apply to borrowed/lent
      if (overdueOnly || dueSoonOnly) {
        if (!(a.borrowedUntil && (a.activityType === 'borrowed' || a.activityType === 'lent')))
          return false;
        const overdue = getOverdueDays(a.borrowedUntil as any) > 0;
        const daysLeft = getDaysLeft(a.borrowedUntil as any);
        const soon = daysLeft > 0 && daysLeft <= 3;
        const passOverdue = overdueOnly ? overdue : false;
        const passSoon = dueSoonOnly ? soon : false;
        if (overdueOnly && dueSoonOnly) {
          if (!(overdue || soon)) return false;
        } else if (overdueOnly) {
          if (!passOverdue) return false;
        } else if (dueSoonOnly) {
          if (!passSoon) return false;
        }
      }
      if (!term) return true;
      const hay = [
        a.title,
        a.category,
        a.location,
        (a as any).note,
        (a as any).description,
        (a as any).ownerName,
        (a as any).holderName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  })();

  const toggleFavorite = async (id: string) => {
    if (!user) return;
    const wasFav = favItemIds.has(id);
    // Optimistic update
    setFavItemIds((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(id); else next.add(id);
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

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          // Base color adjusted to reference (#0f1115) instead of ui.bg
          background: `radial-gradient(900px 600px at 10% -10%, rgba(139,227,106,.08), transparent 40%), radial-gradient(800px 500px at 110% 40%, rgba(123,220,255,.06), transparent 40%), #0f1115`,
          py: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Top Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: { xs: '100%', sm: 'auto' } }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg,#9cf07c,#62d24b)',
                }}
              />
              <Typography
                variant='h5'
                fontWeight={900}
                color={ui.text}
                sx={{ letterSpacing: '.25px' }}
              >
                Activity Feed
              </Typography>
            </Box>

            {/* Search + filters - center on desktop, full width on mobile */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                flex: { xs: 0, sm: 1 },
                mx: { xs: 0, sm: 2 },
                maxWidth: { xs: '100%', sm: 520 },
                width: { xs: '100%', sm: 'auto' },
                order: { xs: 2, sm: 0 },
              }}
            >
              <TextField
                size='small'
                placeholder='Search items'
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 0.5 }}>
                      <FiSearch size={16} color='#8ca2ba' />
                    </Box>
                  ),
                }}
                sx={{
                  // base input container
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#141a26',
                    borderRadius: 2,
                    // ensure native focus outline doesn't show
                    outline: 'none',
                  },
                  // hide the default notched outline so we can draw our own gradient border
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                    // make sure any stronger rules (error / theme) are overridden
                    borderWidth: 1,
                    borderStyle: 'solid',
                    // use !important to beat MUI runtime focus rules
                    // (sx doesn't support !important directly on values, so we add a selector below)
                  },
                  '&:hover .MuiOutlinedInput-root': {
                    // subtle hover tint
                    background: '#161a22',
                  },
                  // focused state: blue gradient border
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    background: 'linear-gradient(#141a26,#141a26) padding-box, linear-gradient(90deg,#6bd6ff,#7f8cff) border-box',
                    border: '1px solid transparent',
                    // ensure our gradient-border rendering is respected
                    WebkitBackgroundClip: 'padding-box, border-box',
                    backgroundClip: 'padding-box, border-box',
                    // fallback subtle blue halo in case the gradient border isn't applied
                    boxShadow: '0 0 0 3px rgba(127,140,255,0.10)',
                  },
                  // stronger selector to override MUI's focused-notchedOutline rule (which can set primary/error color)
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent !important',
                  },
                  // remove any native focus outlines on the input element itself
                  '& .MuiOutlinedInput-input': {
                    '&:focus': { outline: 'none !important', boxShadow: 'none !important' },
                  },
                }}
              />
              <Button
                variant='outlined'
                size='small'
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{
                  borderColor: '#2a3144',
                  bgcolor: 'transparent',
                  color: hasActiveFilters ? '#7f8cff' : '#e8efff',
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 700,
                  height: 40,
                  px: { xs: 1.2, sm: 1.8 },
                  minWidth: { xs: 40, sm: 'auto' },
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#3b465f',
                    bgcolor: '#20283a',
                  },
                }}
              >
                <LuFilter size={16} style={{ marginRight: 0 }} />
                <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>
                  Filter
                </Box>
              </Button>
              {hasActiveFilters && (
                <Button
                  variant='outlined'
                  size='small'
                  onClick={resetFilters}
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    borderColor: '#2a3144',
                    color: '#a2b3c7',
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 700,
                    height: 40,
                    px: 1.8,
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: '#3b465f',
                      bgcolor: '#20283a',
                      color: '#e8efff',
                    },
                  }}
                >
                  Reset
                </Button>
              )}
              <Button
                component={RouterLink}
                to='/storage'
                variant='outlined'
                size='small'
                sx={{
                  display: { xs: 'inline-flex', sm: 'none' },
                  borderColor: '#2a3144',
                  color: '#e8efff',
                  '&:hover': {
                    borderColor: '#3b465f',
                    bgcolor: '#20283a',
                  },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 700,
                  height: 40,
                  px: 1.8,
                }}
              >
                Storage
              </Button>
            </Box>

            <Button
              component={RouterLink}
              to='/storage'
              variant='outlined'
              size='small'
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                borderColor: '#2a3144',
                color: '#e8efff',
                '&:hover': {
                  borderColor: '#3b465f',
                  bgcolor: '#20283a',
                },
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 700,
                height: 34,
                px: 1.8,
              }}
            >
              View Storage
            </Button>
          </Box>

          <Popover
              open={Boolean(filterAnchor)}
              anchorEl={filterAnchor}
              onClose={() => setFilterAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              sx={{
                mt: 1,
                '& .MuiPopover-paper': {
                  bgcolor: '#14171f',
                  border: '1px solid #23293a',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  p: 2,
                  minWidth: 280,
                },
              }}
            >
              <Typography
                variant='caption'
                sx={{ color: '#8ca2ba', fontWeight: 600, display: 'block', mb: 1 }}
              >
                Filter by
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {/* Type filters */}
                <Box>
                  <Typography variant='caption' sx={{ color: '#7d8799', mb: 0.5, display: 'block', fontSize: 11 }}>
                    Type
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {([
                      { key: 'storage', label: 'Storage' },
                      { key: 'borrowed', label: 'Borrowed' },
                      { key: 'lent', label: 'Lent' },
                    ] as const).map((t) => (
                      <Button
                        key={t.key}
                        size='small'
                        onClick={() => toggleType(t.key)}
                        sx={{
                          border: '1px solid #2a3144',
                          bgcolor: typeFilters.has(t.key) ? '#20283a' : 'transparent',
                          color: '#e8efff',
                          textTransform: 'none',
                          fontSize: 12,
                          fontWeight: 700,
                          borderRadius: '999px',
                          px: 1.4,
                          minHeight: 30,
                          '&:hover': { bgcolor: '#20283a' },
                        }}
                      >
                        {t.label}
                      </Button>
                    ))}
                    <Button
                      size='small'
                      onClick={() => setShowPeople((v) => !v)}
                      sx={{
                        border: '1px solid #2a3144',
                        bgcolor: showPeople ? '#20283a' : 'transparent',
                        color: '#e8efff',
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: '999px',
                        px: 1.4,
                        minHeight: 30,
                        '&:hover': { bgcolor: '#20283a' },
                      }}
                    >
                      People
                    </Button>
                  </Box>
                </Box>
                {/* Status filters */}
                <Box>
                  <Typography variant='caption' sx={{ color: '#7d8799', mb: 0.5, display: 'block', fontSize: 11 }}>
                    Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    <Button
                      size='small'
                      onClick={() => setFavOnly((v) => !v)}
                      sx={{
                        border: '1px solid #2a3144',
                        bgcolor: favOnly ? '#20283a' : 'transparent',
                        color: '#e8efff',
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: '999px',
                        px: 1.4,
                        minHeight: 30,
                        '&:hover': { bgcolor: '#20283a' },
                      }}
                    >
                      Favorites
                    </Button>
                    <Button
                      size='small'
                      onClick={() => setOverdueOnly((v) => !v)}
                      sx={{
                        border: '1px solid #2a3144',
                        bgcolor: overdueOnly ? '#20283a' : 'transparent',
                        color: '#e8efff',
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: '999px',
                        px: 1.4,
                        minHeight: 30,
                        '&:hover': { bgcolor: '#20283a' },
                      }}
                    >
                      Overdue
                    </Button>
                    <Button
                      size='small'
                      onClick={() => setDueSoonOnly((v) => !v)}
                      sx={{
                        border: '1px solid #2a3144',
                        bgcolor: dueSoonOnly ? '#20283a' : 'transparent',
                        color: '#e8efff',
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: '999px',
                        px: 1.4,
                        minHeight: 30,
                        '&:hover': { bgcolor: '#20283a' },
                      }}
                    >
                      Due soon
                    </Button>
                  </Box>
                </Box>
                {/* Mode filters */}
                <Box>
                  <Typography variant='caption' sx={{ color: '#7d8799', mb: 0.5, display: 'block', fontSize: 11 }}>
                    Borrow Mode
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    <Button
                      size='small'
                      onClick={() => toggleMode('free')}
                      sx={{
                        border: '1px solid #2a3144',
                        bgcolor: modeFilters.has('free') ? '#20283a' : 'transparent',
                        color: '#e8efff',
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: '999px',
                        px: 1.4,
                        minHeight: 30,
                        '&:hover': { bgcolor: '#20283a' },
                      }}
                    >
                      Free
                    </Button>
                    <Button
                      size='small'
                      onClick={() => toggleMode('request')}
                      sx={{
                        border: '1px solid #2a3144',
                        bgcolor: modeFilters.has('request') ? '#20283a' : 'transparent',
                        color: '#e8efff',
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: '999px',
                        px: 1.4,
                        minHeight: 30,
                        '&:hover': { bgcolor: '#20283a' },
                      }}
                    >
                      Request
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Popover>

          {/* Summary Cards (icon left, label top, count bottom) */}
          <Box
            sx={{
              mb: 2,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            }}
          >
            {[
              {
                icon: <PiPackageLight size={26} />,
                label: 'Storage',
                count: counts.storage,
                color: ACTIVITY_COLORS.storage,
              },
              {
                icon: <PiHandArrowDown size={26} />,
                label: 'Borrowed',
                count: counts.borrowed,
                color: ACTIVITY_COLORS.borrowed,
              },
              {
                icon: <PiHandArrowUp size={26} />,
                label: 'Lent',
                count: counts.lent,
                color: ACTIVITY_COLORS.lent,
              },
            ].map((card) => (
              <Box
                key={card.label}
                sx={{
                  '--r': '18px',
                  position: 'relative',
                  background: `linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)) , #14171f`,
                  border: '1px solid #23293a',
                  borderRadius: 'var(--r)',
                  px: '14px',
                  pt: '16px',
                  pb: '16px',
                  boxShadow: '0 8px 26px rgba(0,0,0,0.34)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                  <Box
                    sx={{
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{ color: '#a7b3c7', lineHeight: 1, fontSize: 13 }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                        color: '#e9eef7',
                        mt: 0.5,
                      }}
                    >
                      {card.count} items
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Masonry Activity Feed */}
          {activities.length > 0 ? (
            (() => {
              // Build a render list with RecentActivityCard then optional PeopleCard
              const list: React.ReactNode[] = [];
              // Quick Add card always first
              list.push(
                <Paper
                  key='quick-add'
                  sx={{
                    '--r': '20px',
                    position: 'relative',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f',
                    border: '1px solid #23293a',
                    borderRadius: 'var(--r)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                    breakInside: 'avoid',
                    WebkitColumnBreakInside: 'avoid',
                    overflow: 'hidden',
                    p: 2,
                  }}
                >
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: '#e9eef7',
                        mb: 1,
                      }}
                    >
                      Quick add item
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1.05 }}>
                      <TextField
                        size='small'
                        label='Title'
                        value={qTitle}
                        onChange={(e) => setQTitle(e.target.value)}
                        sx={{
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& label.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            {
                              borderColor: '#7f8cff',
                            },
                        }}
                      />
                      <TextField
                        size='small'
                        select
                        label='Category'
                        value={qCategory}
                        onChange={(e) => setQCategory(e.target.value)}
                        sx={{
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& label.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            {
                              borderColor: '#7f8cff',
                            },
                        }}
                      >
                        {[
                          'Tools',
                          'Outfit',
                          'Stationary',
                          'Appliances',
                          'Equipment',
                          'Sports',
                          'Books',
                          'Other',
                        ].map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        size='small'
                        label='Location'
                        value={qLocation}
                        onChange={(e) => setQLocation(e.target.value)}
                        sx={{
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& label.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            {
                              borderColor: '#7f8cff',
                            },
                        }}
                      />
                      <TextField
                        size='small'
                        label='Notes'
                        value={qNote}
                        onChange={(e) => setQNote(e.target.value)}
                        multiline
                        minRows={2}
                        placeholder='Handling / care instructions…'
                        sx={{
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& label.Mui-focused': {
                            color: '#7f8cff',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            {
                              borderColor: '#7f8cff',
                            },
                        }}
                      />
                      <Box sx={{ mt: 0.25 }}>
                        <Typography
                          variant='caption'
                          sx={{ color: '#8ca2ba', display: 'block', mb: 0.6 }}
                        >
                          Images (max 3)
                        </Typography>
                        <ImageUploader
                          max={3}
                          onChange={setQFiles}
                          value={qFiles}
                          variant='tiles'
                          showHelper={false}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Button
                          variant='contained'
                          size='small'
                          disabled={!canQuickSubmit}
                          onClick={handleQuickAdd}
                          startIcon={
                            qSaving ? (
                              <CircularProgress size={16} color='inherit' />
                            ) : undefined
                          }
                          sx={{
                            flex: 1,
                            fontWeight: 700,
                            background:
                              'linear-gradient(90deg,#6bd6ff,#7f8cff)',
                            color: '#0d1117',
                            textTransform: 'none',
                            '&:hover': { filter: 'brightness(1.08)' },
                          }}
                        >
                          {qSaving ? 'Adding…' : 'Add item'}
                        </Button>
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={() => {
                            setQTitle('');
                            setQCategory('');
                            setQLocation('');
                            setQNote('');
                            setQFiles([]);
                          }}
                          sx={{
                            flex: 1,
                            borderColor: '#2a3144',
                            color: '#a2b3c7',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: '#3b465f',
                              color: '#d1dbe6',
                            },
                          }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                );
                const items = filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    item={activity}
                    type={activity.activityType}
                    accentColor={ACTIVITY_COLORS[activity.activityType]}
                    isFavorite={favItemIds.has(activity.id)}
                    onToggleFavorite={() => toggleFavorite(activity.id)}
                  />
                ));
                // Insert RecentActivityCard first always
                list.push(
                  <RecentActivityCard
                    key='recent-activity'
                    events={recentEvents.slice(0, 6)}
                  />
                );
                // If we have favorite owners, always prepare the PeopleCard.
                // If the People filter is active, show only the PeopleCard (hiding other activity cards).
                if (favOwners.length > 0) {
                  const people = (
                    <PeopleCard key='people-card' owners={favOwners} />
                  );
                  // If filter toggled to show people, hide other items and show only PeopleCard
                  if (showPeople) {
                    list.push(people);
                  } else {
                    // Otherwise, insert PeopleCard among the items (either first after RecentActivityCard or as 3rd card)
                    const latestActivityTs = Math.max(
                      ...activities.map((a) => a.activityTimestamp)
                    );
                    if (latestFavAt && latestFavAt > latestActivityTs) {
                      list.push(people, ...items);
                    } else {
                      const idx = Math.min(2, items.length);
                      list.push(...items.slice(0, idx), people, ...items.slice(idx));
                    }
                  }
                } else {
                  list.push(...items);
                }
              
              return (
                <Masonry
                  breakpointCols={{
                    default: 4,
                    1400: 3,
                    1024: 2,
                    640: 1,
                  }}
                  className='my-masonry-grid'
                  columnClassName='my-masonry-grid_column'
                >
                  {list}
                </Masonry>
              );
            })()
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant='body2' color='text.secondary'>
                {user
                  ? 'No activity yet. Add your first item to get started!'
                  : 'Sign in to see your activity'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
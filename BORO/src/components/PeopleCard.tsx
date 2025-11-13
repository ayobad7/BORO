import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Link as RouterLink } from 'react-router-dom';
import { ACCENTS } from '../lib/accents';
import { v4 as uuidv4 } from 'uuid';
import { collection, query, where, onSnapshot, getCountFromServer, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';


type Owner = { id: string; name: string; createdAt: number };

interface PeopleCardProps {
  owners?: Owner[]; // Optional pre-fetched owners to display
}

export default function PeopleCard({ owners: ownersProp }: PeopleCardProps) {
  const { user } = useAuth();
  const [owners, setOwners] = useState<Owner[]>(ownersProp || []);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSaving, setInviteSaving] = useState(false);

  // If owners not provided, fetch from favoriteStorages
  useEffect(() => {
    if (ownersProp) return; // use provided owners
    if (!user) return;
    const q = query(
      collection(db, 'favoriteStorages'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const raw = snap.docs.map((d) => {
        const data: any = d.data();
        return {
          id: data.storageOwnerId as string,
          name: data.storageOwnerName as string,
          createdAt:
            data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
        } as Owner;
      });
      // unique by id, keep latest
      const map = new Map<string, Owner>();
      for (const o of raw.sort((a, b) => b.createdAt - a.createdAt)) {
        if (!map.has(o.id)) map.set(o.id, o);
      }
      setOwners(Array.from(map.values()));
    });
    return () => unsub();
  }, [user, ownersProp]);

  // Fetch item counts for visible owners (limit to first 5)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const top = owners.slice(0, 5);
        const results = await Promise.all(
          top.map(async (o) => {
            const qItems = query(
              collection(db, 'items'),
              where('ownerId', '==', o.id)
            );
            const snap = await getCountFromServer(qItems);
            return [o.id, snap.data().count] as const;
          })
        );
        if (!mounted) return;
        setCounts(Object.fromEntries(results));
      } catch {
        // ignore count errors
      }
    };
    if (owners.length > 0) load();
    return () => {
      mounted = false;
    };
  }, [owners]);

  const people = useMemo(() => owners.slice(0, 5), [owners]);

  const openInvite = () => setInviteOpen(true);
  const closeInvite = () => setInviteOpen(false);

  const parseStorageOwnerId = (link: string): string | null => {
    if (!link) return null;
    // Try to extract /storage/{id} from the link
    try {
      // If user pasted a relative path, ensure it's parseable
      let urlStr = link.trim();
      if (urlStr.startsWith('/')) {
        // prefix with example host to allow URL parsing
        urlStr = `https://example.com${urlStr}`;
      } else if (!/^https?:\/\//i.test(urlStr)) {
        // assume https if protocol missing
        urlStr = `https://${urlStr}`;
      }
      const u = new URL(urlStr);
      const m = u.pathname.match(/\/storage\/([^/]+)/);
      if (m) return m[1];
    } catch (e) {
      // fallback to regex match anywhere in the string
      const m2 = link.match(/\/storage\/([^\s\/?#]+)/);
      if (m2) return m2[1];
    }
    return null;
  };

  const handleAddInvite = async () => {
    setInviteError(null);
    const ownerId = parseStorageOwnerId(inviteLink);
    if (!ownerId) {
      setInviteError('Could not find a /storage/{id} in the link');
      return;
    }
    if (!user) {
      setInviteError('Sign in to add favorites');
      return;
    }
    if (ownerId === user.uid) {
      setInviteError('You cannot add your own storage');
      return;
    }
    setInviteSaving(true);
    try {
      // Try to fetch ownerName from an item owned by that owner
      let ownerNameVal = '';
      const q = query(collection(db, 'items'), where('ownerId', '==', ownerId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0].data() as any;
        ownerNameVal = d.ownerName || '';
      }

      const newId = uuidv4();
      const fav = {
        id: newId,
        userId: user.uid,
        storageOwnerId: ownerId,
        storageOwnerName: ownerNameVal,
        createdAt: Date.now(),
      };
      await setDoc(doc(collection(db, 'favoriteStorages'), newId), {
        ...fav,
        createdAt: serverTimestamp(),
      });
      // reset and close
      setInviteLink('');
      setInviteError(null);
      setInviteOpen(false);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Invite add failed', e);
      setInviteError('Failed to add favorite');
    } finally {
      setInviteSaving(false);
    }
  };

  // Visual card container to match ActivityCard styling
  return (
    <Box
      sx={{
        '--card-r': '20px',
        '--pad': '12px',
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
        border: '1px solid #23293a',
        borderRadius: 'var(--card-r)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        breakInside: 'avoid',
        WebkitColumnBreakInside: 'avoid',
        transition: 'transform .18s ease, box-shadow .18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 'var(--pad)', pt: 1.0, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '999px',
              px: 1.2,
              py: 0.5,
              bgcolor: `${ACCENTS.people}33`,
              color: ACCENTS.people,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            People
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button
              size='small'
              onClick={() => {
                openInvite();
              }}
              sx={{
                bgcolor: '#1a2130',
                border: '1px solid #2a3144',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: '999px',
                px: 1.2,
                '&:hover': { bgcolor: '#20283a' },
              }}
            >
              Invite
            </Button>
          </Box>
        </Box>
      </Box>

      {/* List */}
      <Box sx={{ px: 'var(--pad)', pb: 1.25, display: 'grid', gap: 0.75 }}>
        {owners.length > 10 && (
          <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size='small'
              component={RouterLink}
              to='/favorites'
              sx={{
                bgcolor: '#1a2130',
                border: '1px solid #2a3144',
                color: '#e8efff',
                textTransform: 'none',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: '999px',
                px: 1.2,
                height: 30,
                '&:hover': { bgcolor: '#20283a' },
              }}
            >
              View all →
            </Button>
          </Box>
        )}
        {people.length === 0 ? (
          <Typography variant='body2' sx={{ color: '#9ea9bf', py: 1 }}>
            No favorites yet — add someone’s storage to favorites.
          </Typography>
        ) : (
          people.map((p) => (
            <Box
              key={p.id}
              component={RouterLink}
              to={`/storage/${p.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: '#e9eef7',
                p: 0.5,
                borderRadius: 1,
                '&:hover': { backgroundColor: '#121826' },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: `${ACCENTS.people}44`,
                  color: '#fff',
                }}
              >
                {p.name?.[0]?.toUpperCase() || '?'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name || 'Unknown'}
                </Typography>
                <Typography variant='caption' sx={{ color: '#9ea9bf' }}>
                  {typeof counts[p.id] === 'number'
                    ? `${counts[p.id]} items`
                    : '— items'}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Invite dialog (placeholder) */}
      <Dialog open={inviteOpen} onClose={closeInvite} fullWidth maxWidth='xs'>
        <DialogTitle>Invite person</DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 1.5, color: '#9ea9bf' }}>
            Paste a storage link to add as favorite.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size='small'
            placeholder='https://example.com/storage/USER_ID'
            value={inviteLink}
            onChange={(e) => setInviteLink(e.target.value)}
          />
          {inviteError && (
            <Typography variant='caption' sx={{ color: '#ff7a7a', mt: 1 }}>
              {inviteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInvite}>Close</Button>
          <Button onClick={handleAddInvite} variant='contained' disabled={inviteSaving || !inviteLink.trim()}>
            {inviteSaving ? 'Adding…' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

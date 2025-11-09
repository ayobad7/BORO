import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ui } from '../lib/uiTokens';
import RecentActivityCard from '../components/RecentActivityCard';
import type { ActivityEvent } from '../components/RecentActivityCard';

// Simple activity page pulling from localStorage cache; later can be replaced by server persistence.
export default function ActivityPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<
    'all' | 'borrowed' | 'lent' | 'storage' | 'favorite' | 'changes'
  >('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    try {
      const key = `boro:recentEvents:${user.uid}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as ActivityEvent[];
        setEvents(parsed.sort((a, b) => b.ts - a.ts));
      }
    } catch {}
  }, [user]);

  // Very lightweight type inference from text (temporary until structured metadata added)
  const classify = (
    e: ActivityEvent
  ): 'borrowed' | 'lent' | 'storage' | 'favorite' | 'other' => {
    const t = e.text.toLowerCase();
    if (t.includes('you borrowed')) return 'borrowed';
    if (t.includes('borrowed “')) return 'lent';
    if (t.includes('you added')) return 'storage';
    if (t.includes('favorited')) return 'favorite';
    return 'other';
  };

  // Detect extend/return events quickly by substring (temporary until structured types added)
  const isChangeEvent = (e: ActivityEvent) => {
    const t = e.text.toLowerCase();
    return t.includes('extended') || t.includes('returned');
  };

  const filtered = useMemo(() => {
    let base = events;
    if (filter === 'changes') base = base.filter(isChangeEvent);
    else if (filter !== 'all')
      base = base.filter((e) => classify(e) === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter((e) => e.text.toLowerCase().includes(q));
    }
    return base.slice(0, 200); // larger cap for full page
  }, [events, filter, search]);

  // Group into chunks of 12 for load-more simulation
  const [visibleCount, setVisibleCount] = useState(12);
  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: `radial-gradient(900px 600px at 10% -10%, rgba(139,227,106,.08), transparent 40%), radial-gradient(800px 500px at 110% 40%, rgba(123,220,255,.06), transparent 40%), #0f1115`,
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Typography
              variant='h5'
              fontWeight={900}
              color={ui.text}
              sx={{ letterSpacing: '.25px' }}
            >
              Activity
            </Typography>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {['all', 'storage', 'borrowed', 'lent', 'favorite', 'changes'].map(
              (f) => (
                <Box
                  key={f}
                  onClick={() => setFilter(f as any)}
                  sx={{
                    cursor: 'pointer',
                    px: 1.4,
                    py: 0.6,
                    borderRadius: '999px',
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor: filter === f ? '#222b3b' : '#1a2130',
                    border: '1px solid #2a3144',
                    color: '#e8efff',
                    userSelect: 'none',
                    '&:hover': { backgroundColor: '#20283a' },
                  }}
                >
                  {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
                </Box>
              )
            )}
            <Box sx={{ flexGrow: 1, minWidth: 180 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search activity…'
                style={{
                  background: '#1a2130',
                  border: '1px solid #2a3144',
                  color: '#e8efff',
                  padding: '8px 12px',
                  borderRadius: 999,
                  fontSize: 13,
                  outline: 'none',
                  width: 220,
                }}
              />
            </Box>
          </Box>

          {/* Timeline reuse of RecentActivityCard styling with in-card load more */}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <RecentActivityCard
              events={visible}
              footer={
                canLoadMore ? (
                  <Box
                    onClick={() => setVisibleCount((c) => c + 12)}
                    sx={{ textAlign: 'center' }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        cursor: 'pointer',
                        px: 1.6,
                        py: 0.8,
                        borderRadius: '999px',
                        fontSize: 13,
                        fontWeight: 700,
                        backgroundColor: '#1a2130',
                        border: '1px solid #2a3144',
                        color: '#e8efff',
                        '&:hover': { backgroundColor: '#20283a' },
                      }}
                    >
                      Load more
                    </Box>
                  </Box>
                ) : null
              }
            />
          </Box>
          {visible.length === 0 && (
            <Typography variant='body2' sx={{ color: '#8f9bad', mt: 4 }}>
              No activity yet.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

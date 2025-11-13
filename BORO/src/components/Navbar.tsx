import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { ui } from '../lib/uiTokens';
import { ACCENTS } from '../lib/accents';

export default function Navbar() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [clearedOpen, setClearedOpen] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      setNotifications([]);
      return;
    }

    // Maintain separate arrays per source to avoid stale/duplicated accumulation
  let borrowArr: any[] = [];
  let extendArr: any[] = [];
  let overdueArr: any[] = [];
  let persistedArr: any[] = [];
  let reminderArr: any[] = [];
  let requesterArr: any[] = [];

    const updateNotifications = () => {
      const merged = [...borrowArr, ...extendArr, ...overdueArr, ...persistedArr, ...reminderArr, ...requesterArr];
      // sort with overdue notifications prioritized, then newest-first by createdAt
      const getMs = (n: any) => {
        if (!n) return 0;
        const c = n.createdAt;
        if (!c) return 0;
        if (typeof c === 'number') return c;
        if (c?.toMillis) return c.toMillis();
        if (typeof c === 'string') return new Date(c).getTime() || 0;
        return 0;
      };
      const mergedSorted = merged.slice().sort((a: any, b: any) => {
        // overdue gets higher priority
        const pa = a?.type === 'overdue' ? 2 : 1;
        const pb = b?.type === 'overdue' ? 2 : 1;
        if (pa !== pb) return pb - pa; // overdue first
        const ma = getMs(a) || 0;
        const mb = getMs(b) || 0;
        return mb - ma; // newest first
      });
      setNotifications(mergedSorted);
      setNotificationCount(mergedSorted.length);
    };

    const borrowRequestsQuery = query(
      collection(db, 'borrowRequests'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubBorrowRequests = onSnapshot(borrowRequestsQuery, (snap) => {
      borrowArr = snap.docs.map((d) => ({ id: d.id, type: 'borrowRequest', ...d.data() }));
      updateNotifications();
    });

    const extendRequestsQuery = query(
      collection(db, 'extendDateRequests'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubExtendRequests = onSnapshot(extendRequestsQuery, (snap) => {
      extendArr = snap.docs.map((d) => ({ id: d.id, type: 'extendRequest', ...d.data() }));
      updateNotifications();
    });

    const itemsQuery = query(
      collection(db, 'items'),
      where('holderId', '==', user.uid),
      where('status', '==', 'borrowed')
    );
    const unsubItems = onSnapshot(itemsQuery, (snap) => {
      const now = dayjs();
      overdueArr = [];
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.borrowedUntil) {
          const dueDate = dayjs(data.borrowedUntil);
          const daysUntilDue = dueDate.diff(now, 'day');
          if (daysUntilDue < 0) {
            overdueArr.push({ id: d.id, type: 'overdue', itemTitle: data.title, dueDate: data.borrowedUntil, ownerId: data.ownerId, itemImage: data.imageUrls?.[0] });
          }
        }
      });
      updateNotifications();
    });

    // Persisted notifications (return, grab, reminders for owner)
    const persistedQuery = query(
      collection(db, 'notifications'),
      where('ownerId', '==', user.uid),
      where('read', '==', false)
    );
    const unsubPersisted = onSnapshot(persistedQuery, (snap) => {
      persistedArr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      updateNotifications();
    });

    // Notifications specifically addressed to the requester (approve/reject messages)
    const requesterQuery = query(
      collection(db, 'notifications'),
      where('requesterId', '==', user.uid),
      where('read', '==', false)
    );
    const unsubRequester = onSnapshot(requesterQuery, (snap) => {
      requesterArr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      updateNotifications();
    });

    // Unread reminders targeted at the current user (borrower)
    const remindersQuery = query(
      collection(db, 'notifications'),
      where('borrowerId', '==', user.uid),
      where('type', '==', 'reminder'),
      where('read', '==', false)
    );
    const unsubReminders = onSnapshot(remindersQuery, (snap) => {
      reminderArr = snap.docs.map((d) => ({ id: d.id, type: 'reminder', ...d.data() }));
      updateNotifications();
    });

    return () => {
      unsubBorrowRequests();
      unsubExtendRequests();
      unsubItems();
      unsubPersisted();
      unsubReminders && unsubReminders();
      unsubRequester && unsubRequester();
    };
  }, [user]);

  // Enrich notifications that reference an item with itemTitle and itemImage when missing
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    let mounted = true;
    const need = notifications.filter((n) => n.itemId && !n.itemImage && !n._fetchingItem);
    if (need.length === 0) return;
    (async () => {
      for (const n of need) {
        // mark as fetching to avoid duplicate loads
        if (!mounted) return;
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, _fetchingItem: true } : x)));
        try {
          const snap = await getDoc(doc(db, 'items', n.itemId));
          if (!mounted) return;
          if (snap.exists()) {
            const data: any = snap.data();
            setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, itemTitle: data.title || x.itemTitle, itemImage: data.imageUrls?.[0] || x.itemImage } : x)));
          } else {
            setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, _fetchingItem: false } : x)));
          }
        } catch (e) {
          setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, _fetchingItem: false } : x)));
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [notifications]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotificationClick = (notification: any) => {
    handleMenuClose();
    if (notification.type === 'borrowRequest' || notification.type === 'extendRequest') {
      navigate(`/item/${notification.itemId}`);
    } else if (notification.type === 'overdue') {
      navigate(`/item/${notification.id}`);
    } else if (notification.type === 'return') {
      try {
        updateDoc(doc(db, 'notifications', notification.id), { read: true });
      } catch {}
      navigate(`/item/${notification.itemId}`);
    } else if (notification.type === 'reminder') {
      try {
        updateDoc(doc(db, 'notifications', notification.id), { read: true });
      } catch {}
      navigate(`/item/${notification.itemId}`);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AppBar
      position='sticky'
      color='transparent'
      elevation={0}
      sx={{
        top: 0,
        background:
          `radial-gradient(900px 600px at 10% -10%, rgba(139,227,106,.08), transparent 40%), radial-gradient(800px 500px at 110% 40%, rgba(123,220,255,.06), transparent 40%), #0f1115`,
        borderBottom: `1px solid ${ui.border}`,
        boxShadow: scrolled ? '0 6px 18px rgba(0,0,0,0.35)' : 'none',
        backdropFilter: scrolled ? 'saturate(120%)' : 'none',
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
        <Box
          sx={{
            width: '100%',
            // Match page container max width used across pages (Home2 uses 1400)
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant='h4'
            component={RouterLink}
            to='/'
            sx={{
              textDecoration: 'none',
              fontWeight: 800,
              background: 'linear-gradient(90deg,#6bd6ff,#7f8cff)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '.5px',
            }}
          >
            BORO
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction='row' spacing={2} alignItems='center'>
            {user ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <Badge badgeContent={notificationCount} color='error'>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: `${ACCENTS.people}44`,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13,
                        border: `1px solid ${ACCENTS.people}66`,
                      }}
                    >
                      {getInitials(user.displayName || user.email)}
                    </Avatar>
                  </Badge>
                </IconButton>
                <Button
                  onClick={signOutUser}
                  sx={{
                    bgcolor: '#1a2130',
                    border: '1px solid #2a3144',
                    color: '#e8efff',
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: '999px',
                    px: 1.75,
                    minHeight: 34,
                    '&:hover': { bgcolor: '#20283a' },
                  }}
                >
                  Sign out
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { width: 380, maxWidth: 'calc(100vw - 32px)', p: 1 } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 0.5 }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>Notifications</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        size='small'
                        onClick={async () => {
                          // Clear all non-request notifications: mark the underlying
                          // persisted notification documents as read so they won't
                          // reappear from onSnapshot listeners. We intentionally
                          // skip the in-flight request-type entries (borrow/extend
                          // requests) which come from separate collections.
                          try {
                            const toClear = notifications.filter((n) => n.type !== 'borrowRequest' && n.type !== 'extendRequest');
                            const toClearLen = toClear.length;
                            for (const n of toClear) {
                              // If this notification was persisted in the notifications
                              // collection (has an id), mark it read. This covers return,
                              // reminder, grab, requestApproved, requestRejected, etc.
                              if (n.id) {
                                try {
                                  await updateDoc(doc(db, 'notifications', n.id), { read: true });
                                } catch (err) {
                                  // ignore individual failures
                                }
                              }
                            }
                            // locally remove non-request notifications
                            const remaining = notifications.filter((n) => n.type === 'borrowRequest' || n.type === 'extendRequest');
                            setNotifications(remaining);
                            setNotificationCount(remaining.length);
                            // show confirmation snackbar with count
                            setClearedCount(toClearLen);
                            setClearedOpen(true);
                          } catch (e) {
                            // ignore whole-operation failures
                          }
                        }}
                      sx={{ color: ACCENTS.storage }}
                      >
                        Clear all
                      </Button>
                      <Button size='small' onClick={handleMenuClose} sx={{ color: ACCENTS.storage }}>Close</Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ maxHeight: 420, overflow: 'auto' }}>
                    {notifications.length === 0 ? (
                      <Box sx={{ p: 2 }}><Typography variant='body2' color='text.secondary'>No notifications</Typography></Box>
                    ) : (
                      notifications.map((notif, idx) => {
                        // choose accent per notification type
                        const accent = notif.type === 'borrowRequest' || notif.type === 'extendRequest' ? ACCENTS.storage : notif.type === 'return' ? ACCENTS.lent : ACCENTS.borrowed;
                        const timeLabel = notif.createdAt ? (notif.createdAt.toMillis ? new Date(notif.createdAt.toMillis()).toLocaleString() : new Date(notif.createdAt).toLocaleString()) : '';
                        // Build primary node with selective bolding for names and item titles
                        let primaryNode: React.ReactNode = null;
                        if (notif.type === 'borrowRequest') {
                          primaryNode = (
                            <>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.requesterName || 'Someone'}</Box>
                              <Box component='span' sx={{ mx: 0.5 }}>requested</Box>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.itemTitle || 'this item'}</Box>
                            </>
                          );
                        } else if (notif.type === 'extendRequest') {
                          primaryNode = (
                            <>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.requesterName || 'Someone'}</Box>
                              <Box component='span' sx={{ mx: 0.5 }}>requested an extension for</Box>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.itemTitle || 'this item'}</Box>
                            </>
                          );
                        } else if (notif.type === 'overdue') {
                          primaryNode = (
                            <>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.itemTitle || 'Item'}</Box>
                              <Box component='span' sx={{ mx: 0.5 }}>is overdue</Box>
                            </>
                          );
                        } else if (notif.type === 'reminder') {
                          primaryNode = notif.message ? notif.message : (<><Box component='span' sx={{ fontWeight: 800 }}>{notif.itemTitle || ''}</Box><Box component='span' sx={{ ml: 0.5 }}>reminder</Box></>);
                        } else if (notif.type === 'requestApproved' || notif.type === 'requestRejected') {
                          // Render approve/reject messages cleanly for requester
                          if (typeof notif.message === 'string' && notif.message.trim()) {
                            primaryNode = notif.message;
                          } else {
                            const verb = notif.type === 'requestApproved' ? 'approved' : 'rejected';
                            primaryNode = (
                              <>
                                <Box component='span'>Your request for</Box>
                                <Box component='span' sx={{ mx: 0.5, fontWeight: 800 }}>{notif.itemTitle || 'this item'}</Box>
                                <Box component='span'>was {verb}.</Box>
                              </>
                            );
                          }
                        } else if (notif.type === 'return' || notif.type === 'grab') {
                          primaryNode = (
                            <>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.borrowerName || notif.requesterName || 'Someone'}</Box>
                              <Box component='span' sx={{ mx: 0.5 }}>{notif.type === 'return' ? 'returned' : 'grabbed'}</Box>
                              <Box component='span' sx={{ fontWeight: 800 }}>{notif.itemTitle || ''}</Box>
                            </>
                          );
                        } else {
                          primaryNode = JSON.stringify(notif);
                        }
                        const secondary = notif.type === 'overdue' && notif.dueDate ? `Due: ${new Date(notif.dueDate).toLocaleDateString()}` : timeLabel;
                        const hasImage = !!notif.itemImage;
                        const avatarContent = hasImage ? (
                          <Box
                            component='img'
                            src={notif.itemImage}
                            alt={notif.itemTitle || 'item'}
                            sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                          />
                        ) : (
                          <Box sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography variant='caption' sx={{ color: accent, fontWeight: 800 }}>{(notif.type === 'borrowRequest' || notif.type === 'extendRequest') ? (notif.requesterName ? notif.requesterName.split(' ').map((s: string) => s[0]).join('').slice(0,2).toUpperCase() : '?') : notif.itemTitle ? notif.itemTitle[0]?.toUpperCase() : '?'}</Typography>
                          </Box>
                        );
                        return (
                          <Box key={`${notif.id}-${idx}`} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', p: 1.25, cursor: 'pointer' }} onClick={() => handleNotificationClick(notif)}>
                            {avatarContent}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant='body2' sx={{ fontWeight: 500, display: 'block', color: '#e9eef7' }}>{primaryNode}</Typography>
                              {secondary && <Typography variant='caption' sx={{ color: '#9ea9bf', display: 'block' }}>{secondary}</Typography>}
                            </Box>
                            {/* action area for request types */}
                            {notif.type === 'borrowRequest' && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button size='small' variant='contained' onClick={async (e) => { e.stopPropagation(); navigate(`/item/${notif.itemId}`); }}>View</Button>
                              </Box>
                            )}
                          </Box>
                        );
                      })
                    )}
                  </Box>
                  <Divider />
                  <MenuItem onClick={signOutUser}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant='contained'
                onClick={signInWithGoogle}
                sx={{
                  background: 'linear-gradient(180deg,#9cf07c,#62d24b)',
                  color: '#0A0A0A',
                  '&:hover': { filter: 'brightness(1.06)' },
                  textTransform: 'none',
                }}
              >
                Sign in
              </Button>
            )}
          </Stack>
        </Box>
      </Toolbar>
        <Snackbar open={clearedOpen} autoHideDuration={3000} onClose={() => setClearedOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity='success' onClose={() => setClearedOpen(false)} sx={{ width: '100%' }}>
            {clearedCount > 0 ? `${clearedCount} notification${clearedCount === 1 ? '' : 's'} cleared` : 'No notifications cleared'}
          </Alert>
        </Snackbar>
    </AppBar>
  );
}

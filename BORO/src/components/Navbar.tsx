import { useEffect, useState } from 'react';
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
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { ui } from '../lib/uiTokens';
import { ACCENTS } from '../lib/accents';

export default function Navbar() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      setNotifications([]);
      return;
    }

    const notifs: any[] = [];

    const borrowRequestsQuery = query(
      collection(db, 'borrowRequests'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubBorrowRequests = onSnapshot(borrowRequestsQuery, (snap) => {
      const requests = snap.docs.map((d) => ({ id: d.id, type: 'borrowRequest', ...d.data() }));
      notifs.push(...requests);
      updateNotifications();
    });

    const extendRequestsQuery = query(
      collection(db, 'extendDateRequests'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubExtendRequests = onSnapshot(extendRequestsQuery, (snap) => {
      const requests = snap.docs.map((d) => ({ id: d.id, type: 'extendRequest', ...d.data() }));
      notifs.push(...requests);
      updateNotifications();
    });

    const itemsQuery = query(
      collection(db, 'items'),
      where('holderId', '==', user.uid),
      where('status', '==', 'borrowed')
    );
    const unsubItems = onSnapshot(itemsQuery, (snap) => {
      const now = dayjs();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.borrowedUntil) {
          const dueDate = dayjs(data.borrowedUntil);
          const daysUntilDue = dueDate.diff(now, 'day');
          if (daysUntilDue < 0) {
            notifs.push({ id: d.id, type: 'overdue', itemTitle: data.title, dueDate: data.borrowedUntil, ownerId: data.ownerId });
          }
        }
      });
      updateNotifications();
    });

    const returnsQuery = query(
      collection(db, 'notifications'),
      where('ownerId', '==', user.uid),
      where('type', '==', 'return'),
      where('read', '==', false)
    );
    const unsubReturns = onSnapshot(returnsQuery, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, type: 'return', ...d.data() }));
      notifs.push(...arr);
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
      const arr = snap.docs.map((d) => ({ id: d.id, type: 'reminder', ...d.data() }));
      notifs.push(...arr);
      updateNotifications();
    });

    function updateNotifications() {
      setNotifications([...notifs]);
      setNotificationCount(notifs.length);
    }

    return () => {
      unsubBorrowRequests();
      unsubExtendRequests();
      unsubItems();
      unsubReturns();
      unsubReminders && unsubReminders();
    };
  }, [user]);

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
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  {notifications.length === 0 ? (
                    <MenuItem disabled>No notifications</MenuItem>
                  ) : (
                    notifications.map((notif, idx) => (
                      <MenuItem key={`${notif.id}-${idx}`} onClick={() => handleNotificationClick(notif)}>
                        {notif.type === 'borrowRequest' && `New borrow request from ${notif.requesterName}`}
                        {notif.type === 'extendRequest' && `Extend date request from ${notif.requesterName}`}
                        {notif.type === 'overdue' && `Overdue: ${notif.itemTitle} (Due: ${new Date(notif.dueDate).toLocaleDateString()})`}
                              {notif.type === 'reminder' && (
                                // Prefer explicit message if set, fallback to compact summary
                                notif.message ? `${notif.message}` : `Reminder: ${notif.itemTitle || ''}`
                              )}
                        {notif.type === 'return' && `${notif.borrowerName || 'Someone'} returned ${notif.itemTitle}`}
                      </MenuItem>
                    ))
                  )}
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
    </AppBar>
  );
}

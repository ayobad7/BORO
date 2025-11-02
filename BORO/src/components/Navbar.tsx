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
import InputBase from '@mui/material/InputBase';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

export default function Navbar() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      setNotifications([]);
      return;
    }

    const notifs: any[] = [];

    // Listen for pending borrow requests (items I own)
    const borrowRequestsQuery = query(
      collection(db, 'borrowRequests'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubBorrowRequests = onSnapshot(borrowRequestsQuery, (snap) => {
      const requests = snap.docs.map((d) => ({
        id: d.id,
        type: 'borrowRequest',
        ...d.data(),
      }));
      notifs.push(...requests);
      updateNotifications();
    });

    // Listen for pending extend requests (items I own)
    const extendRequestsQuery = query(
      collection(db, 'extendDateRequests'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubExtendRequests = onSnapshot(extendRequestsQuery, (snap) => {
      const requests = snap.docs.map((d) => ({
        id: d.id,
        type: 'extendRequest',
        ...d.data(),
      }));
      notifs.push(...requests);
      updateNotifications();
    });

    // Listen for items I'm borrowing that are overdue
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
          // Only show notification if overdue (past the return date)
          if (daysUntilDue < 0) {
            notifs.push({
              id: d.id,
              type: 'overdue',
              itemTitle: data.title,
              dueDate: data.borrowedUntil,
              ownerId: data.ownerId,
            });
          }
        }
      });
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
    };
  }, [user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: any) => {
    handleMenuClose();
    if (
      notification.type === 'borrowRequest' ||
      notification.type === 'extendRequest'
    ) {
      navigate(`/item/${notification.itemId}`);
    } else if (notification.type === 'overdue') {
      navigate(`/item/${notification.id}`);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <AppBar
      position='static'
      color='transparent'
      elevation={0}
      sx={{ mt: 1.5 }}
    >
      <Toolbar sx={{ justifyContent: 'center', py: 1.5 }}>
        <Box
          sx={{
            width: 1000,
            maxWidth: '100%',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Brand */}
          <Typography
            variant='h4'
            component={RouterLink}
            to='/'
            sx={{ textDecoration: 'none', color: '#D12128', fontWeight: 800 }}
          >
            BORO
          </Typography>

          {/* Center search */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                bgcolor: '#072B36',
                borderRadius: 15,
                px: 2,
                py: 0.75,
                width: 360,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <InputBase
                placeholder='Search item'
                sx={{ color: '#FAE3AC', width: '100%' }}
                inputProps={{ 'aria-label': 'search item' }}
              />
            </Box>
          </Box>

          {/* Right actions */}
          <Stack direction='row' spacing={2} alignItems='center'>
            {user ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <Badge badgeContent={notificationCount} color='error'>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        color: '#FAE3AC',
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(user.displayName || user.email)}
                    </Avatar>
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {notifications.length === 0 ? (
                    <MenuItem disabled>No notifications</MenuItem>
                  ) : (
                    notifications.map((notif, idx) => (
                      <MenuItem
                        key={`${notif.id}-${idx}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        {notif.type === 'borrowRequest' &&
                          `New borrow request from ${notif.requesterName}`}
                        {notif.type === 'extendRequest' &&
                          `Extend date request from ${notif.requesterName}`}
                        {notif.type === 'overdue' &&
                          `Overdue: ${notif.itemTitle} (Due: ${new Date(
                            notif.dueDate
                          ).toLocaleDateString()})`}
                      </MenuItem>
                    ))
                  )}
                  <Divider />
                  <MenuItem onClick={signOutUser}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant='contained' onClick={signInWithGoogle}>
                Sign in
              </Button>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

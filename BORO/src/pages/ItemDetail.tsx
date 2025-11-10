import { useEffect, useMemo, useState } from 'react';
import { useParams, Link as RouterLink, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  collection,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import type { StorageItem, BorrowRequest, ExtendDateRequest } from '../types';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState<StorageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingRequests, setPendingRequests] = useState<BorrowRequest[]>([]);
  const [extendRequests, setExtendRequests] = useState<ExtendDateRequest[]>([]);

  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowFromDate, setBorrowFromDate] = useState<Dayjs | null>(null);
  const [borrowToDate, setBorrowToDate] = useState<Dayjs | null>(null);
  const [borrowMessage, setBorrowMessage] = useState('');

  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendToDate, setExtendToDate] = useState<Dayjs | null>(null);
  const [extendMessage, setExtendMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, 'items', id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setLoading(false);
        if (!snap.exists()) {
          setItem(null);
        } else {
          setItem({ id: snap.id, ...(snap.data() as any) });
        }
      },
      (e) => {
        setLoading(false);
        setError(e.message);
      }
    );
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q1 = query(
      collection(db, 'borrowRequests'),
      where('itemId', '==', id),
      where('status', '==', 'pending')
    );
    const unsub1 = onSnapshot(q1, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as BorrowRequest[];
      setPendingRequests(arr);
    });

    const q2 = query(
      collection(db, 'extendDateRequests'),
      where('itemId', '==', id),
      where('status', '==', 'pending')
    );
    const unsub2 = onSnapshot(q2, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as ExtendDateRequest[];
      setExtendRequests(arr);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [id]);

  const isOwner = useMemo(
    () => !!(user && item && user.uid === item.ownerId),
    [user, item]
  );
  const isBorrower = useMemo(
    () =>
      !!(
        user &&
        item &&
        item.status === 'borrowed' &&
        user.uid === item.holderId
      ),
    [user, item]
  );
  const canFreeBorrow = useMemo(
    () =>
      !!(
        user &&
        item &&
        !isOwner &&
        item.borrowMode === 'free' &&
        item.status === 'available'
      ),
    [user, item, isOwner]
  );
  const canRequestBorrow = useMemo(
    () =>
      !!(
        user &&
        item &&
        !isOwner &&
        item.borrowMode === 'request' &&
        item.status === 'available'
      ),
    [user, item, isOwner]
  );

  const markReturned = async () => {
    if (!item || !isOwner) return;
    setSaving(true);
    try {
      const borrowerId = item.holderId;
      const borrowerName = item.holderName || 'Unknown';
      const ref = doc(db, 'items', item.id);
      await updateDoc(ref, {
        status: 'available',
        holderId: item.ownerId,
        holderName: null,
        borrowedFrom: null,
        borrowedUntil: null,
        updatedAt: serverTimestamp(),
      });
      // Create a return notification for the owner
      const notifId = uuidv4();
      await setDoc(doc(collection(db, 'notifications'), notifId), {
        id: notifId,
        type: 'return',
        ownerId: item.ownerId,
        itemId: item.id,
        itemTitle: item.title,
        borrowerId,
        borrowerName,
        read: false,
        createdAt: serverTimestamp(),
        returnedAt: serverTimestamp(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to mark returned');
    } finally {
      setSaving(false);
    }
  };

  const returnItem = async () => {
    if (
      !item ||
      !user ||
      item.status !== 'borrowed' ||
      user.uid !== item.holderId
    )
      return;
    setSaving(true);
    try {
      const ref = doc(db, 'items', item.id);
      await updateDoc(ref, {
        status: 'available',
        holderId: item.ownerId,
        holderName: null,
        borrowedFrom: null,
        borrowedUntil: null,
        updatedAt: serverTimestamp(),
      });
      // Create a return notification for the owner
      const notifId = uuidv4();
      await setDoc(doc(collection(db, 'notifications'), notifId), {
        id: notifId,
        type: 'return',
        ownerId: item.ownerId,
        itemId: item.id,
        itemTitle: item.title,
        borrowerId: user.uid,
        borrowerName: user.displayName || user.email || 'Unknown',
        read: false,
        createdAt: serverTimestamp(),
        returnedAt: serverTimestamp(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to return item');
    } finally {
      setSaving(false);
    }
  };

  const borrowNow = async () => {
    if (!item || !user || !borrowToDate) return;
    setSaving(true);
    try {
      const ref = doc(db, 'items', item.id);
      await updateDoc(ref, {
        status: 'borrowed',
        holderId: user.uid,
        holderName: user.displayName || user.email || 'Unknown',
        borrowedFrom: borrowFromDate ? borrowFromDate.toISOString() : null,
        borrowedUntil: borrowToDate.toISOString(),
        updatedAt: serverTimestamp(),
      });
      setBorrowDialogOpen(false);
      setBorrowFromDate(null);
      setBorrowToDate(null);
      setBorrowMessage('');
    } catch (e: any) {
      setError(e.message || 'Failed to borrow');
    } finally {
      setSaving(false);
    }
  };

  const submitBorrowRequest = async () => {
    if (!item || !user) return;
    setSaving(true);
    try {
      const reqId = uuidv4();
      const req: any = {
        id: reqId,
        itemId: item.id,
        ownerId: item.ownerId,
        requesterId: user.uid,
        requesterName: user.displayName || user.email || 'Unknown',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Only add fields if they have values (Firestore doesn't accept undefined)
      if (borrowFromDate) {
        req.fromDate = borrowFromDate.toISOString();
      }
      if (borrowToDate) {
        req.toDate = borrowToDate.toISOString();
      }
      if (borrowMessage.trim()) {
        req.message = borrowMessage.trim();
      }

      await setDoc(doc(collection(db, 'borrowRequests'), reqId), req);
      await updateDoc(doc(db, 'items', item.id), {
        status: 'requested',
        updatedAt: serverTimestamp(),
      });
      setBorrowDialogOpen(false);
      setBorrowFromDate(null);
      setBorrowToDate(null);
      setBorrowMessage('');
    } catch (e: any) {
      setError(e.message || 'Failed to submit request');
    } finally {
      setSaving(false);
    }
  };

  const approveBorrowRequest = async (req: BorrowRequest) => {
    if (!item || !isOwner) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'borrowRequests', req.id), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'items', item.id), {
        status: 'borrowed',
        holderId: req.requesterId,
        holderName: req.requesterName || 'Unknown',
        borrowedFrom: req.fromDate || null,
        borrowedUntil: req.toDate || null,
        updatedAt: serverTimestamp(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to approve');
    } finally {
      setSaving(false);
    }
  };

  const rejectBorrowRequest = async (req: BorrowRequest) => {
    if (!isOwner) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'borrowRequests', req.id), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'items', item!.id), {
        status: 'available',
        updatedAt: serverTimestamp(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to reject');
    } finally {
      setSaving(false);
    }
  };

  const submitExtendRequest = async () => {
    if (!item || !user || !extendToDate) return;
    const isFree = item.borrowMode === 'free';
    setSaving(true);
    try {
      if (isFree) {
        // Free mode: borrower directly updates the item
        await updateDoc(doc(db, 'items', item.id), {
          borrowedUntil: extendToDate.toISOString(),
          updatedAt: serverTimestamp(),
        });
        setExtendDialogOpen(false);
        setExtendToDate(null);
        setExtendMessage('');
      } else {
        // Request mode: create extend request for owner approval
        const reqId = uuidv4();
        const req: ExtendDateRequest = {
          id: reqId,
          itemId: item.id,
          ownerId: item.ownerId,
          requesterId: user.uid,
          requesterName: user.displayName || user.email || 'Unknown',
          currentToDate: item.borrowedUntil || '',
          requestedToDate: extendToDate.toISOString(),
          message: extendMessage.trim() || undefined,
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await setDoc(doc(collection(db, 'extendDateRequests'), reqId), {
          ...req,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setExtendDialogOpen(false);
        setExtendToDate(null);
        setExtendMessage('');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to extend date');
    } finally {
      setSaving(false);
    }
  };

  // Open extend dialog when URL contains ?extend=1
  useEffect(() => {
    if (searchParams.get('extend')) {
      setExtendDialogOpen(true);
    }
  }, [searchParams]);

  // Clear ?extend param when dialog closes
  useEffect(() => {
    if (!extendDialogOpen && searchParams.get('extend')) {
      const sp = new URLSearchParams(searchParams as any);
      sp.delete('extend');
      setSearchParams(sp);
    }
  }, [extendDialogOpen, searchParams]);

  const approveExtendRequest = async (req: ExtendDateRequest) => {
    if (!item || !isOwner) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'extendDateRequests', req.id), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'items', item.id), {
        borrowedUntil: req.requestedToDate,
        updatedAt: serverTimestamp(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to approve extend');
    } finally {
      setSaving(false);
    }
  };

  const rejectExtendRequest = async (req: ExtendDateRequest) => {
    if (!isOwner) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'extendDateRequests', req.id), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to reject extend');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <Box
            sx={{
              width: 1000,
              maxWidth: '100%',
              py: 3,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      </>
    );
  }

  if (!item) {
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
            <Alert severity='warning' sx={{ mb: 2 }}>
              Item not found.
            </Alert>
            <Button variant='outlined' component={RouterLink} to='/storage'>
              Back to storage
            </Button>
          </Box>
        </Box>
      </>
    );
  }

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
          {error && (
            <Alert
              severity='error'
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          <Stack spacing={2}>
            <Typography variant='h5'>{item.title}</Typography>
            <Typography variant='body2' color='text.secondary'>
              Category: {item.category}
              {item.location ? ` • ${item.location}` : ''}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Mode: {item.borrowMode} • Status: {item.status}
            </Typography>
            {item.description && (
              <Typography variant='body1'>{item.description}</Typography>
            )}

            {item.imageUrls?.length ? (
              <ImageList
                cols={Math.min(3, item.imageUrls.length)}
                rowHeight={180}
              >
                {item.imageUrls.map((url, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={url}
                      loading='lazy'
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Typography color='text.secondary'>No images</Typography>
            )}

            <Card>
              <CardContent>
                <Typography variant='subtitle1'>Actions</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {isOwner
                    ? 'You are the owner of this item.'
                    : 'You are viewing a shared item.'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant='outlined' component={RouterLink} to='/storage'>
                  Back
                </Button>
                {isOwner && item.status === 'borrowed' && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={markReturned}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Mark returned'}
                  </Button>
                )}
                {!isOwner && canFreeBorrow && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setBorrowDialogOpen(true)}
                    disabled={!user}
                  >
                    Borrow now
                  </Button>
                )}
                {!isOwner && canRequestBorrow && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setBorrowDialogOpen(true)}
                    disabled={!user}
                  >
                    Request borrow
                  </Button>
                )}
                {isBorrower && (
                  <>
                    <Button
                      variant='outlined'
                      onClick={() => setExtendDialogOpen(true)}
                    >
                      Extend date
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      onClick={returnItem}
                      disabled={saving}
                    >
                      {saving ? 'Returning…' : 'Return'}
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>

            {isOwner && pendingRequests.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant='subtitle1' gutterBottom>
                    Pending Borrow Requests
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {pendingRequests.map((req) => (
                    <Stack key={req.id} spacing={1} sx={{ mb: 2 }}>
                      <Typography variant='body2'>
                        <strong>{req.requesterName || 'Unknown'}</strong> wants
                        to borrow this item
                      </Typography>
                      {req.fromDate && (
                        <Typography variant='body2' color='text.secondary'>
                          From: {new Date(req.fromDate).toLocaleDateString()}
                        </Typography>
                      )}
                      {req.toDate && (
                        <Typography variant='body2' color='text.secondary'>
                          Until: {new Date(req.toDate).toLocaleDateString()}
                        </Typography>
                      )}
                      {req.message && (
                        <Typography variant='body2' color='text.secondary'>
                          Message: {req.message}
                        </Typography>
                      )}
                      <Stack direction='row' spacing={1}>
                        <Button
                          size='small'
                          variant='contained'
                          onClick={() => approveBorrowRequest(req)}
                          disabled={saving}
                        >
                          Approve
                        </Button>
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() => rejectBorrowRequest(req)}
                          disabled={saving}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </Stack>
                  ))}
                </CardContent>
              </Card>
            )}

            {isOwner && extendRequests.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant='subtitle1' gutterBottom>
                    Pending Extend Date Requests
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {extendRequests.map((req) => (
                    <Stack key={req.id} spacing={1} sx={{ mb: 2 }}>
                      <Typography variant='body2'>
                        <strong>{req.requesterName || 'Unknown'}</strong> wants
                        to extend the return date
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Current:{' '}
                        {new Date(req.currentToDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Requested:{' '}
                        {new Date(req.requestedToDate).toLocaleDateString()}
                      </Typography>
                      {req.message && (
                        <Typography variant='body2' color='text.secondary'>
                          Message: {req.message}
                        </Typography>
                      )}
                      <Stack direction='row' spacing={1}>
                        <Button
                          size='small'
                          variant='contained'
                          onClick={() => approveExtendRequest(req)}
                          disabled={saving}
                        >
                          Approve
                        </Button>
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() => rejectExtendRequest(req)}
                          disabled={saving}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </Stack>
                  ))}
                </CardContent>
              </Card>
            )}

            {item.status === 'borrowed' && (
              <Card>
                <CardContent>
                  {item.holderName && (
                    <Typography variant='body2' color='text.secondary'>
                      Currently borrowed by: {item.holderName}
                    </Typography>
                  )}
                  {item.borrowedUntil && (
                    <Typography variant='body2' color='text.secondary'>
                      Return by:{' '}
                      {new Date(item.borrowedUntil).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>

          <Dialog
            open={borrowDialogOpen}
            onClose={() => setBorrowDialogOpen(false)}
            maxWidth='sm'
            fullWidth
          >
            <DialogTitle>
              {item?.borrowMode === 'free'
                ? 'Borrow Item'
                : 'Request to Borrow'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <DatePicker
                  label='Return by'
                  value={borrowToDate}
                  onChange={setBorrowToDate}
                  slotProps={{
                    textField: {
                      required: true,
                      helperText: 'Required: When will you return this item?',
                    },
                  }}
                />
                {item?.borrowMode === 'request' && (
                  <TextField
                    label='Message (optional)'
                    value={borrowMessage}
                    onChange={(e) => setBorrowMessage(e.target.value)}
                    multiline
                    minRows={3}
                  />
                )}
                {item?.borrowMode === 'free' && (
                  <Typography variant='body2' color='text.secondary'>
                    This item will be borrowed immediately.
                  </Typography>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
              <Button
                variant='contained'
                onClick={
                  item?.borrowMode === 'free' ? borrowNow : submitBorrowRequest
                }
                disabled={saving || !borrowToDate}
              >
                {saving
                  ? 'Submitting…'
                  : item?.borrowMode === 'free'
                  ? 'Borrow Now'
                  : 'Submit Request'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={extendDialogOpen}
            onClose={() => setExtendDialogOpen(false)}
            maxWidth='sm'
            fullWidth
          >
            <DialogTitle>Extend Return Date</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {item.borrowedUntil && (
                  <Typography variant='body2' color='text.secondary'>
                    Current return date:{' '}
                    {new Date(item.borrowedUntil).toLocaleDateString()}
                  </Typography>
                )}
                <DatePicker
                  label='New return date'
                  value={extendToDate}
                  onChange={setExtendToDate}
                  minDate={
                    item.borrowedUntil
                      ? dayjs(item.borrowedUntil).add(1, 'day')
                      : dayjs()
                  }
                />
                {item.borrowMode === 'request' && (
                  <TextField
                    label='Reason (optional)'
                    value={extendMessage}
                    onChange={(e) => setExtendMessage(e.target.value)}
                    multiline
                    minRows={2}
                    helperText='Owner approval required for request mode items'
                  />
                )}
                {item.borrowMode === 'free' && (
                  <Typography variant='body2' color='text.secondary'>
                    Free mode: date will update immediately
                  </Typography>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setExtendDialogOpen(false)}>Cancel</Button>
              <Button
                variant='contained'
                onClick={submitExtendRequest}
                disabled={saving || !extendToDate}
              >
                {saving
                  ? 'Submitting…'
                  : item.borrowMode === 'free'
                  ? 'Update Date'
                  : 'Request Extension'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}

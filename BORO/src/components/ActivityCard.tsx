import Box from '@mui/material/Box';
import { useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { StorageItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { updateDoc, doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tooltip from '@mui/material/Tooltip';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { BiCategoryAlt } from 'react-icons/bi';
import { GrLocation } from 'react-icons/gr';
import { PiHandArrowDown, PiTimerBold } from 'react-icons/pi';
import { FiFileText } from 'react-icons/fi';
import { LuShare2 } from 'react-icons/lu';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { getDaysLeft, getOverdueDays } from '../lib/date';
import { buildReminderMessage } from '../lib/reminders';
import { focusRing } from '../lib/accents';

// Option A Revamp: Updated spacing, typography, and layout

interface ActivityCardProps {
  item: StorageItem;
  type: 'storage' | 'borrowed' | 'lent';
  accentColor: string; // accent derived per type
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  // when false, viewer is not the owner of the item (e.g., viewing someone else's storage)
  viewerIsOwner?: boolean;
  // id of the current viewer (signed-in user). If provided the card will compute
  // whether the viewer is the owner or the current holder and show appropriate actions.
  viewerId?: string | null;
}

export default function ActivityCard({
  item,
  type,
  accentColor,
  isFavorite,
  onToggleFavorite,
  viewerIsOwner,
  viewerId = null,
}: ActivityCardProps) {
  const navigate = useNavigate();
  const [copiedOpen, setCopiedOpen] = useState(false);
  const [remindOpen, setRemindOpen] = useState(false);

  const { user } = useAuth();
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendToDate, setExtendToDate] = useState<Dayjs | null>(null);
  const [extendMessage, setExtendMessage] = useState('');
  const [extendSaving, setExtendSaving] = useState(false);
  const [returnSaving, setReturnSaving] = useState(false);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowToDate, setBorrowToDate] = useState<Dayjs | null>(null);
  const [borrowMessage, setBorrowMessage] = useState('');
  const [borrowSaving, setBorrowSaving] = useState(false);
  
  const isBorrower = useMemo(() => !!(user && item && item.status === 'borrowed' && user.uid === item.holderId), [user, item]);

  const handleBorrowSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    // For free mode require a return date; for request mode a date is optional
    if (item.borrowMode === 'free' && !borrowToDate) return;
    setBorrowSaving(true);
    try {
      if (item.borrowMode === 'free') {
        await updateDoc(doc(db, 'items', item.id), {
          status: 'borrowed',
          holderId: user?.uid,
          holderName: user?.displayName || user?.email || 'Unknown',
          borrowedFrom: serverTimestamp(),
          borrowedUntil: borrowToDate!.toISOString(),
          updatedAt: serverTimestamp(),
        });
      } else {
        const reqId = crypto?.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now());
        const req: any = {
          id: reqId,
          itemId: item.id,
          ownerId: item.ownerId,
          requesterId: user?.uid,
          requesterName: user?.displayName || user?.email || 'Unknown',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        if (borrowToDate) req.toDate = borrowToDate.toISOString();
        if (borrowMessage.trim()) req.message = borrowMessage.trim();
        await setDoc(doc(collection(db, 'borrowRequests'), reqId), req);
        await updateDoc(doc(db, 'items', item.id), {
          status: 'requested',
          updatedAt: serverTimestamp(),
        });
      }
      setBorrowDialogOpen(false);
      setBorrowToDate(null);
      setBorrowMessage('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Borrow failed', err);
    } finally {
      setBorrowSaving(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/item/${item.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedOpen(true);
    } catch (err) {
      // ignore copy errors
      setCopiedOpen(true);
    }
  };

  const handleReturnClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If the current viewer is the borrower, perform inline return. Otherwise, fall back to navigating to detail page.
    if (!user || item.status !== 'borrowed' || user.uid !== item.holderId) {
      navigate(`/item/${item.id}?return=1`);
      return;
    }
    setReturnSaving(true);
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
      const nid = crypto?.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now());
      await setDoc(doc(collection(db, 'notifications'), nid), {
        id: nid,
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Return failed', err);
    } finally {
      setReturnSaving(false);
    }
  };

  const handleMarkReturned = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If viewer is not owner or item not borrowed, fallback to detail page
    if (!resolvedViewerIsOwner || item.status !== 'borrowed') {
      navigate(`/item/${item.id}?return=1`);
      return;
    }
    setReturnSaving(true);
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
      const nid = crypto?.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now());
      await setDoc(doc(collection(db, 'notifications'), nid), {
        id: nid,
        type: 'return',
        ownerId: item.ownerId,
        itemId: item.id,
        itemTitle: item.title,
        borrowerId: item.holderId || null,
        borrowerName: item.holderName || null,
        read: false,
        createdAt: serverTimestamp(),
        returnedAt: serverTimestamp(),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Mark returned failed', err);
    } finally {
      setReturnSaving(false);
    }
  };
  // Compute due status string for borrowed/lent; returns value string or null
  const getDueStatus = (): string | null => {
    if (!item.borrowedUntil || (type !== 'borrowed' && type !== 'lent'))
      return null;
    const daysLeft = getDaysLeft(item.borrowedUntil);
    const overdueDays = getOverdueDays(item.borrowedUntil);
    if (overdueDays > 0) return `${overdueDays}d overdue`;
    if (daysLeft === 0) return 'Today';
    if (type === 'borrowed') return `${daysLeft}d left`;
    return `in ${daysLeft}d`;
  };

  // Severity color for due/return line
  const getDueColor = (): string | undefined => {
    if (!item.borrowedUntil || (type !== 'borrowed' && type !== 'lent'))
      return undefined;
    const daysLeft = getDaysLeft(item.borrowedUntil);
    const overdueDays = getOverdueDays(item.borrowedUntil);
    if (overdueDays > 0) return '#ff7a7a'; // danger
    if (daysLeft <= 3) return '#ffd06b'; // warning
    return '#8be36a'; // safe
  };

  // Icon line (label/value hierarchy; extra gap between label and value)
  const IconLine = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ color: accentColor, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
        <Typography
          variant='caption'
          sx={{
            color: '#7d8799',
            fontWeight: 500,
            fontSize: 12,
            lineHeight: 1.35,
          }}
        >
          {label}
        </Typography>
        {value && (
          <Typography
            variant='caption'
            sx={{
              ml: 1,
              color: '#dfe6f3',
              fontWeight: 700,
              fontSize: 12,
              lineHeight: 1.35,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 260,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const formatAddedDate = (createdAt?: number): string => {
    if (!createdAt) return 'Recently';
    const now = Date.now();
    const diff = now - createdAt;
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (days < 1) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (weeks === 1) return '1 week ago';
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months === 1) return '1 month ago';
    return `${months} months ago`;
  };

  // Resolve viewer relationship to this item. Priority: explicit viewerIsOwner prop, else derive from viewerId. Default: true (owner) to preserve existing behavior.
  // Resolve owner/holder using string coercion to avoid mismatches between undefined/null or different types
  const resolvedViewerIsOwner =
    typeof viewerIsOwner === 'boolean'
      ? viewerIsOwner
      : viewerId != null
      ? String(viewerId) === String(item.ownerId)
      : true;
  const resolvedViewerIsHolder =
    viewerId != null && item.holderId != null
      ? String(viewerId) === String(item.holderId)
      : false;

  // Debug: log viewer/item relation for borrowed cards (kept lightweight)
  if ((import.meta as any).env?.MODE !== 'production' && type === 'borrowed') {
    // eslint-disable-next-line no-console
    console.debug('ActivityCard debug:', {
      id: item.id,
      viewerId,
      holderId: item.holderId,
      ownerId: item.ownerId,
      resolvedViewerIsOwner,
      resolvedViewerIsHolder,
      type,
    });
  }

  return (
    <Box
      component={RouterLink}
      to={`/item/${item.id}`}
      sx={{
        // Consistent spacing + radius via CSS variables (Option A: increased padding)
        '--card-r': '20px',
        '--pad': '14px',
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        // Background gradient + panel tone (reference style)
        background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
        border: '1px solid #23293a',
        // Increased outer radius for softer card rounding
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
      {/* Media with padding (no outline) */}
      <Box sx={{ position: 'relative', p: 'var(--pad)' }}>
        <Box
          sx={{
            // Inner radius follows outer radius minus padding to keep equal corner offset
            borderRadius: 'calc(var(--card-r) - var(--pad))',
            overflow: 'hidden',
            background: '#0b0f16',
            aspectRatio: '16 / 12',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          {item.imageUrls?.[0] ? (
            <Box
              component='img'
              src={item.imageUrls[0]}
              alt={item.title || 'Item image'}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : null}
        </Box>
      </Box>
      <Box
        sx={{
          px: 'var(--pad)',
          pt: 0,
          pb: 1.75,
          display: 'grid',
          gap: 1.5, // Increased from 1 to test if styles are applying
          position: 'relative',
        }}
      >
        {/* Title Row with Share/Favorite icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='h6'
            sx={{
              fontSize: 17,
              fontWeight: 800,
              color: '#f0f4f9',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
              minWidth: 0,
            }}
          >
            {item.title}
          </Typography>
          {/* Share & Favorite icons in title row */}
          <IconButton
            size='small'
            onClick={handleShare}
            sx={{ color: '#8ca2ba', flexShrink: 0 }}
            aria-label='share'
          >
            <LuShare2 size={18} />
          </IconButton>
          {isFavorite ? (
            <AiFillHeart
              size={18}
              color='#ff7a9e'
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite?.();
              }}
            />
          ) : (
            <AiOutlineHeart
              size={18}
              color='#8ca2ba'
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite?.();
              }}
            />
          )}
        </Box>

        {/* Status Badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Chip
            label={type === 'storage' ? 'Storage' : type === 'borrowed' ? 'Borrowed' : 'Lent'}
            size='small'
            sx={{
              height: 20,
              bgcolor: `${accentColor}22`,
              color: accentColor,
              border: `1px solid ${accentColor}44`,
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              '& .MuiChip-label': { px: 0.9 },
            }}
          />
          {/* Storage: Borrow Mode badge */}
          {type === 'storage' && (
            <Chip
              icon={item.borrowMode === 'free' ? <TbLockOpen size={11} /> : <TbLock size={11} />}
              label={item.borrowMode === 'free' ? 'Free Borrow' : 'Request'}
              size='small'
              sx={{
                height: 20,
                bgcolor: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}44`,
                fontSize: 10,
                fontWeight: 700,
                '& .MuiChip-label': { px: 0.9 },
                '& .MuiChip-icon': { color: accentColor, marginLeft: '5px' },
              }}
            />
          )}
          {/* Borrowed/Lent: Due status badge */}
          {getDueStatus() && type !== 'storage' && (
            <Chip
              icon={<PiTimerBold size={11} />}
              label={getDueStatus()}
              size='small'
              sx={{
                height: 20,
                bgcolor: `${getDueColor()}22`,
                color: getDueColor(),
                border: `1px solid ${getDueColor()}44`,
                fontSize: 10,
                fontWeight: 700,
                '& .MuiChip-label': { px: 0.9 },
                '& .MuiChip-icon': { color: getDueColor(), marginLeft: '5px' },
              }}
            />
          )}
          {/* Lent: Show borrower name as badge */}
          {type === 'lent' && item.holderName && (
            <Chip
              label={`Lent to ${item.holderName}`}
              size='small'
              sx={{
                height: 20,
                bgcolor: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}44`,
                fontSize: 10,
                fontWeight: 700,
                '& .MuiChip-label': { px: 0.9 },
              }}
            />
          )}
        </Box>

        {/* Metadata */}
  <Box sx={{ display: 'grid', gap: 1.25, mb: 0.25 }}>
          <IconLine
            icon={<BiCategoryAlt size={14} />}
            label='Category'
            value={item.category || '—'}
          />
          <IconLine
            icon={<GrLocation size={14} />}
            label='Location'
            value={item.location || '—'}
          />
            {item.note && (
              <IconLine
                icon={<FiFileText size={14} />}
                label='Notes'
                value={item.note}
              />
            )}
          {type === 'borrowed' && (
            <IconLine
              icon={<PiHandArrowDown size={14} />}
              label='Lender'
              value={item.ownerName || 'Unknown'}
            />
          )}
        </Box>

        {/* Storage cards: Bottom info section */}
        {type === 'storage' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 0.5,
              pt: 1,
              borderTop: '1px solid #1e2433',
            }}
          >
            <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11 }}>
              Added {formatAddedDate(item.createdAt)}
            </Typography>
            {resolvedViewerIsOwner ? (
              <Typography
                variant='caption'
                sx={{
                  color: accentColor,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Available
              </Typography>
            ) : (
              <Box>
                <Button
                  size='small'
                  variant='contained'
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBorrowDialogOpen(true);
                    setBorrowToDate(dayjs().add(7, 'day'));
                    setBorrowMessage('');
                  }}
                  sx={{
                    // Match Return button styling exactly to avoid height mismatch
                    bgcolor: accentColor,
                    color: '#0A0A0A',
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 800,
                    borderRadius: 2,
                    px: 1.5,
                    minHeight: 34,
                    height: 34,
                    lineHeight: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    '&:hover': { bgcolor: accentColor },
                  }}
                >
                  {item.borrowMode === 'free' ? 'Borrow' : 'Request borrow'}
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Borrowed/Lent: Action buttons */}
        {type !== 'storage' && (
          <>
            {/* Progress bar - show if we have borrowedUntil */}
            {(() => {
              const hasBar = item.borrowedUntil;
              if (!hasBar) return null;
              return (
                <Box sx={{ mt: 0.25, mb: 0.25 }}>
                  {(() => {
                    // Convert Firestore timestamps or string dates to milliseconds
                    const toMs = (val: any): number => {
                      if (!val) return Date.now();
                      if (typeof val === 'number') return val;
                      if (val?.toMillis) return val.toMillis();
                      if (val instanceof Date) return val.getTime();
                      if (typeof val === 'string') return new Date(val).getTime();
                      return Date.now();
                    };
                    // Use borrowedFrom if available, otherwise use createdAt or estimate
                    const start = item.borrowedFrom 
                      ? toMs(item.borrowedFrom) 
                      : (item.createdAt ? toMs(item.createdAt) : Date.now() - 7 * 86400000); // Default to 7 days ago
                    const end = toMs(item.borrowedUntil);
                    const now = Date.now();
                    const total = Math.max(1, end - start);
                    const done = Math.min(total, Math.max(0, now - start));
                    const pct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
                    // Use blue gradient for normal, red gradient for overdue
                    let barColor = 'linear-gradient(90deg,#6bd6ff,#7f8cff)';
                    const dueColor = getDueColor();
                    if (dueColor === '#ff7a7a') {
                      barColor = 'linear-gradient(90deg,#ff7a7a,#ffb6b6)';
                    }
                    return (
                      <Box
                        sx={{
                          height: 6,
                          bgcolor: '#1b2231',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${pct}%`,
                            height: '100%',
                            background: barColor,
                            borderRadius: 999,
                            transition: 'width .3s ease',
                          }}
                        />
                      </Box>
                    );
                  })()}
                </Box>
              );
            })()}
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {type === 'borrowed' && (
                <>
                  {/* Borrower actions: show when card type is 'borrowed' (implies holder in feeds) or when resolvedViewerIsHolder is true */}
                  {(type === 'borrowed' || resolvedViewerIsHolder) && (
                    <>
                      <Button
                        variant='outlined'
                        size='small'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // open in-place extend modal (preferred) if viewer is borrower; otherwise navigate to item
                          if (isBorrower) {
                            setExtendDialogOpen(true);
                            // prefill min date but mark as not touched so the user must actively pick a new date
                            setExtendToDate(item.borrowedUntil ? dayjs(item.borrowedUntil).add(1, 'day') : dayjs().add(1, 'day'));
                          } else {
                            navigate(`/item/${item.id}?extend=1`);
                          }
                        }}
                        sx={{
                          borderColor: '#2a3144',
                          color: accentColor,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: 'none',
                          flex: 1,
                        }}
                      >
                        Extend
                      </Button>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={handleReturnClick}
                        disabled={returnSaving}
                        sx={{
                          bgcolor: accentColor,
                          color: '#0a0a0a',
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: 'none',
                          flex: 1,
                          px: 1.5,
                          minHeight: 34,
                          height: 34,
                          lineHeight: '20px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxSizing: 'border-box',
                          '&:hover': { bgcolor: accentColor },
                        }}
                      >
                        {returnSaving ? 'Returning…' : 'Return'}
                      </Button>
                    </>
                  )}
                </>
              )}
              {type === 'lent' && (
                <>
                  {/* Owner actions: only show if the viewer is the owner of the item */}
                  {resolvedViewerIsOwner && (
                    <>
                          {(() => {
                            const hasDue = !!item.borrowedUntil;
                            const msUntil = hasDue ? new Date(String(item.borrowedUntil)).getTime() - Date.now() : Infinity;
                            const canRemind = hasDue ? msUntil < 3 * 24 * 60 * 60 * 1000 : false;
                            const tooltip = !hasDue
                              ? 'No due date'
                              : canRemind
                              ? 'Remind borrower'
                              : 'Remind available within 3 days of due date';

                            return (
                              <Tooltip title={tooltip}>
                                <Button
                                  variant='outlined'
                                  size='small'
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!hasDue) return;
                                    if (!canRemind) return;
                                    try {
                                      const msg = buildReminderMessage({
                                        ownerName: item.ownerName,
                                        itemName: item.title,
                                        dueDate: item.borrowedUntil,
                                      });
                                      if (!msg) return;
                                      const nid = crypto?.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now());
                                      await setDoc(doc(collection(db, 'notifications'), nid), {
                                        id: nid,
                                        type: 'reminder',
                                        ownerId: item.ownerId,
                                        ownerName: item.ownerName || null,
                                        borrowerId: item.holderId || null,
                                        borrowerName: item.holderName || null,
                                        itemId: item.id,
                                        itemTitle: item.title,
                                        message: msg,
                                        read: false,
                                        createdAt: serverTimestamp(),
                                      });
                                      setRemindOpen(true);
                                    } catch (err) {
                                      // eslint-disable-next-line no-console
                                      console.error('Remind failed', err);
                                    }
                                  }}
                                  disabled={!canRemind}
                                  sx={{
                                    borderColor: '#2a3144',
                                    color: accentColor,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    flex: 1,
                                    width: '100%',
                                  }}
                                >
                                  Remind
                                </Button>
                              </Tooltip>
                            );
                          })()}
                      <Button
                        variant='contained'
                        size='small'
                        onClick={handleMarkReturned}
                        sx={{
                          bgcolor: accentColor,
                          color: '#0a0a0a',
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: 'none',
                          flex: 1,
                          '&:hover': { bgcolor: accentColor },
                        }}
                        disabled={returnSaving || item.status !== 'borrowed'}
                      >
                        Returned
                      </Button>
                    </>
                  )}
                </>
              )}
            </Box>
          </>
        )}
      </Box>
      {/* (media moved above) */}
      {/* Accessibility focus ring */}
      <Box
        component='span'
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--card-r)',
          pointerEvents: 'none',
          '&:focus-visible + &': focusRing(`${accentColor}99`),
        }}
      />
      <Snackbar
        open={remindOpen}
        autoHideDuration={1800}
        onClose={() => setRemindOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: '#0f1318',
            color: '#e9eef7',
            border: '1px solid #23293a',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            borderRadius: '12px',
            px: 1.5,
            py: 0.7,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 180,
            justifyContent: 'center',
          },
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(90deg,#ffd06b,#ff9b6b)',
                boxShadow: '0 2px 8px rgba(255,160,100,0.12) inset',
              }}
            />
            <Typography variant='caption' sx={{ color: '#e9eef7', fontWeight: 700 }}>
              Reminder sent
            </Typography>
          </Box>
        }
      />
      {/* bottom-right badge removed in favor of inner image placement */}
      <Snackbar
        open={copiedOpen}
        autoHideDuration={1800}
        onClose={() => setCopiedOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: '#0f1318',
            color: '#e9eef7',
            border: '1px solid #23293a',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            borderRadius: '12px',
            px: 1.5,
            py: 0.7,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 180,
            justifyContent: 'center',
          },
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(90deg,#6bd6ff,#7f8cff)',
                boxShadow: '0 2px 8px rgba(127,140,255,0.18) inset',
              }}
            />
            <Typography variant='caption' sx={{ color: '#e9eef7', fontWeight: 700 }}>
              URL copied to clipboard
            </Typography>
          </Box>
        }
      />
      {/* Extend Dialog (in-place) */}
      {/* Borrow Dialog (in-card) */}
      <Dialog
        open={borrowDialogOpen}
        // Stop propagation on close so backdrop clicks don't bubble to the card link
        onClose={(e?: {}) => {
          try {
            // @ts-ignore
            e?.stopPropagation?.();
          } catch (_) {}
          setBorrowDialogOpen(false);
          setBorrowToDate(null);
          setBorrowMessage('');
        }}
  maxWidth='xs'
        // Prevent clicks inside the dialog (portal) and backdrop from bubbling to the card's RouterLink
        PaperProps={{ onClick: (e: React.MouseEvent) => e.stopPropagation(), onMouseDown: (e: React.MouseEvent) => e.stopPropagation() }}
        BackdropProps={{ onClick: (e: React.MouseEvent) => e.stopPropagation(), onMouseDown: (e: React.MouseEvent) => e.stopPropagation(), onTouchStart: (e: React.TouchEvent) => e.stopPropagation() }}
      >
        <DialogTitle>
          {item.borrowMode === 'free' ? 'Borrow Item' : 'Request to Borrow'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'grid', gap: 2 }}>
            <DatePicker label='Return by' value={borrowToDate} onChange={setBorrowToDate} />
            {item.borrowMode === 'request' && (
              <TextField
                label='Message (optional)'
                value={borrowMessage}
                onChange={(e) => setBorrowMessage(e.target.value)}
                multiline
                minRows={3}
              />
            )}
            {item.borrowMode === 'free' && (
              <Typography variant='body2' color='text.secondary'>
                This item will be borrowed immediately.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
          <Button
            variant='contained'
            onClick={handleBorrowSubmit}
            // For free mode require a date; for request mode allow empty date (matches ItemDetail behavior)
            disabled={borrowSaving || (item.borrowMode === 'free' && !borrowToDate)}
          >
            {borrowSaving ? 'Submitting…' : item.borrowMode === 'free' ? 'Borrow Now' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={extendDialogOpen}
        // Stop propagation on close events so backdrop clicks don't bubble to the card link
  onClose={(e?: {}) => {
          try {
            // try to stop propagation if an event is available
            // @ts-ignore
            e?.stopPropagation?.();
          } catch (_) {}
          setExtendDialogOpen(false);
          // reset touched state and selected date when closing the dialog
          
          setExtendToDate(null);
        }}
        maxWidth='xs'
        // Prevent clicks inside the dialog (portal) from bubbling to the card's RouterLink
        PaperProps={{
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
          onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
        }}
        BackdropProps={{
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
          onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
          onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
        }}
      >
        <DialogTitle>Extend Return Date</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'grid', gap: 2 }}>
            {item.borrowedUntil && (
              <Typography variant='body2' color='text.secondary'>
                Current return date: {new Date(item.borrowedUntil).toLocaleDateString()}
              </Typography>
            )}
            <Box
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              onTouchStart={(e: React.TouchEvent) => e.stopPropagation()}
            >
              <DatePicker
                label='New return date'
                value={extendToDate}
                onChange={(d) => {
                  setExtendToDate(d);
                  
                }}
                minDate={item.borrowedUntil ? dayjs(item.borrowedUntil).add(1, 'day') : dayjs()}
              />
            </Box>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => { e.stopPropagation(); setExtendDialogOpen(false); setExtendToDate(null); }}>Cancel</Button>
          <Button
            variant='contained'
            onClick={async (e) => {
              e.stopPropagation();
              if (!extendToDate) return;
              setExtendSaving(true);
              try {
                if (item.borrowMode === 'free') {
                  await updateDoc(doc(db, 'items', item.id), {
                    borrowedUntil: extendToDate.toISOString(),
                    updatedAt: serverTimestamp(),
                  });
                } else {
                  const reqId = crypto?.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now());
                  const reqBase: any = {
                    id: reqId,
                    itemId: item.id,
                    ownerId: item.ownerId,
                    requesterId: user?.uid,
                    requesterName: user?.displayName || user?.email || 'Unknown',
                    currentToDate: item.borrowedUntil || '',
                    requestedToDate: extendToDate.toISOString(),
                    status: 'pending',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  };
                  const req = extendMessage.trim() ? { ...reqBase, message: extendMessage.trim() } : reqBase;
                  await setDoc(doc(collection(db, 'extendDateRequests'), reqId), {
                    ...req,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                  });
                }
                setExtendDialogOpen(false);
                setExtendToDate(null);
                setExtendMessage('');
                
              } catch (e) {
                console.error('Extend failed', e);
              } finally {
                setExtendSaving(false);
              }
            }}
            disabled={extendSaving || !extendToDate}
          >
            {extendSaving ? 'Submitting…' : item.borrowMode === 'free' ? 'Update Date' : 'Request Extension'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

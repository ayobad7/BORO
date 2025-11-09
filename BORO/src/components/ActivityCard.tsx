import Box from '@mui/material/Box';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { Link as RouterLink } from 'react-router-dom';
import type { StorageItem } from '../types';
import { BiCategoryAlt } from 'react-icons/bi';
import { GrLocation } from 'react-icons/gr';
import { PiHandArrowDown, PiTimerBold } from 'react-icons/pi';
import { FiFileText } from 'react-icons/fi';
import { LuShare2 } from 'react-icons/lu';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { getDaysLeft, getOverdueDays } from '../lib/date';
import { focusRing } from '../lib/accents';

// Option A Revamp: Updated spacing, typography, and layout

interface ActivityCardProps {
  item: StorageItem;
  type: 'storage' | 'borrowed' | 'lent';
  accentColor: string; // accent derived per type
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function ActivityCard({
  item,
  type,
  accentColor,
  isFavorite,
  onToggleFavorite,
}: ActivityCardProps) {
  const [copiedOpen, setCopiedOpen] = useState(false);

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

      {/* Content */}
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
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    sx={{
                      bgcolor: accentColor,
                      color: '#0a0a0a',
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: 'none',
                      flex: 1,
                      '&:hover': { bgcolor: accentColor },
                    }}
                  >
                    Return
                  </Button>
                </>
              )}
              {type === 'lent' && (
                <>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
                    Remind
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    sx={{
                      bgcolor: accentColor,
                      color: '#0a0a0a',
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: 'none',
                      flex: 1,
                      '&:hover': { bgcolor: accentColor },
                    }}
                  >
                    Returned
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
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
    </Box>
  );
}

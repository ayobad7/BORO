import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { LuShare2 } from 'react-icons/lu';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdOutlineMoreTime } from 'react-icons/md';
import { HiMiniInboxArrowDown, HiOutlineInboxArrowDown } from 'react-icons/hi2';
import { GoBell } from 'react-icons/go';
import { getOverdueDays } from '../lib/date';
import React from 'react';

interface ActionBarProps {
  type: 'storage' | 'borrowed' | 'lent';
  accentColor: string;
  borrowedUntil?: string | null;
  isFavorite?: boolean;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  onExtend?: () => void;
  onReturn?: () => void;
  onRemind?: () => void; // for lent cards
  onMarkReturned?: () => void;
}

// Derive borrowed state: primary is Return unless overdue, then Extend becomes primary.
function getBorrowedPrimary(borrowedUntil?: string | null) {
  if (!borrowedUntil)
    return { label: 'Return', mode: 'return' as const, overdue: false };
  const overdue = getOverdueDays(borrowedUntil) > 0;
  if (overdue) return { label: 'Extend', mode: 'extend' as const, overdue };
  return { label: 'Return', mode: 'return' as const, overdue };
}

export default function ActionBar({
  type,
  // accentColor,
  borrowedUntil,
  isFavorite = false,
  onShare,
  onToggleFavorite,
  onExtend,
  onReturn,
  onRemind,
  onMarkReturned,
}: ActionBarProps) {
  // Decide primary action config
  let primaryLabel = '';
  let primaryIcon: React.ReactNode = null;
  let primaryHandler: (() => void) | undefined;

  const borrowedCfg =
    type === 'borrowed' ? getBorrowedPrimary(borrowedUntil) : null;

  if (type === 'storage') {
    primaryLabel = 'Share';
    primaryIcon = <LuShare2 size={16} />;
    primaryHandler = onShare;
  } else if (type === 'borrowed' && borrowedCfg) {
    primaryLabel = borrowedCfg.label;
    if (borrowedCfg.mode === 'extend') {
      primaryIcon = <MdOutlineMoreTime size={18} />;
      primaryHandler = onExtend;
    } else {
      primaryIcon = <HiMiniInboxArrowDown size={18} />;
      primaryHandler = onReturn;
    }
  } else if (type === 'lent') {
    primaryLabel = 'Mark Returned';
    primaryIcon = <HiOutlineInboxArrowDown size={18} />;
    primaryHandler = onMarkReturned;
  }

  // Secondary actions (no messaging system):
  // Borrowed: show Extend (if primary is Return) or Return (if primary is Extend)
  // Lent: show Remind bell + favorite
  const showBorrowedSecondary = type === 'borrowed' && borrowedCfg;
  const showLentRemind = type === 'lent';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        mt: 0.5,
      }}
      onClick={(e) => e.preventDefault()}
    >
      <Button
        size='small'
        startIcon={primaryIcon}
        disabled={!primaryHandler}
        aria-label={primaryLabel}
        onClick={(e) => {
          e.preventDefault();
          primaryHandler?.();
        }}
        sx={{
          flex: 1,
          bgcolor: '#1a2130',
          border: '1px solid #2a3144',
          color: '#e8efff',
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: '999px',
          px: 1.6,
          '&:hover': { bgcolor: '#20283a' },
          minHeight: 34,
        }}
      >
        {primaryLabel}
      </Button>

      {showBorrowedSecondary && (
        <Tooltip
          title={borrowedCfg?.mode === 'extend' ? 'Return item' : 'Extend time'}
        >
          <IconButton
            size='small'
            aria-label={
              borrowedCfg?.mode === 'extend' ? 'Return item' : 'Extend time'
            }
            onClick={(e) => {
              e.preventDefault();
              if (borrowedCfg?.mode === 'extend') {
                onReturn?.();
              } else {
                onExtend?.();
              }
            }}
            sx={{
              bgcolor: '#1a2130',
              border: '1px solid #2a3144',
              color: '#e8efff',
              width: 34,
              height: 34,
              '&:hover': { bgcolor: '#20283a' },
            }}
          >
            {borrowedCfg?.mode === 'extend' ? (
              <HiMiniInboxArrowDown size={17} />
            ) : (
              <MdOutlineMoreTime size={17} />
            )}
          </IconButton>
        </Tooltip>
      )}
      {showLentRemind && (
        <Tooltip title='Remind borrower'>
          <IconButton
            size='small'
            aria-label='Remind borrower'
            onClick={(e) => {
              e.preventDefault();
              onRemind?.();
            }}
            sx={{
              bgcolor: '#1a2130',
              border: '1px solid #2a3144',
              color: '#e8efff',
              width: 34,
              height: 34,
              '&:hover': { bgcolor: '#20283a' },
            }}
          >
            <GoBell size={16} />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title={isFavorite ? 'Unfavorite' : 'Favorite'}>
        <IconButton
          size='small'
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.();
          }}
          sx={{
            // Keep button neutral; color only the heart icon
            bgcolor: '#1a2130',
            border: '1px solid #2a3144',
            color: isFavorite ? '#ff5b73' : '#e8efff',
            width: 34,
            height: 34,
            '&:hover': { bgcolor: '#20283a' },
            transition: 'background-color .18s ease, color .18s ease',
          }}
        >
          {isFavorite ? (
            <AiFillHeart size={18} />
          ) : (
            <AiOutlineHeart size={18} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

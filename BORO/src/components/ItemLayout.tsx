import { useState } from 'react';
import { ACCENTS } from '../lib/accents';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import type { StorageItem } from '../types';
import { PiTimerBold, PiHandArrowDownLight } from 'react-icons/pi';
import { BiCategoryAlt } from 'react-icons/bi';
import { GrLocation } from 'react-icons/gr';
import { FiFileText } from 'react-icons/fi';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';

interface ItemLayoutProps {
  item: StorageItem;
  accentColor?: string;
  // viewer context flags - controls which actions are shown/enabled
  viewerIsOwner?: boolean;
  viewerIsBorrower?: boolean;
  onBorrow?: () => void;
  onRequest?: () => void;
  onReturn?: () => void;
  onExtend?: () => void;
  onRemind?: () => void;
}

export default function ItemLayout({ item, accentColor = ACCENTS.storage, viewerIsOwner = false, viewerIsBorrower = false, onBorrow, onRequest, onReturn, onExtend, onRemind }: ItemLayoutProps) {
  const [idx, setIdx] = useState(0);
  const images = item.imageUrls || [];
  // card accent reflects the semantic of the card: storage / borrowed / lent
  const cardAccent = item.status === 'borrowed' ? (viewerIsOwner ? ACCENTS.lent : ACCENTS.borrowed) : (accentColor || ACCENTS.storage);

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 3 }}>
      <Box sx={{ width: 1000, maxWidth: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '480px 1fr' }, gap: 3, px: 2 }}>
        {/* Left: media */}
        <Box>
          <Box sx={{ borderRadius: '18px', overflow: 'hidden', background: '#0b0f16', border: '1px solid #23293a' }}>
            {images && images.length > 0 ? (
              <Box component='img' src={images[idx]} alt={item.title} sx={{ width: '100%', height: { xs: 320, md: 420 }, objectFit: 'cover', display: 'block' }} />
            ) : (
              <Box sx={{ width: '100%', height: { xs: 320, md: 420 }, display: 'grid', placeItems: 'center', color: '#9ea9bf' }}>
                <Typography variant='h6' sx={{ color: '#9ea9bf' }}>No image</Typography>
              </Box>
            )}
          </Box>
          {/* Thumbnails */}
          {images && images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto', py: 0.5 }}>
              {images.slice(0, 6).map((src, i) => (
                <Box
                  key={i}
                  onClick={() => setIdx(i)}
                  sx={{
                    flex: '0 0 auto',
                    cursor: 'pointer',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: idx === i ? `2px solid ${cardAccent}` : '1px solid #1e2433',
                  }}
                >
                  <Box component='img' src={src} alt={`thumb-${i}`} sx={{ width: 88, height: 64, objectFit: 'cover', display: 'block' }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Right: details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant='h5' sx={{ fontWeight: 800, color: '#e9eef7', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</Typography>
            </Box>
            <Chip
              icon={item.borrowMode === 'free' ? <TbLockOpen size={14} color={cardAccent} /> : <TbLock size={14} color={cardAccent} />}
              label={item.borrowMode === 'free' ? 'Grab' : 'Request'}
              size='small'
              sx={{ bgcolor: `${cardAccent}22`, color: cardAccent, border: `1px solid ${cardAccent}44`, fontWeight: 700 }}
            />
          </Box>

          {/* Owner placed under title */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar src={item.ownerPhotoURL || undefined} sx={{ bgcolor: '#2a3144', color: '#fff', width: 44, height: 44 }}>{item.ownerName ? item.ownerName.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : '?'}</Avatar>
            <Box>
              <Typography variant='body2' sx={{ fontWeight: 800, color: '#e9eef7' }}>{item.ownerName || 'Unknown'}</Typography>
              <Typography variant='caption' sx={{ color: '#9ea9bf' }}>Owner</Typography>
            </Box>
          </Box>

          {/* Meta rows similar to ActivityCard */}
            <Box sx={{ display: 'grid', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: cardAccent, display: 'flex', alignItems: 'center' }}><BiCategoryAlt /></Box>
              <Box>
                <Typography variant='caption' sx={{ color: '#7d8799', fontWeight: 500 }}>Category</Typography>
                <Typography variant='body2' sx={{ color: '#dfe6f3', fontWeight: 700 }}>{item.category || '—'}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: cardAccent, display: 'flex', alignItems: 'center' }}><GrLocation /></Box>
              <Box>
                <Typography variant='caption' sx={{ color: '#7d8799', fontWeight: 500 }}>Location</Typography>
                <Typography variant='body2' sx={{ color: '#dfe6f3', fontWeight: 700 }}>{item.location || '—'}</Typography>
              </Box>
            </Box>
            {item.note && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: cardAccent, display: 'flex', alignItems: 'center' }}><FiFileText /></Box>
                <Box>
                  <Typography variant='caption' sx={{ color: '#7d8799', fontWeight: 500 }}>Notes</Typography>
                  <Typography variant='body2' sx={{ color: '#dfe6f3', fontWeight: 700 }}>{item.note}</Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ borderColor: '#1e2433', my: 0.5 }} />

          <Box sx={{ flex: 1 }}>
            {item.description && item.description.trim() && item.description !== item.note && (
              <Typography variant='body1' sx={{ color: '#dfe6f3' }}>{item.description}</Typography>
            )}

            {/* Status / Due rows with ActivityCard-style accents */}
            <Box sx={{ mt: 0.5, display: 'grid', gap: 1 }}>
              {item.status === 'borrowed' && item.holderName && (
                (() => {
                  const label = viewerIsOwner ? `Lent to ${item.holderName}` : `Borrowed by ${item.holderName}`;
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: cardAccent, display: 'flex', alignItems: 'center' }}><PiHandArrowDownLight /></Box>
                      <Box>
                        <Typography variant='caption' sx={{ color: '#7d8799', fontWeight: 500 }}>Status</Typography>
                        <Typography variant='body2' sx={{ color: '#dfe6f3', fontWeight: 700 }}>{label}</Typography>
                      </Box>
                    </Box>
                  );
                })()
              )}
              {item.borrowedUntil && (
                (() => {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: cardAccent, display: 'flex', alignItems: 'center' }}><PiTimerBold /></Box>
                      <Box>
                        <Typography variant='caption' sx={{ color: '#7d8799', fontWeight: 500 }}>Due</Typography>
                        <Typography variant='body2' sx={{ color: '#dfe6f3', fontWeight: 700 }}>{new Date(item.borrowedUntil).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  );
                })()
              )}
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
            {/* Actions shown depending on viewer role */}
            {!viewerIsOwner && item.status === 'available' && item.borrowMode === 'free' && (
              <Button variant='contained' sx={{ bgcolor: cardAccent, color: '#0a0a0a', fontWeight: 800 }} onClick={onBorrow}>Borrow now</Button>
            )}
            {!viewerIsOwner && item.status === 'available' && item.borrowMode === 'request' && (
              <Button variant='contained' sx={{ bgcolor: cardAccent, color: '#0a0a0a', fontWeight: 800 }} onClick={onRequest}>Request borrow</Button>
            )}
            {viewerIsBorrower && item.status === 'borrowed' && (
              <>
                <Button variant='outlined' sx={{ border: `1px solid ${cardAccent}`, color: cardAccent, fontWeight: 800, boxSizing: 'border-box' }} onClick={onExtend}>Extend</Button>
                <Button variant='contained' sx={{ bgcolor: cardAccent, color: '#0a0a0a', fontWeight: 800 }} onClick={onReturn}>Return</Button>
              </>
            )}
            {viewerIsOwner && item.status === 'borrowed' && (
              <>
                <Button variant='outlined' sx={{ border: `1px solid ${cardAccent}`, color: cardAccent, fontWeight: 800, boxSizing: 'border-box' }} onClick={onRemind}>Remind</Button>
                <Button variant='contained' sx={{ bgcolor: cardAccent, color: '#0a0a0a', fontWeight: 800 }} onClick={onReturn}>Mark returned</Button>
              </>
            )}
            <Button
              variant='contained'
              component={RouterLink}
              to='/storage'
              sx={{
                // Match QuickAddCard "Add item" style: blue-cyan gradient
                background: 'linear-gradient(90deg,#6bd6ff,#7f8cff)',
                color: '#0d1117',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { filter: 'brightness(1.08)' },
              }}
            >
              Back to storage
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

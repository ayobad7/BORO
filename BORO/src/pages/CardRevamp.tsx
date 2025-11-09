import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { BiCategoryAlt } from 'react-icons/bi';
import { GrLocation } from 'react-icons/gr';
import { PiTimerBold, PiHandArrowDown, PiHandArrowUp } from 'react-icons/pi';
import { LuShare2 } from 'react-icons/lu';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { ACCENTS } from '../lib/accents';

export default function CardRevamp() {
  const tokens = {
    bg: '#0f1115',
    card: '#14171f',
    border: '#23293a',
    text: '#f0f4f9',
    subtext: '#7d8799',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: tokens.bg,
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', color: tokens.text }}>
        <Typography variant='h3' sx={{ fontWeight: 900, mb: 1 }}>
          Option A: Subtle Refinement
        </Typography>
        <Typography variant='body1' sx={{ color: tokens.subtext, mb: 4 }}>
          Side-by-side comparison: Current vs Revamped for all 3 card types
        </Typography>

        {/* STORAGE CARDS */}
        <Box sx={{ mb: 6 }}>
          <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, color: ACCENTS.storage }}>
            Storage Cards
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Current Storage */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#ffc36b' }}>
                ❌ Current
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '12px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                {/* Image */}
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box
                    sx={{
                      borderRadius: 'calc(var(--card-r) - var(--pad))',
                      overflow: 'hidden',
                      background: '#0b0f16',
                      aspectRatio: '16 / 12',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0.9, pb: 1.6, display: 'grid', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                    <Typography variant='subtitle2' fontWeight={800} sx={{ fontSize: 15, color: '#e9eef7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Camping Tent
                    </Typography>
                    <Box sx={{ px: 1.2, py: 0.5, bgcolor: `${ACCENTS.storage}33`, color: ACCENTS.storage, fontSize: 12, fontWeight: 500, borderRadius: '999px' }}>
                      Storage
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gap: 0.6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={13} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Outdoor</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={13} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Garage</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TbLockOpen size={13} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Mode</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Free</Typography>
                    </Box>
                  </Box>

                  {/* Empty space - no actions */}
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><LuShare2 size={18} /></Button>
                    <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><AiOutlineHeart size={18} /></Button>
                    {/* Empty space where buttons would be */}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Revamped Storage */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: ACCENTS.storage }}>
                ✨ Revamped (Option A)
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '14px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                {/* Image */}
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box
                    sx={{
                      borderRadius: 'calc(var(--card-r) - var(--pad))',
                      overflow: 'hidden',
                      background: '#0b0f16',
                      aspectRatio: '16 / 12',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0, pb: 1.75, display: 'grid', gap: 1 }}>
                  {/* Title + Share/Favorite */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='h6' sx={{ fontSize: 17, fontWeight: 800, color: '#f0f4f9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                      Camping Tent
                    </Typography>
                    <LuShare2 size={18} color='#8ca2ba' style={{ cursor: 'pointer' }} />
                    <AiFillHeart size={18} color='#ff7a9e' style={{ cursor: 'pointer' }} />
                  </Box>

                  {/* Status Badges */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Chip
                      label='Storage'
                      size='small'
                      sx={{
                        height: 20,
                        bgcolor: `${ACCENTS.storage}22`,
                        color: ACCENTS.storage,
                        border: `1px solid ${ACCENTS.storage}44`,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        '& .MuiChip-label': { px: 0.9 },
                      }}
                    />
                    <Chip
                      icon={<TbLockOpen size={11} />}
                      label='Free Borrow'
                      size='small'
                      sx={{
                        height: 20,
                        bgcolor: `${ACCENTS.storage}22`,
                        color: ACCENTS.storage,
                        border: `1px solid ${ACCENTS.storage}44`,
                        fontSize: 10,
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 0.9 },
                        '& .MuiChip-icon': { color: ACCENTS.storage, marginLeft: '5px' },
                      }}
                    />
                  </Box>

                  {/* Metadata */}
                  <Box sx={{ display: 'grid', gap: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={14} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Outdoor</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={14} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Garage</Typography>
                    </Box>
                  </Box>

                  {/* Bottom info - Added date + Availability */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, pt: 1, borderTop: '1px solid #1e2433' }}>
                    <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11 }}>
                      Added 2 weeks ago
                    </Typography>
                    <Typography variant='caption' sx={{ color: ACCENTS.storage, fontSize: 11, fontWeight: 700 }}>
                      Available
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Revamped Storage (Lent Out) */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: ACCENTS.storage }}>
                ✨ Storage (Currently Lent)
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '14px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box sx={{ borderRadius: 'calc(var(--card-r) - var(--pad))', overflow: 'hidden', background: '#0b0f16', aspectRatio: '16 / 12', display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0, pb: 1.75, display: 'grid', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='h6' sx={{ fontSize: 17, fontWeight: 800, color: '#f0f4f9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                      Projector
                    </Typography>
                    <LuShare2 size={18} color='#8ca2ba' style={{ cursor: 'pointer' }} />
                    <AiOutlineHeart size={18} color='#8ca2ba' style={{ cursor: 'pointer' }} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Chip label='Storage' size='small' sx={{ height: 20, bgcolor: `${ACCENTS.storage}22`, color: ACCENTS.storage, border: `1px solid ${ACCENTS.storage}44`, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', '& .MuiChip-label': { px: 0.9 } }} />
                    <Chip label='Lent to Mike' size='small' sx={{ height: 20, bgcolor: `${ACCENTS.lent}22`, color: ACCENTS.lent, border: `1px solid ${ACCENTS.lent}44`, fontSize: 10, fontWeight: 700, '& .MuiChip-label': { px: 0.9 } }} />
                  </Box>

                  <Box sx={{ display: 'grid', gap: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={14} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Electronics</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={14} color={ACCENTS.storage} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Office</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, pt: 1, borderTop: '1px solid #1e2433' }}>
                    <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11 }}>
                      Added 3 months ago
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#ffd06b', fontSize: 11, fontWeight: 700 }}>
                      Due in 2d
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* BORROWED CARDS */}
        <Box sx={{ mb: 6 }}>
          <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, color: ACCENTS.borrowed }}>
            Borrowed Cards
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Current Borrowed */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#ffc36b' }}>
                ❌ Current
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '12px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box sx={{ borderRadius: 'calc(var(--card-r) - var(--pad))', overflow: 'hidden', background: '#0b0f16', aspectRatio: '16 / 12', display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0.9, pb: 1.6, display: 'grid', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                    <Typography variant='subtitle2' fontWeight={800} sx={{ fontSize: 15, color: '#e9eef7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      PlayStation 5 Controller
                    </Typography>
                    <Box sx={{ px: 1.2, py: 0.5, bgcolor: `${ACCENTS.borrowed}33`, color: ACCENTS.borrowed, fontSize: 12, fontWeight: 500, borderRadius: '999px' }}>
                      Borrowed
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gap: 0.6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={13} color={ACCENTS.borrowed} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Gaming</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={13} color={ACCENTS.borrowed} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Living Room</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PiHandArrowDown size={13} color={ACCENTS.borrowed} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Lender</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Alex Chen</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PiTimerBold size={13} color='#ffd06b' />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Due</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#ffd06b', fontSize: 12, fontWeight: 700 }}>2d left</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><LuShare2 size={18} /></Button>
                    <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><AiOutlineHeart size={18} /></Button>
                    <Box sx={{ flex: 1 }} />
                    <Button variant='outlined' size='small' sx={{ borderColor: '#2a3144', color: ACCENTS.borrowed, fontSize: 12, fontWeight: 700 }}>Extend</Button>
                    <Button variant='contained' size='small' sx={{ bgcolor: ACCENTS.borrowed, color: '#0a0a0a', fontSize: 12, fontWeight: 700 }}>Return</Button>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pb: 1 }}>
                  <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                    <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b' }} />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Revamped Borrowed */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: ACCENTS.borrowed }}>
                ✨ Revamped (Option A)
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '14px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box sx={{ borderRadius: 'calc(var(--card-r) - var(--pad))', overflow: 'hidden', background: '#0b0f16', aspectRatio: '16 / 12', display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0, pb: 1.75, display: 'grid', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='h6' sx={{ fontSize: 17, fontWeight: 800, color: '#f0f4f9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                      PlayStation 5 Controller
                    </Typography>
                    <LuShare2 size={18} color='#8ca2ba' style={{ cursor: 'pointer' }} />
                    <AiFillHeart size={18} color='#ff7a9e' style={{ cursor: 'pointer' }} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Chip label='Borrowed' size='small' sx={{ height: 20, bgcolor: `${ACCENTS.borrowed}22`, color: ACCENTS.borrowed, border: `1px solid ${ACCENTS.borrowed}44`, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', '& .MuiChip-label': { px: 0.9 } }} />
                    <Chip icon={<PiTimerBold size={11} />} label='2d left' size='small' sx={{ height: 20, bgcolor: '#ffd06b22', color: '#ffd06b', border: '1px solid #ffd06b44', fontSize: 10, fontWeight: 700, '& .MuiChip-label': { px: 0.9 }, '& .MuiChip-icon': { color: '#ffd06b', marginLeft: '5px' } }} />
                  </Box>

                  <Box sx={{ display: 'grid', gap: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={14} color={ACCENTS.borrowed} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Gaming</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={14} color={ACCENTS.borrowed} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Living Room</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PiHandArrowDown size={14} color={ACCENTS.borrowed} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Lender</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Alex Chen</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 0.25 }}>
                    <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                      <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b', borderRadius: 999 }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.75, mt: 0.25 }}>
                    <Button variant='outlined' size='small' sx={{ borderColor: '#2a3144', color: ACCENTS.borrowed, fontSize: 12, fontWeight: 700, textTransform: 'none', flex: 1 }}>Extend</Button>
                    <Button variant='contained' size='small' sx={{ bgcolor: ACCENTS.borrowed, color: '#0a0a0a', fontSize: 12, fontWeight: 800, textTransform: 'none', flex: 1 }}>Return</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* LENT CARDS */}
        <Box sx={{ mb: 6 }}>
          <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, color: ACCENTS.lent }}>
            Lent Cards
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Current Lent */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#ffc36b' }}>
                ❌ Current
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '12px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box sx={{ borderRadius: 'calc(var(--card-r) - var(--pad))', overflow: 'hidden', background: '#0b0f16', aspectRatio: '16 / 12', display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0.9, pb: 1.6, display: 'grid', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                    <Typography variant='subtitle2' fontWeight={800} sx={{ fontSize: 15, color: '#e9eef7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Camping Tent
                    </Typography>
                    <Box sx={{ px: 1.2, py: 0.5, bgcolor: `${ACCENTS.lent}33`, color: ACCENTS.lent, fontSize: 12, fontWeight: 500, borderRadius: '999px' }}>
                      Lent
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gap: 0.6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={13} color={ACCENTS.lent} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Outdoor</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={13} color={ACCENTS.lent} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Garage</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PiHandArrowUp size={13} color={ACCENTS.lent} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Borrower</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>Sarah Kim</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PiTimerBold size={13} color='#8be36a' />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Return</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#8be36a', fontSize: 12, fontWeight: 700 }}>in 5d</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><LuShare2 size={18} /></Button>
                    <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><AiOutlineHeart size={18} /></Button>
                    <Box sx={{ flex: 1 }} />
                    <Button variant='outlined' size='small' sx={{ borderColor: '#2a3144', color: ACCENTS.lent, fontSize: 12, fontWeight: 700 }}>Remind</Button>
                    <Button variant='contained' size='small' sx={{ bgcolor: ACCENTS.lent, color: '#0a0a0a', fontSize: 12, fontWeight: 700 }}>Returned</Button>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pb: 1 }}>
                  <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                    <Box sx={{ width: '40%', height: '100%', bgcolor: '#8be36a' }} />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Revamped Lent */}
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: ACCENTS.lent }}>
                ✨ Revamped (Option A)
              </Typography>
              <Box
                sx={{
                  '--card-r': '20px',
                  '--pad': '14px',
                  width: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , ${tokens.card}`,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 'var(--pad)' }}>
                  <Box sx={{ borderRadius: 'calc(var(--card-r) - var(--pad))', overflow: 'hidden', background: '#0b0f16', aspectRatio: '16 / 12', display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 'var(--pad)', pt: 0, pb: 1.75, display: 'grid', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='h6' sx={{ fontSize: 17, fontWeight: 800, color: '#f0f4f9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                      Camping Tent
                    </Typography>
                    <LuShare2 size={18} color='#8ca2ba' style={{ cursor: 'pointer' }} />
                    <AiFillHeart size={18} color='#ff7a9e' style={{ cursor: 'pointer' }} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Chip label='Lent' size='small' sx={{ height: 20, bgcolor: `${ACCENTS.lent}22`, color: ACCENTS.lent, border: `1px solid ${ACCENTS.lent}44`, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', '& .MuiChip-label': { px: 0.9 } }} />
                    <Chip icon={<PiTimerBold size={11} />} label='in 5d' size='small' sx={{ height: 20, bgcolor: `${ACCENTS.lent}22`, color: ACCENTS.lent, border: `1px solid ${ACCENTS.lent}44`, fontSize: 10, fontWeight: 700, '& .MuiChip-label': { px: 0.9 }, '& .MuiChip-icon': { color: ACCENTS.lent, marginLeft: '5px' } }} />
                  </Box>

                  <Box sx={{ display: 'grid', gap: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BiCategoryAlt size={14} color={ACCENTS.lent} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Category</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Outdoor</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GrLocation size={14} color={ACCENTS.lent} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Location</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Garage</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PiHandArrowUp size={14} color={ACCENTS.lent} />
                      <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>Borrower</Typography>
                      <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>Sarah Kim</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 0.25 }}>
                    <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                      <Box sx={{ width: '40%', height: '100%', bgcolor: '#8be36a', borderRadius: 999 }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.75, mt: 0.25 }}>
                    <Button variant='outlined' size='small' sx={{ borderColor: '#2a3144', color: ACCENTS.lent, fontSize: 12, fontWeight: 700, textTransform: 'none', flex: 1 }}>Remind</Button>
                    <Button variant='contained' size='small' sx={{ bgcolor: ACCENTS.lent, color: '#0a0a0a', fontSize: 12, fontWeight: 800, textTransform: 'none', flex: 1 }}>Returned</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Summary */}
        <Box sx={{ p: 3, bgcolor: '#0f1218', border: '1px solid #1e2433', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: 800, mb: 2 }}>
            ✨ Option A Changes Summary
          </Typography>
          <Box component='ul' sx={{ m: 0, pl: 2.5, color: '#a8b5c7', '& li': { mb: 0.75, fontSize: 14, lineHeight: 1.6 } }}>
            <li><strong style={{ color: '#e8eef7' }}>Padding:</strong> 12px → 14px (more breathing room)</li>
            <li><strong style={{ color: '#e8eef7' }}>Title:</strong> 15px → 17px with 800 weight (better hierarchy)</li>
            <li><strong style={{ color: '#e8eef7' }}>Icons:</strong> Share & heart moved to title row (saves space)</li>
            <li><strong style={{ color: '#e8eef7' }}>Status badges:</strong> Type & due date as chips at top</li>
            <li><strong style={{ color: '#e8eef7' }}>Metadata icons:</strong> 13px → 14px (slightly larger)</li>
            <li><strong style={{ color: '#e8eef7' }}>Values:</strong> Font weight 600 → 700 (bolder)</li>
            <li><strong style={{ color: '#e8eef7' }}>Storage cards:</strong> Borrow mode badge + availability status + added date at bottom</li>
            <li><strong style={{ color: '#e8eef7' }}>Action buttons:</strong> Full width (flex: 1) with textTransform: 'none'</li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

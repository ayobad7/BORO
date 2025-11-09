import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { PiTimerBold, PiHandArrowDown } from 'react-icons/pi';
import { LuShare2 } from 'react-icons/lu';
import { GrFavorite } from 'react-icons/gr';
import { CgAdd } from 'react-icons/cg';
import { BiCategoryAlt } from 'react-icons/bi';
import { GrLocation } from 'react-icons/gr';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import NotchCard from '../components/NotchCard';
import { ACCENTS } from '../lib/accents';

export default function Style() {
  // Quick local tokens based on the provided screenshot (approximate)
  const tokens = {
    bg: '#0F0F10', // page background
    surface: '#151617', // generic surface
    card: '#101112', // card bg
    border: '#2A2D33',
    text: '#F3F4F6',
    subtext: '#9CA3AF',
    primary: '#B6FF1A', // neon lime (estimated)
    primaryHover: '#A3F114',
    secondary: '#8CFF5A', // softer lime for secondary
    tertiary: '#2B2F36', // neutral pill
  } as const;

  const swatches: Array<{ name: string; hex: string }> = [
    { name: 'Primary (neon lime)', hex: tokens.primary },
    { name: 'Secondary (soft lime)', hex: tokens.secondary },
    { name: 'Surface', hex: tokens.surface },
    { name: 'Card', hex: tokens.card },
    { name: 'Border', hex: tokens.border },
    { name: 'Text', hex: tokens.text },
    { name: 'Subtext', hex: tokens.subtext },
  ];

  // Pastel chip palette (approximate)
  const pastelChips: Array<{ name: string; hex: string }> = [
    { name: 'Rose', hex: '#FF86A5' },
    { name: 'Pink', hex: '#FF9ECF' },
    { name: 'Magenta', hex: '#FF7AD9' },
    { name: 'Red', hex: '#FF8A8A' },
    { name: 'Orange', hex: '#FFB37A' },
    { name: 'Amber', hex: '#FFD27A' },
    { name: 'Yellow', hex: '#FFF07A' },
    { name: 'Lime', hex: '#C9FF7A' },
    { name: 'Green', hex: '#7AFFB0' },
    { name: 'Mint', hex: '#A7FFCF' },
    { name: 'Teal', hex: '#7AFFDA' },
    { name: 'Cyan', hex: '#7AE8FF' },
    { name: 'Sky', hex: '#7AC6FF' },
    { name: 'Blue', hex: '#8AA8FF' },
    { name: 'Indigo', hex: '#A08AFF' },
    { name: 'Violet', hex: '#C38AFF' },
    { name: 'Purple', hex: '#DF8AFF' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: tokens.bg,
        display: 'grid',
        placeItems: 'center',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 980, color: tokens.text }}>
        {/* Buttons preview */}
        <Typography variant='h4' sx={{ fontWeight: 800, mb: 2 }}>
          Style Preview
        </Typography>
        <Stack direction='row' spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant='contained'
            startIcon={<CgAdd size={18} />}
            sx={{
              bgcolor: tokens.primary,
              color: '#0A0A0A',
              borderRadius: 9999,
              fontWeight: 700,
              '&:hover': { bgcolor: tokens.primaryHover },
            }}
          >
            Add Item
          </Button>
          <Button
            variant='outlined'
            sx={{
              borderColor: tokens.primary,
              color: tokens.primary,
              borderRadius: 9999,
              fontWeight: 700,
              '&:hover': {
                borderColor: tokens.primaryHover,
                bgcolor: 'rgba(182,255,26,0.1)',
              },
            }}
          >
            Secondary
          </Button>
          <Button
            variant='contained'
            sx={{
              bgcolor: tokens.tertiary,
              color: tokens.text,
              borderRadius: 9999,
              fontWeight: 700,
              '&:hover': { bgcolor: '#353A42' },
            }}
          >
            Tertiary
          </Button>
          <Button
            variant='contained'
            startIcon={<PiTimerBold size={16} />}
            sx={{
              bgcolor: 'rgba(182,255,26,0.12)',
              color: tokens.primary,
              borderRadius: 9999,
              fontWeight: 800,
              '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
            }}
          >
            Quaternary (Chip-like)
          </Button>
          <Chip
            icon={<PiTimerBold size={16} />}
            label='7 days left'
            sx={{
              bgcolor: 'rgba(182,255,26,0.12)',
              color: tokens.primary,
              borderRadius: '9999px',
              fontWeight: 800,
              '& .MuiChip-icon': { color: tokens.primary },
            }}
          />
        </Stack>

        {/* Soft gradient buttons (like reference) */}
        <Typography variant='h6' sx={{ fontWeight: 800, mb: 1.5 }}>
          Soft gradient buttons
        </Typography>
        <Stack direction='row' spacing={1.25} sx={{ mb: 3, flexWrap: 'wrap' }}>
          <Button
            disableElevation
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 9999,
              px: 2.2,
              py: 0.9,
              color: '#0a2e25',
              position: 'relative',
              background: 'linear-gradient(180deg, #CFF7E9 0%, #9EECD8 100%)',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              '&:hover': {
                filter: 'brightness(1.04)',
                boxShadow: '0 8px 22px rgba(0,0,0,0.16)',
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 40%)',
                pointerEvents: 'none',
              },
            }}
          >
            Mint
          </Button>

          <Button
            disableElevation
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 9999,
              px: 2.2,
              py: 0.9,
              color: '#0b2740',
              position: 'relative',
              background: 'linear-gradient(180deg, #D9ECFF 0%, #B7D7FF 100%)',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              '&:hover': {
                filter: 'brightness(1.04)',
                boxShadow: '0 8px 22px rgba(0,0,0,0.16)',
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 40%)',
                pointerEvents: 'none',
              },
            }}
          >
            Sky
          </Button>

          <Button
            disableElevation
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 9999,
              px: 2.2,
              py: 0.9,
              color: '#4a1330',
              position: 'relative',
              background: 'linear-gradient(180deg, #FFE1F0 0%, #FFC1E1 100%)',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              '&:hover': {
                filter: 'brightness(1.04)',
                boxShadow: '0 8px 22px rgba(0,0,0,0.16)',
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 40%)',
                pointerEvents: 'none',
              },
            }}
          >
            Rose
          </Button>
        </Stack>

        <Divider sx={{ borderColor: tokens.border, my: 3 }} />

        {/* Card preview */}
        <Card
          sx={{
            backgroundColor: tokens.card,
            border: `1px solid ${tokens.border}`,
            borderRadius: 3,
            p: 3,
            boxShadow: 'none',
            color: tokens.text,
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800, fontSize: 22 }}>
            Card Title
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: tokens.subtext, mb: 2, fontSize: 14 }}
          >
            Subtitle and helper text go here. This demonstrates contrast and
            spacing.
          </Typography>
          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              sx={{
                bgcolor: tokens.primary,
                color: '#0A0A0A',
                '&:hover': { bgcolor: tokens.primaryHover },
              }}
            >
              Manage
            </Button>
            <Button
              variant='outlined'
              sx={{
                borderColor: tokens.primary,
                color: tokens.primary,
                '&:hover': {
                  borderColor: tokens.primaryHover,
                  bgcolor: 'rgba(182,255,26,0.08)',
                },
              }}
            >
              Details
            </Button>
          </Stack>
        </Card>

        {/* Borderless card preview */}
        <Card
          sx={{
            backgroundColor: tokens.card,
            border: 'none',
            borderRadius: 3,
            p: 3,
            boxShadow: 'none',
            color: tokens.text,
            mt: 2,
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800, fontSize: 22 }}>
            Borderless Card
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: tokens.subtext, mb: 2, fontSize: 14 }}
          >
            Same content and spacing, but without an outline to compare
            elevation/contrast.
          </Typography>
          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              sx={{
                bgcolor: tokens.primary,
                color: '#0A0A0A',
                '&:hover': { bgcolor: tokens.primaryHover },
              }}
            >
              Manage
            </Button>
            <Button
              variant='outlined'
              sx={{
                borderColor: tokens.primary,
                color: tokens.primary,
                '&:hover': {
                  borderColor: tokens.primaryHover,
                  bgcolor: 'rgba(182,255,26,0.08)',
                },
              }}
            >
              Details
            </Button>
          </Stack>
        </Card>

        {/* Borrowed actions preview */}
        <Box sx={{ mt: 3 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
            Borrowed Actions (Preview)
          </Typography>
          <Stack direction='row' spacing={1.5}>
            <Button
              variant='outlined'
              sx={{
                borderColor: tokens.primary,
                color: tokens.primary,
                '&:hover': {
                  borderColor: tokens.primaryHover,
                  bgcolor: 'rgba(182,255,26,0.08)',
                },
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Extend
            </Button>
            <Button
              variant='contained'
              sx={{
                bgcolor: tokens.primary,
                color: '#0A0A0A',
                '&:hover': { bgcolor: tokens.primaryHover },
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Return
            </Button>
          </Stack>
        </Box>

        {/* Storage card sample */}
        <Box sx={{ mt: 3 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
            Storage Card (Preview)
          </Typography>
          <Card
            sx={{
              backgroundColor: tokens.card,
              border: 'none',
              borderRadius: 3,
              p: 2,
              boxShadow: 'none',
              color: tokens.text,
              maxWidth: 320,
            }}
          >
            <Box sx={{ p: 1.5 }}>
              <Box
                sx={{
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 1.2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    bgcolor: '#424242',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ px: 1.5, pb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 0.75 }}>
                Sample Item Title
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
              >
                <Typography sx={{ color: tokens.subtext, fontSize: 14 }}>
                  Category • Location • Owner
                </Typography>
              </Box>
              <Stack
                direction='row'
                spacing={1}
                sx={{ justifyContent: 'flex-end', mb: 1 }}
              >
                <Button
                  startIcon={<LuShare2 size={16} />}
                  sx={{
                    bgcolor: 'rgba(182,255,26,0.12)',
                    color: tokens.primary,
                    borderRadius: 9999,
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 1.5,
                    '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
                  }}
                >
                  Share
                </Button>
                <Button
                  startIcon={<GrFavorite size={16} />}
                  sx={{
                    bgcolor: 'rgba(182,255,26,0.12)',
                    color: tokens.primary,
                    borderRadius: 9999,
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 1.5,
                    '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
                  }}
                >
                  Favorite
                </Button>
              </Stack>
              <Button
                fullWidth
                variant='contained'
                sx={{
                  bgcolor: tokens.primary,
                  color: '#0A0A0A',
                  '&:hover': { bgcolor: tokens.primaryHover },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 800,
                }}
              >
                Add to
              </Button>
            </Box>
          </Card>

          {/* Outlined storage card with page background */}
          <Typography
            variant='body2'
            sx={{ color: tokens.subtext, mt: 2, mb: 1 }}
          >
            Outlined Storage Card (Page BG #0f0f10)
          </Typography>
          <Card
            sx={{
              backgroundColor: '#0f0f10',
              background: '#0f0f10',
              backgroundImage: 'none',
              border: `1px solid ${tokens.border}`,
              borderRadius: 3,
              p: 2,
              boxShadow: 'none',
              color: tokens.text,
              maxWidth: 320,
              mt: 2,
            }}
          >
            <Box sx={{ p: 1.5 }}>
              <Box
                sx={{
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 1.2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    bgcolor: '#424242',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ px: 1.5, pb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 0.75 }}>
                Outlined Storage Card
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
              >
                <Typography sx={{ color: tokens.subtext, fontSize: 14 }}>
                  Category • Location • Owner
                </Typography>
              </Box>
              <Stack
                direction='row'
                spacing={1}
                sx={{ justifyContent: 'flex-end', mb: 1 }}
              >
                <Button
                  startIcon={<LuShare2 size={16} />}
                  sx={{
                    bgcolor: 'rgba(182,255,26,0.12)',
                    color: tokens.primary,
                    borderRadius: 9999,
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 1.5,
                    '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
                  }}
                >
                  Share
                </Button>
                <Button
                  startIcon={<GrFavorite size={16} />}
                  sx={{
                    bgcolor: 'rgba(182,255,26,0.12)',
                    color: tokens.primary,
                    borderRadius: 9999,
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 1.5,
                    '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
                  }}
                >
                  Favorite
                </Button>
              </Stack>
              <Button
                fullWidth
                variant='contained'
                sx={{
                  bgcolor: tokens.primary,
                  color: '#0A0A0A',
                  '&:hover': { bgcolor: tokens.primaryHover },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 800,
                }}
              >
                Add to
              </Button>
            </Box>
          </Card>

          {/* Proportional NotchCard preview */}
          <Typography
            variant='body2'
            sx={{ color: tokens.subtext, mt: 3, mb: 1 }}
          >
            Notched Storage Card (Proportional SVG clipPath)
          </Typography>
          <Box sx={{ width: 320 }}>
            <NotchCard
              accentColor={tokens.primary}
              borderColor={tokens.border}
              sx={{ color: tokens.text }}
            >
              <Box sx={{ p: 1.5 }}>
                <Box
                  sx={{
                    border: `1px solid ${tokens.border}`,
                    borderRadius: 1.2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      bgcolor: '#424242',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ px: 1.5, pb: 1.75 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 0.75 }}>
                  Notched Card Title
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: tokens.subtext, mb: 1, fontSize: 14 }}
                >
                  Category • Location • Mode
                </Typography>
                <Stack
                  direction='row'
                  spacing={1}
                  sx={{ justifyContent: 'flex-end', mb: 1 }}
                >
                  <Button
                    startIcon={<LuShare2 size={16} />}
                    sx={{
                      bgcolor: 'rgba(182,255,26,0.12)',
                      color: tokens.primary,
                      borderRadius: 9999,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 1.5,
                      '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    startIcon={<GrFavorite size={16} />}
                    sx={{
                      bgcolor: 'rgba(182,255,26,0.12)',
                      color: tokens.primary,
                      borderRadius: 9999,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 1.5,
                      '&:hover': { bgcolor: 'rgba(182,255,26,0.18)' },
                    }}
                  >
                    Favorite
                  </Button>
                </Stack>
                <Button
                  fullWidth
                  variant='contained'
                  sx={{
                    bgcolor: tokens.primary,
                    color: '#0A0A0A',
                    '&:hover': { bgcolor: tokens.primaryHover },
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 800,
                  }}
                >
                  Add to
                </Button>
              </Box>
            </NotchCard>
          </Box>
        </Box>

        <Divider sx={{ borderColor: tokens.border, my: 3 }} />

        {/* Palette */}
        <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
          Estimated palette from screenshot
        </Typography>
        <Stack direction='row' spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          {swatches.map((s) => (
            <Box
              key={s.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                pr: 1.5,
                border: `1px solid ${tokens.border}`,
                borderRadius: 2,
                background: tokens.surface,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: 1,
                  bgcolor: s.hex,
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
              <Typography variant='body2' sx={{ color: tokens.subtext }}>
                {s.name}: <span style={{ color: tokens.text }}>{s.hex}</span>
              </Typography>
            </Box>
          ))}
        </Stack>

        <Typography
          variant='caption'
          sx={{ color: tokens.subtext, mt: 1, display: 'block' }}
        >
          Notes: colors are best-effort approximations. If you want exact
          values, sample them with your hex picker and I’ll wire them into the
          palette.
        </Typography>

        {/* Pastel Chips */}
        <Divider sx={{ borderColor: tokens.border, my: 3 }} />
        <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
          Pastel Chips
        </Typography>
        <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {pastelChips.map((c) => (
            <Chip
              key={c.name}
              label={c.name}
              sx={{
                bgcolor: '#0a1020',
                color: c.hex,
                border: `1px solid ${c.hex}55`,
                borderRadius: '9999px',
                height: 32,
                '& .MuiChip-label': {
                  px: 1.25,
                  fontWeight: 700,
                },
                '&:hover': { bgcolor: '#0c1426' },
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ borderColor: tokens.border, my: 4 }} />

        {/* REVAMPED CARD SHOWCASE - Option B */}
        <Typography variant='h4' sx={{ fontWeight: 800, mb: 1 }}>
          Card Revamp Comparison
        </Typography>
        <Typography variant='body2' sx={{ color: tokens.subtext, mb: 3 }}>
          Comparing current design with 3 revamp options (A: Subtle, B: Moderate, C: Full Redesign)
        </Typography>

        <Box sx={{ display: 'grid', gap: 4 }}>
          {/* CURRENT vs OPTION A */}
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, color: '#7bdcff' }}>
              Option A: Subtle Refinement (30 min)
            </Typography>
            <Typography variant='body2' sx={{ color: tokens.subtext, mb: 2 }}>
              Quick wins: Better spacing, icons for metadata, bolder titles, status badges
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* CURRENT CARD */}
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#ffc36b' }}>
                  ❌ Current Design
                </Typography>
                <Box
                  sx={{
                    '--card-r': '20px',
                    '--pad': '12px',
                    display: 'block',
                    width: 320,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
                    border: '1px solid #23293a',
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

                  {/* Content */}
                  <Box sx={{ px: 'var(--pad)', pt: 0.9, pb: 1.6, display: 'grid', gap: 0.75 }}>
                    {/* Title + Type */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                      <Typography
                        variant='subtitle2'
                        fontWeight={800}
                        sx={{
                          fontSize: 15,
                          color: '#e9eef7',
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        PlayStation 5 Controller
                      </Typography>
                      <Box
                        sx={{
                          px: 1.2,
                          py: 0.5,
                          bgcolor: `${ACCENTS.borrowed}33`,
                          color: ACCENTS.borrowed,
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: '999px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Borrowed
                      </Box>
                    </Box>

                    {/* Metadata */}
                    <Box sx={{ display: 'grid', gap: 0.6 }}>
                      {/* Category */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BiCategoryAlt size={13} color={ACCENTS.borrowed} />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Category
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>
                          Gaming
                        </Typography>
                      </Box>
                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GrLocation size={13} color={ACCENTS.borrowed} />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Location
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>
                          Living Room
                        </Typography>
                      </Box>
                      {/* Lender */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PiHandArrowDown size={13} color={ACCENTS.borrowed} />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Lender
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>
                          Alex Chen
                        </Typography>
                      </Box>
                      {/* Due */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PiTimerBold size={13} color='#ffd06b' />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Due
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#ffd06b', fontSize: 12, fontWeight: 700 }}>
                          2d left
                        </Typography>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><LuShare2 size={18} /></Button>
                      <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><AiOutlineHeart size={18} /></Button>
                      <Box sx={{ flex: 1 }} />
                      <Button variant='outlined' size='small' sx={{ borderColor: '#2a3144', color: ACCENTS.borrowed, fontSize: 12, fontWeight: 700 }}>Extend</Button>
                      <Button variant='contained' size='small' sx={{ bgcolor: ACCENTS.borrowed, color: '#0a0a0a', fontSize: 12, fontWeight: 700 }}>Return</Button>
                    </Box>
                  </Box>

                  {/* Progress bar */}
                  <Box sx={{ px: 'var(--pad)', pb: 1 }}>
                    <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                      <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* OPTION A */}
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#7bdcff' }}>
                  ✨ Option A: Subtle Refinement
                </Typography>
                <Box
                  sx={{
                    '--card-r': '20px',
                    '--pad': '14px',
                    display: 'block',
                    width: 320,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
                    border: '1px solid #23293a',
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

                  {/* Content */}
                  <Box sx={{ px: 'var(--pad)', pt: 0, pb: 1.75, display: 'grid', gap: 1 }}>
                    {/* Title + Favorite */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='h6'
                        sx={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: '#f0f4f9',
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.3,
                        }}
                      >
                        PlayStation 5 Controller
                      </Typography>
                      <AiFillHeart size={18} color='#ff7a9e' />
                    </Box>

                    {/* Status Badges */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                      <Chip
                        label='Borrowed'
                        size='small'
                        sx={{
                          height: 20,
                          bgcolor: `${ACCENTS.borrowed}22`,
                          color: ACCENTS.borrowed,
                          border: `1px solid ${ACCENTS.borrowed}44`,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          '& .MuiChip-label': { px: 0.9 },
                        }}
                      />
                      <Chip
                        icon={<PiTimerBold size={11} />}
                        label='2d left'
                        size='small'
                        sx={{
                          height: 20,
                          bgcolor: '#ffd06b22',
                          color: '#ffd06b',
                          border: '1px solid #ffd06b44',
                          fontSize: 10,
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.9 },
                          '& .MuiChip-icon': { color: '#ffd06b', marginLeft: '5px' },
                        }}
                      />
                    </Box>

                    {/* Metadata - with icons */}
                    <Box sx={{ display: 'grid', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BiCategoryAlt size={14} color={ACCENTS.borrowed} />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Category
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>
                          Gaming
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GrLocation size={14} color={ACCENTS.borrowed} />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Location
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>
                          Living Room
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PiHandArrowDown size={14} color={ACCENTS.borrowed} />
                        <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                          Lender
                        </Typography>
                        <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 700 }}>
                          Alex Chen
                        </Typography>
                      </Box>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mt: 0.25 }}>
                      <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                        <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b', borderRadius: 999 }} />
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 0.75, mt: 0.25 }}>
                      <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><LuShare2 size={18} /></Button>
                      <Box sx={{ flex: 1 }} />
                      <Button 
                        variant='outlined' 
                        size='small' 
                        sx={{ 
                          borderColor: '#2a3144', 
                          color: ACCENTS.borrowed, 
                          fontSize: 12, 
                          fontWeight: 700,
                          textTransform: 'none',
                        }}
                      >
                        Extend
                      </Button>
                      <Button 
                        variant='contained' 
                        size='small' 
                        sx={{ 
                          bgcolor: ACCENTS.borrowed, 
                          color: '#0a0a0a', 
                          fontSize: 12, 
                          fontWeight: 800,
                          textTransform: 'none',
                        }}
                      >
                        Return
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Option A improvements */}
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#0f1218', border: '1px solid #1e2433', borderRadius: 2 }}>
                  <Typography variant='caption' sx={{ color: '#7bdcff', fontWeight: 700, display: 'block', mb: 0.75 }}>
                    Changes:
                  </Typography>
                  <Box component='ul' sx={{ m: 0, pl: 2, color: '#a8b5c7', fontSize: 12, '& li': { mb: 0.4 } }}>
                    <li>Padding: 12px → 14px</li>
                    <li>Title: 15px → 17px (800 weight)</li>
                    <li>Status badges at top</li>
                    <li>Slightly larger icons (13 → 14px)</li>
                    <li>Bolder metadata values</li>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: tokens.border }} />

          {/* OPTION B */}
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, color: '#8be36a' }}>
              Option B: Moderate Revamp (2-3 hours)
            </Typography>
            <Typography variant='body2' sx={{ color: tokens.subtext, mb: 2 }}>
              Better grouping, icon containers, improved hierarchy, primary action button
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* CURRENT CARD */}
          <Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#ffc36b' }}>
              ❌ Current Design
            </Typography>
            <Box
              sx={{
                '--card-r': '20px',
                '--pad': '12px',
                display: 'block',
                width: 320,
                background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
                border: '1px solid #23293a',
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

              {/* Content */}
              <Box sx={{ px: 'var(--pad)', pt: 0.9, pb: 1.6, display: 'grid', gap: 0.75 }}>
                {/* Title + Type */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                  <Typography
                    variant='subtitle2'
                    fontWeight={800}
                    sx={{
                      fontSize: 15,
                      color: '#e9eef7',
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    PlayStation 5 Controller
                  </Typography>
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.5,
                      bgcolor: `${ACCENTS.borrowed}33`,
                      color: ACCENTS.borrowed,
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Borrowed
                  </Box>
                </Box>

                {/* Metadata */}
                <Box sx={{ display: 'grid', gap: 0.6 }}>
                  {/* Category */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiCategoryAlt size={13} color={ACCENTS.borrowed} />
                    <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                      Category
                    </Typography>
                    <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>
                      Gaming
                    </Typography>
                  </Box>
                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GrLocation size={13} color={ACCENTS.borrowed} />
                    <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                      Location
                    </Typography>
                    <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>
                      Living Room
                    </Typography>
                  </Box>
                  {/* Lender */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PiHandArrowDown size={13} color={ACCENTS.borrowed} />
                    <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                      Lender
                    </Typography>
                    <Typography variant='caption' sx={{ ml: 1, color: '#dfe6f3', fontSize: 12, fontWeight: 600 }}>
                      Alex Chen
                    </Typography>
                  </Box>
                  {/* Due */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PiTimerBold size={13} color='#ffd06b' />
                    <Typography variant='caption' sx={{ color: '#7d8799', fontSize: 12 }}>
                      Due
                    </Typography>
                    <Typography variant='caption' sx={{ ml: 1, color: '#ffd06b', fontSize: 12, fontWeight: 700 }}>
                      2d left
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><LuShare2 size={18} /></Button>
                  <Button sx={{ minWidth: 36, p: 0.75, color: '#8ca2ba' }}><AiOutlineHeart size={18} /></Button>
                  <Box sx={{ flex: 1 }} />
                  <Button variant='outlined' size='small' sx={{ borderColor: '#2a3144', color: ACCENTS.borrowed, fontSize: 12, fontWeight: 700 }}>Extend</Button>
                  <Button variant='contained' size='small' sx={{ bgcolor: ACCENTS.borrowed, color: '#0a0a0a', fontSize: 12, fontWeight: 700 }}>Return</Button>
                </Box>
              </Box>

              {/* Progress bar */}
              <Box sx={{ px: 'var(--pad)', pb: 1 }}>
                <Box sx={{ height: 6, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                  <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* REVAMPED CARD */}
          <Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#8be36a' }}>
              ✅ Revamped Design (Option B)
            </Typography>
            <Box
              sx={{
                '--card-r': '20px',
                '--pad': '16px',
                display: 'block',
                width: 320,
                background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
                border: '1px solid #23293a',
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

              {/* Content */}
              <Box sx={{ px: 'var(--pad)', pt: 0, pb: 2, display: 'grid', gap: 1.5 }}>
                {/* Title + Status Badge */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: '#f3f6fa',
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.3,
                      }}
                    >
                      PlayStation 5 Controller
                    </Typography>
                    <AiFillHeart size={20} color='#ff7a9e' />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label='Borrowed'
                      size='small'
                      sx={{
                        height: 22,
                        bgcolor: `${ACCENTS.borrowed}22`,
                        color: ACCENTS.borrowed,
                        border: `1px solid ${ACCENTS.borrowed}44`,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                    <Chip
                      icon={<PiTimerBold size={12} />}
                      label='Due in 2 days'
                      size='small'
                      sx={{
                        height: 22,
                        bgcolor: '#ffd06b22',
                        color: '#ffd06b',
                        border: '1px solid #ffd06b44',
                        fontSize: 11,
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 1 },
                        '& .MuiChip-icon': { color: '#ffd06b', marginLeft: '6px' },
                      }}
                    />
                  </Box>
                </Box>

                {/* Grouped Metadata Section */}
                <Box
                  sx={{
                    bgcolor: '#0f1218',
                    border: '1px solid #1e2433',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'grid',
                    gap: 1,
                  }}
                >
                  {/* Category */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: `${ACCENTS.borrowed}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BiCategoryAlt size={16} color={ACCENTS.borrowed} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                        Category
                      </Typography>
                      <Typography sx={{ color: '#e8eef7', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                        Gaming
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#1e2433' }} />

                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: `${ACCENTS.borrowed}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <GrLocation size={16} color={ACCENTS.borrowed} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                        Location
                      </Typography>
                      <Typography sx={{ color: '#e8eef7', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                        Living Room
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#1e2433' }} />

                  {/* Lender */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: `${ACCENTS.borrowed}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PiHandArrowDown size={16} color={ACCENTS.borrowed} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                        Lender
                      </Typography>
                      <Typography sx={{ color: '#e8eef7', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                        Alex Chen
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Progress bar */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                      Borrow Period
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#ffd06b', fontSize: 12, fontWeight: 700 }}>
                      65% elapsed
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                    <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b', borderRadius: 999 }} />
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<LuShare2 size={16} />}
                    sx={{
                      flex: 1,
                      borderColor: '#2a3144',
                      color: '#a8b5c7',
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': { borderColor: '#3b465f', bgcolor: '#1a2030' },
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      flex: 1,
                      bgcolor: ACCENTS.borrowed,
                      color: '#0a0a0a',
                      fontSize: 13,
                      fontWeight: 800,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#ffd280' },
                    }}
                  >
                    Return Now
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Option B improvements */}
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#0f1218', border: '1px solid #1e2433', borderRadius: 2 }}>
            <Typography variant='caption' sx={{ color: '#8be36a', fontWeight: 700, display: 'block', mb: 0.75 }}>
              Changes:
            </Typography>
            <Box component='ul' sx={{ m: 0, pl: 2, color: '#a8b5c7', fontSize: 12, '& li': { mb: 0.4 } }}>
              <li>Padding: 12px → 16px, gaps 0.75 → 1.5</li>
              <li>Title: 15px → 18px (800 weight)</li>
              <li>Grouped metadata section with dividers</li>
              <li>Icons in 32×32 containers</li>
              <li>Status badges + progress label</li>
              <li>Primary "Return Now" button</li>
            </Box>
          </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: tokens.border }} />

          {/* OPTION C */}
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, color: '#c79dff' }}>
              Option C: Full Redesign (4+ hours)
            </Typography>
            <Typography variant='body2' sx={{ color: tokens.subtext, mb: 2 }}>
              Horizontal layout for desktop, card-style metadata panels, prominent CTA
            </Typography>

            <Box sx={{ maxWidth: 680 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1.5, color: '#c79dff' }}>
                🎨 Option C: Full Redesign
              </Typography>
              <Box
                sx={{
                  '--card-r': '24px',
                  display: 'block',
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
                  border: '1px solid #23293a',
                  borderRadius: 'var(--card-r)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                  p: 2.5,
                }}
              >
                {/* Horizontal layout */}
                <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                  {/* Left: Image */}
                  <Box sx={{ width: { xs: '100%', sm: 240 }, flexShrink: 0 }}>
                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: '#0b0f16',
                        aspectRatio: '4 / 3',
                        display: 'grid',
                        placeItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <Typography sx={{ color: '#444', fontSize: 14 }}>Item Image</Typography>
                      {/* Status overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          display: 'flex',
                          gap: 0.75,
                        }}
                      >
                        <Chip
                          label='Borrowed'
                          size='small'
                          sx={{
                            height: 24,
                            bgcolor: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(8px)',
                            color: ACCENTS.borrowed,
                            border: `1.5px solid ${ACCENTS.borrowed}`,
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        />
                      </Box>
                      {/* Favorite overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: 'rgba(0,0,0,0.75)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AiFillHeart size={18} color='#ff7a9e' />
                      </Box>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mt: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Time Remaining
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#ffd06b', fontSize: 13, fontWeight: 800 }}>
                          2 days
                        </Typography>
                      </Box>
                      <Box sx={{ height: 10, bgcolor: '#1b2231', borderRadius: 999, overflow: 'hidden' }}>
                        <Box sx={{ width: '65%', height: '100%', bgcolor: '#ffd06b', borderRadius: 999 }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Right: Content */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Title */}
                    <Box>
                      <Typography
                        variant='h5'
                        sx={{
                          fontSize: 22,
                          fontWeight: 900,
                          color: '#f8fafc',
                          lineHeight: 1.3,
                          mb: 0.5,
                        }}
                      >
                        PlayStation 5 Controller
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#7a8799', fontSize: 13 }}>
                        Wireless gaming controller in excellent condition
                      </Typography>
                    </Box>

                    {/* Info cards grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25 }}>
                      {/* Category card */}
                      <Box
                        sx={{
                          bgcolor: '#0f1218',
                          border: '1px solid #1e2433',
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <BiCategoryAlt size={16} color={ACCENTS.borrowed} />
                          <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                            Category
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#e8eef7', fontSize: 15, fontWeight: 800 }}>
                          Gaming
                        </Typography>
                      </Box>

                      {/* Location card */}
                      <Box
                        sx={{
                          bgcolor: '#0f1218',
                          border: '1px solid #1e2433',
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <GrLocation size={16} color={ACCENTS.borrowed} />
                          <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                            Location
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#e8eef7', fontSize: 15, fontWeight: 800 }}>
                          Living Room
                        </Typography>
                      </Box>

                      {/* Lender card */}
                      <Box
                        sx={{
                          bgcolor: '#0f1218',
                          border: '1px solid #1e2433',
                          borderRadius: 2,
                          p: 1.5,
                          gridColumn: 'span 2',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <PiHandArrowDown size={16} color={ACCENTS.borrowed} />
                          <Typography variant='caption' sx={{ color: '#7a8799', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                            Borrowed From
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              bgcolor: `${ACCENTS.people}33`,
                              border: `2px solid ${ACCENTS.people}66`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 14,
                              fontWeight: 800,
                              color: ACCENTS.people,
                            }}
                          >
                            AC
                          </Box>
                          <Typography sx={{ color: '#e8eef7', fontSize: 16, fontWeight: 800 }}>
                            Alex Chen
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.25, mt: 'auto' }}>
                      <Button
                        variant='outlined'
                        startIcon={<LuShare2 size={18} />}
                        sx={{
                          borderColor: '#2a3144',
                          color: '#a8b5c7',
                          fontSize: 14,
                          fontWeight: 700,
                          textTransform: 'none',
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          '&:hover': { borderColor: '#3b465f', bgcolor: '#1a2030' },
                        }}
                      >
                        Share
                      </Button>
                      <Button
                        variant='contained'
                        sx={{
                          flex: 1,
                          bgcolor: ACCENTS.borrowed,
                          color: '#0a0a0a',
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: 'none',
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          boxShadow: `0 4px 12px ${ACCENTS.borrowed}44`,
                          '&:hover': { bgcolor: '#ffd280', boxShadow: `0 6px 16px ${ACCENTS.borrowed}66` },
                        }}
                      >
                        Return Now
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Option C improvements */}
              <Box sx={{ mt: 2, p: 1.5, bgcolor: '#0f1218', border: '1px solid #1e2433', borderRadius: 2 }}>
                <Typography variant='caption' sx={{ color: '#c79dff', fontWeight: 700, display: 'block', mb: 0.75 }}>
                  Changes:
                </Typography>
                <Box component='ul' sx={{ m: 0, pl: 2, color: '#a8b5c7', fontSize: 12, '& li': { mb: 0.4 } }}>
                  <li>Horizontal layout (image left, content right)</li>
                  <li>Info in card-style panels (2-column grid)</li>
                  <li>Status badges overlaid on image</li>
                  <li>Prominent "Return Now" CTA with shadow</li>
                  <li>Profile avatar for person</li>
                  <li>Larger typography (title 22px)</li>
                  <li>Description text added</li>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Summary comparison */}
        <Box sx={{ mt: 4, p: 3, bgcolor: '#0f1218', border: '1px solid #1e2433', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: 800, mb: 2, color: '#e8eef7' }}>
            📊 Quick Comparison
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#7bdcff', mb: 0.75 }}>
                Option A: Subtle
              </Typography>
              <Typography variant='body2' sx={{ color: '#a8b5c7', fontSize: 13, lineHeight: 1.6 }}>
                Quick polish, minimal code changes, safe choice
              </Typography>
            </Box>
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#8be36a', mb: 0.75 }}>
                Option B: Moderate
              </Typography>
              <Typography variant='body2' sx={{ color: '#a8b5c7', fontSize: 13, lineHeight: 1.6 }}>
                Balanced improvement, better UX, recommended
              </Typography>
            </Box>
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#c79dff', mb: 0.75 }}>
                Option C: Full
              </Typography>
              <Typography variant='body2' sx={{ color: '#a8b5c7', fontSize: 13, lineHeight: 1.6 }}>
                Complete rethink, desktop-optimized, more work
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { PiTimerBold } from 'react-icons/pi';
import { LuShare2 } from 'react-icons/lu';
import { GrFavorite } from 'react-icons/gr';
import { CgAdd } from 'react-icons/cg';

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
      </Box>
    </Box>
  );
}

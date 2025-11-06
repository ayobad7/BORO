import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

export default function Style2() {
  // Tokens from your request
  const tokens = {
    surface: '#0f0f0f', // page background
    card: '#1a1a1a',
    accent: '#abf732',
    accentHover: '#9ee829',
    text: '#F5F6F7',
    subtext: '#A0A6AD',
    border: '#2A2A2A',
    neutral: '#262626',
  } as const;

  const swatches: Array<{ name: string; hex: string }> = [
    { name: 'Accent', hex: tokens.accent },
    { name: 'Surface', hex: tokens.surface },
    { name: 'Card', hex: tokens.card },
    { name: 'Border', hex: tokens.border },
    { name: 'Text', hex: tokens.text },
    { name: 'Subtext', hex: tokens.subtext },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: tokens.surface,
        display: 'grid',
        placeItems: 'center',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 980, color: tokens.text }}>
        <Typography variant='h4' sx={{ fontWeight: 800, mb: 2 }}>
          Style 2 Preview
        </Typography>

        {/* Buttons */}
        <Stack direction='row' spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant='contained'
            sx={{
              bgcolor: tokens.accent,
              color: '#0A0A0A',
              borderRadius: 9999,
              fontWeight: 700,
              '&:hover': { bgcolor: tokens.accentHover },
            }}
          >
            Primary (Accent)
          </Button>
          <Button
            variant='outlined'
            sx={{
              borderColor: tokens.accent,
              color: tokens.accent,
              borderRadius: 9999,
              fontWeight: 700,
              '&:hover': {
                borderColor: tokens.accentHover,
                bgcolor: 'rgba(171,247,50,0.10)',
              },
            }}
          >
            Secondary
          </Button>
          <Button
            variant='contained'
            sx={{
              bgcolor: tokens.neutral,
              color: tokens.text,
              borderRadius: 9999,
              fontWeight: 700,
              border: `1px solid ${tokens.border}`,
              '&:hover': { bgcolor: '#2f2f2f' },
            }}
          >
            Tertiary
          </Button>
        </Stack>

        <Divider sx={{ borderColor: tokens.border, my: 3 }} />

        {/* Card */}
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
          <Typography variant='h6' sx={{ fontWeight: 800 }}>
            Card Title
          </Typography>
          <Typography variant='body2' sx={{ color: tokens.subtext, mb: 2 }}>
            Subtitle showing contrast and spacing using your exact colors.
          </Typography>
          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              sx={{
                bgcolor: tokens.accent,
                color: '#0A0A0A',
                '&:hover': { bgcolor: tokens.accentHover },
              }}
            >
              Manage
            </Button>
            <Button
              variant='outlined'
              sx={{
                borderColor: tokens.accent,
                color: tokens.accent,
                '&:hover': {
                  borderColor: tokens.accentHover,
                  bgcolor: 'rgba(171,247,50,0.08)',
                },
              }}
            >
              Details
            </Button>
          </Stack>
        </Card>

        <Divider sx={{ borderColor: tokens.border, my: 3 }} />

        {/* Palette */}
        <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
          Your provided palette
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
                background: tokens.card,
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
      </Box>
    </Box>
  );
}

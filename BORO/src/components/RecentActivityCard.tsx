import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ACCENTS } from '../lib/accents';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { MdOutlineReadMore } from 'react-icons/md';
import { useMemo } from 'react';

export interface ActivityEvent {
  id: string;
  ts: number;
  text: string;
}

interface RecentActivityCardProps {
  events: ActivityEvent[];
  // Optional custom footer. undefined => default "View more" CTA; null => no footer
  footer?: React.ReactNode | null;
}

function formatRelative(ts: number): string {
  if (!Number.isFinite(ts)) return 'just now';
  const now = Date.now();
  if (ts > now) ts = now; // guard future timestamps
  const diffMs = now - ts;
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 24) return `${diffH || 1}h ago`;
  const diffD = Math.floor(diffMs / 86400000);
  if (diffD < 31) return `${diffD}d ago`;
  if (diffD < 365) {
    const diffM = Math.floor(diffD / 30);
    return `${diffM || 1}mo ago`;
  }
  // Show date for older events (e.g. Aug 10 2024)
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export default function RecentActivityCard({
  events,
  footer,
}: RecentActivityCardProps) {
  const withTime = useMemo(
    () => events.map((e) => ({ ...e, rel: formatRelative(e.ts) })),
    [events]
  );
  const defaultFooter = (
    <Button
      component={RouterLink}
      to='/activity'
      startIcon={<MdOutlineReadMore size={18} />}
      sx={{
        width: '100%',
        justifyContent: 'center',
        bgcolor: '#1a2130',
        border: '1px solid #2a3144',
        color: '#e8efff',
        textTransform: 'none',
        fontSize: 13,
        fontWeight: 700,
        borderRadius: '999px',
        px: 1.4,
        height: 34,
        '&:hover': { bgcolor: '#20283a' },
        transition: 'background-color .18s ease, border-color .18s ease',
      }}
    >
      View more
    </Button>
  );
  const footerNode = footer === undefined ? defaultFooter : footer;
  return (
    <Box
      sx={{
        '--r': '20px',
        position: 'relative',
        background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #14171f`,
        border: '1px solid #23293a',
        borderRadius: 'var(--r)',
        px: '14px',
        pt: '10px',
        pb: '14px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        breakInside: 'avoid',
        WebkitColumnBreakInside: 'avoid',
        overflow: 'hidden',
        // Using flex to get tighter control of header->list spacing
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography
          variant='subtitle2'
          sx={{ fontWeight: 800, fontSize: 15, color: '#e9eef7' }}
        >
          Recent Activity
        </Typography>
      </Box>
      <Box
        component='ul'
        sx={{
          listStyle: 'none',
          m: 0,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          mt: 0.25, // minimal space below header
        }}
      >
        {withTime.length === 0 && (
          <Typography variant='caption' sx={{ color: '#7d8799' }}>
            No recent events.
          </Typography>
        )}
        {withTime.map((ev, idx) => (
          <Box
            key={ev.id}
            component='li'
            sx={{
              display: 'flex',
              gap: 1,
              position: 'relative',
              py: 1.0,
              '--divider': '#1d2430',
              borderBottom:
                idx < withTime.length - 1 ? '1px solid var(--divider)' : 'none',
            }}
          >
            <Box
              sx={{
                width: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: `${ACCENTS.activity}`,
                  boxShadow: `0 0 0 3px rgba(125,137,153,0.15)`,
                }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant='body2'
                sx={{
                  fontSize: 13,
                  lineHeight: 1.25,
                  fontWeight: 500,
                  color: '#dfe6f3',
                  mb: 0.4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {ev.text}
              </Typography>
              <Typography
                variant='caption'
                sx={{ fontSize: 11, color: '#7d8799' }}
              >
                {ev.rel}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {footerNode !== null && <Box sx={{ mt: 1.1 }}>{footerNode}</Box>}
    </Box>
  );
}

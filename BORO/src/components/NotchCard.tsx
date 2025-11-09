import React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Proportional notch card.
 * Uses objectBoundingBox clipPath so the circular notch scales with width/height.
 * NOTE: Because objectBoundingBox scales non-uniformly if width != height, the arc can appear slightly elliptical.
 * Acceptable for proportional variant; choose fixed pixel path for perfect circle.
 */
interface NotchCardProps {
  children: React.ReactNode;
  accentColor?: string;
  bg?: string;
  borderColor?: string;
  notchRadiusX?: number; // fraction of width (0-1)
  notchRadiusY?: number; // fraction of height (0-1)
  sx?: SxProps<Theme>;
}

export default function NotchCard({
  children,
  accentColor = '#7bdcff',
  bg = '#0f0f10',
  borderColor = 'rgba(255,255,255,0.08)',
  notchRadiusX = 0.115, // ~11.5% of width
  notchRadiusY = 0.18, // ~18% of height
  sx = {},
}: NotchCardProps) {
  // Build path numbers once. objectBoundingBox coordinates 0..1
  const rW = notchRadiusX;
  const rH = notchRadiusY;
  // Path: start top-left, go to (1 - rW,0), arc to (1,rH), then down/right around rectangle.
  const d = `M0 0 H${(1 - rW).toFixed(4)} A${rW.toFixed(4)} ${rH.toFixed(
    4
  )} 0 0 1 1 ${rH.toFixed(4)} V1 H0 Z`;

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {/* SVG defs */}
      <svg width={0} height={0} aria-hidden>
        <defs>
          <clipPath id='proportionalNotch' clipPathUnits='objectBoundingBox'>
            <path d={d} />
          </clipPath>
        </defs>
      </svg>
      {/* Clipped content box */}
      <Box
        sx={{
          position: 'relative',
          clipPath: 'url(#proportionalNotch)',
          background: bg,
          border: `1px solid ${borderColor}`,
          borderRadius: 3, // still apply base rounding for remaining corners
          overflow: 'hidden',
          transition: 'border-color .15s ease',
          '&:hover': {
            borderColor: accentColor,
            boxShadow: `0 0 0 1px ${accentColor}`,
          },
        }}
      >
        {children}
        {/* Accent circle anchored at notch */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: accentColor,
            color: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            border: '2px solid #0f0f10',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        >
          *
        </Box>
      </Box>
    </Box>
  );
}

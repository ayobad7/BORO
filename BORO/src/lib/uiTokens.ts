// Shared UI tokens inspired by Style page
export const ui = {
  bg: '#0F0F10',
  surface: '#151617',
  card: '#101112',
  border: '#2A2D33',
  text: '#F3F4F6',
  subtext: '#9CA3AF',
  primary: '#B6FF1A',
  primaryHover: '#A3F114',
  neutral: '#2B2F36',
} as const;

export function alpha(hex: string, a: number) {
  // supports 7-char #RRGGBB
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

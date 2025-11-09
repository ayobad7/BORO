// Centralized accent and elevation/spacing tokens
export const ACCENTS = {
  storage: '#7bdcff', // cyan
  borrowed: '#ffc36b', // amber
  lent: '#8be36a', // lime
  favorite: '#c79dff', // purple
  people: '#d6b6ff', // lighter pastel purple for people card
  activity: '#7f8cff', // indigo for recent activity card
} as const;

export type AccentKey = keyof typeof ACCENTS;

// Elevation tokens (can be expanded)
export const elevation = {
  1: '0 4px 12px rgba(0,0,0,0.25)',
  2: '0 8px 24px rgba(0,0,0,0.3)',
  3: '0 14px 40px rgba(0,0,0,0.38)',
} as const;

// 4px modular scale spacing helper
export const s = (n: number) => `${n * 4}px`;

// Focus ring style helper
export const focusRing = (color: string) => ({
  outline: 'none',
  boxShadow: `0 0 0 2px rgba(0,0,0,0.6), 0 0 0 4px ${color}88`,
});

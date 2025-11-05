// Date utilities for BORO
// Returns number of days from today (local) to the given ISO date string.
// Floors to 0 and normalizes both dates to local midnight to avoid TZ drift.
export function getDaysLeft(borrowedUntil?: string): number {
  if (!borrowedUntil) return 0;
  const returnDate = new Date(borrowedUntil);
  const today = new Date();
  // Normalize to local midnight to avoid partial days glitches
  today.setHours(0, 0, 0, 0);
  returnDate.setHours(0, 0, 0, 0);
  const diffTime = returnDate.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

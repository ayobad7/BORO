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

// Formats a timestamp to a compact date like "20 Nov 25"
export function formatShortDate(input?: unknown): string {
  if (!input) return '';
  let d: Date | null = null;

  try {
    if (typeof input === 'number') {
      // Heuristic: if seconds, convert to ms
      const ms = input < 1e12 ? input * 1000 : input;
      d = new Date(ms);
    } else if (typeof input === 'string') {
      d = new Date(input);
    } else if (typeof input === 'object' && input !== null) {
      // Firestore Timestamp support: has toDate() or seconds/nanoseconds
      const anyInput = input as any;
      if (typeof anyInput?.toDate === 'function') {
        d = anyInput.toDate();
      } else if (typeof anyInput?.seconds === 'number') {
        const seconds = anyInput.seconds as number;
        const nanos =
          typeof anyInput.nanoseconds === 'number' ? anyInput.nanoseconds : 0;
        d = new Date(seconds * 1000 + Math.floor(nanos / 1_000_000));
      }
    }
  } catch {
    d = null;
  }

  if (!d || isNaN(d.getTime())) return '';

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
}

// Returns days overdue (0 if not overdue). Normalized to local midnight.
export function getOverdueDays(borrowedUntil?: string): number {
  if (!borrowedUntil) return 0;
  const returnDate = new Date(borrowedUntil);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  returnDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - returnDate.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

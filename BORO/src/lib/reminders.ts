import { getDaysLeft, getOverdueDays, formatShortDate } from './date';

export interface BuildReminderOpts {
  ownerName?: string | null;
  itemName: string;
  dueDate?: string | null;
}

// Build a short, human-friendly reminder message for borrowers.
// Returns an empty string when the dueDate is missing/invalid.
export function buildReminderMessage({ ownerName, itemName, dueDate }: BuildReminderOpts) {
  if (!dueDate) return '';
  try {
    const overdue = getOverdueDays(dueDate);
    const daysLeft = getDaysLeft(dueDate);
    const when = formatShortDate(dueDate) || new Date(dueDate).toLocaleDateString();
    const owner = ownerName || 'Owner';

    if (overdue > 0) {
      return `${owner} — Friendly reminder: “${itemName}” was due ${overdue} day${
        overdue > 1 ? 's' : ''
      } ago (${when}). Please return it as soon as you can.`;
    }

    if (daysLeft === 0) {
      return `${owner} — Friendly reminder: “${itemName}” is due today (${when}). Please return it.`;
    }

    return `${owner} — Friendly reminder: “${itemName}” is due in ${daysLeft} day${
      daysLeft > 1 ? 's' : ''
    } on ${when}. Please return it by then.`;
  } catch (e) {
    return '';
  }
}

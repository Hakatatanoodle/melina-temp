/**
 * Presentation-side formatting helpers. The backend returns raw domain data;
 * the frontend decides how it reads.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-10-12' -> 'Oct 12, 2026' */
export function formatDate(iso) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** '2026-10-12' -> 'Oct 12' (used inside a year-grouped timeline) */
export function formatShortDate(iso) {
  if (!iso) return '';
  const [, month, day] = iso.split('-').map(Number);
  if (!month || !day) return iso;
  return `${MONTHS[month - 1]} ${day}`;
}

/** Today's date as YYYY-MM-DD in the user's local timezone. */
export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Friendly age from a date of birth: "3 years", "8 months", "2 weeks". */
export function formatAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;

  if (months < 0) return 'Newborn';
  if (months === 0) {
    const weeks = Math.max(1, Math.floor((now - birth) / (7 * 24 * 60 * 60 * 1000)));
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'}`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

/** Time-aware greeting used on the dashboard. */
export function greetingForHour(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** First name from a full name. */
export function firstName(fullName) {
  return (fullName || '').trim().split(/\s+/)[0] || 'there';
}

/** Initials for branded portrait fallbacks. */
export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Groups timeline records by year, newest first. */
export function groupByYear(records) {
  const groups = [];
  const byYear = new Map();
  for (const record of records) {
    const year = (record.date || '').slice(0, 4) || '—';
    if (!byYear.has(year)) {
      const group = { year, records: [] };
      byYear.set(year, group);
      groups.push(group);
    }
    byYear.get(year).records.push(record);
  }
  return groups;
}

export function parseYmdLocal(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Local calendar date as YYYY-MM-DD (for date pickers; avoids UTC shift). */
export function ymdFromDateLocal(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

export function ymdAddDays(ymd: string, deltaDays: number): string {
  const d = parseYmdLocal(ymd);
  d.setDate(d.getDate() + deltaDays);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

/** Number of camping nights for check-in through checkout (checkout day is not a night in camp). */
export function countTripNights(checkInYmd: string, checkoutYmd: string): number {
  const s = parseYmdLocal(checkInYmd);
  const e = parseYmdLocal(checkoutYmd);
  const diffDays = Math.round((e.getTime() - s.getTime()) / 86400000);
  return Math.max(0, diffDays);
}

/** Last calendar date you occupy the site (night before checkout morning). */
export function lastCampingNightYmd(checkoutYmd: string): string {
  return ymdAddDays(checkoutYmd, -1);
}

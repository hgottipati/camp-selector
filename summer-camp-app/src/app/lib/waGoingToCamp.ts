/**
 * Washington State Parks use ReserveAmerica / GoingToCamp (no public API here).
 * Opens their results flow with dates prefilled; users finish search on their site.
 * Params match their UI: check-in date and checkout / departure date.
 */
export function buildWaGoingToCampResultsUrl(startDate: string, endDate: string): string {
  const base = 'https://washington.goingtocamp.com/create-booking/results';
  const p = new URLSearchParams();
  p.set('searchTabGroupId', '0');
  p.set('startDate', startDate);
  p.set('endDate', endDate);
  return `${base}?${p.toString()}`;
}

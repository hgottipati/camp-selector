const REC_PROXY = '/api/rec';

export type RecreationSearchHit = {
  id: string;
  name: string;
  latitude?: string;
  longitude?: string;
  addresses?: Array<{ state_code?: string; city?: string }>;
  average_rating?: number;
  campsite_reserve_type?: string[];
  campsite_equipment_name?: string[];
  [key: string]: unknown;
};

export type RecreationSearchResponse = {
  results?: RecreationSearchHit[];
  total?: number;
  size?: number;
  start?: number;
};

export type CampsiteAvailabilityEntry = {
  campsite_id: string;
  site?: string;
  loop?: string;
  campsite_type?: string;
  campsite_reserve_type?: string;
  availabilities: Record<string, string>;
};

export type MonthlyAvailabilityResponse = {
  campsites: Record<string, CampsiteAvailabilityEntry>;
};

export function parseFacilityIdFromSearchId(searchId: string): string {
  return searchId.replace(/_asset$/i, '');
}

export function recreationCampingUrl(facilityId: string): string {
  return `https://www.recreation.gov/camping/campgrounds/${facilityId}`;
}

function apiUrl(path: string, searchParams: Record<string, string | string[] | undefined>): string {
  const u = new URL(`${REC_PROXY}${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  for (const [k, v] of Object.entries(searchParams)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      for (const item of v) u.searchParams.append(k, item);
    } else {
      u.searchParams.set(k, v);
    }
  }
  return u.pathname + u.search;
}

export async function recreationSearchCampgrounds(params: {
  q: string;
  size?: number;
  start?: number;
}): Promise<RecreationSearchResponse> {
  const path = apiUrl('/search', {
    q: params.q,
    exact: 'false',
    fq: 'entity_type:campground',
    size: String(params.size ?? 20),
    start: String(params.start ?? 0),
  });
  const res = await fetch(path);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Search failed (${res.status})`);
  }
  return res.json() as Promise<RecreationSearchResponse>;
}

/** UTC midnight keys as returned by recreation.gov, e.g. 2026-07-10T00:00:00Z */
export function nightKeysInclusive(firstNightYmd: string, lastNightYmd: string): string[] {
  const keys: string[] = [];
  const [sy, sm, sd] = firstNightYmd.split('-').map(Number);
  const [ey, em, ed] = lastNightYmd.split('-').map(Number);
  const endUtc = Date.UTC(ey, em - 1, ed);
  let cur = Date.UTC(sy, sm - 1, sd);
  while (cur <= endUtc) {
    const d = new Date(cur);
    const ymd = d.toISOString().slice(0, 10);
    keys.push(`${ymd}T00:00:00Z`);
    cur += 86400000;
  }
  return keys;
}

function monthStartsForRange(firstNightYmd: string, lastNightYmd: string): string[] {
  const starts = new Set<string>();
  const nights = nightKeysInclusive(firstNightYmd, lastNightYmd);
  for (const k of nights) {
    const y = Number(k.slice(0, 4));
    const m = Number(k.slice(5, 7));
    const iso = new Date(Date.UTC(y, m - 1, 1)).toISOString();
    const startParam = iso.slice(0, 19) + '.000Z';
    starts.add(startParam);
  }
  return [...starts];
}

async function fetchOneMonth(facilityId: string, startDateParam: string): Promise<MonthlyAvailabilityResponse> {
  const encoded = encodeURIComponent(startDateParam);
  const path = `${REC_PROXY}/camps/availability/campground/${facilityId}/month?start_date=${encoded}`;
  const res = await fetch(path);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Availability failed (${res.status})`);
  }
  return res.json() as Promise<MonthlyAvailabilityResponse>;
}

/** Merge monthly payloads for one campground (same site ids). */
function mergeMonthly(parts: MonthlyAvailabilityResponse[]): MonthlyAvailabilityResponse {
  const campsites: Record<string, CampsiteAvailabilityEntry> = {};
  for (const part of parts) {
    for (const [id, site] of Object.entries(part.campsites ?? {})) {
      const existing = campsites[id];
      if (!existing) {
        campsites[id] = { ...site, availabilities: { ...site.availabilities } };
      } else {
        existing.availabilities = { ...existing.availabilities, ...site.availabilities };
      }
    }
  }
  return { campsites };
}

export function countSitesAvailableAllNights(
  merged: MonthlyAvailabilityResponse,
  nights: string[],
  campsiteTypeFilter: string | null,
): number {
  let count = 0;
  for (const site of Object.values(merged.campsites ?? {})) {
    if (campsiteTypeFilter && site.campsite_type !== campsiteTypeFilter) continue;
    let ok = true;
    for (const night of nights) {
      if (site.availabilities[night] !== 'Available') {
        ok = false;
        break;
      }
    }
    if (ok) count++;
  }
  return count;
}

export async function fetchAvailabilityForStay(
  facilityId: string,
  firstNightYmd: string,
  lastNightYmd: string,
): Promise<{ merged: MonthlyAvailabilityResponse; nights: string[] }> {
  const months = monthStartsForRange(firstNightYmd, lastNightYmd);
  const parts = await Promise.all(months.map((m) => fetchOneMonth(facilityId, m)));
  const nights = nightKeysInclusive(firstNightYmd, lastNightYmd);
  return { merged: mergeMonthly(parts), nights };
}

export function hitStateCodes(hit: RecreationSearchHit): string[] {
  const codes = new Set<string>();
  for (const a of hit.addresses ?? []) {
    if (a.state_code) codes.add(a.state_code);
  }
  return [...codes];
}

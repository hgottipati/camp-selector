"use client";

import { useCallback, useMemo, useState } from 'react';
import {
  countSitesAvailableAllNights,
  fetchAvailabilityForStay,
  hitStateCodes,
  parseFacilityIdFromSearchId,
  recreationCampingUrl,
  recreationSearchCampgrounds,
  type RecreationSearchHit,
} from '../lib/recreationApi';
import { useTripDates } from '../context/TripDatesContext';
import { ExternalLink, Loader2, MapPin, Search, Tent } from 'lucide-react';

type EnrichedHit = RecreationSearchHit & {
  facilityId: string;
  availableSites: number | null;
  loadingAvailability: boolean;
  availabilityError?: string;
};

const CAMPSITE_TYPES = [
  { value: '', label: 'Any site type' },
  { value: 'STANDARD NONELECTRIC', label: 'Standard non-electric' },
  { value: 'STANDARD ELECTRIC', label: 'Standard electric' },
  { value: 'TENT ONLY NONELECTRIC', label: 'Tent only' },
  { value: 'GROUP STANDARD NONELECTRIC', label: 'Group' },
  { value: 'MANAGEMENT', label: 'Management' },
];

async function mapWithConcurrency<T>(items: T[], limit: number, fn: (item: T, index: number) => Promise<void>) {
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
}

export function FederalCampgroundSearch() {
  const { startDate, endDate } = useTripDates();
  const [query, setQuery] = useState('Washington');
  const [onlyWa, setOnlyWa] = useState(true);
  const [siteType, setSiteType] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hits, setHits] = useState<EnrichedHit[]>([]);

  const typeFilter = useMemo(() => (siteType ? siteType : null), [siteType]);

  const visibleHits = useMemo(
    () =>
      hits.filter(
        (h) => !h.loadingAvailability && h.availableSites != null && h.availableSites > 0,
      ),
    [hits],
  );

  const availabilityPending = hits.some((h) => h.loadingAvailability);
  const availabilityDone = hits.length > 0 && !availabilityPending;

  const runSearch = useCallback(async () => {
    setLoadingSearch(true);
    setSearchError(null);
    try {
      const data = await recreationSearchCampgrounds({ q: query.trim() || 'Washington', size: 24, start: 0 });
      let list = data.results ?? [];
      if (onlyWa) {
        list = list.filter((h) => hitStateCodes(h).includes('WA'));
      }
      const base: EnrichedHit[] = list.map((h) => ({
        ...h,
        facilityId: parseFacilityIdFromSearchId(h.id),
        availableSites: null,
        loadingAvailability: true,
      }));
      setHits(base);

      await mapWithConcurrency(base, 4, async (hit) => {
        try {
          const { merged, nights } = await fetchAvailabilityForStay(hit.facilityId, startDate, endDate);
          const availableSites = countSitesAvailableAllNights(merged, nights, typeFilter);
          setHits((prev) =>
            prev.map((p) =>
              p.facilityId === hit.facilityId ? { ...p, availableSites, loadingAvailability: false } : p,
            ),
          );
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Availability error';
          setHits((prev) =>
            prev.map((p) =>
              p.facilityId === hit.facilityId
                ? { ...p, availableSites: null, loadingAvailability: false, availabilityError: msg }
                : p,
            ),
          );
        }
      });
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : 'Search failed');
      setHits([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [query, onlyWa, startDate, endDate, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-6 shadow-md ring-1 ring-amber-100">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Recreation.gov
          </span>
          <p className="text-sm text-gray-700">
            Federal campgrounds with live availability for your nights (first night → last night). Not all Washington
            parks are on Recreation.gov — use the <strong className="text-emerald-800">WA State</strong> tab for those.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-800">Search</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-gray-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Olympic, Gifford Pinchot"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-800">Site type</span>
            <select
              className="w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              value={siteType}
              onChange={(e) => setSiteType(e.target.value)}
            >
              {CAMPSITE_TYPES.map((o) => (
                <option key={o.value || 'any'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={onlyWa}
              onChange={(e) => setOnlyWa(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            Only results in WA
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => void runSearch()}
              disabled={loadingSearch}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:opacity-60"
            >
              {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tent className="h-4 w-4" />}
              Search availability
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Data from Recreation.gov — see{' '}
          <a
            href="https://www.recreation.gov/use-our-data"
            className="font-medium text-amber-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Use and share our data
          </a>
          . Book on their site.
        </p>
      </div>

      {searchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{searchError}</div>
      )}

      {hits.length > 0 && availabilityPending && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          Checking campgrounds for sites free every night ({startDate} → {endDate})…
        </div>
      )}

      {visibleHits.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleHits.map((hit) => {
            const bookUrl = recreationCampingUrl(hit.facilityId);
            const city = hit.addresses?.[0]?.city;
            const states = hitStateCodes(hit).join(', ');
            const n = hit.availableSites ?? 0;
            return (
              <article
                key={hit.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg"
              >
                <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{hit.name}</h3>
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                      Federal
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    {(city || states) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" />
                        {[city, states].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {hit.average_rating != null && (
                      <span className="text-amber-800">★ {hit.average_rating.toFixed(1)}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">
                    ~{n} site{n === 1 ? '' : 's'} available every night (with your site-type filter)
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    <a
                      href={bookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      View & book on Recreation.gov
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {availabilityDone && visibleHits.length === 0 && !searchError && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-700">
          <p className="font-medium text-gray-900">No availability in this batch</p>
          <p className="mt-2 text-sm">
            None of the campgrounds we checked had a matching site free for every night from {startDate} through{' '}
            {endDate}. Try wider dates, a different site type, or another search (e.g. a specific forest or park
            name).
          </p>
        </div>
      )}

      {!loadingSearch && hits.length === 0 && !searchError && (
        <p className="text-center text-gray-600">
          Run a search to load federal campgrounds and check live availability for your trip dates.
        </p>
      )}
    </div>
  );
}

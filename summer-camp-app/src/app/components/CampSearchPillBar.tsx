"use client";

import { useState } from 'react';
import { Minus, Plus, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { TripDateRangePicker } from './TripDateRangePicker';
import type { Campground } from '../data/campgrounds';
import { cn } from './ui/utils';

export type RegionFilter = 'all' | Campground["region"];

const REGIONS: { id: RegionFilter; label: string; sub: string }[] = [
  { id: 'all', label: 'All regions', sub: 'All of Washington' },
  { id: 'NW', label: 'Northwest', sub: 'Forests & coast · 🌲' },
  { id: 'NE', label: 'Northeast', sub: 'Sun & lakes · ☀️' },
  { id: 'SW', label: 'Southwest', sub: 'Mountains · 🌳' },
  { id: 'SE', label: 'Southeast', sub: 'High desert · 🏜️' },
];

type CampSearchPillBarProps = {
  sourceTab: 'wa' | 'federal';
  selectedRegion: RegionFilter;
  onRegionChange: (r: RegionFilter) => void;
  regionCounts: { NW: number; NE: number; SW: number; SE: number };
  totalCampgrounds: number;
  onSearchClick: () => void;
};

export function CampSearchPillBar({
  sourceTab,
  selectedRegion,
  onRegionChange,
  regionCounts,
  totalCampgrounds,
  onSearchClick,
}: CampSearchPillBarProps) {
  const [whereOpen, setWhereOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const [guests, setGuests] = useState(0);
  const [pets, setPets] = useState(0);

  const regionMeta = REGIONS.find((r) => r.id === selectedRegion);

  const whoSummary =
    guests === 0 && pets === 0
      ? 'Add guests · pets'
      : pets > 0
        ? `${guests} guest${guests === 1 ? '' : 's'} · ${pets} pet${pets === 1 ? '' : 's'}`
        : `${guests} guest${guests === 1 ? '' : 's'}`;

  const whereSecondary =
    sourceTab === 'federal'
      ? 'Washington'
      : selectedRegion === 'all'
        ? 'Search regions'
        : (regionMeta?.label ?? 'Region');

  return (
    <div
      className={cn(
        'mx-auto mb-8 flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-stretch',
        'rounded-full border border-gray-200 bg-white',
        'shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)]',
        'px-2 py-2 pl-3 sm:pl-4',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col divide-y divide-gray-200 sm:flex-row sm:divide-x sm:divide-y-0">
        {/* Where */}
        {sourceTab === 'wa' ? (
          <Popover open={whereOpen} onOpenChange={setWhereOpen} modal={false}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-start justify-center gap-0.5 rounded-none px-5 py-3 text-left transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:rounded-l-full sm:px-8"
              >
                <span className="text-xs font-bold tracking-wide text-gray-900">Where</span>
                <span
                  className={cn(
                    'truncate text-sm',
                    selectedRegion === 'all' ? 'font-normal text-gray-500' : 'font-semibold text-gray-900',
                  )}
                >
                  {whereSecondary}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={12}
              className="w-[min(100vw-2rem,20rem)] border-gray-200 p-2 shadow-lg"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <p className="px-2 pb-2 text-xs font-medium text-gray-500">Washington regions</p>
              <ul className="flex flex-col gap-0.5">
                {REGIONS.map((r) => {
                  const count =
                    r.id === 'all'
                      ? totalCampgrounds
                      : regionCounts[r.id as keyof typeof regionCounts];
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onRegionChange(r.id);
                          setWhereOpen(false);
                        }}
                        className={cn(
                          'flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left text-sm transition',
                          selectedRegion === r.id ? 'bg-gray-100 font-semibold text-gray-900' : 'hover:bg-gray-50',
                        )}
                      >
                        <span>{r.label}</span>
                        <span className="text-xs font-normal text-gray-500">
                          {r.sub} · {count} spots
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-start justify-center gap-0.5 px-5 py-3 sm:rounded-l-full sm:px-8">
            <span className="text-xs font-bold tracking-wide text-gray-900">Where</span>
            <span className="truncate text-sm font-semibold text-gray-900">Washington</span>
          </div>
        )}

        {/* When */}
        <div className="min-w-0 flex-1 sm:min-w-[11rem]">
          <TripDateRangePicker variant="pill" />
        </div>

        {/* Who */}
        <Popover open={whoOpen} onOpenChange={setWhoOpen} modal={false}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-start justify-center gap-0.5 rounded-none px-5 py-3 text-left transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:px-8"
            >
              <span className="text-xs font-bold tracking-wide text-gray-900">Who</span>
              <span
                className={cn(
                  'truncate text-sm',
                  guests === 0 && pets === 0 ? 'font-normal text-gray-500' : 'font-semibold text-gray-900',
                )}
              >
                {whoSummary}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={12}
            className="w-[min(100vw-2rem,22rem)] border-gray-200 p-4 shadow-lg"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Guests</p>
                  <p className="text-xs text-gray-500">People in your crew</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    disabled={guests <= 0}
                    onClick={() => setGuests((g) => Math.max(0, g - 1))}
                    className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-[1.25rem] text-center text-sm font-semibold tabular-nums">{guests}</span>
                  <button
                    type="button"
                    aria-label="More guests"
                    disabled={guests >= 30}
                    onClick={() => setGuests((g) => Math.min(30, g + 1))}
                    className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Pets</p>
                  <p className="text-xs text-gray-500">Dogs &amp; other pets</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Fewer pets"
                    disabled={pets <= 0}
                    onClick={() => setPets((p) => Math.max(0, p - 1))}
                    className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-[1.25rem] text-center text-sm font-semibold tabular-nums">{pets}</span>
                  <button
                    type="button"
                    aria-label="More pets"
                    disabled={pets >= 10}
                    onClick={() => setPets((p) => Math.min(10, p + 1))}
                    className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex shrink-0 items-center justify-center self-center sm:self-auto">
        <button
          type="button"
          onClick={onSearchClick}
          className="flex size-12 items-center justify-center rounded-full bg-[#FF385C] text-white shadow-md transition hover:bg-[#E31C5F] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          aria-label="Search campgrounds"
        >
          <Search className="size-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

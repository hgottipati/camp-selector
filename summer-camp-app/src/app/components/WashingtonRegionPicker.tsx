import { useId } from 'react';
import type { Campground } from '../data/campgrounds';

export type RegionCode = 'all' | Campground['region'];

type WashingtonRegionPickerProps = {
  value: RegionCode;
  onChange: (region: RegionCode) => void;
  counts: Record<Campground['region'], number>;
  total: number;
};

/**
 * Schematic Washington outline in a normalized viewBox (0–80 wide, 0–100 tall).
 * Not survey-grade — tuned so quadrant splits match how campgrounds are tagged in data
 * (roughly: west of ~-120.5° and north/south of ~47.25°).
 */
const WA_OUTLINE_D =
  'M 6 14 L 5 42 L 9 68 L 16 82 L 32 91 L 52 92 L 66 86 L 74 72 L 78 48 L 76 26 L 68 12 L 44 7 L 22 9 Z';

/** Vertical split (lon ~-120.5) and horizontal (lat ~47.25) in the same coordinate space. */
const SPLIT_X = 43.5;
const SPLIT_Y = 50;

const REGION_META: Record<
  Campground['region'],
  { label: string; short: string; fill: string; fillActive: string }
> = {
  NW: {
    label: 'Northwest',
    short: 'NW',
    fill: 'rgba(37, 99, 235, 0.22)',
    fillActive: 'rgba(37, 99, 235, 0.45)',
  },
  NE: {
    label: 'Northeast',
    short: 'NE',
    fill: 'rgba(202, 138, 4, 0.22)',
    fillActive: 'rgba(202, 138, 4, 0.45)',
  },
  SW: {
    label: 'Southwest',
    short: 'SW',
    fill: 'rgba(22, 163, 74, 0.22)',
    fillActive: 'rgba(22, 163, 74, 0.45)',
  },
  SE: {
    label: 'Southeast',
    short: 'SE',
    fill: 'rgba(234, 88, 12, 0.22)',
    fillActive: 'rgba(234, 88, 12, 0.45)',
  },
};

function quadrantRect(region: Campground['region']): { x: number; y: number; w: number; h: number } {
  switch (region) {
    case 'NW':
      return { x: 0, y: 0, w: SPLIT_X, h: SPLIT_Y };
    case 'NE':
      return { x: SPLIT_X, y: 0, w: 80 - SPLIT_X, h: SPLIT_Y };
    case 'SW':
      return { x: 0, y: SPLIT_Y, w: SPLIT_X, h: 100 - SPLIT_Y };
    case 'SE':
      return { x: SPLIT_X, y: SPLIT_Y, w: 80 - SPLIT_X, h: 100 - SPLIT_Y };
  }
}

export function WashingtonRegionPicker({ value, onChange, counts, total }: WashingtonRegionPickerProps) {
  const clipId = useId().replace(/:/g, '');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Pick a region on the map</h3>
          <p className="text-xs text-gray-500 sm:text-sm">
            Tap a quarter of Washington — same filters as the buttons below. Outline is simplified, not a survey map.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange('all')}
          aria-pressed={value === 'all'}
          className={`mt-2 shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition sm:mt-0 ${
            value === 'all'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All regions ({total})
        </button>
      </div>

      <div className="mx-auto max-w-[min(100%,420px)]">
        <svg
          viewBox="0 0 80 100"
          className="h-auto w-full touch-manipulation"
          role="group"
          aria-label="Washington state region filter"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={WA_OUTLINE_D} />
            </clipPath>
          </defs>

          {/* State silhouette stroke (behind interactive fills) */}
          <path
            d={WA_OUTLINE_D}
            fill="none"
            stroke="rgb(55 65 81)"
            strokeWidth={1.2}
            strokeLinejoin="round"
            className="text-gray-700"
          />

          <g clipPath={`url(#${clipId})`}>
            {(Object.keys(REGION_META) as Campground['region'][]).map((region) => {
              const { x, y, w, h } = quadrantRect(region);
              const meta = REGION_META[region];
              const selected = value === region;
              const n = counts[region];

              return (
                <g key={region}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={selected ? meta.fillActive : meta.fill}
                    className="cursor-pointer transition-colors duration-150 hover:opacity-90"
                    stroke={selected ? 'rgb(17 24 39)' : 'rgba(255,255,255,0.35)'}
                    strokeWidth={selected ? 1.4 : 0.6}
                    onClick={() => onChange(region)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChange(region);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selected}
                    aria-label={`${meta.label} Washington, ${n} campgrounds`}
                  />
                  <text
                    x={x + w / 2}
                    y={y + h / 2 - 4}
                    textAnchor="middle"
                    className="pointer-events-none select-none fill-gray-900 text-[7px] font-bold sm:text-[8px]"
                    style={{ fontSize: '6.5px' }}
                  >
                    {meta.short}
                  </text>
                  <text
                    x={x + w / 2}
                    y={y + h / 2 + 7}
                    textAnchor="middle"
                    className="pointer-events-none select-none fill-gray-800 text-[5px] font-medium"
                    style={{ fontSize: '5px' }}
                  >
                    {n} site{n !== 1 ? 's' : ''}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Outline again on top so borders read clearly over fills */}
          <path
            d={WA_OUTLINE_D}
            fill="none"
            stroke="rgb(31 41 55)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            pointerEvents="none"
          />
        </svg>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        NW 🌲 · NE ☀️ · SW 🌳 · SE 🏜️ — or use the chips below.
      </p>
    </div>
  );
}

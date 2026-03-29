"use client";

import { useCallback, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarRange } from 'lucide-react';
import { useTripDates } from '../context/TripDatesContext';
import { countTripNights, parseYmdLocal, ymdFromDateLocal } from '../lib/ymd';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

function formatDayLabel(ymd: string): string {
  return parseYmdLocal(ymd).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Compact range like "Apr 7 – Apr 14, 2026" for pill search bar. */
function formatShortRange(ymdStart: string, ymdEnd: string): string {
  const a = parseYmdLocal(ymdStart);
  const b = parseYmdLocal(ymdEnd);
  const short: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const withYear: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const sameYear = a.getFullYear() === b.getFullYear();
  const left = a.toLocaleDateString('en-US', sameYear ? short : withYear);
  const right = b.toLocaleDateString('en-US', withYear);
  return `${left} – ${right}`;
}

function dayStartTs(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function isDayInClosedInterval(day: Date, a: Date, b: Date): boolean {
  const t = dayStartTs(day);
  const lo = dayStartTs(a < b ? a : b);
  const hi = dayStartTs(a < b ? b : a);
  return t >= lo && t <= hi;
}

type TripDateRangePickerProps = {
  variant?: 'default' | 'compact' | 'pill';
  className?: string;
};

/**
 * react-day-picker's range logic (addToRange) extends an existing {from,to} in a single click.
 * To get a true two-click flow (check-in, then checkout), we open with selected=undefined and
 * show the saved trip via a read-only modifier until the user picks the first day.
 */
export function TripDateRangePicker({ variant = 'default', className }: TripDateRangePickerProps) {
  const { startDate, endDate, setTripRange } = useTripDates();
  const [open, setOpen] = useState(false);
  /** Passed to DayPicker; undefined on open so the first click only sets `from`. */
  const [pickerSelection, setPickerSelection] = useState<DateRange | undefined>(undefined);
  /** Muted highlight of current trip before user starts a new selection. */
  const [showSavedSpan, setShowSavedSpan] = useState(true);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setPickerSelection(undefined);
      setShowSavedSpan(true);
    } else {
      setPickerSelection(undefined);
      setShowSavedSpan(true);
    }
  }, []);

  const savedFrom = useMemo(() => parseYmdLocal(startDate), [startDate]);
  const savedTo = useMemo(() => parseYmdLocal(endDate), [endDate]);

  const modifiers = useMemo(
    () => ({
      saved_trip: (day: Date) =>
        showSavedSpan && isDayInClosedInterval(day, savedFrom, savedTo),
    }),
    [showSavedSpan, savedFrom, savedTo],
  );

  const onSelectRange = useCallback(
    (range: DateRange | undefined) => {
      setShowSavedSpan(false);

      if (!range?.from) {
        setPickerSelection(undefined);
        return;
      }

      if (range.to) {
        setTripRange(ymdFromDateLocal(range.from), ymdFromDateLocal(range.to));
        handleOpenChange(false);
        return;
      }

      setPickerSelection({ from: range.from, to: undefined });
    },
    [setTripRange, handleOpenChange],
  );

  const nights = countTripNights(startDate, endDate);
  const isCompact = variant === 'compact';
  const isPill = variant === 'pill';

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            !isPill &&
              'group w-full rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:border-green-400 hover:bg-green-50/40 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200',
            isCompact && !isPill && 'px-3 py-2.5',
            !isCompact && !isPill && 'px-4 py-3',
            isPill &&
              'flex h-full min-h-[3.25rem] w-full min-w-0 flex-col items-start justify-center gap-0.5 border-0 bg-transparent px-5 py-3 text-left shadow-none transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:px-8',
            className,
          )}
          aria-label="Choose trip dates, check-in through checkout"
        >
          {isPill ? (
            <>
              <span className="text-xs font-bold tracking-wide text-gray-900">When</span>
              <span className="truncate text-sm font-semibold text-gray-900">{formatShortRange(startDate, endDate)}</span>
            </>
          ) : (
            <div className="flex w-full items-center gap-3">
              <CalendarRange
                className={cn(
                  'shrink-0 text-green-600 transition group-hover:text-green-700',
                  isCompact ? 'h-4 w-4' : 'h-5 w-5',
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    'font-medium text-gray-900',
                    isCompact ? 'text-sm leading-snug' : 'text-base',
                  )}
                >
                  {formatDayLabel(startDate)} → {formatDayLabel(endDate)}
                </div>
                <div className={cn('text-gray-600', isCompact ? 'text-xs' : 'text-sm')}>
                  {nights} night{nights === 1 ? '' : 's'} · tap to change dates
                </div>
              </div>
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto max-w-[calc(100vw-1.5rem)] border-gray-200 p-0 shadow-lg sm:min-w-[36rem]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="range"
          defaultMonth={savedFrom}
          selected={pickerSelection}
          onSelect={onSelectRange}
          numberOfMonths={2}
          modifiers={modifiers}
          modifiersClassNames={{
            saved_trip: 'trip-saved-span',
          }}
          classNames={{
            months: 'flex flex-col gap-4 sm:flex-row sm:justify-center',
          }}
          initialFocus
          className="rounded-md"
        />
        <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-600">
          Choose check-in, then checkout. The calendar closes after both dates are set. Shaded dates are your current
          trip until you pick a new check-in.
        </p>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { ymdAddDays } from '../lib/ymd';

export type TripDatesState = {
  /** Check-in / first night in camp (YYYY-MM-DD) */
  startDate: string;
  /** Checkout / departure morning — not counted as a camping night (YYYY-MM-DD) */
  endDate: string;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;
  /** Set both dates in one update (check-in and checkout). */
  setTripRange: (checkInYmd: string, checkoutYmd: string) => void;
};

const TripDatesContext = createContext<TripDatesState | null>(null);

const DEFAULT_START = '2026-07-10';
/** Same 4-night default as before (slept 10–13): checkout morning of the 14th */
const DEFAULT_END = '2026-07-14';

export function TripDatesProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);

  const setStartDateSafe = useCallback((v: string) => {
    setStartDate(v);
    setEndDate((e) => (e <= v ? ymdAddDays(v, 1) : e));
  }, []);

  const setEndDateSafe = useCallback(
    (v: string) => {
      setEndDate(v <= startDate ? ymdAddDays(startDate, 1) : v);
    },
    [startDate],
  );

  const setTripRange = useCallback((checkInYmd: string, checkoutYmd: string) => {
    const a = checkInYmd <= checkoutYmd ? checkInYmd : checkoutYmd;
    const b = checkInYmd <= checkoutYmd ? checkoutYmd : checkInYmd;
    const checkoutSafe = b <= a ? ymdAddDays(a, 1) : b;
    setStartDate(a);
    setEndDate(checkoutSafe);
  }, []);

  const value = useMemo(
    () => ({
      startDate,
      endDate,
      setStartDate: setStartDateSafe,
      setEndDate: setEndDateSafe,
      setTripRange,
    }),
    [startDate, endDate, setStartDateSafe, setEndDateSafe, setTripRange],
  );

  return <TripDatesContext.Provider value={value}>{children}</TripDatesContext.Provider>;
}

export function useTripDates() {
  const ctx = useContext(TripDatesContext);
  if (!ctx) {
    throw new Error('useTripDates must be used within TripDatesProvider');
  }
  return ctx;
}

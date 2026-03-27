"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type TripDatesState = {
  /** First night (YYYY-MM-DD) */
  startDate: string;
  /** Last night inclusive (YYYY-MM-DD) */
  endDate: string;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;
};

const TripDatesContext = createContext<TripDatesState | null>(null);

const DEFAULT_START = '2026-07-10';
const DEFAULT_END = '2026-07-13';

export function TripDatesProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);

  const setStartDateSafe = useCallback((v: string) => {
    setStartDate(v);
    setEndDate((e) => (e < v ? v : e));
  }, []);

  const setEndDateSafe = useCallback(
    (v: string) => {
      setEndDate(v < startDate ? startDate : v);
    },
    [startDate],
  );

  const value = useMemo(
    () => ({
      startDate,
      endDate,
      setStartDate: setStartDateSafe,
      setEndDate: setEndDateSafe,
    }),
    [startDate, endDate, setStartDateSafe, setEndDateSafe],
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

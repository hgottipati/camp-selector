"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultWeights, type WeightId, type WeightState } from '../lib/interestWeights';

type InterestWeightsContextValue = {
  weights: WeightState;
  setWeight: (id: WeightId, value: number) => void;
  resetWeights: () => void;
};

const InterestWeightsContext = createContext<InterestWeightsContextValue | null>(null);

export function InterestWeightsProvider({ children }: { children: ReactNode }) {
  const [weights, setWeights] = useState<WeightState>(defaultWeights);

  const setWeight = useCallback((id: WeightId, value: number) => {
    setWeights((prev) => ({ ...prev, [id]: value }));
  }, []);

  const resetWeights = useCallback(() => {
    setWeights(defaultWeights());
  }, []);

  const value = useMemo(
    () => ({ weights, setWeight, resetWeights }),
    [weights, setWeight, resetWeights],
  );

  return (
    <InterestWeightsContext.Provider value={value}>{children}</InterestWeightsContext.Provider>
  );
}

export function useInterestWeights(): InterestWeightsContextValue {
  const ctx = useContext(InterestWeightsContext);
  if (!ctx) {
    throw new Error('useInterestWeights must be used within InterestWeightsProvider');
  }
  return ctx;
}

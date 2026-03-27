"use client";

import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { WEIGHT_KEY_META } from '../lib/interestWeights';
import { useInterestWeights } from '../context/InterestWeightsContext';
import { Sparkles } from 'lucide-react';
import { LOKI_MATCH_NAME } from './LokiMatchBrand';

type InterestWeightsPanelProps = {
  className?: string;
};

export function InterestWeightsPanel({ className = '' }: InterestWeightsPanelProps) {
  const { weights, setWeight, resetWeights } = useInterestWeights();

  return (
    <section
      className={`rounded-2xl border border-emerald-200/80 bg-white p-6 shadow-md ${className}`}
      aria-labelledby="interest-weights-heading"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="interest-weights-heading"
            className="flex flex-wrap items-center gap-2 text-xl font-bold text-gray-900"
          >
            <Sparkles className="h-6 w-6 text-amber-500" aria-hidden />
            Tune your <span className="text-emerald-800">{LOKI_MATCH_NAME}</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Slide each bar — we brew your <strong>{LOKI_MATCH_NAME}</strong> score for every campground
            (1–10-ish, totally unserious science). Crank what your crew actually cares about.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {WEIGHT_KEY_META.map(({ id, label }) => (
          <div key={id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={`weight-${id}`} className="text-gray-800">
                {label}
              </Label>
              <span
                className="min-w-[2.5rem] rounded-md bg-emerald-50 px-2 py-0.5 text-center text-sm font-bold tabular-nums text-emerald-800"
                aria-live="polite"
              >
                {weights[id]}
              </span>
            </div>
            <Slider
              id={`weight-${id}`}
              min={0}
              max={100}
              step={1}
              value={[weights[id]]}
              onValueChange={(v: number[]) => setWeight(id, v[0] ?? 0)}
              className="w-full [&_[data-slot=slider-track]]:h-3 [&_[data-slot=slider-track]]:bg-slate-200 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-emerald-500 [&_[data-slot=slider-range]]:to-teal-500 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-emerald-600"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={resetWeights}>
          Reset sliders
        </Button>
      </div>
    </section>
  );
}

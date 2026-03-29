import type { SampleItinerary, SampleItineraryDay } from '../data/campgrounds';

export type DerivedItinerary = {
  days: SampleItineraryDay[];
  /** Explains how the template was trimmed or extended */
  hint: string;
  tripNights: number;
  templateNights: number;
};

/**
 * Shapes `sampleItinerary.days` to the trip length from the date filter.
 * Templates are authored for `itinerary.nights`; shorter/longer stays get a sensible slice or add-on block.
 */
export function deriveItineraryForNights(itinerary: SampleItinerary, tripNights: number): DerivedItinerary {
  const templateNights = itinerary.nights;
  const days = itinerary.days;

  if (tripNights < 1 || days.length === 0) {
    return {
      days,
      hint: '',
      tripNights,
      templateNights,
    };
  }

  if (tripNights === templateNights) {
    return {
      days,
      hint: `Aligned with your ${tripNights}-night trip dates.`,
      tripNights,
      templateNights,
    };
  }

  if (tripNights < templateNights) {
    if (tripNights === 1 && days.length >= 3) {
      return {
        days: [
          days[0],
          {
            label: 'Day 2 — Pack up & roll out',
            items: [
              ...days[days.length - 1].items,
              'With one night, a Lake Chelan day trip is usually too rushed — save that for a 2+ night stay.',
            ],
          },
        ],
        hint: `You picked 1 night — showing a compact plan (middle “big day” trimmed).`,
        tripNights,
        templateNights,
      };
    }

    return {
      days: [days[0], days[days.length - 1]],
      hint: `Shortened for your ${tripNights}-night trip (first + last day only).`,
      tripNights,
      templateNights,
    };
  }

  const extra = tripNights - templateNights;
  return {
    days: [
      ...days,
      {
        label: `Extra time (${extra} more night${extra > 1 ? 's' : ''})`,
        items: [
          'Second Lake Chelan day: different beach, boat rental, or Manson vs downtown Chelan.',
          'Zero-mile day at the park: lagoon, river, courts, and naps.',
          'Optional side trips: Wenatchee, Methow / Winthrop, or local fruit stands — pick one and keep it easy.',
        ],
      },
    ],
    hint: `Your dates are ${tripNights} nights (${extra} longer than the sample) — core plan plus flexible add-ons.`,
    tripNights,
    templateNights,
  };
}

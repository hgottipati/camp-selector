"use client";

import { useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { campgrounds } from '../data/campgrounds';
import {
  MapPin,
  Clock,
  Star,
  Thermometer,
  Waves,
  Mountain,
  Tent,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Activity,
  CalendarRange,
  ListOrdered,
} from 'lucide-react';
import { useInterestWeights } from '../context/InterestWeightsContext';
import { useTripDates } from '../context/TripDatesContext';
import { buildWaGoingToCampResultsUrl } from '../lib/waGoingToCamp';
import { GoogleMapsEmbed } from '../components/GoogleMapsEmbed';
import { computeMatchScore } from '../lib/interestWeights';
import { waterTemperaturePreview } from '../lib/waterDisplay';
import { LOKI_MATCH_NAME } from '../components/LokiMatchBrand';
import { deriveItineraryForNights } from '../lib/deriveSampleItinerary';
import { countTripNights } from '../lib/ymd';

function formatTripYmd(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CampgroundDetail() {
  const { id } = useParams();
  const { weights } = useInterestWeights();
  const { startDate, endDate, setStartDate, setEndDate } = useTripDates();
  const campground = campgrounds.find((c) => c.id === id);
  const waGoingToCampUrl = buildWaGoingToCampResultsUrl(startDate, endDate);

  const tripNights = useMemo(() => countTripNights(startDate, endDate), [startDate, endDate]);
  const derivedItinerary = useMemo(() => {
    if (!campground?.sampleItinerary) return null;
    return deriveItineraryForNights(campground.sampleItinerary, tripNights);
  }, [campground, tripNights]);

  if (!campground) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campground not found</h2>
        <Link to="/" className="text-green-600 hover:underline">
          Back to all campgrounds
        </Link>
      </div>
    );
  }

  const regionColors = {
    NW: 'bg-blue-600',
    NE: 'bg-yellow-600',
    SW: 'bg-green-700',
    SE: 'bg-orange-600',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all campgrounds
      </Link>

      {/* Hero Image */}
      <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
        <img
          src={campground.image}
          alt={campground.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="rounded-full bg-emerald-600 px-4 py-1 text-sm font-medium text-white shadow-sm">
              WA State
            </span>
            <span className={`${regionColors[campground.region]} px-4 py-1 rounded-full text-sm font-medium`}>
              {campground.region}
            </span>
            <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{campground.scenicRating} / 5</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-white shadow-lg ring-1 ring-white/35 backdrop-blur-sm">
              <span className="font-bold drop-shadow-sm">
                {LOKI_MATCH_NAME} {computeMatchScore(campground.matchScores, weights)}
              </span>
            </span>
          </div>
          <p className="mb-2 text-sm text-white/90">
            {LOKI_MATCH_NAME} uses the sliders on the home page —{' '}
            <Link to="/" className="underline decoration-white/50 hover:text-white">
              adjust them there
            </Link>
            .
          </p>
          <h1 className="text-4xl font-bold mb-2">{campground.name}</h1>
          <p className="text-lg">{campground.commercialLevel}</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-5 shadow-md ring-1 ring-rose-100">
          <div className="mb-2">
            <span className="text-sm text-gray-600">Your {LOKI_MATCH_NAME}</span>
          </div>
          <p className="text-2xl font-bold text-rose-700">
            {computeMatchScore(campground.matchScores, weights)}
          </p>
          <p className="text-sm text-gray-500">from current sliders</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Distance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campground.distanceFromBothell} mi</p>
          <p className="text-sm text-gray-500">from Bothell</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Drive Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campground.driveTime}</p>
          <p className="text-sm text-gray-500">each way</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Waves className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Water Access</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{campground.waterAccess.type}</p>
          <p
            className="text-sm text-gray-500 line-clamp-3"
            title={campground.waterAccess.temperature}
          >
            {waterTemperaturePreview(campground.waterAccess.temperature, 140)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Tent className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Best For</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{campground.bestFor[0]}</p>
          <p className="text-sm text-gray-500">+ {campground.bestFor.length - 1} more</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Location</h2>
            <p className="text-sm text-gray-600">
              Google Maps embedded here — no need to leave this page. Map search uses the park name (Washington, USA).
            </p>
          </div>
        </div>
        <GoogleMapsEmbed parkName={campground.name} title={`Map of ${campground.name}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Spot</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{campground.description}</p>
          </div>

          {derivedItinerary && campground.sampleItinerary && (
            <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-md">
              <div className="mb-4 flex flex-wrap items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white">
                  <ListOrdered className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                    Your dates · Check-in {formatTripYmd(startDate)} · Checkout {formatTripYmd(endDate)} · {tripNights}{' '}
                    night{tripNights === 1 ? '' : 's'}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{campground.sampleItinerary.title}</h2>
                  <p className="mt-1 text-sm font-medium text-sky-800">{derivedItinerary.hint}</p>
                  {campground.sampleItinerary.blurb && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{campground.sampleItinerary.blurb}</p>
                  )}
                </div>
              </div>
              <ol className="space-y-6">
                {derivedItinerary.days.map((day) => (
                  <li key={day.label}>
                    <h3 className="mb-2 font-semibold text-gray-900">{day.label}</h3>
                    <ul className="space-y-2 border-l-2 border-sky-200 pl-4">
                      {day.items.map((item, idx) => (
                        <li key={`${day.label}-${idx}`} className="text-sm leading-relaxed text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-gray-500">
                Change <strong>Check-in</strong> / <strong>Checkout</strong> in the sidebar — this outline updates
                automatically (same dates as GoingToCamp).
              </p>
            </div>
          )}

          {/* Terrain */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Mountain className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Terrain & Setting</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{campground.terrain}</p>
          </div>

          {/* Water Details */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900">Water Info</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Type</p>
                  <p className="text-gray-700">{campground.waterAccess.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Thermometer className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Temperature (typical July–Aug)</p>
                  <p className="text-gray-700">{campground.waterAccess.temperature}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Not a live forecast — check weather and local advisories before you swim.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {campground.activities.map((activity) => (
                <div key={activity} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Pro Tips 💡</h2>
            </div>
            <ul className="space-y-3">
              {campground.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-800">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Best For */}
          <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Best For</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {campground.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              <div className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <CalendarRange className="h-4 w-4 text-green-600" aria-hidden />
                Trip dates (same as home page — drives sample itinerary when this park has one)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-0.5 text-xs text-gray-600">
                  Check-in
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 text-gray-900"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-xs text-gray-600">
                  Checkout
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 text-gray-900"
                  />
                </label>
              </div>
            </div>

            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={waGoingToCampUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 min-w-[10rem] items-center justify-center gap-2 rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                Check availability (GoingToCamp)
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>

            {/* Booking CTA */}
            <a
              href={campground.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2 mb-4"
            >
              Book / park info
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              to="/compare"
              className="w-full bg-gray-100 text-gray-900 px-6 py-4 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              Compare with Others
            </Link>

            {/* Season */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-bold text-gray-900 mb-3">Available Months</h4>
              <div className="flex flex-wrap gap-2">
                {campground.season.map((month) => (
                  <span
                    key={month}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

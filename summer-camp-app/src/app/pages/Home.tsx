"use client";

import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { campgrounds, type Campground } from '../data/campgrounds';
import { MapPin, Clock, Star, Thermometer, Waves, ChevronRight, CalendarRange, ExternalLink } from 'lucide-react';
import { useInterestWeights } from '../context/InterestWeightsContext';
import { useTripDates } from '../context/TripDatesContext';
import { computeMatchScore } from '../lib/interestWeights';
import { waterTemperaturePreview } from '../lib/waterDisplay';
import { InterestWeightsPanel } from '../components/InterestWeightsPanel';
import { LokiMatchScore } from '../components/LokiMatchBrand';
import { FederalCampgroundSearch } from '../components/FederalCampgroundSearch';
import { buildWaGoingToCampResultsUrl } from '../lib/waGoingToCamp';

type RegionFilter = 'all' | Campground['region'];
type SourceTab = 'wa' | 'federal';

export default function Home() {
  const [sourceTab, setSourceTab] = useState<SourceTab>('wa');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('all');
  const { weights } = useInterestWeights();
  const { startDate, endDate, setStartDate, setEndDate } = useTripDates();

  const regionCounts = useMemo(
    () => ({
      NW: campgrounds.filter((c) => c.region === 'NW').length,
      NE: campgrounds.filter((c) => c.region === 'NE').length,
      SW: campgrounds.filter((c) => c.region === 'SW').length,
      SE: campgrounds.filter((c) => c.region === 'SE').length,
    }),
    [],
  );

  const filteredCampgrounds = useMemo(() => {
    const base =
      selectedRegion === 'all'
        ? [...campgrounds]
        : campgrounds.filter((c) => c.region === selectedRegion);
    return base
      .map((c) => ({
        campground: c,
        score: computeMatchScore(c.matchScores, weights),
      }))
      .sort((x, y) => {
        if (y.score !== x.score) return y.score - x.score;
        return x.campground.name.localeCompare(y.campground.name);
      })
      .map(({ campground }) => campground);
  }, [selectedRegion, weights]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-3">Let's Pick Our Perfect Campground! 🎉</h2>
        <p className="text-lg mb-4">
          We've researched {campgrounds.length} great spots around Washington State. Each one has its own vibe — from
          saltwater beaches to desert lakes to lush forests. Let's find the best fit for our crew!
        </p>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <span className="text-2xl">👥</span> 8 People
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <span className="text-2xl">⛺</span> 3 Tents
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <span className="text-2xl">☀️</span> Summer Vibes
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-gray-800">
          <CalendarRange className="h-5 w-5 text-green-600" aria-hidden />
          <h3 className="text-lg font-bold">Trip dates (shared)</h3>
          <span className="text-sm text-gray-600">
            First night through last night — used for WA GoingToCamp links and Recreation.gov availability.
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            First night
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Last night
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </label>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSourceTab('wa')}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            sourceTab === 'wa'
              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
              : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
          }`}
        >
          WA State Parks
          <span className="ml-2 text-xs font-normal opacity-90">manual list + Loki Match</span>
        </button>
        <button
          type="button"
          onClick={() => setSourceTab('federal')}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            sourceTab === 'federal'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
              : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
          }`}
        >
          Recreation.gov
          <span className="ml-2 text-xs font-normal opacity-90">live federal availability</span>
        </button>
      </div>

      {sourceTab === 'wa' && (
        <div className="mb-8">
          <InterestWeightsPanel />
          <p className="mt-3 text-center text-sm text-gray-600">
            Cards below are sorted by <strong>Loki Match</strong> (highest first) and reshuffle when you move the sliders.
          </p>
        </div>
      )}

      {sourceTab === 'wa' && (
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          type="button"
          onClick={() => setSelectedRegion('all')}
          className={`px-5 py-2.5 rounded-lg transition ${
            selectedRegion === 'all'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All regions ({campgrounds.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('NW')}
          className={`px-5 py-2.5 rounded-lg transition ${
            selectedRegion === 'NW'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Northwest 🌲 ({regionCounts.NW})
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('NE')}
          className={`px-5 py-2.5 rounded-lg transition ${
            selectedRegion === 'NE'
              ? 'bg-yellow-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Northeast ☀️ ({regionCounts.NE})
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('SW')}
          className={`px-5 py-2.5 rounded-lg transition ${
            selectedRegion === 'SW'
              ? 'bg-green-700 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Southwest 🌳 ({regionCounts.SW})
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('SE')}
          className={`px-5 py-2.5 rounded-lg transition ${
            selectedRegion === 'SE'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Southeast 🏜️ ({regionCounts.SE})
        </button>
      </div>
      )}

      {sourceTab === 'wa' && (
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCampgrounds.map((campground) => {
          const waAvailUrl = buildWaGoingToCampResultsUrl(startDate, endDate);
          return (
            <div
              key={campground.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group flex flex-col"
            >
              <Link to={`/campground/${campground.id}`} className="block">
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={campground.image}
                    alt={campground.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                    <span className="rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                      WA State
                    </span>
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                      {campground.region}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <div className="bg-yellow-400 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{campground.scenicRating}</span>
                      <span className="text-xs font-medium text-gray-800">/5 scenic</span>
                    </div>
                    <LokiMatchScore score={computeMatchScore(campground.matchScores, weights)} />
                  </div>
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-1">
                <Link to={`/campground/${campground.id}`} className="block">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                    {campground.name}
                  </h3>
                </Link>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{campground.distanceFromBothell} miles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{campground.driveTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Waves className="w-4 h-4 text-blue-500" />
                    <span>{campground.waterAccess.type}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm text-gray-600"
                    title={campground.waterAccess.temperature}
                  >
                    <Thermometer className="w-4 h-4 shrink-0 text-red-500" />
                    <span className="line-clamp-2">{waterTemperaturePreview(campground.waterAccess.temperature)}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{campground.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {campground.bestFor.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-4 border-t sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to={`/campground/${campground.id}`}
                    className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={waAvailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                  >
                    Check availability
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Opens Washington GoingToCamp with your trip dates prefilled (state reservation system).
                </p>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {sourceTab === 'federal' && <FederalCampgroundSearch />}

      {/* Bottom CTA */}
      <div className="mt-12 bg-blue-100 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Can't Decide? 🤔</h3>
        <p className="text-gray-700 mb-5">
          Use our comparison tool to see campgrounds side-by-side, or open the map to see where they sit in the state.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/compare"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            Compare Campgrounds
          </Link>
          <Link
            to="/map"
            className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md border border-gray-200"
          >
            View on Map
          </Link>
        </div>
      </div>
    </div>
  );
}

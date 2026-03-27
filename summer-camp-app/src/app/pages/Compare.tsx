"use client";

import { useMemo, useState } from 'react';
import { campgrounds, type Campground } from '../data/campgrounds';
import { Link } from 'react-router';
import {
  MapPin,
  Clock,
  Star,
  Thermometer,
  Waves,
  Mountain,
  Tent,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useInterestWeights } from '../context/InterestWeightsContext';
import { computeMatchScore } from '../lib/interestWeights';
import { waterTemperaturePreview } from '../lib/waterDisplay';
import { InterestWeightsPanel } from '../components/InterestWeightsPanel';
import { LOKI_MATCH_NAME, LokiMatchScore } from '../components/LokiMatchBrand';

export default function Compare() {
  const { weights } = useInterestWeights();
  const [selectedIds, setSelectedIds] = useState<string[]>([
    campgrounds[0].id,
    campgrounds[1].id,
  ]);

  const selectedCampgrounds = selectedIds
    .map((id) => campgrounds.find((c) => c.id === id))
    .filter((c): c is Campground => c != null);

  const weightedWinner = useMemo(() => {
    if (selectedCampgrounds.length !== 2) return null;
    const [a, b] = selectedCampgrounds;
    const sa = computeMatchScore(a.matchScores, weights);
    const sb = computeMatchScore(b.matchScores, weights);
    if (sa === sb) return null;
    return sa > sb ? a : b;
  }, [selectedCampgrounds, weights]);

  const handleSelectChange = (index: number, newId: string) => {
    const newSelected = [...selectedIds];
    newSelected[index] = newId;
    setSelectedIds(newSelected);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-3">Compare Campgrounds 📊</h2>
        <p className="text-lg">
          Pick any two campgrounds to see how they stack up side-by-side. This makes it easy to
          decide which one is right for your group!
        </p>
      </div>

      <div className="mb-8">
        <InterestWeightsPanel className="border-violet-200/80" />
        <p className="mt-3 text-center text-sm text-gray-600">
          <strong>{LOKI_MATCH_NAME}</strong> scores below update live with the sliders — same brew as
          the home page.
        </p>
      </div>

      {/* Selection Dropdowns */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[0, 1].map((index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campground {index + 1}
            </label>
            <select
              value={selectedIds[index]}
              onChange={(e) => handleSelectChange(index, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {campgrounds.map((campground) => (
                <option key={campground.id} value={campground.id}>
                  {campground.name} ({campground.region})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {selectedCampgrounds.map((campground) => (
          <div key={campground!.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={campground!.image}
                alt={campground!.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 shadow-sm">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold">{campground!.scenicRating}</span>
                </div>
                <LokiMatchScore score={computeMatchScore(campground!.matchScores, weights)} />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{campground!.name}</h3>

              {/* Key Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Distance from Bothell</p>
                    <p className="font-bold text-gray-900">{campground!.distanceFromBothell} miles</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Drive Time</p>
                    <p className="font-bold text-gray-900">{campground!.driveTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5 fill-current" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Scenic Rating</p>
                    <p className="font-bold text-gray-900">{campground!.scenicRating} / 5</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-rose-500" aria-hidden />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Your {LOKI_MATCH_NAME}</p>
                    <p className="font-bold text-rose-700">
                      {computeMatchScore(campground!.matchScores, weights)} / 10
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Waves className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Water Access</p>
                    <p className="font-bold text-gray-900">{campground!.waterAccess.type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Thermometer className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Water temp (July-ish, typical)</p>
                    <p className="text-sm font-semibold leading-snug text-gray-900">
                      {campground!.waterAccess.temperature}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tent className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Commercial Level</p>
                    <p className="font-bold text-gray-900">{campground!.commercialLevel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mountain className="w-5 h-5 text-green-700 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Terrain</p>
                    <p className="text-gray-900 text-sm">{campground!.terrain}</p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Activities ({campground!.activities.length})</h4>
                <div className="space-y-2">
                  {campground!.activities.slice(0, 5).map((activity) => (
                    <div key={activity} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  ))}
                  {campground!.activities.length > 5 && (
                    <p className="text-sm text-gray-500 ml-6">
                      +{campground!.activities.length - 5} more activities
                    </p>
                  )}
                </div>
              </div>

              {/* Best For Tags */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {campground!.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/campground/${campground!.id}`}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center"
              >
                View Full Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Winner Recommendation */}
      {selectedCampgrounds.length === 2 && weightedWinner && (
        <div className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50/80 p-6 text-center shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-800">
            For your current {LOKI_MATCH_NAME} mix
          </p>
          <p className="mt-2 text-xl font-bold text-gray-900">
            Leaning toward{' '}
            <span className="text-rose-700">{weightedWinner.name}</span>
            <span className="text-base font-normal text-gray-600">
              {' '}
              ({LOKI_MATCH_NAME}: {computeMatchScore(weightedWinner.matchScores, weights)} vs{' '}
              {computeMatchScore(
                selectedCampgrounds.find((c) => c.id !== weightedWinner.id)!.matchScores,
                weights,
              )}
              )
            </span>
          </p>
        </div>
      )}

      {selectedCampgrounds.length === 2 && (
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Comparison Summary 🎯</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-800">
            <div>
              <h4 className="font-bold mb-2 text-lg">{selectedCampgrounds[0]!.name}</h4>
              <ul className="space-y-1 text-sm">
                <li>✨ {selectedCampgrounds[0]!.scenicRating > selectedCampgrounds[1]!.scenicRating ? 'More scenic' : 'Less scenic'}</li>
                <li>🚗 {selectedCampgrounds[0]!.distanceFromBothell < selectedCampgrounds[1]!.distanceFromBothell ? 'Closer to home' : 'Farther from home'}</li>
                <li>
                  💧 Water-fun rubric: {selectedCampgrounds[0]!.matchScores.water}/10 vs{' '}
                  {selectedCampgrounds[1]!.matchScores.water}/10 (see temp notes above)
                </li>
                <li>🎪 {selectedCampgrounds[0]!.activities.length > selectedCampgrounds[1]!.activities.length ? 'More activities' : 'Fewer activities'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-lg">{selectedCampgrounds[1]!.name}</h4>
              <ul className="space-y-1 text-sm">
                <li>✨ {selectedCampgrounds[1]!.scenicRating > selectedCampgrounds[0]!.scenicRating ? 'More scenic' : 'Less scenic'}</li>
                <li>🚗 {selectedCampgrounds[1]!.distanceFromBothell < selectedCampgrounds[0]!.distanceFromBothell ? 'Closer to home' : 'Farther from home'}</li>
                <li>
                  💧 Water-fun rubric: {selectedCampgrounds[1]!.matchScores.water}/10 vs{' '}
                  {selectedCampgrounds[0]!.matchScores.water}/10 (see temp notes above)
                </li>
                <li>🎪 {selectedCampgrounds[1]!.activities.length > selectedCampgrounds[0]!.activities.length ? 'More activities' : 'Fewer activities'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* All Campgrounds Quick Reference */}
      <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Reference Table 📋</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Campground</th>
                <th className="text-left py-3 px-4">Region</th>
                <th className="text-left py-3 px-4">Distance</th>
                <th className="text-left py-3 px-4">Drive Time</th>
                <th className="text-left py-3 px-4">Scenic</th>
                <th className="text-left py-3 px-4">{LOKI_MATCH_NAME}</th>
                <th className="text-left py-3 px-4">Water Temp</th>
              </tr>
            </thead>
            <tbody>
              {campgrounds.map((campground) => (
                <tr key={campground.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{campground.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      campground.region === 'NW' ? 'bg-blue-100 text-blue-800' :
                      campground.region === 'NE' ? 'bg-yellow-100 text-yellow-800' :
                      campground.region === 'SW' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {campground.region}
                    </span>
                  </td>
                  <td className="py-3 px-4">{campground.distanceFromBothell} mi</td>
                  <td className="py-3 px-4">{campground.driveTime}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {campground.scenicRating}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-rose-700">
                    {computeMatchScore(campground.matchScores, weights)}
                  </td>
                  <td className="max-w-[220px] py-3 px-4 text-xs leading-snug">
                    {waterTemperaturePreview(campground.waterAccess.temperature, 90)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

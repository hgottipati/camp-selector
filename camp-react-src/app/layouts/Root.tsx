import { Outlet, Link, useLocation } from 'react-router';
import { Tent, Map, GitCompare } from 'lucide-react';
import { InterestWeightsProvider } from '../context/InterestWeightsContext';
import { LOKI_MATCH_NAME } from '../components/LokiMatchBrand';

export default function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Tent className="h-9 w-9 shrink-0 text-green-600" aria-hidden />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Summer Camp 2026</h1>
                <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-gray-600">
                  <span className="font-semibold text-emerald-800">{LOKI_MATCH_NAME}</span>
                  <span aria-hidden>·</span>
                  <span>8 people · 3 tents · Washington</span>
                </p>
              </div>
            </Link>

            <nav className="flex gap-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Campgrounds
              </Link>
              <Link
                to="/map"
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  location.pathname === '/map'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </Link>
              <Link
                to="/compare"
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  location.pathname === '/compare'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content — shared interest weights for match scores across pages */}
      <main>
        <InterestWeightsProvider>
          <Outlet />
        </InterestWeightsProvider>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            🏕️ Planning our summer adventure · July - September 2026
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Book early! Popular weekends fill up 9 months in advance
          </p>
          <p className="mt-3 text-xs text-gray-500">
            <span className="font-medium text-gray-400">{LOKI_MATCH_NAME}</span> — silly weighted score from
            the sliders; not scientific, just fun for the group chat.
          </p>
        </div>
      </footer>
    </div>
  );
}

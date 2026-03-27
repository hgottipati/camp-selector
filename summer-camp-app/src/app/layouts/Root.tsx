import { Outlet, Link, useLocation } from 'react-router';
import { Tent, Map, GitCompare } from 'lucide-react';
import { InterestWeightsProvider } from '../context/InterestWeightsContext';
import { TripDatesProvider } from '../context/TripDatesContext';
import { LOKI_MATCH_NAME } from '../components/LokiMatchBrand';

export default function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full min-w-0 bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      {/* Header — stack on narrow screens so nav never forces horizontal overflow */}
      <header className="sticky top-0 z-50 w-full min-w-0 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="flex min-w-0 max-w-full items-start gap-3">
              <Tent className="h-9 w-9 shrink-0 text-green-600" aria-hidden />
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Summer Camp 2026</h1>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-gray-600 sm:text-sm">
                  <span className="font-semibold text-emerald-800">{LOKI_MATCH_NAME}</span>
                  <span aria-hidden>·</span>
                  <span>8 people · 3 tents · Washington</span>
                </p>
              </div>
            </Link>

            <nav className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
              <Link
                to="/"
                className={`inline-flex flex-1 justify-center rounded-lg px-3 py-2 text-sm transition sm:flex-initial sm:px-4 ${
                  location.pathname === '/'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Campgrounds
              </Link>
              <Link
                to="/map"
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm transition sm:flex-initial sm:gap-2 sm:px-4 ${
                  location.pathname === '/map'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map className="h-4 w-4 shrink-0" />
                Map
              </Link>
              <Link
                to="/compare"
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm transition sm:flex-initial sm:gap-2 sm:px-4 ${
                  location.pathname === '/compare'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <GitCompare className="h-4 w-4 shrink-0" />
                Compare
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content — shared interest weights for match scores across pages */}
      <main>
        <InterestWeightsProvider>
          <TripDatesProvider>
            <Outlet />
          </TripDatesProvider>
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

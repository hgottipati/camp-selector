"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/map-leaflet.css";
import { campgrounds, type Campground } from "../data/campgrounds";
import { Star, MapPin, Clock, Navigation, Sparkles } from "lucide-react";
import { useInterestWeights } from "../context/InterestWeightsContext";
import { computeMatchScore } from "../lib/interestWeights";
import { LOKI_MATCH_NAME } from "../components/LokiMatchBrand";
import { ShareListingButton } from "../components/ShareListingButton";

const BOTHELL: L.LatLngExpression = [47.7593, -122.2054];

function regionHex(region: Campground["region"]): string {
  switch (region) {
    case "NW":
      return "#2563eb";
    case "NE":
      return "#ca8a04";
    case "SW":
      return "#16a34a";
    case "SE":
      return "#ea580c";
    default:
      return "#64748b";
  }
}

function makeCampIcon(campground: Campground, selected: boolean): L.DivIcon {
  const color = regionHex(campground.region);
  const scale = selected ? 1.35 : 1;
  const ring = selected ? "0 0 0 4px rgba(255,255,255,0.95), 0 4px 14px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.35)";
  return L.divIcon({
    className: "wa-camp-marker",
    html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:${ring};transform:scale(${scale})"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export default function MapView() {
  const { weights } = useInterestWeights();
  const [selectedCampground, setSelectedCampground] = useState(campgrounds[0]);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const skipFlyRef = useRef(true);

  // Init Leaflet map + markers once
  useEffect(() => {
    const el = mapElRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, { scrollWheelZoom: true }).setView([47.4, -120.2], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    const bounds = L.latLngBounds([BOTHELL as L.LatLngTuple]);

    L.circleMarker(BOTHELL, {
      radius: 9,
      color: "#dc2626",
      weight: 3,
      fillColor: "#ef4444",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup("<strong>Bothell</strong><br/>Home base");

    campgrounds.forEach((c) => {
      const selected = c.id === selectedCampground.id;
      const marker = L.marker([c.latitude, c.longitude], {
        icon: makeCampIcon(c, selected),
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width:160px"><strong>${c.name}</strong><br/>` +
          `<span style="opacity:.85">${c.distanceFromBothell} mi · ${c.driveTime}</span></div>`,
      );

      marker.on("click", () => {
        setSelectedCampground(c);
      });

      markersRef.current[c.id] = marker;
      bounds.extend([c.latitude, c.longitude]);
    });

    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 8 });

    const mapHost = el.parentElement;
    const ro =
      mapHost &&
      new ResizeObserver(() => {
        map.invalidateSize();
      });
    if (mapHost && ro) ro.observe(mapHost);

    return () => {
      ro?.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; selection synced in next effect
  }, []);

  // Keep marker highlight + map focus in sync with selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    campgrounds.forEach((c) => {
      const m = markersRef.current[c.id];
      if (m) {
        m.setIcon(makeCampIcon(c, c.id === selectedCampground.id));
      }
    });

    if (skipFlyRef.current) {
      skipFlyRef.current = false;
      return;
    }

    map.flyTo([selectedCampground.latitude, selectedCampground.longitude], Math.max(map.getZoom(), 8), {
      duration: 0.55,
    });
  }, [selectedCampground]);

  return (
    <div className="flex h-[calc(100dvh-10.5rem)] min-h-[360px] w-full min-w-0 flex-col overflow-hidden md:h-[calc(100dvh-9rem)] md:min-h-[480px] md:max-h-[calc(100dvh-9rem)] md:flex-row">
      {/* Map first on small screens so it gets real height; list below, scrollable */}
      <div className="relative order-1 min-h-0 w-full min-w-0 flex-1 bg-slate-100 md:order-2 md:h-full md:min-h-0 md:flex-1">
        {/* Shorter on mobile so tiles + attribution sit above the compact bottom bar */}
        <div
          ref={mapElRef}
          className="absolute inset-x-0 top-0 bottom-[4.25rem] z-0 md:inset-0"
        />

        <div className="pointer-events-none absolute inset-0 z-[500]">
          <div className="pointer-events-auto absolute top-3 right-3 z-[502] max-w-[min(180px,calc(100%-5.5rem))] rounded-lg bg-white/95 p-2.5 text-xs shadow-lg backdrop-blur md:right-4 md:max-w-[200px] md:p-4 md:text-sm">
            <h4 className="mb-2 font-bold text-gray-900">Legend</h4>
            <div className="space-y-1.5 text-gray-700 md:space-y-2 md:text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" /> NW
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-600" /> NE
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-600" /> SW
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-600" /> SE
              </div>
              <div className="flex items-center gap-2 border-t border-gray-200 pt-1.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 ring-2 ring-white" /> Bothell
              </div>
            </div>
          </div>

          {/* Desktop / tablet: richer card above map */}
          {selectedCampground && (
            <div className="pointer-events-auto absolute bottom-4 left-1/2 z-[501] hidden w-[min(100%-2rem,28rem)] max-w-[28rem] -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow-2xl md:block">
              <img
                src={selectedCampground.image}
                alt={selectedCampground.name}
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedCampground.name}</h3>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-1 text-sm">
                      <Star className="h-3 w-3 fill-current" />
                      {selectedCampground.scenicRating}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-rose-600" aria-hidden />
                      {LOKI_MATCH_NAME} {computeMatchScore(selectedCampground.matchScores, weights)}
                    </span>
                  </div>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">{selectedCampground.description}</p>
                <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedCampground.distanceFromBothell} miles</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{selectedCampground.driveTime}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ShareListingButton
                    href={`/campground/${selectedCampground.id}`}
                    title={selectedCampground.name}
                    text={`${selectedCampground.name} — on the campground map`}
                    compact
                    className="shrink-0"
                  />
                  <Link
                    to={`/campground/${selectedCampground.id}`}
                    className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  >
                    View full details
                    <Navigation className="h-4 w-4 shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: thin bar — full card was covering the whole map */}
          {selectedCampground && (
            <div className="pointer-events-auto absolute right-2 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-2 z-[501] flex items-center gap-2 rounded-xl border border-gray-200 bg-white/95 p-2.5 pr-2 shadow-lg backdrop-blur md:hidden">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900">{selectedCampground.name}</p>
                <p className="text-xs text-gray-500">
                  Tap pins for more · {selectedCampground.distanceFromBothell} mi
                </p>
              </div>
              <Link
                to={`/campground/${selectedCampground.id}`}
                className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"
              >
                Details
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: scrollable strip under map on phones */}
      <div className="order-2 max-h-[min(34vh,300px)] w-full shrink-0 overflow-y-auto border-t border-gray-200 bg-white shadow-md md:order-1 md:max-h-none md:h-full md:w-96 md:shrink-0 md:border-r md:border-t-0 md:shadow-lg">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white md:p-6">
          <h2 className="mb-1 text-xl font-bold md:mb-2 md:text-2xl">Campground map</h2>
          <p className="text-xs text-white/90 md:text-sm">
            OpenStreetMap — tap a pin or choose below. Red dot = Bothell.
          </p>
        </div>

        <div className="divide-y">
          {campgrounds.map((campground) => (
            <div
              key={campground.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCampground(campground)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedCampground(campground);
                }
              }}
              className={`w-full cursor-pointer p-4 text-left transition hover:bg-gray-50 ${
                selectedCampground.id === campground.id ? "border-l-4 border-green-600 bg-green-50" : ""
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-gray-900">{campground.name}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    campground.region === "NW"
                      ? "bg-blue-100 text-blue-800"
                      : campground.region === "NE"
                        ? "bg-yellow-100 text-yellow-800"
                        : campground.region === "SW"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {campground.region}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{campground.distanceFromBothell} miles from Bothell</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{campground.driveTime} drive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
                  <span>{campground.scenicRating} / 5 scenic rating</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-rose-700">
                  <Sparkles className="h-4 w-4 shrink-0 text-rose-500" aria-hidden />
                  <span>
                    {LOKI_MATCH_NAME} {computeMatchScore(campground.matchScores, weights)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  to={`/campground/${campground.id}`}
                  className="text-sm text-green-600 hover:text-green-700 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View details →
                </Link>
                <span onClick={(e) => e.stopPropagation()} className="relative z-20 inline-flex">
                  <ShareListingButton
                    href={`/campground/${campground.id}`}
                    title={campground.name}
                    compact
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

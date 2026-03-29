/** Pin on Google Maps at coordinates (map view, not turn-by-turn directions). */
export function googleMapsPinUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

/** Prefer a curated place / goo.gl / maps.app link when set; otherwise lat,lng. */
export function resolveCampgroundMapsUrl(params: {
  googleMapsUrl?: string;
  latitude: number;
  longitude: number;
}): string {
  const trimmed = params.googleMapsUrl?.trim();
  if (trimmed) return trimmed;
  return googleMapsPinUrl(params.latitude, params.longitude);
}

/** Stable text query for geocoding WA listings (name is usually “… State Park”). */
export function googleMapsPlaceQuery(parkName: string): string {
  const n = parkName.trim();
  return `${n}, Washington, USA`;
}

/**
 * URL for an embedded Google Map (iframe). User stays on your site.
 * Uses the park **name** (plus Washington, USA) as `q` so Google picks the place, not raw coordinates.
 *
 * Set `VITE_GOOGLE_MAPS_EMBED_API_KEY` (Maps Embed API) in `.env` for the supported embed endpoint.
 * Without a key, uses the public search embed (`output=embed`); restrict the key by HTTP referrer in Google Cloud.
 */
export function googleMapsEmbedSrc(params: { placeQuery: string }): string {
  const q = params.placeQuery.trim();
  const key = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY?.trim();
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&zoom=11`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed&hl=en`;
}

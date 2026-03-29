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

/**
 * URL for an embedded Google Map (iframe). User stays on your site.
 * Set `VITE_GOOGLE_MAPS_EMBED_API_KEY` (Maps Embed API) in `.env` for the supported embed endpoint.
 * Without a key, uses the public coordinate embed (`output=embed`); restrict the key by HTTP referrer in Google Cloud.
 */
export function googleMapsEmbedSrc(params: { latitude: number; longitude: number }): string {
  const { latitude, longitude } = params;
  const key = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY?.trim();
  const q = `${latitude},${longitude}`;
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&zoom=12`;
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=12&output=embed&hl=en`;
}

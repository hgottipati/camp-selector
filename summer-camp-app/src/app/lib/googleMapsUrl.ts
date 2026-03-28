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

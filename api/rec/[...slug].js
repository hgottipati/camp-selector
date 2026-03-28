/**
 * Proxies whitelisted recreation.gov JSON endpoints for the SPA (CORS-safe).
 * See https://www.recreation.gov/use-our-data
 */
const UPSTREAM_BASE = 'https://www.recreation.gov/api';

const ALLOW = /^(search|camps\/campgrounds\/\d+|camps\/availability\/campground\/\d+\/month)$/;

/**
 * Vercel catch-all routes often do not set req.query.slug; path must be read from req.url.
 */
function getProxyPathAndSearch(req) {
  const raw = req.url || '';
  let pathname = '';
  let searchParams;
  try {
    const u = new URL(raw, 'http://localhost');
    pathname = u.pathname.replace(/\/$/, '') || '/';
    searchParams = u.searchParams;
  } catch {
    return { pathPart: null, searchParams: new URLSearchParams() };
  }

  const prefixes = ['/api/rec', '/rec'];
  for (const prefix of prefixes) {
    const withSlash = `${prefix}/`;
    if (pathname.startsWith(withSlash)) {
      const pathPart = pathname.slice(withSlash.length);
      return { pathPart: pathPart || null, searchParams };
    }
  }

  // Some runtimes pass only the tail (e.g. /search?q=… ) without the /api/rec prefix.
  const tail = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  if (tail && ALLOW.test(tail)) {
    return { pathPart: tail, searchParams };
  }

  const slug = req.query?.slug;
  if (slug !== undefined && slug !== null) {
    const pathPart = Array.isArray(slug) ? slug.join('/') : String(slug);
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key === 'slug') continue;
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        if (v !== undefined && v !== null && v !== '') sp.append(key, String(v));
      }
    }
    return { pathPart: pathPart || null, searchParams: sp };
  }

  return { pathPart: null, searchParams: searchParams || new URLSearchParams() };
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pathPart, searchParams } = getProxyPathAndSearch(req);
  if (!pathPart) {
    return res.status(400).json({ error: 'Missing path' });
  }

  if (!ALLOW.test(pathPart)) {
    return res.status(403).json({ error: 'Path not allowed' });
  }

  const target = new URL(`${UPSTREAM_BASE}/${pathPart}`);
  for (const [key, value] of searchParams) {
    target.searchParams.append(key, value);
  }

  const upstream = await fetch(target.toString(), {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'NatureTripPlanner/1.0 (availability lookup; recreation.gov public API)',
    },
  });

  const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
  const body = await upstream.text();
  res.status(upstream.status).setHeader('Content-Type', contentType);
  return res.send(body);
}

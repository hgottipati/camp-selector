/**
 * Proxies whitelisted recreation.gov JSON endpoints for the SPA (CORS-safe).
 * See https://www.recreation.gov/use-our-data
 */
const UPSTREAM_BASE = 'https://www.recreation.gov/api';

const ALLOW = /^(search|camps\/campgrounds\/\d+|camps\/availability\/campground\/\d+\/month)$/;

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slugParam = req.query.slug;
  if (slugParam === undefined || slugParam === null) {
    return res.status(400).json({ error: 'Missing path' });
  }

  const pathPart = Array.isArray(slugParam) ? slugParam.join('/') : String(slugParam);
  if (!ALLOW.test(pathPart)) {
    return res.status(403).json({ error: 'Path not allowed' });
  }

  const target = new URL(`${UPSTREAM_BASE}/${pathPart}`);
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'slug') continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (v !== undefined && v !== null && v !== '') {
        target.searchParams.append(key, String(v));
      }
    }
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

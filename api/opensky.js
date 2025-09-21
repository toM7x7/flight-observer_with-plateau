import fs from 'fs/promises';
import path from 'path';

const FALLBACK_FILE = path.join(process.cwd(), 'sample', 'states_hnd.json');
const REQUEST_TIMEOUT_MS = Number(process.env.OPEN_SKY_TIMEOUT_MS || 8000);

export default async function handler(req, res) {
  try {
    const { lamin, lamax, lomin, lomax } = req.query;
    if ([lamin, lamax, lomin, lomax].some(v => v === undefined)) {
      res.status(400).json({ ok: false, error: 'lamin, lamax, lomin, lomax are required' });
      return;
    }

    const qs = new URLSearchParams({ lamin, lamax, lomin, lomax }).toString();
    const target = `https://opensky-network.org/api/states/all?${qs}`;

    const headers = { Accept: 'application/json' };
    const user = process.env.OPEN_SKY_USERNAME || process.env.OPEN_SKY_USER || '';
    const pass = process.env.OPEN_SKY_PASSWORD || process.env.OPEN_SKY_PASS || '';
    if (user && pass) {
      headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error('timeout')), REQUEST_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(target, { headers, cache: 'no-store', redirect: 'follow', signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();

    if (!response.ok) {
      res.status(response.status).json({ ok: false, upstream: true, status: response.status, body: raw.slice(0, 200) });
      return;
    }

    if (!contentType.includes('application/json')) {
      res.status(502).json({ ok: false, upstream: true, status: response.status, body: raw.slice(0, 200) });
      return;
    }

    const data = JSON.parse(raw);
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    res.status(200).json({ ok: true, fallback: false, data });
  } catch (err) {
    try {
      const fallbackRaw = await fs.readFile(FALLBACK_FILE, 'utf8');
      const fallbackData = JSON.parse(fallbackRaw);
      res.status(200).json({ ok: false, fallback: true, data: fallbackData, error: String(err) });
    } catch (fallbackErr) {
      res.status(502).json({ ok: false, error: String(err), fallbackError: String(fallbackErr) });
    }
  }
}

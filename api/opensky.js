export default async function handler(req, res) {
  try {
    const { lamin, lamax, lomin, lomax } = req.query;
    if ([lamin, lamax, lomin, lomax].some(v => v === undefined)) {
      res.status(400).json({ error: 'lamin, lamax, lomin, lomax are required' });
      return;
    }

    const qs = new URLSearchParams({ lamin, lamax, lomin, lomax }).toString();
    const url = `https://opensky-network.org/api/states/all?${qs}`;

    const headers = { Accept: 'application/json' };
    const user = process.env.OPEN_SKY_USERNAME || '';
    const pass = process.env.OPEN_SKY_PASSWORD || '';
    if (user && pass) {
      headers.Authorization = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
    }

    const response = await fetch(url, { headers, cache: 'no-store', redirect: 'follow' });
    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();

    if (!response.ok) {
      res.status(response.status).json({ error: 'upstream', status: response.status, body: raw.slice(0, 200) });
      return;
    }

    if (!contentType.includes('application/json')) {
      res.status(502).json({ error: 'non-json-upstream', contentType, body: raw.slice(0, 200) });
      return;
    }

    const data = JSON.parse(raw);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (err) {
    console.error('opensky api error', err);
    res.status(500).json({ error: 'server', message: String(err) });
  }
}

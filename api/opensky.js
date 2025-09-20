export default async function handler(req, res) {
  try {
    const { lamin, lamax, lomin, lomax } = req.query;
    if ([lamin,lamax,lomin,lomax].some(v=>v===undefined)) {
      res.status(400).json({ error: 'lamin, lamax, lomin, lomax are required' }); return;
    }
    const qp = new URLSearchParams({ lamin, lamax, lomin, lomax }).toString();
    const url = `https://opensky-network.org/api/states/all?${qp}`;

    // 認証（任意）
    const user = process.env.OPEN_SKY_USERNAME || '';
    const pass = process.env.OPEN_SKY_PASSWORD || '';
    const headers = {};
    if (user && pass) headers['Authorization'] = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

    const r = await fetch(url, { headers, cache: 'no-store' });
    const js = await r.json();
    res.setHeader('Cache-Control','no-store');
    res.status(200).json(js);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}

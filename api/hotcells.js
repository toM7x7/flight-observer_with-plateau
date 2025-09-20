export default async function handler(req, res) {
  try {
    const lamin = parseFloat(process.env.HOTSCAN_LAMIN || '24.0');
    const lamax = parseFloat(process.env.HOTSCAN_LAMAX || '46.0');
    const lomin = parseFloat(process.env.HOTSCAN_LOMIN || '123.0');
    const lomax = parseFloat(process.env.HOTSCAN_LOMAX || '146.0');
    const cell  = parseFloat(process.env.HOTSCAN_CELL_SIZE || '0.25');
    const topk  = parseInt(process.env.HOTSCAN_TOPK || '5', 10);

    const qp = new URLSearchParams({ lamin, lamax, lomin, lomax }).toString();
    const url = `https://opensky-network.org/api/states/all?${qp}`;

    const headers = {};
    const u = process.env.OPEN_SKY_USERNAME || ''; const p = process.env.OPEN_SKY_PASSWORD || '';
    if (u && p) headers['Authorization'] = 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64');

    const r = await fetch(url, { headers, cache:'no-store' });
    const data = await r.json();

    const bins = new Map(); // "i:j" -> count
    const idx = (lat,lon)=> `${Math.floor((lat-lamin)/cell)}:${Math.floor((lon-lomin)/cell)}`;
    for (const s of (data.states||[])) {
      const lat=s[6], lon=s[5]; if (lat==null||lon==null) continue;
      const k=idx(lat,lon); bins.set(k,(bins.get(k)||0)+1);
    }
    const cells=[];
    for (const [k,c] of bins) {
      const [i,j]=k.split(':').map(Number);
      const cLamin = lamin + i*cell, cLomin = lomin + j*cell;
      cells.push({ count:c, bbox:{ lamin:cLamin, lamax:cLamin+cell, lomin:cLomin, lomax:cLomin+cell } });
    }
    cells.sort((a,b)=>b.count-a.count);
    res.status(200).json({ time:data.time, cells: cells.slice(0, topk) });
  } catch (e) {
    res.status(500).json({ error:String(e) });
  }
}

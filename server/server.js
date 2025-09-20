import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { OpenSkyClient } from './opensky.js';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8787;

// Basic CORS guard (keep simple for local dev)
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Serve static front-end assets from the repo root
const rootDir = path.resolve(__dirname, '..');
const sendStatic = (res, file) => {
  res.sendFile(path.join(rootDir, file));
};

app.get('/', (req, res) => sendStatic(res, 'index.html'));
app.get('/index.html', (req, res) => sendStatic(res, 'index.html'));
app.get('/app.js', (req, res) => sendStatic(res, 'app.js'));
app.get('/styles.css', (req, res) => sendStatic(res, 'styles.css'));
app.get('/config.js', (req, res) => sendStatic(res, 'config.js'));
app.get('/ar.html', (req, res) => sendStatic(res, 'ar.html'));

app.use('/assets', express.static(path.join(rootDir, 'assets')));
app.use('/tiles', express.static(path.join(rootDir, 'tiles')));

// API: presets
app.get('/api/presets', (req, res) => {
  const presetsPath = path.resolve(__dirname, './config/presets.json');
  const cfg = JSON.parse(fs.readFileSync(presetsPath, 'utf-8'));
  res.json(cfg);
});

const openSkyClient = new OpenSkyClient(process.env);

// API: opensky proxy
app.get('/api/opensky', async (req, res) => {
  try {
    const { lamin, lamax, lomin, lomax } = req.query;
    if ([lamin, lamax, lomin, lomax].some(v => v === undefined)) {
      return res.status(400).json({ error: 'lamin, lamax, lomin, lomax are required' });
    }
    const data = await openSkyClient.fetchStatesBBox({
      lamin: Number(lamin), lamax: Number(lamax), lomin: Number(lomin), lomax: Number(lomax)
    });

    // Optional: expand=1 to return keyed objects instead of arrays
    if (req.query.expand === '1' && Array.isArray(data.states)) {
      data.states = data.states.map(arr => ({
        icao24: arr[0], callsign: arr[1], origin_country: arr[2], time_position: arr[3], last_contact: arr[4],
        longitude: arr[5], latitude: arr[6], baro_altitude: arr[7], on_ground: arr[8], velocity: arr[9],
        true_track: arr[10], vertical_rate: arr[11], sensors: arr[12], geo_altitude: arr[13], squawk: arr[14],
        spi: arr[15], position_source: arr[16]
      }));
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// API: hotcells - scan a larger bbox and return top cells
app.get('/api/hotcells', async (req, res) => {
  try {
    const lamin = Number(req.query.lamin ?? process.env.HOTSCAN_LAMIN ?? 35.2);
    const lamax = Number(req.query.lamax ?? process.env.HOTSCAN_LAMAX ?? 36.2);
    const lomin = Number(req.query.lomin ?? process.env.HOTSCAN_LOMIN ?? 139.2);
    const lomax = Number(req.query.lomax ?? process.env.HOTSCAN_LOMAX ?? 140.6);
    const cell = Number(req.query.cell ?? process.env.HOTSCAN_CELL_SIZE ?? 0.02);
    const topk = Number(req.query.topk ?? process.env.HOTSCAN_TOPK ?? 5);

    const data = await openSkyClient.fetchStatesBBox({ lamin, lamax, lomin, lomax });

    const bins = new Map(); // key => count
    const index = (lat, lon) => {
      const yi = Math.floor((lat - lamin) / cell);
      const xi = Math.floor((lon - lomin) / cell);
      return `${xi}:${yi}`;
    };
    for (const s of (data.states || [])) {
      const lon = s[5], lat = s[6];
      if (lat == null || lon == null) continue;
      const key = index(lat, lon);
      bins.set(key, (bins.get(key) || 0) + 1);
    }
    const cells = [];
    for (const [key, count] of bins) {
      const [xi, yi] = key.split(':').map(Number);
      const cellLomin = lomin + xi * cell;
      const cellLamin = lamin + yi * cell;
      cells.push({ count, bbox: { lamin: cellLamin, lamax: cellLamin + cell, lomin: cellLomin, lomax: cellLomin + cell } });
    }
    cells.sort((a, b) => b.count - a.count);
    res.json({ time: data.time, cells: cells.slice(0, topk) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Flight3D server running on http://localhost:${port}`);
  console.log(`Serving static from ${rootDir}`);
});

// API: config (Cesium ion token/asset & local tileset presence)
app.get('/api/config', (req, res) => {
  const ionToken = process.env.ION_TOKEN || null;
  const ionAssetId = process.env.ION_ASSET_ID ? Number(process.env.ION_ASSET_ID) : null;
  const rel = process.env.PLATEAU_LOCAL_TILESET || '../tiles/plateau/tileset.json';
  const p = path.resolve(__dirname, rel);
  const plateauLocal = fs.existsSync(p);
  res.json({ ionToken, ionAssetId, plateauLocal });
});

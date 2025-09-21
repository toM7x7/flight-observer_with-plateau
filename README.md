# Flight Observer with PLATEAU

Browser tools for combining PLATEAU 3D city data with OpenSky traffic. The project ships with a Cesium web client, a Quest 3 WebXR scene, and Vercel-ready API routes.

---

## Demo URLs
- Web: `https://<your-app>.vercel.app/`
- AR:  `https://<your-app>.vercel.app/ar.html` (Quest Browser / HTTPS)

---

## Web Experience
1. Choose an area (for example **HND Tokyo Bay Corridor**) from the toolbar.
2. Press **Start** to begin polling (Poll(s) 5-10 seconds is a good default).
3. Toggle **Buildings** to overlay PLATEAU 3D city tiles.
4. Use **Find / Lat / Lon / W/H(km)** for custom bounding boxes and press **Use**.

Tip: If nothing shows up, widen W/H, shift the box slightly offshore, or use the Hot button (when `/api/hotcells` is enabled) to jump to active cells.

---

## AR Experience (Quest 3)
1. Open **`/ar.html`** in Quest Browser.
2. Tap **Enter AR** on the HUD and aim at a desk or floor.
3. Pull the controller trigger (or pinch) to place the miniature.
4. Press **Start** to begin polling. The **Scale** slider switches between 1m = 1km and 1m = 1m.

A status badge in the lower-left shows each step (`requestSession...`, `AR session started`, `placing...`).

---

## Repository Layout (Vercel Ready)
```
repo-root/
|-- index.html / app.js / styles.css / utils.js
|-- ar.html / assets/mini_city.glb            # optional miniature terrain
|-- tiles/plateau/tileset.json                # optional local 3D Tiles
|-- sample/states_hnd.json          # fallback snapshot used when upstream is down
|-- api/
    |-- opensky.js     # /api/opensky?lamin&lomin&lamax&lomax
    |-- states.js      # alias of opensky.js
    |-- presets.js     # preset bounding boxes
    |-- config.js      # minimal config endpoint
    `-- hotcells.js    # optional heat-map aggregates
```

Vercel settings:
- **Framework preset**: Other
- **Build Command / Output**: empty (static)
- **Environment Variables** (set as needed)
  - `OPEN_SKY_MODE=opensky`
  - `OPEN_SKY_USERNAME` / `OPEN_SKY_PASSWORD` (recommended for higher OpenSky quota)
  - `ION_TOKEN` / `ION_ASSET_ID` (if using Cesium ion)

`vercel.json` ships with `Cache-Control: no-store` and `Permissions-Policy: xr-spatial-tracking=(self)`.

---

## PLATEAU Integration
- **Cesium ion (recommended)**: use *Japan 3D Buildings*, then set `ION_TOKEN` and `ION_ASSET_ID`.
- **Local 3D Tiles**: drop files under `/tiles/plateau/tileset.json`; the client auto-detects availability.

---

## Troubleshooting
### `/api/opensky` returns non-200
- Inspect Vercel function logs. The handler echoes upstream status and the first portion of the body so you can see the failure reason.
- `401/403`: credentials missing or invalid - update `OPEN_SKY_USERNAME/PASSWORD`.
- `429`: rate limited - increase Poll(s) to 10-15 seconds and trim the bounding box.
- `5xx` or HTML body: upstream outage - wait a bit or jump to another cell via Hot.

### AR will not start / black view
- Console shows `Failed to resolve module specifier "three"` - confirm the import map in `ar.html`.
- Status badge says `immersive-ar not supported` - use Quest Browser or another WebXR AR capable browser.
- Status stays on `no hit...` - ensure a well-lit surface and remember placement happens on WebXR `select` events only.

### No aircraft visible
- If the API response has fallback: true, the bundled snapshot is being shown because OpenSky could not be reached. Reduce polling frequency or move the bounding box and check the logs.
1. Verify `https://<app>.vercel.app/api/presets` returns 200 with your presets.
2. Hit `https://<app>.vercel.app/api/opensky?...` directly; inspect the JSON or upstream error.
3. Increase Poll(s), widen the area, or use `/api/hotcells` to locate active cells.

---

## Known Work Items
- Surface `/api/hotcells` results directly in both Web and AR UIs.
- Expose callsign, altitude, and speed overlays in the AR HUD.
- Explore VR/other-headset fallbacks alongside Quest 3 AR.

---

## License
MIT

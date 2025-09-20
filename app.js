/* global Cesium, FLIGHT3D_CONFIG */

// === 基本設定 ==========================================
const API_BASE = (window.FLIGHT3D_CONFIG && window.FLIGHT3D_CONFIG.apiBase) || '';

const viewerOptions = {
  animation: false,
  timeline: false,
  baseLayerPicker: false,
  geocoder: false,
  imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' })
};
// Terrain 互換（新旧API）
if (Cesium && Cesium.EllipsoidTerrain) {
  viewerOptions.terrain = new Cesium.EllipsoidTerrain();
} else if (Cesium && Cesium.EllipsoidTerrainProvider) {
  viewerOptions.terrainProvider = new Cesium.EllipsoidTerrainProvider();
}
const viewer = new Cesium.Viewer('c', viewerOptions);

// === 視認性：地面の青みを抑える =========================
const base = viewer.imageryLayers.get(0);
if (base) {
  base.saturation = 0.1;   // 彩度を落とす
  base.brightness = 0.85;  // わずかに暗く
  base.contrast = 1.08;    // 輪郭強調
}
viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0b1320'); // 背景
viewer.scene.globe.baseColor  = Cesium.Color.fromCssColorString('#0f172a'); // タイル無し時
if (viewer.scene.skyAtmosphere) {
  viewer.scene.skyAtmosphere.saturationShift = -0.15;
  viewer.scene.skyAtmosphere.brightnessShift = -0.1;
}

// === PLATEAU（建物）自動ロード ==========================
let BUILDINGS = null;
async function tryLoadBuildings() {
  try {
    const cfg = await fetch(`${API_BASE}/api/config`).then(r=>r.json()).catch(()=>({}));
    if (cfg.ionToken && cfg.ionAssetId) {
      Cesium.Ion.defaultAccessToken = cfg.ionToken;
      BUILDINGS = await Cesium.Cesium3DTileset.fromIonAssetId(cfg.ionAssetId);
      viewer.scene.primitives.add(BUILDINGS);
      console.log('[PLATEAU] Cesium ion loaded', cfg.ionAssetId);
    } else if (cfg.plateauLocal) {
      BUILDINGS = await Cesium.Cesium3DTileset.fromUrl('/tiles/plateau/tileset.json');
      viewer.scene.primitives.add(BUILDINGS);
      console.log('[PLATEAU] Local 3D Tiles loaded');
    } else {
      console.log('[PLATEAU] No tiles configured (imagery only)');
    }
    // Mode 表示（サーバが返す場合）
    const modeText = document.getElementById('modeText');
    if (modeText) modeText.textContent = cfg.serverMode || (window.FLIGHT3D_CONFIG?.serverMode || '');
  } catch (e) {
    console.warn('[PLATEAU] load failed', e);
  }
}
// モジュール実行環境想定（index.htmlで type="module" を指定）
await tryLoadBuildings();

const toggleBuildings = document.getElementById('toggleBuildings');
if (toggleBuildings) {
  toggleBuildings.addEventListener('change', ()=>{
    if (BUILDINGS) BUILDINGS.show = toggleBuildings.checked;
  });
}

// === プリセット読み込み（配列/オブジェクト両対応） ========
async function loadPresets() {
  const res = await fetch(`${API_BASE}/api/presets`);
  const cfg = await res.json();
  let areas = [];
  if (Array.isArray(cfg.areas)) areas = cfg.areas;
  else if (Array.isArray(cfg)) areas = cfg;
  else if (cfg && typeof cfg === 'object') {
    for (const [id, p] of Object.entries(cfg)) {
      if (p && p.lamin != null) areas.push({ id, name: p.name || id, ...p });
    }
  }
  window.FLIGHT3D_PRESETS = areas;
  const sel = document.getElementById('areaSelect');
  sel.innerHTML = '';
  for (const a of areas) {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.name;
    sel.appendChild(opt);
  }
  if (sel.options.length) sel.selectedIndex = 0;
}
await loadPresets();

// === UI操作 ============================================
const areaSelect = document.getElementById('areaSelect');
const openARBtn = document.getElementById('openARBtn');
if (openARBtn) {
  openARBtn.addEventListener('click', ()=>{
    window.location.href = 'ar.html';
  });
}

document.getElementById('goBtn')?.addEventListener('click', ()=>{
  const a = getSelectedArea(); flyToArea(a);
});

document.getElementById('hotBtn')?.addEventListener('click', async ()=>{
  try {
    const r = await fetch(`${API_BASE}/api/hotcells`);
    const js = await r.json();
    if (js.cells && js.cells.length) {
      const b = js.cells[0].bbox;
      const a = { id:'hot', name:'HotCell', ...b, camera:{ lon:(b.lomin+b.lomax)/2, lat:(b.lamin+b.lamax)/2, alt:4000 } };
      flyToArea(a);
      currentBBox = b;
    }
  } catch(e) { console.warn('hotcells error', e); }
});

const pollSecInput = document.getElementById('pollSec');
document.getElementById('startBtn')?.addEventListener('click', ()=> startPolling());
document.getElementById('stopBtn')?.addEventListener('click',  ()=> stopPolling());

function getSelectedArea() {
  const id = areaSelect?.value;
  const a = (window.FLIGHT3D_PRESETS||[]).find(x=>x.id===id);
  return a || null;
}

function flyToArea(a) {
  if (!a) return;
  const cam = a.camera || { lon: (a.lomin+a.lomax)/2, lat:(a.lamin+a.lamax)/2, alt: 4000 };
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(cam.lon, cam.lat, cam.alt)
  });
  currentBBox = { lamin: a.lamin, lamax: a.lamax, lomin: a.lomin, lomax: a.lomax };
}

// ---- Airport lookup (IATA / ICAO) ----
const AIRPORTS = {
  // Tokyo area
  HND:{name:'Tokyo Haneda', lat:35.5494, lon:139.7798}, RJTT:{lat:35.5494, lon:139.7798},
  NRT:{name:'Narita',       lat:35.7719, lon:140.3929}, RJAA:{lat:35.7719, lon:140.3929},
  // Kansai / Chubu / Hokkaido / Kyushu / Okinawa / Others
  KIX:{name:'Kansai',       lat:34.4273, lon:135.2440}, RJBB:{lat:34.4273, lon:135.2440},
  NGO:{name:'Chubu Centrair',lat:34.8584, lon:136.8048}, RJGG:{lat:34.8584, lon:136.8048},
  CTS:{name:'New Chitose',  lat:42.7752, lon:141.6923}, RJCC:{lat:42.7752, lon:141.6923},
  FUK:{name:'Fukuoka',      lat:33.5859, lon:130.4500}, RJFF:{lat:33.5859, lon:130.4500},
  OKA:{name:'Naha',         lat:26.1958, lon:127.6460}, ROAH:{lat:26.1958, lon:127.6460},
  ITM:{name:'Itami',        lat:34.7855, lon:135.4382}, RJOO:{lat:34.7855, lon:135.4382},
  SDJ:{name:'Sendai',       lat:38.1397, lon:140.9170}, RJSS:{lat:38.1397, lon:140.9170},
  HIJ:{name:'Hiroshima',    lat:34.4361, lon:132.9190}, RJOA:{lat:34.4361, lon:132.9190}
};

function bboxFromCenter(lat, lon, wKm, hKm) {
  const dLat = (hKm/2) / 110.574; // deg
  const dLon = (wKm/2) / (111.320 * Math.cos(lat*Math.PI/180)); // deg
  return { lamin: lat - dLat, lamax: lat + dLat, lomin: lon - dLon, lomax: lon + dLon };
}
function centerSpanFromBBox(b) {
  const lat = (b.lamin + b.lamax)/2;
  const lon = (b.lomin + b.lomax)/2;
  const hKm = (b.lamax - b.lamin) * 110.574;
  const wKm = (b.lomax - b.lomin) * (111.320 * Math.cos(lat*Math.PI/180));
  return { lat, lon, wKm, hKm };
}

// ---- Hook UI elements ----
const $ap   = document.getElementById('apLookup');
const $lat  = document.getElementById('lat');
const $lon  = document.getElementById('lon');
const $wkm  = document.getElementById('wkm');
const $hkm  = document.getElementById('hkm');
const $use  = document.getElementById('useCustom');
const $save = document.getElementById('saveCustom');

if ($ap) {
  $ap.addEventListener('change', ()=>{
    const key = ($ap.value||'').trim().toUpperCase();
    const ap = AIRPORTS[key];
    if (ap) {
      $lat.value = ap.lat.toFixed(6);
      $lon.value = ap.lon.toFixed(6);
      // 推奨の初期サイズ（空港回廊向け）
      if (!$wkm.value) $wkm.value = 80;
      if (!$hkm.value) $hkm.value = 60;
    }
  });
}

function useCustom() {
  const lat = Number($lat.value), lon = Number($lon.value);
  const wKm = Number($wkm.value||60), hKm = Number($hkm.value||40);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return alert('Lat/Lon を数値で入力してください。');
  const b = bboxFromCenter(lat, lon, wKm, hKm);
  const a = { id:'custom', name:`Custom ${lat.toFixed(3)},${lon.toFixed(3)}`, ...b,
              camera:{ lon, lat, alt: Math.max(wKm,hKm)*80 } };
  flyToArea(a);
  currentBBox = { lamin:b.lamin, lamax:b.lamax, lomin:b.lomin, lomax:b.lomax };
}

function saveCustom() {
  const lat = Number($lat.value), lon = Number($lon.value);
  const wKm = Number($wkm.value||60), hKm = Number($hkm.value||40);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return alert('Lat/Lon を数値で入力してください。');
  const b = bboxFromCenter(lat, lon, wKm, hKm);
  const id = `custom_${Date.now()}`;
  const a = { id, name:`★ ${($ap.value||'Custom')}`, ...b,
              camera:{ lon, lat, alt: Math.max(wKm,hKm)*80 } };
  (window.FLIGHT3D_PRESETS ||= []).push(a);
  const sel = document.getElementById('areaSelect');
  const opt = document.createElement('option'); opt.value=id; opt.textContent=a.name; sel.appendChild(opt);
  sel.value = id; // 選択
  flyToArea(a);
  currentBBox = { lamin:b.lamin, lamax:b.lamax, lomin:b.lomin, lomax:b.lomax };
}

$use?.addEventListener('click', useCustom);
$save?.addEventListener('click', saveCustom);

// Area選択時にUIへ反映（中心値を知りたいときに便利）
const origFlyToArea = flyToArea;
flyToArea = function(a) {
  origFlyToArea(a);
  if ($lat && $lon && $wkm && $hkm && a) {
    const cs = centerSpanFromBBox(a);
    $lat.value = cs.lat.toFixed(6);
    $lon.value = cs.lon.toFixed(6);
    $wkm.value = Math.max(1, Math.round(cs.wKm));
    $hkm.value = Math.max(1, Math.round(cs.hKm));
  }
};

// URLパラメータでも直接指定可能: ?lat=35.55&lon=139.78&wkm=80&hkm=60
(function applyURLParams(){
  const q = new URL(location.href).searchParams;
  const lat = parseFloat(q.get('lat')), lon = parseFloat(q.get('lon'));
  const wkm = parseFloat(q.get('wkm')), hkm = parseFloat(q.get('hkm'));
  if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(wkm) && !Number.isNaN(hkm)) {
    if ($lat) $lat.value = lat; if ($lon) $lon.value = lon; if ($wkm) $wkm.value = wkm; if ($hkm) $hkm.value = hkm;
    useCustom();
  }
})();


// === マゼンタ機体・便名ラベル ============================
// マゼンタ（機体＆トレイル）
const MAGENTA = '#e6007e';
const PLANE_SVG_MAGENTA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
  <g fill='${MAGENTA}' stroke='white' stroke-width='2'>
    <path d='M2 36 L62 28 L62 36 L34 40 L30 62 L24 62 L24 40 L2 36 Z'/>
  </g>
</svg>`);

function createEntity(id, positionProp, { useModel, showTrails }) {
  const ent = {
    id,
    position: positionProp,
    orientation: new Cesium.VelocityOrientationProperty(positionProp),
    label: {
      text: id, // 後で便名に差し替える
      font: '12px system-ui, sans-serif',
      pixelOffset: new Cesium.Cartesian2(0, -22),
      showBackground: true,
      backgroundColor: Cesium.Color.fromCssColorString('#120015').withAlpha(0.75),
      fillColor: Cesium.Color.WHITE,
      outlineWidth: 0
    }
  };
  if (useModel) {
    ent.model = {
      uri: 'assets/aircraft.glb',
      minimumPixelSize: 32,
      maximumScale: 2000,
      color: Cesium.Color.fromCssColorString(MAGENTA) // モデルでもマゼンタに
    };
  } else {
    ent.billboard = {
      image: PLANE_SVG_MAGENTA,
      width: 30,
      height: 30,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER
    };
  }
  if (showTrails) {
    ent.path = {
      show: true, leadTime: 0,
      trailTime: (window.FLIGHT3D_CONFIG?.trailSeconds ?? 60),
      width: 2.0,
      material: Cesium.Color.fromCssColorString(MAGENTA).withAlpha(0.85)
    };
  }
  return viewer.entities.add(ent);
}

// === 取得・描画ループ =====================================
const aircraft = new Map(); // icao24 -> { entity, pos, last }
let timer = null;
let currentBBox = null;

// 初期エリアへ
setTimeout(()=>{
  const a = getSelectedArea();
  if (a) {
    flyToArea(a);
    currentBBox = { lamin: a.lamin, lamax: a.lamax, lomin: a.lomin, lomax: a.lomax };
  }
}, 300);

function startPolling() {
  stopPolling();
  const sec = Math.max(3, Math.min(20, Number(pollSecInput?.value||5)));
  timer = setInterval(fetchAndUpdate, sec*1000);
  fetchAndUpdate();
}
function stopPolling() {
  if (timer) clearInterval(timer), timer=null;
}

async function fetchAndUpdate() {
  if (!currentBBox) return;

  // API名の違いにフォールバック対応
  const qs = new URLSearchParams(currentBBox).toString();
  let r = await fetch(`${API_BASE}/api/opensky?${qs}`);
  if (!r.ok) r = await fetch(`${API_BASE}/api/states?${qs}`);
  if (!r.ok) { console.warn('states API error', r.status); return; }

  const data = await r.json();
  const t = Cesium.JulianDate.fromDate(new Date((data.time||Date.now()/1000)*1000));

  const useModel   = document.getElementById('useModel')?.checked ?? false;
  const showTrails = document.getElementById('showTrails')?.checked ?? true;

  const seen = new Set();

  for (const s of (data.states||[])) {
    const icao24   = s[0];
    const callsign = (s[1] || '').trim(); // 便名
    const lon      = s[5], lat = s[6];
    const baroAlt  = s[7];
    const onGround = s[8];
    const track    = s[10];
    const geoAlt   = s[13];

    if (lat == null || lon == null) continue;

    const alt = (geoAlt ?? baroAlt ?? 0);
    const h   = Math.max(alt, onGround ? 0 : 30); // 地面刺さり回避
    const p   = Cesium.Cartesian3.fromDegrees(lon, lat, h);
    const labelTxt = callsign || (icao24 ? icao24.toUpperCase() : '');

    let rec = aircraft.get(icao24);
    if (!rec) {
      const pos = new Cesium.SampledPositionProperty();
      pos.addSample(t, p);
      const entity = createEntity(icao24, pos, { useModel, showTrails });
      entity.label.text = labelTxt;
      rec = { entity, pos, last: t };
      aircraft.set(icao24, rec);
    } else {
      rec.pos.addSample(t, p);
      rec.entity.label.text = labelTxt;
      rec.last = t;
    }

    // billboard のときは true_track で機首向き補助（モデルは VelocityOrientation が効く）
    if (track != null && rec.entity.billboard) {
      rec.entity.billboard.rotation = Cesium.Math.toRadians(track);
    }

    seen.add(icao24);
  }

  // 古い機体の掃除
  const cleanupSec = (window.FLIGHT3D_CONFIG?.cleanupSeconds || 60);
  for (const [id, rec] of aircraft) {
    const dt = Cesium.JulianDate.secondsDifference(t, rec.last);
    if (dt > cleanupSec) {
      viewer.entities.remove(rec.entity);
      aircraft.delete(id);
    }
  }
}

// 自動開始
startPolling();

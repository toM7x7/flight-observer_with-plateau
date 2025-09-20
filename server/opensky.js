
import fs from 'fs';
import path from 'path';

const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));

export class OpenSkyClient {
  constructor(env) {
    this.mode = env.OPEN_SKY_MODE || 'mock';
    this.baseUrl = env.OPEN_SKY_BASE_URL || 'https://opensky-network.org/api';
    this.username = env.OPEN_SKY_USERNAME || '';
    this.password = env.OPEN_SKY_PASSWORD || '';
    this.oauthTokenUrl = env.OPEN_SKY_OAUTH_TOKEN_URL || '';
    this.clientId = env.OPEN_SKY_CLIENT_ID || '';
    this.clientSecret = env.OPEN_SKY_CLIENT_SECRET || '';
    this.tokenCache = { access_token: null, exp: 0 };
  }

  async fetchStatesBBox({ lamin, lamax, lomin, lomax }) {
    if (this.mode === 'mock') {
      return this._mockStates({ lamin, lamax, lomin, lomax });
    }
    return this._realStates({ lamin, lamax, lomin, lomax });
  }

  async _realStates({ lamin, lamax, lomin, lomax }) {
    const qp = new URLSearchParams({ lamin, lamax, lomin, lomax }).toString();
    const url = `${this.baseUrl}/states/all?${qp}`;

    const headers = {};
    let authUsed = false;

    // Prefer OAuth2 if configured
    if (this.clientId && this.clientSecret && this.oauthTokenUrl) {
      const token = await this._getOAuth2Token();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        authUsed = true;
      }
    }

    // Fallback to Basic if configured
    if (!authUsed && this.username && this.password) {
      const b64 = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      headers['Authorization'] = `Basic ${b64}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenSky error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return data;
  }

  async _getOAuth2Token() {
    const now = Date.now() / 1000;
    if (this.tokenCache.access_token && this.tokenCache.exp > now + 30) {
      return this.tokenCache.access_token;
    }
    if (!this.oauthTokenUrl) return null;

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    }).toString();

    const res = await fetch(this.oauthTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!res.ok) {
      return null;
    }
    const tok = await res.json();
    this.tokenCache = {
      access_token: tok.access_token,
      exp: (tok.expires_in ? (Date.now()/1000 + tok.expires_in) : (Date.now()/1000 + 300))
    };
    return tok.access_token;
  }

  // --- MOCK ---
  // 机上の東京湾あたりを周回する複数機を、時間で少しずつ動かす
  // 返却形式は OpenSky の states/all とおなじ ["icao24", callsign, ... lon, lat, ... velocity, true_track, ..., geo_altitude, ...]
  async _mockStates({ lamin, lamax, lomin, lomax }) {
    const now = Math.floor(Date.now() / 1000);
    const seeds = [
      { icao24: 'abcd01', lat: 35.57, lon: 139.82, speed: 220, track: 90, alt: 1500 },
      { icao24: 'efgh02', lat: 35.60, lon: 139.80, speed: 240, track: 45, alt: 2200 },
      { icao24: 'ijkl03', lat: 35.55, lon: 139.86, speed: 200, track: 200, alt: 1800 },
      { icao24: 'mnop04', lat: 35.58, lon: 139.89, speed: 230, track: 300, alt: 2500 },
      { icao24: 'qrst05', lat: 35.52, lon: 139.84, speed: 260, track: 30, alt: 3200 }
    ];

    const states = [];
    for (const s of seeds) {
      // 動かす（単純化: 1秒あたり ≒ speed(m/s) を度に換算）
      const t = now % 600; // 10分周期
      const metersPerDegLat = 111_111;
      const metersPerDegLon = 111_111 * Math.cos(s.lat * Math.PI/180);
      const dx = (s.speed * Math.cos(s.track * Math.PI/180) * t) / metersPerDegLon;
      const dy = (s.speed * Math.sin(s.track * Math.PI/180) * t) / metersPerDegLat;
      let lon = s.lon + dx;
      let lat = s.lat + dy;
      let alt = s.alt + 50 * Math.sin(t/30);

      // BBox の外に出にくいよう軽く折り返す
      if (lon < lomin) lon = lomin + (lomin - lon)*0.2;
      if (lon > lomax) lon = lomax - (lon - lomax)*0.2;
      if (lat < lamin) lat = lamin + (lamin - lat)*0.2;
      if (lat > lamax) lat = lamax - (lat - lamax)*0.2;

      states.push([
        s.icao24, null, null, null, null,
        lon, lat, null, false, s.speed, s.track, null, null, alt, null, null
      ]);
    }

    return { time: now, states };
  }
}

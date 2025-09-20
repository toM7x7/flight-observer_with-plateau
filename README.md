
# Flight 3D (PLATEAU ﾃ・OpenSky) 窶・Starter

**逶ｮ逧・*: 迚ｹ螳壹お繝ｪ繧｢・・Box・峨↓髯仙ｮ壹＠縺溪・D繝溘ル繝ｻ繝輔Λ繧､繝医Ξ繝ｼ繝繝ｼ窶昴ｒ**繝悶Λ繧ｦ繧ｶ**縺ｧ蜍輔°縺呎怙蟆乗ｧ区・縲・ 
- 繝輔Ο繝ｳ繝・ **CesiumJS**・・SM繧､繝｡繝ｼ繧ｸ・区･募・菴灘慍蠖｢・丈ｻｻ諢上〒PLATEAU 3D Tiles・・ 
- 繧ｵ繝ｼ繝・ **Node.js/Express**・・penSky繝励Ο繧ｭ繧ｷ & 繝帙ャ繝医そ繝ｫ髮・ｨ・& 繝｢繝・け・・ 
- 繝・・繝ｭ繧､: Docker 1繧ｳ繝槭Φ繝峨√ｂ縺励￥縺ｯ Render/Fly 縺ｪ縺ｩ PaaS 縺ｫ縺昴・縺ｾ縺ｾ霈峨○繧峨ｌ縺ｾ縺吶・
> 縺ｾ縺壹・ **繝｢繝・け繝｢繝ｼ繝・*縺ｧ蜍穂ｽ懃｢ｺ隱・竊・谺｡縺ｫ **OpenSky API** 縺ｫ縺､縺ｪ縺取崛縺・竊・蠢・ｦ√↓蠢懊§縺ｦ **PLATEAU 3D Tiles** 繧定ｨｭ螳壹√・鬆・〒騾ｲ繧√ｋ縺ｨ霄薙″縺ｾ縺帙ｓ縲・
---

## 1) 隕∽ｻｶ
- Node.js **18+**・・fetch`/`URL`縺梧ｨ呎ｺ悶〒菴ｿ縺医ｋ蜑肴署・・- npm 8+
- ・井ｻｻ諢擾ｼ韻esium ion 縺ｮ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・LATEAU縺ｮ 3D Tiles 繧段on縺九ｉ隱ｭ繧蝣ｴ蜷茨ｼ・- ・井ｻｻ諢擾ｼ碓penSky Network 縺ｮ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ亥諺蜷阪〒繧ょ庄縲ょｰ・擂縺ｯ OAuth2 謗ｨ螂ｨ・・
---

## 2) 繧ｯ繧､繝・け繧ｹ繧ｿ繝ｼ繝茨ｼ医Ο繝ｼ繧ｫ繝ｫ・・
```bash
# 萓晏ｭ倥ｒ繧､繝ｳ繧ｹ繝医・繝ｫ
cd server && npm ci && cd ..

# .env 繧剃ｽ懈・・医∪縺壹・繝｢繝・け縺ｧOK・・cp .env.example .env

# 繧ｵ繝ｼ繝占ｵｷ蜍包ｼ磯撕逧・ヵ繧｡繧､繝ｫ繧ょ酔繝昴・繝医〒驟堺ｿ｡・・node server/server.js

# 繝悶Λ繧ｦ繧ｶ縺ｧ
http://localhost:8787
```

> 逕ｻ髱｢蟾ｦ荳翫・縲窟rea縲阪ｒ蛻・ｊ譖ｿ縺医ｋ縺ｨ縲・*HND・育ｾｽ逕ｰ縺ｮ譚ｱ莠ｬ貉ｾ蝗槫ｻ奇ｼ・*繧・*NRT霑大ｍ**縺ｪ縺ｩ縺ｮ**繧医￥鬟帙・繝励Μ繧ｻ繝・ヨ**縺ｫ遘ｻ蜍輔＠縺ｾ縺吶ょ・譛溷､縺ｯ繝｢繝・け繝・・繧ｿ縺ｮ蟾｡闊ｪ縺ｫ縺ｪ縺｣縺ｦ縺・∪縺吶・
---

## 3) OpenSky 縺ｫ蛻・ｊ譖ｿ縺医ｋ

1. `.env` 繧堤ｷｨ髮・＠縺ｦ `OPEN_SKY_MODE=opensky` 縺ｫ縲・ 
2. ・亥諺蜷阪〒濶ｯ縺代ｌ縺ｰ縺昴・縺ｾ縺ｾ・峨ヶ繝ｩ繧ｦ繧ｶ縺ｧ繝ｪ繝ｭ繝ｼ繝峨・ 
3. 隱崎ｨｼ縺励◆縺・ｴ蜷医・縲・*譌ｧ: Basic** 縺・**譁ｰ: OAuth2** 繧帝∈縺ｳ縲～.env` 縺ｫ雉・ｼ諠・ｱ繧貞・繧後※縺上□縺輔＞縲・
> **豕ｨ諢・*: 繝悶Λ繧ｦ繧ｶ縺九ｉ逶ｴ謗･OpenSky繧貞娼縺上・縺ｯCORS繧・ヨ繝ｼ繧ｯ繝ｳ遘伜諺縺ｮ轤ｹ縺ｧ髱樊耳螂ｨ縲よ悽繧ｹ繧ｿ繝ｼ繧ｿ繝ｼ縺ｯ**蠢・★閾ｪ蜑阪し繝ｼ繝舌ｒ邨檎罰**縺励∪縺吶・
---

## 4) PLATEAU・・D驛ｽ蟶ゑｼ峨ｒ驥阪・繧・
`app.js` 蜀・・縲・/ 3D Tiles・井ｻｻ諢擾ｼ峨阪・繧ｳ繝｡繝ｳ繝医ｒ螟悶＠縲・*URL 縺・Cesium ion Asset ID** 繧定ｨｭ螳壹＠縺ｦ縺上□縺輔＞縲・ 
- 閾ｪ蜑阪・繧ｹ繝・ `Cesium.Cesium3DTileset.fromUrl('/tiles/plateau/tileset.json')`
- Cesium ion: `Cesium.Cesium3DTileset.fromIonAssetId(ASSET_ID)` ・・`Cesium.Ion.defaultAccessToken='...'`

> 縺ｲ縺ｨ縺ｾ縺・**3D繧ｿ繧､繝ｫ辟｡縺励〒繧ょ虚菴・*縺励∪縺呻ｼ・SM繧､繝｡繝ｼ繧ｸ・区･募・菴灘慍蠖｢・峨・
---

## 5) 繝・・繝ｭ繧､・域耳螂ｨ・咼ocker・・
### A. Docker 蜊倅ｽ・```bash
# 繝ｫ繝ｼ繝医〒螳溯｡・docker build -t flight3d .
docker run -it --rm -p 8787:8787 --env-file .env flight3d
# 竊・http://localhost:8787
```

### B. Render/Fly/閾ｪ遉ｾ繧ｵ繝ｼ繝・- 縺昴・縺ｾ縺ｾ Docker 繧偵ョ繝励Ο繧､縺吶ｋ縺九～server/server.js` 繧・`node server/server.js` 縺ｧ襍ｷ蜍輔☆繧九□縺代〒縺吶・- 迺ｰ蠅・､画焚縺ｯ `.env` 縺ｨ蜷悟錐縺ｧ險ｭ螳壹＠縺ｦ縺上□縺輔＞縲・
---

## 6) 莉墓ｧ假ｼ・VP・・
### 讖溯・
- **/api/opensky**: BBox謖・ｮ壹・讖滉ｽ灘叙蠕暦ｼ医Δ繝・け/譛ｬ逡ｪ縺ｮ蛻・崛・・- **/api/hotcells**: 蠎・沺繧ｹ繧ｭ繝｣繝ｳ 竊・繧ｰ繝ｪ繝・ラ髮・ｨ・竊・荳贋ｽ阪そ繝ｫ蜃ｺ蜉・- **/api/presets**: 繧医￥鬟帙・繝励Μ繧ｻ繝・ヨ・・ND/NRT/隘ｿ蛛ｴ蝗槫ｻ・豁ｦ阡ｵ蟆乗揄3谺｡繝｡繝・す繝･・・
### 陦ｨ遉ｺ
- 讖滉ｽ薙・ **遘ｻ蜍募ｹｳ蝮・ｼ玖｣憺俣**縺ｧ貊代ｉ縺九↓遘ｻ蜍包ｼ・SampledPositionProperty`・・- 讖滄ｦ悶・ **騾溷ｺｦ繝吶け繝医Ν**縺ｧ閾ｪ蜍包ｼ・VelocityOrientationProperty`・・- 繝医Ξ繧､繝ｫ縺ｯ **60遘・*縲∝商縺・ｩ滉ｽ薙・ **60遘呈峩譁ｰ辟｡縺励〒遐ｴ譽・*

### 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｻ繧ｹ繧ｱ繝ｼ繝ｫ
- 蜷梧凾 200 讖・縺ｾ縺ｧ諠ｳ螳夲ｼ医◎繧御ｻ･荳翫・霍晞屬/鬮伜ｺｦ縺ｧ髢灘ｼ輔″・・- 繝昴・繝ｪ繝ｳ繧ｰ髢馴囈縺ｯ 5窶・0 遘抵ｼ亥諺蜷阪・ 10 遘呈耳螂ｨ・・
---

## 7) 驕狗畑繝弱・繝茨ｼ郁誠縺｡縺ｪ縺・◆繧√・豕ｨ諢擾ｼ・- **蟆上＆縺吶℃繧九お繝ｪ繧｢ = 辟｡莠ｺ**縺ｫ縺ｪ繧翫′縺｡ 竊・**譚ｱ莠ｬ貉ｾ or 遨ｺ貂ｯ霑大ｍ**繧・縺､縺ｯ蟶ｸ譎る∈謚・- `geo_altitude` 蜆ｪ蜈医∵ｬ謳肴凾縺ｯ `baro_altitude` 竊・蝨ｰ陦ｨ + 譛菴弱が繝輔そ繝・ヨ
- API 繝ｬ繝ｼ繝・繧ｯ繝ｬ繧ｸ繝・ヨ縺ｮ遽邏・ **繧ｨ繝ｪ繧｢繧堤強縺・*縲・*繝帙ャ繝医そ繝ｫ**縺縺題ｿｽ霍｡
- 讓ｩ蛻ｩ陦ｨ險・ OpenSky / PLATEAU / 蝨ｰ蝗ｳ繧ｿ繧､繝ｫ縺ｮ蟶ｰ螻槭ｒ譏手ｨ・
---

## 8) 諡｡蠑ｵ繝ｭ繝ｼ繝峨・繝・・
- [ ] **AR蜊謎ｸ翫Δ繝ｼ繝会ｼ・ebXR・・*: `ar.html` 繧偵・繝ｼ繧ｹ縺ｫ縲・*繝溘ル蝨ｰ蠖｢glb**繧呈惻縺ｫ驟咲ｽｮ
- [ ] **繝九い繝溘せ讀懷・**: 3D霍晞屬縺ｮ髢ｾ蛟､縺ｧ繧｢繝ｩ繝ｼ繝・- [ ] **骭ｲ逕ｻ/繝ｪ繝励Ξ繧､**: IndexedDB 縺ｫ荳螳壽凾髢謎ｿ晏ｭ倪・蜀咲函UI
- [ ] **繝偵・繝医・繝・・閾ｪ蜍輔ぜ繝ｼ繝**: /api/hotcells 縺ｮ荳贋ｽ阪そ繝ｫ縺ｸ繧ｪ繝ｼ繝医ヱ繝ｳ
- [ ] **讖滉ｽ薙き繝・ざ繝ｪ蛻･繧｢繧､繧ｳ繝ｳ**: OpenSky `category` 繧剃ｽｿ縺・ｩ溽ｨｮ縺ｫ蠢懊§縺ｦ繝｢繝・Ν蛻・崛

---

## 9) 繝ｩ繧､繧ｻ繝ｳ繧ｹ
MIT・亥酔譴ｱ縺ｮ `LICENSE` 繧貞盾辣ｧ・・## PLATEAU・・D驛ｽ蟶ゅΔ繝・Ν・峨・陦ｨ遉ｺ・亥ｿ・郁ｦ∽ｻｶ・・
**譛遏ｭ・域耳螂ｨ・・*・咾esium ion 縺ｮ *Japan 3D Buildings* 繧貞茜逕ｨ  
1. Cesium ion 縺ｧ Japan 3D Buildings 繧偵Λ繧､繝悶Λ繝ｪ縺ｫ霑ｽ蜉  
2. Access Token 縺ｨ Asset ID 繧貞叙蠕・ 
3. `.env` 縺ｫ `ION_TOKEN` 縺ｨ `ION_ASSET_ID` 繧定ｨｭ螳・ 
4. 繧ｵ繝ｼ繝仙・襍ｷ蜍・竊・閾ｪ蜍慕噪縺ｫ3D蟒ｺ迚ｩ縺碁㍾縺ｪ繧翫∪縺・
**繝ｭ繝ｼ繧ｫ繝ｫ3D Tiles**・啻tiles/plateau/tileset.json` 縺ｫ驟咲ｽｮ・郁・蜍墓､懷・・・
繝輔Ο繝ｳ繝・I縺ｫ **Buildings 繝医げ繝ｫ**繧定ｿｽ蜉縺励※縺翫ｊ縲＾N/OFF 繧堤ｰ｡蜊倥↓蛻・ｊ譖ｿ縺医〒縺阪∪縺吶・---

## Quest 3 WebXR (MR) で遊ぶ
- `ar.html` をリポジトリ直下に配置。Quest Browser で `https://<host>/ar.html` を開き、机にタップして卓上ミニ地形を配置します。
- UI は DOM Overlay 前提（Mini/Life-size/Scale スライダなど Web 版とほぼ共通）。DOM Overlay 非対応ブラウザでは 3D パネルへのフォールバック実装を追加してください。
- `assets/mini_city.glb` を置くと PLATEAU 由来の軽量ミニ地形がロードされ、無い場合はグリッドのみで動作します。
- API は Web 版と同じ `/api/opensky` / `/api/states` / `/api/presets` / `/api/config`（同一オリジン想定）。

## Vercel デプロイ（静的 + Serverless Functions）
- ルート直下に静的ファイル（`index.html` / `app.js` / `styles.css` / `config.js` / `ar.html` / `assets` / `tiles` など）を配置します。
- `/api` 以下に以下の Functions を追加しています。
  - `opensky.js`（BBox から states/all をプロキシ）
  - `states.js`（`opensky.js` のエイリアス）
  - `presets.js`（プリセットエリアの JSON）
  - `config.js`（Cesium ion token / Asset ID 等をフロントへ伝搬）
  - `hotcells.js`（簡易ヒートマップ上位セル集計）
- `vercel.json` を追加し、全レスポンスに `Cache-Control: no-store` を付与するシンプル設定にしています。
- Vercel プロジェクトでは Root Directory をリポジトリルートに設定するだけで静的ファイルと API が揃います。
- 必要な環境変数例（Project Settings → Environment Variables）
  - `OPEN_SKY_MODE=opensky`
  - `OPEN_SKY_USERNAME` / `OPEN_SKY_PASSWORD`（Basic 認証が必要な場合）
  - `ION_TOKEN` / `ION_ASSET_ID`（Cesium ion 経由で PLATEAU を重ねる場合）
  - `HOTSCAN_LAMIN` / `HOTSCAN_LAMAX` / `HOTSCAN_LOMIN` / `HOTSCAN_LOMAX` / `HOTSCAN_CELL_SIZE` / `HOTSCAN_TOPK`（ホットセル集計のデフォルト）

## Quest 3 チェックリスト
1. Vercel へデプロイ → `https://<app>.vercel.app/ar.html` を Quest Browser で開く
2. 机に向けてタップでミニ地形を設置 → `Scale` / `Mini` / `Life-size` でサイズ調整
3. `Find` に `KIX` などを入力 → `Use` → `Start` で観測を開始
4. Traffic が無い場合は `W/H` を広げるか `/api/hotcells` の上位セルを UI に組み込む

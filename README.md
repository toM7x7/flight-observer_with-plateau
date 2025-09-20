# Flight Observer with PLATEAU ✈️

**PLATEAU（3D都市）× OpenSky（航空機位置）** をブラウザで可視化。  
- **Web 3D（Cesium）**：都市上空をリアルタイムに飛ぶ機体を表示  
- **WebXR（Quest 3対応 AR/MR）**：卓上ミニチュア ⇄ 実寸大をスケール連続切替  
- **Vercel** へそのままデプロイ可能（静的＋Serverless Functions）

---

## デモ
- Web: `https://<your-app>.vercel.app/`
- AR:  `https://<your-app>.vercel.app/ar.html` （Quest Browser / HTTPS）

---

## 使い方（Web）

1. 画面上部の **Area** から「HND Tokyo Bay Corridor」などを選ぶ  
2. **Start** で取得開始（**Poll(s)** は 5–10秒推奨）  
3. **Buildings**（建物）をONにすると PLATEAU が重なります  
4. **Find / Lat / Lon / W/H(km)** で自由にエリア指定、**Use** でジャンプ

> 見えない時は **W/Hを広げる**、**海側へ寄せる**、**Hot** を使うと当たりやすいです。

---

## 使い方（AR / Quest 3）

1. Quest Browser で **`/ar.html`** を開く  
2. 上部HUDの **Enter AR** を押す → カメラの前で**平面**（机・床）を向ける  
3. コントローラ**トリガー**（または手の**ピンチ**）で**設置**  
4. **Start** で機体表示、**Scale** スライダーで **1m=1km ⇄ 1m=1m** を連続調整

---

## Vercel デプロイ

```
repo-root/
├─ index.html / app.js / styles.css / utils.js
├─ ar.html / assets/mini_city.glb（任意）
├─ tiles/plateau/tileset.json（任意：ローカルPLATEAU）
└─ api/
   ├─ opensky.js     # /api/opensky?lamin&lomin&lamax&lomax
   ├─ states.js      # opensky.jsのエイリアス
   ├─ presets.js     # よく飛ぶエリアのプリセット
   ├─ config.js      # Ion/モードなど最小設定
   └─ hotcells.js    # 任意：広域ヒートマップ
```

- **Framework preset**: Other  
- **Build Command / Output**: なし（静的）  
- **Environment Variables**（必要に応じて）
  - `OPEN_SKY_MODE=opensky`
  - `OPEN_SKY_USERNAME` / `OPEN_SKY_PASSWORD`（任意）
  - `ION_TOKEN` / `ION_ASSET_ID`（Cesium ionを使う場合）

---

## PLATEAU（3D都市）の表示

- **Cesium ion** の *Japan 3D Buildings* を使う（推奨）  
  - `ION_TOKEN`, `ION_ASSET_ID` を環境変数で設定  
- **ローカル 3D Tiles** を配信  
  - `tiles/plateau/tileset.json` を設置（Webでは自動検出）

---

## 既知の注意点

- OpenSkyはボランティア受信網のため、**エリアや時間帯**によっては `states: []` になる場合があります  
  - **Poll間隔を長めに**、**箱を広く/海側に寄せる**、**Hot** を使う  
  - 429（レート制限）は Poll を **10–15s** に  
- WebXRはHTTPS必須・Quest Browser推奨。AR開始は**ユーザー操作**（Enter AR）でのみ可能

---

## ライセンス
MIT

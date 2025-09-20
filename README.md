
# Flight 3D (PLATEAU ÁEOpenSky)  EStarter

**目皁E*: 特定エリア�E�EBox�E�に限定した EDミニ・フライトレーダー”を**ブラウザ**で動かす最小構�E、E 
- フロンチE **CesiumJS**�E�ESMイメージ�E�楕�E体地形�E�任意でPLATEAU 3D Tiles�E�E 
- サーチE **Node.js/Express**�E�EpenSkyプロキシ & ホットセル雁E��E& モチE���E�E 
- チE�Eロイ: Docker 1コマンド、もしくは Render/Fly など PaaS にそ�Eまま載せられます、E
> まず�E **モチE��モーチE*で動作確誁EↁE次に **OpenSky API** につなぎ替ぁEↁE忁E��に応じて **PLATEAU 3D Tiles** を設定、�E頁E��進めると躓きません、E
---

## 1) 要件
- Node.js **18+**�E�Efetch`/`URL`が標準で使える前提�E�E- npm 8+
- �E�任意）Cesium ion のアカウント！ELATEAUの 3D Tiles をionから読む場合！E- �E�任意）OpenSky Network のアカウント（匿名でも可。封E��は OAuth2 推奨�E�E
---

## 2) クイチE��スタート（ローカル�E�E
```bash
# 依存をインスト�Eル
cd server && npm ci && cd ..

# .env を作�E�E�まず�EモチE��でOK�E�Ecp .env.example .env

# サーバ起動（静皁E��ァイルも同ポ�Eトで配信�E�Enode server/server.js

# ブラウザで
http://localhost:8787
```

> 画面左上�E「Area」を刁E��替えると、E*HND�E�羽田の東京湾回廊！E*めE*NRT近傍**などの**よく飛�EプリセチE��**に移動します。�E期値はモチE��チE�Eタの巡航になってぁE��す、E
---

## 3) OpenSky に刁E��替える

1. `.env` を編雁E��て `OPEN_SKY_MODE=opensky` に、E 
2. �E�匿名で良ければそ�Eまま�E�ブラウザでリロード、E 
3. 認証したぁE��合�E、E*旧: Basic** ぁE**新: OAuth2** を選び、`.env` に賁E��惁E��を�Eれてください、E
> **注愁E*: ブラウザから直接OpenSkyを叩く�EはCORSめE��ークン秘匿の点で非推奨。本スターターは**忁E��自前サーバを経由**します、E
---

## 4) PLATEAU�E�ED都市）を重�EめE
`app.js` 冁E�E、E/ 3D Tiles�E�任意）」�Eコメントを外し、E*URL ぁECesium ion Asset ID** を設定してください、E 
- 自前�EスチE `Cesium.Cesium3DTileset.fromUrl('/tiles/plateau/tileset.json')`
- Cesium ion: `Cesium.Cesium3DTileset.fromIonAssetId(ASSET_ID)` �E�E`Cesium.Ion.defaultAccessToken='...'`

> ひとまぁE**3Dタイル無しでも動佁E*します！ESMイメージ�E�楕�E体地形�E�、E
---

## 5) チE�Eロイ�E�推奨�E�Docker�E�E
### A. Docker 単佁E```bash
# ルートで実衁Edocker build -t flight3d .
docker run -it --rm -p 8787:8787 --env-file .env flight3d
# ↁEhttp://localhost:8787
```

### B. Render/Fly/自社サーチE- そ�Eまま Docker をデプロイするか、`server/server.js` めE`node server/server.js` で起動するだけです、E- 環墁E��数は `.env` と同名で設定してください、E
---

## 6) 仕様！EVP�E�E
### 機�E
- **/api/opensky**: BBox持E���E機体取得（モチE��/本番の刁E���E�E- **/api/hotcells**: 庁E��スキャン ↁEグリチE��雁E��EↁE上位セル出劁E- **/api/presets**: よく飛�EプリセチE���E�END/NRT/西側回廁E武蔵小杉3次メチE��ュ�E�E
### 表示
- 機体�E **移動平坁E��補間**で滑らかに移動！ESampledPositionProperty`�E�E- 機首�E **速度ベクトル**で自動！EVelocityOrientationProperty`�E�E- トレイルは **60私E*、古ぁE��体�E **60秒更新無しで破棁E*

### パフォーマンス・スケール
- 同時 200 橁Eまで想定（それ以上�E距離/高度で間引き�E�E- ポ�Eリング間隔は 5 E0 秒（匿名�E 10 秒推奨�E�E
---

## 7) 運用ノ�Eト（落ちなぁE��め�E注意！E- **小さすぎるエリア = 無人**になりがち ↁE**東京湾 or 空港近傍**めEつは常時選抁E- `geo_altitude` 優先、欠損時は `baro_altitude` ↁE地表 + 最低オフセチE��
- API レーチEクレジチE��の節紁E **エリアを狭ぁE*、E*ホットセル**だけ追跡
- 権利表訁E OpenSky / PLATEAU / 地図タイルの帰属を明訁E
---

## 8) 拡張ロード�EチE�E
- [ ] **AR卓上モード！EebXR�E�E*: `ar.html` を�Eースに、E*ミニ地形glb**を机に配置
- [ ] **ニアミス検�E**: 3D距離の閾値でアラーチE- [ ] **録画/リプレイ**: IndexedDB に一定時間保存�E再生UI
- [ ] **ヒ�Eト�EチE�E自動ズーム**: /api/hotcells の上位セルへオートパン
- [ ] **機体カチE��リ別アイコン**: OpenSky `category` を使ぁE��種に応じてモチE��刁E��

---

## 9) ライセンス
MIT�E�同梱の `LICENSE` を参照�E�E## PLATEAU�E�ED都市モチE���E��E表示�E�忁E��要件�E�E
**最短�E�推奨�E�E*�E�Cesium ion の *Japan 3D Buildings* を利用  
1. Cesium ion で Japan 3D Buildings をライブラリに追加  
2. Access Token と Asset ID を取征E 
3. `.env` に `ION_TOKEN` と `ION_ASSET_ID` を設宁E 
4. サーバ�E起勁EↁE自動的に3D建物が重なりまぁE
**ローカル3D Tiles**�E�`tiles/plateau/tileset.json` に配置�E��E動検�E�E�E
フロンチEIに **Buildings トグル**を追加しており、ON/OFF を簡単に刁E��替えできます、E---

## Quest 3 WebXR (MR) �ŗV��
- `ar.html` �����|�W�g�������ɔz�u�BQuest Browser �� `https://<host>/ar.html` ���J���A���Ƀ^�b�v���đ��~�j�n�`��z�u���܂��B
- UI �� DOM Overlay �O��iMini/Life-size/Scale �X���C�_�Ȃ� Web �łƂقڋ��ʁj�BDOM Overlay ��Ή��u���E�U�ł� 3D �p�l���ւ̃t�H�[���o�b�N������ǉ����Ă��������B
- `assets/mini_city.glb` ��u���� PLATEAU �R���̌y�ʃ~�j�n�`�����[�h����A�����ꍇ�̓O���b�h�݂̂œ��삵�܂��B
- API �� Web �łƓ��� `/api/opensky` / `/api/states` / `/api/presets` / `/api/config`�i����I���W���z��j�B

## Vercel �f�v���C�i�ÓI + Serverless Functions�j
- ���[�g�����ɐÓI�t�@�C���i`index.html` / `app.js` / `styles.css` / `config.js` / `ar.html` / `assets` / `tiles` �Ȃǁj��z�u���܂��B
- `/api` �ȉ��Ɉȉ��� Functions ��ǉ����Ă��܂��B
  - `opensky.js`�iBBox ���� states/all ���v���L�V�j
  - `states.js`�i`opensky.js` �̃G�C���A�X�j
  - `presets.js`�i�v���Z�b�g�G���A�� JSON�j
  - `config.js`�iCesium ion token / Asset ID �����t�����g�֓`���j
  - `hotcells.js`�i�ȈՃq�[�g�}�b�v��ʃZ���W�v�j
- `vercel.json` ��ǉ����A�S���X�|���X�� `Cache-Control: no-store` ��t�^����V���v���ݒ�ɂ��Ă��܂��B
- Vercel �v���W�F�N�g�ł� Root Directory �����|�W�g�����[�g�ɐݒ肷�邾���ŐÓI�t�@�C���� API �������܂��B
- �K�v�Ȋ��ϐ���iProject Settings �� Environment Variables�j
  - `OPEN_SKY_MODE=opensky`
  - `OPEN_SKY_USERNAME` / `OPEN_SKY_PASSWORD`�iBasic �F�؂��K�v�ȏꍇ�j
  - `ION_TOKEN` / `ION_ASSET_ID`�iCesium ion �o�R�� PLATEAU ���d�˂�ꍇ�j
  - `HOTSCAN_LAMIN` / `HOTSCAN_LAMAX` / `HOTSCAN_LOMIN` / `HOTSCAN_LOMAX` / `HOTSCAN_CELL_SIZE` / `HOTSCAN_TOPK`�i�z�b�g�Z���W�v�̃f�t�H���g�j

## Quest 3 �`�F�b�N���X�g
1. Vercel �փf�v���C �� `https://<app>.vercel.app/ar.html` �� Quest Browser �ŊJ��
2. ���Ɍ����ă^�b�v�Ń~�j�n�`��ݒu �� `Scale` / `Mini` / `Life-size` �ŃT�C�Y����
3. `Find` �� `KIX` �Ȃǂ���� �� `Use` �� `Start` �Ŋϑ����J�n
4. Traffic �������ꍇ�� `W/H` ���L���邩 `/api/hotcells` �̏�ʃZ���� UI �ɑg�ݍ���

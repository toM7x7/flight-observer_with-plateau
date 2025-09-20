export default async function handler(req, res) {
  const ionToken   = process.env.ION_TOKEN || null;
  const ionAssetId = process.env.ION_ASSET_ID ? Number(process.env.ION_ASSET_ID) : null;
  const plateauLocal = false; // Vercelは./tiles配信OK。必要ならfs.existsSyncで確認可
  const serverMode = process.env.OPEN_SKY_MODE || 'opensky';
  res.status(200).json({ ionToken, ionAssetId, plateauLocal, serverMode });
}

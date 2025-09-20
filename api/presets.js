const AREAS = [
  { id:'hnd_bay', name:'HND Tokyo Bay Corridor', lamin:35.50, lamax:35.63, lomin:139.74, lomax:139.90,
    camera:{ lon:139.82, lat:35.57, alt:3000 } },
  { id:'nrt_east', name:'NRT East Corridor', lamin:35.70, lamax:35.90, lomin:140.25, lomax:140.45,
    camera:{ lon:140.35, lat:35.80, alt:3500 } },
  { id:'kix_bay', name:'KIX Bay', lamin:34.25, lamax:34.55, lomin:135.05, lomax:135.45,
    camera:{ lon:135.24, lat:34.43, alt:3000 } },
  { id:'ngo_bay', name:'NGO Ise Bay', lamin:34.68, lamax:35.00, lomin:136.50, lomax:137.05,
    camera:{ lon:136.80, lat:34.85, alt:3000 } }
];
export default async function handler(req, res) {
  res.status(200).json({ areas: AREAS });
}

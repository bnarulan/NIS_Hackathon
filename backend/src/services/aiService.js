// aiService.js placeholder
export function analyzeText(text) {
  const lowered = (text || "").toLowerCase();

  let dangerLevel = 1;
  if (/(fire|пожар|gas leak|газ|взрыв|explosion|violence|насилие)/.test(lowered)) {
    dangerLevel = 10;
  } else if (/(leak|утечка|дым|smoke|обвал|collapse|electric|электро)/.test(lowered)) {
    dangerLevel = 7;
  } else if (/(trash|мусор|noise|шум|дорога|яма|hole)/.test(lowered)) {
    dangerLevel = 4;
  }

  function computeLocationWeight(lat, lng) {
    if (lat == null || lng == null) return 5;
    const distance = Math.sqrt(lat * lat + lng * lng);
    if (distance < 0.05) return 4;
    if (distance < 0.2) return 6;
    return 8;
  }

  return { dangerLevel, computeLocationWeight };
}

export function calculatePriority({
  likes = 0,
  comments = 0,
  dangerLevel = 1,
  locationWeight = 5,
  daysOpen = 0
}) {
  const raw =
    0.3 * likes +
    0.2 * comments +
    0.25 * dangerLevel +
    0.15 * locationWeight +
    0.1 * daysOpen;

  const scaled = Math.min(100, Math.max(0, raw * 5));
  return Math.round(scaled);
}
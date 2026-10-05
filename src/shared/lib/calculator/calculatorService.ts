// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { computeChart, searchTimezones } from 'free-human-design';
import type {
  BirthInput,
  GeneKeysCalculatedProfile,
  GeneKeySpherePlacement,
  NatalChartCalculationResult,
  NatalPlanetInfo,
} from './types';

export const ZODIAC_SIGNS_RU: Record<string, string> = {
  Aries: 'Овен',
  Taurus: 'Телец',
  Gemini: 'Близнецы',
  Cancer: 'Рак',
  Leo: 'Лев',
  Virgo: 'Дева',
  Libra: 'Весы',
  Scorpio: 'Скорпион',
  Sagittarius: 'Стрелец',
  Capricorn: 'Козерог',
  Aquarius: 'Водолей',
  Pisces: 'Рыбы',
};

export const PLANETS_RU: Record<string, string> = {
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
  north_node: 'Северный Узел',
  south_node: 'Южный Узел',
  earth: 'Земля',
};

const MAJOR_ASPECTS = [
  { name: 'Соединение', angle: 0, orb: 8 },
  { name: 'Секстиль', angle: 60, orb: 5 },
  { name: 'Квадрат', angle: 90, orb: 7 },
  { name: 'Трин', angle: 120, orb: 8 },
  { name: 'Оппозиция', angle: 180, orb: 8 },
];

/**
 * Normalizes an angle into [0, 360)
 */
function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * Calculates shortest angular distance between two longitudes
 */
function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(normalizeDegrees(lon1) - normalizeDegrees(lon2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Determines which house [1..12] a given longitude falls in, given 12 cusps
 */
function determineHouse(longitude: number, cusps: number[]): number {
  const lon = normalizeDegrees(longitude);
  for (let i = 0; i < 12; i++) {
    const cuspCurrent = normalizeDegrees(cusps[i]);
    const cuspNext = normalizeDegrees(cusps[(i + 1) % 12]);

    if (cuspCurrent < cuspNext) {
      if (lon >= cuspCurrent && lon < cuspNext) return i + 1;
    } else {
      // Wraps around 360 / 0 (Aries)
      if (lon >= cuspCurrent || lon < cuspNext) return i + 1;
    }
  }
  return 1;
}

/**
 * Compute Hologenetic Profile (Gene Keys) from birth data
 */
export function computeGeneKeysProfile(input: BirthInput): GeneKeysCalculatedProfile {
  const dateStr = input.date;
  const timeStr = input.time || '12:00';
  const tz = input.timezone || 'Europe/Moscow';
  const lat = input.lat ?? 55.75;
  const lng = input.lng ?? 37.62;

  const chart = computeChart({
    birthdate: dateStr,
    birthtime: timeStr,
    timezone: tz,
    lat,
    lng,
    house: 'placidus',
  });

  const spheresRaw = chart.geneKeys?.spheres || {};

  const makeSphere = (key: string, label: string, body: string): GeneKeySpherePlacement => {
    const data = spheresRaw[key] || { gk: 1, line: 1 };
    return {
      sphere: key,
      sphereLabel: label,
      gate: data.gk,
      line: data.line,
      body,
    };
  };

  return {
    spheres: {
      lifes_work: makeSphere('lifeswork', 'Дело жизни', 'Личность Солнце'),
      evolution: makeSphere('evolution', 'Эволюция', 'Личность Земля'),
      radiance: makeSphere('radiance', 'Сияние', 'Дизайн Солнце'),
      purpose: makeSphere('purpose', 'Цель', 'Дизайн Земля'),
      attraction: makeSphere('attraction', 'Притяжение', 'Дизайн Луна'),
      iq: makeSphere('iq', 'IQ', 'Личность Венера'),
      eq: makeSphere('eq', 'EQ', 'Личность Марс'),
      sq: makeSphere('sq', 'SQ', 'Дизайн Венера'),
      core_vocation: makeSphere('core', 'Призвание / Ядро', 'Дизайн Марс'),
      culture: makeSphere('culture', 'Культура', 'Дизайн Юпитер'),
      pearl: makeSphere('pearl', 'Жемчужина', 'Личность Юпитер'),
    },
    humanDesignSummary: {
      type: chart.humanDesign?.type,
      profile: chart.humanDesign?.profile,
      authority: chart.humanDesign?.authority,
      definedCenters: chart.humanDesign?.definedCenters,
    },
    input,
    engine: 'free-human-design (Swiss Ephemeris validated / astronomia)',
  };
}

/**
 * Compute Natal Chart (Personality planets only + Houses + Ascendant/MC + Aspects)
 */
export function computeNatalChart(input: BirthInput): NatalChartCalculationResult {
  const dateStr = input.date;
  const timeStr = input.time || '12:00';
  const tz = input.timezone || 'Europe/Moscow';
  const lat = input.lat ?? 55.75;
  const lng = input.lng ?? 37.62;

  const chart = computeChart({
    birthdate: dateStr,
    birthtime: timeStr,
    timezone: tz,
    lat,
    lng,
    house: 'placidus',
  });

  const cuspsList: number[] = (chart.astrology?.houses?.cusps || []).map(
    (c: { longitude: number }) => c.longitude
  );

  const personalityActivations = chart.humanDesign?.activations?.personality || [];

  // Filter only standard planets/nodes
  const planets: NatalPlanetInfo[] = personalityActivations
    .filter((p: { body: string }) => p.body !== 'earth') // exclude Earth from standard natal planets
    .map((p: { body: string; longitude: number; retrograde?: boolean }) => {
      const lon = normalizeDegrees(p.longitude);
      const signIdx = Math.floor(lon / 30);
      const degInSign = lon % 30;
      const signNamesEng = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio',
        'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ];
      const signEng = signNamesEng[signIdx] || 'Aries';
      const signRu = ZODIAC_SIGNS_RU[signEng] || signEng;
      const house = cuspsList.length === 12 ? determineHouse(lon, cuspsList) : 1;

      return {
        name: PLANETS_RU[p.body] || p.body,
        longitude: lon,
        sign: signRu,
        signIndex: signIdx,
        degree: Math.round(degInSign * 10) / 10,
        retrograde: !!p.retrograde,
        house,
      };
    });

  // Angles
  const ascRaw = chart.astrology?.angles?.ascendant;
  const ascLon = ascRaw ? normalizeDegrees(ascRaw.longitude) : 0;
  const ascSignIdx = Math.floor(ascLon / 30);
  const ascSignEng = ascRaw?.sign || 'Aries';

  const mcRaw = chart.astrology?.angles?.mc;
  const mcLon = mcRaw ? normalizeDegrees(mcRaw.longitude) : 0;
  const mcSignIdx = Math.floor(mcLon / 30);
  const mcSignEng = mcRaw?.sign || 'Gemini';

  // Calculate aspects between planets
  const aspects: Array<{ a: string; b: string; name: string; angle: number; orb: number }> = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const dist = angularDistance(p1.longitude, p2.longitude);

      for (const asp of MAJOR_ASPECTS) {
        const diff = Math.abs(dist - asp.angle);
        if (diff <= asp.orb) {
          aspects.push({
            a: p1.name,
            b: p2.name,
            name: asp.name,
            angle: asp.angle,
            orb: Math.round(diff * 10) / 10,
          });
          break;
        }
      }
    }
  }

  return {
    date: dateStr,
    time: timeStr,
    place: input.place || 'Москва, Россия',
    timezone: tz,
    lat,
    lon: lng,
    utc: `${dateStr}T${timeStr}:00Z`,
    engine: 'free-human-design (Swiss Ephemeris validated / astronomia)',
    ascendant: {
      longitude: ascLon,
      sign: ZODIAC_SIGNS_RU[ascSignEng] || ascSignEng,
      signIndex: ascSignIdx,
      degree: Math.round((ascLon % 30) * 10) / 10,
    },
    mc: {
      longitude: mcLon,
      sign: ZODIAC_SIGNS_RU[mcSignEng] || mcSignEng,
      signIndex: mcSignIdx,
      degree: Math.round((mcLon % 30) * 10) / 10,
    },
    planets,
    houses: cuspsList,
    aspects,
  };
}

/**
 * City & Timezone helper
 */
export function findTimezoneForCity(query: string) {
  try {
    return searchTimezones(query, { limit: 5 });
  } catch {
    return [];
  }
}

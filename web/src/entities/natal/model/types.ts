export interface NatalPlanet {
  name: string;
  longitude: number;
  sign: string;
  signIndex: number;
  degree: number;
  retrograde: boolean;
  house: number;
}

export interface NatalAscendant {
  longitude: number;
  sign: string;
  signIndex: number;
  degree: number;
}

export interface NatalAspect {
  a: string;
  b: string;
  name: string;
  angle: number;
  orb: number;
}

export interface NatalChartData {
  planets: NatalPlanet[];
  ascendant: NatalAscendant;
  houses: number[];
  aspects: NatalAspect[];
  utc: string;
  place: string;
  timezone: string;
  lat: number;
  lon: number;
  date: string;
  time: string;
  fold?: number;
  engine?: string;
}

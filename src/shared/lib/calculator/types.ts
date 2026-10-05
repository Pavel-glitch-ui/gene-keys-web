export interface BirthInput {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place?: string;
  country?: string;
  timezone?: string; // IANA timezone, e.g. "Europe/Moscow"
  lat?: number;
  lng?: number;
}

export interface GeneKeySpherePlacement {
  sphere: string;
  sphereLabel: string;
  gate: number;
  line: number;
  body: string;
  longitude?: number;
}

export interface GeneKeysCalculatedProfile {
  spheres: {
    lifes_work: GeneKeySpherePlacement;
    evolution: GeneKeySpherePlacement;
    radiance: GeneKeySpherePlacement;
    purpose: GeneKeySpherePlacement;
    attraction: GeneKeySpherePlacement;
    iq: GeneKeySpherePlacement;
    eq: GeneKeySpherePlacement;
    sq: GeneKeySpherePlacement;
    core_vocation: GeneKeySpherePlacement;
    culture: GeneKeySpherePlacement;
    pearl: GeneKeySpherePlacement;
  };
  humanDesignSummary?: {
    type?: string;
    profile?: string;
    authority?: string;
    definedCenters?: string[];
  };
  input: BirthInput;
  engine: string;
}

export interface NatalPlanetInfo {
  name: string;
  longitude: number;
  sign: string;
  signIndex: number;
  degree: number;
  retrograde: boolean;
  house: number;
}

export interface NatalChartCalculationResult {
  date: string;
  time: string;
  place: string;
  timezone: string;
  lat: number;
  lon: number;
  utc: string;
  engine: string;
  ascendant: {
    longitude: number;
    sign: string;
    signIndex: number;
    degree: number;
  };
  mc?: {
    longitude: number;
    sign: string;
    signIndex: number;
    degree: number;
  };
  planets: NatalPlanetInfo[];
  houses: number[];
  aspects: Array<{
    a: string;
    b: string;
    name: string;
    angle: number;
    orb: number;
  }>;
}

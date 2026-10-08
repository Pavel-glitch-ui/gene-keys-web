export interface CityOption {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const CITIES_MOCK: CityOption[] = [
  { name: 'Москва, Россия', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Санкт-Петербург, Россия', lat: 59.9343, lon: 30.3351, timezone: 'Europe/Moscow' },
  { name: 'Минск, Беларусь', lat: 53.9006, lon: 27.559, timezone: 'Europe/Minsk' },
  { name: 'Новосибирск, Россия', lat: 55.0084, lon: 82.9357, timezone: 'Asia/Novosibirsk' },
  { name: 'Екатеринбург, Россия', lat: 56.8389, lon: 60.6057, timezone: 'Asia/Yekaterinburg' },
  { name: 'Казань, Россия', lat: 55.8304, lon: 49.0661, timezone: 'Europe/Moscow' },
  { name: 'Нижний Новгород, Россия', lat: 56.2965, lon: 43.9361, timezone: 'Europe/Moscow' },
  { name: 'Челябинск, Россия', lat: 55.1644, lon: 61.4368, timezone: 'Asia/Yekaterinburg' },
  { name: 'Самара, Россия', lat: 53.2415, lon: 50.2212, timezone: 'Europe/Samara' },
  { name: 'Уфа, Россия', lat: 54.7388, lon: 55.9721, timezone: 'Asia/Yekaterinburg' },
  { name: 'Ростов-на-Дону, Россия', lat: 47.2357, lon: 39.7015, timezone: 'Europe/Moscow' },
  { name: 'Краснодар, Россия', lat: 45.0393, lon: 38.9872, timezone: 'Europe/Moscow' },
  { name: 'Красноярск, Россия', lat: 56.0153, lon: 92.8932, timezone: 'Asia/Krasnoyarsk' },
  { name: 'Пермь, Россия', lat: 58.0105, lon: 56.2502, timezone: 'Asia/Yekaterinburg' },
  { name: 'Воронеж, Россия', lat: 51.672, lon: 39.1843, timezone: 'Europe/Moscow' },
  { name: 'Волгоград, Россия', lat: 48.708, lon: 44.5133, timezone: 'Europe/Volgograd' },
  { name: 'Тюмень, Россия', lat: 57.1522, lon: 65.5272, timezone: 'Asia/Yekaterinburg' },
  { name: 'Алматы, Казахстан', lat: 43.2389, lon: 76.8897, timezone: 'Asia/Almaty' },
  { name: 'Астана, Казахстан', lat: 51.1694, lon: 71.4491, timezone: 'Asia/Almaty' },
  { name: 'Ташкент, Узбекистан', lat: 41.2995, lon: 69.2401, timezone: 'Asia/Tashkent' },
  { name: 'Киев, Украина', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
  { name: 'Тбилиси, Грузия', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
  { name: 'Баку, Азербайджан', lat: 40.4093, lon: 49.8671, timezone: 'Asia/Baku' },
  { name: 'Ереван, Армения', lat: 40.1792, lon: 44.4991, timezone: 'Asia/Yerevan' },
  { name: 'Брест, Беларусь', lat: 52.0976, lon: 23.7341, timezone: 'Europe/Minsk' },
  { name: 'Гродно, Беларусь', lat: 53.6694, lon: 23.8131, timezone: 'Europe/Minsk' },
  { name: 'Гомель, Беларусь', lat: 52.4345, lon: 30.9754, timezone: 'Europe/Minsk' },
  { name: 'Варшава, Польша', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
  { name: 'Вильнюс, Литва', lat: 54.6872, lon: 25.2797, timezone: 'Europe/Vilnius' },
  { name: 'Рига, Латвия', lat: 56.9496, lon: 24.1052, timezone: 'Europe/Riga' },
  { name: 'Берлин, Германия', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
  { name: 'Лондон, Великобритания', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'Нью-Йорк, США', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
];

export function resolveCityData(cityName: string): CityOption {
  const query = cityName.trim().toLowerCase();
  if (!query) {
    return CITIES_MOCK[0];
  }

  // Exact or partial match
  const found = CITIES_MOCK.find(
    (c) => c.name.toLowerCase().includes(query) || query.includes(c.name.split(',')[0].toLowerCase())
  );

  if (found) {
    return {
      ...found,
      name: cityName.trim(),
    };
  }

  // Fallback to user's local timezone or Moscow
  let userTz = 'Europe/Moscow';
  try {
    userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Moscow';
  } catch {
    // ignore
  }

  return {
    name: cityName.trim(),
    lat: 55.7558,
    lon: 37.6173,
    timezone: userTz,
  };
}

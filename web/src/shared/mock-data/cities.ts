export interface CityOption {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const CITIES_MOCK: CityOption[] = [
  { name: 'Минск, Беларусь', lat: 53.9006, lon: 27.559, timezone: 'Europe/Minsk' },
  { name: 'Москва, Россия', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Санкт-Петербург, Россия', lat: 59.9343, lon: 30.3351, timezone: 'Europe/Moscow' },
  { name: 'Киев, Украина', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
  { name: 'Алматы, Казахстан', lat: 43.2389, lon: 76.8897, timezone: 'Asia/Almaty' },
  { name: 'Тбилиси, Грузия', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
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

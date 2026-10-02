import type { CompletedReport } from '@/entities/report/model/types';
import { MOCK_TESTS } from './tests';

const archetypeTest = MOCK_TESTS.find((t) => t.id === 'archetype') || MOCK_TESTS[0];
const natalTest = MOCK_TESTS.find((t) => t.id === 'natal') || MOCK_TESTS[2];

export const MOCK_REPORTS: CompletedReport[] = [
  {
    id: 'sample-report-archetypes',
    method: 'archetype',
    date: '2026-09-28T14:20:00.000Z',
    test: archetypeTest,
    scores: [88, 75, 62, 50, 45, 38, 70, 58, 42, 35, 65, 30],
    profile: {
      name: 'Александр',
      focus: 'Работа и реализация',
    },
    answers: [
      3, 4, 3, 0, 4, 3, 4, 1, 3, 2, 3, 1, 2, 3, 2, 1, 2, 2, 1, 0, 1, 2, 1, 0,
      3, 3, 2, 1, 2, 2, 2, 1, 1, 2, 1, 0, 1, 2, 1, 0, 3, 2, 3, 1, 1, 1, 1, 0,
      {
        text: 'В прошлом месяце я решился полностью переписать архитектуру нашего сервиса, несмотря на скепсис команды. Мне было важно найти более ясный путь и убрать технический долг, не оглядываясь на старые компромиссы.',
        skipped: false,
      },
      {
        text: 'Когда готовый проект раскритиковали за излишнюю сложность, я сначала пытался защитить каждую деталь. Но потом понял, что держался за свою роль «автора идеи», а не за реальную пользу для пользователей.',
        skipped: false,
      },
      {
        text: 'Иногда мне трудно вовремя остановиться и выпустить продукт, потому что кажется, что форма еще не до конца отражает внутренний замысел.',
        skipped: false,
      },
      {
        text: 'В сложных переговорах стараюсь сохранять нейтральность и предлагать понятные правила игры для всех участников.',
        skipped: false,
      },
    ],
    premium: true,
  },
  {
    id: 'sample-report-natal',
    method: 'natal',
    date: '2026-10-01T10:15:00.000Z',
    test: natalTest,
    scores: [82, 70, 55, 48, 65, 52],
    profile: {
      name: 'Елена',
      focus: 'Опоры и восстановление',
    },
    answers: [
      3, 4, 1, 4,
      {
        text: 'В моменты спокойных утренних прогулок в тишине я чувствую максимальную связь с собой. Это время, когда не нужно ничего решать и никому отвечать.',
        skipped: false,
      },
      3, 3, 2, 4,
      {
        text: 'После тяжелых рабочих дней мне помогает теплая ванна и книга, совершенно не связанная с работой.',
        skipped: false,
      },
      2, 3, 2, 3,
      {
        text: 'Когда в проекте возникает хаос, я обычно первой стараюсь структурировать факты и составить чек-лист первых шагов.',
        skipped: false,
      },
      3, 3, 1, 3,
      {
        text: 'В разговоре о личном пространстве мне важно открыто говорить о своих границах до того, как появится раздражение.',
        skipped: false,
      },
      3, 2, 2, 3,
      {
        text: 'Смена профессии три года назад стала самым рискованным, но и самым освобождающим шагом.',
        skipped: false,
      },
      3, 4, 1, 3,
      {
        text: 'Я заметила, что если не планирую отдых заранее, работа незаметно заполняет все доступное время.',
        skipped: false,
      },
    ],
    natal: {
      utc: '1992-07-15T08:30:00Z',
      place: 'Минск, Беларусь',
      timezone: 'Europe/Minsk',
      lat: 53.9006,
      lon: 27.559,
      date: '1992-07-15',
      time: '11:30',
      engine: 'Swiss Ephemeris / Moshier; тропический зодиак, цельнознаковые дома',
      ascendant: {
        longitude: 194.25,
        sign: 'Весы',
        signIndex: 6,
        degree: 14.25,
      },
      planets: [
        { name: 'Солнце', longitude: 113.12, sign: 'Рак', signIndex: 3, degree: 23.12, retrograde: false, house: 10 },
        { name: 'Луна', longitude: 298.45, sign: 'Козерог', signIndex: 9, degree: 28.45, retrograde: false, house: 4 },
        { name: 'Меркурий', longitude: 125.8, sign: 'Лев', signIndex: 4, degree: 5.8, retrograde: false, house: 11 },
        { name: 'Венера', longitude: 102.3, sign: 'Рак', signIndex: 3, degree: 12.3, retrograde: false, house: 10 },
        { name: 'Марс', longitude: 45.1, sign: 'Телец', signIndex: 1, degree: 15.1, retrograde: false, house: 8 },
        { name: 'Юпитер', longitude: 162.7, sign: 'Дева', signIndex: 5, degree: 12.7, retrograde: false, house: 12 },
        { name: 'Сатурн', longitude: 317.4, sign: 'Водолей', signIndex: 10, degree: 17.4, retrograde: true, house: 5 },
        { name: 'Уран', longitude: 286.2, sign: 'Козерог', signIndex: 9, degree: 16.2, retrograde: true, house: 4 },
        { name: 'Нептун', longitude: 287.5, sign: 'Козерог', signIndex: 9, degree: 17.5, retrograde: true, house: 4 },
        { name: 'Плутон', longitude: 230.9, sign: 'Скорпион', signIndex: 7, degree: 20.9, retrograde: true, house: 2 },
      ],
      houses: [194.25, 224.25, 254.25, 284.25, 314.25, 344.25, 14.25, 44.25, 74.25, 104.25, 134.25, 164.25],
      aspects: [
        { a: 'Солнце', b: 'Луна', name: 'Оппозиция', angle: 180, orb: 4.67 },
        { a: 'Солнце', b: 'Венера', name: 'Соединение', angle: 0, orb: 10.82 },
        { a: 'Луна', b: 'Уран', name: 'Соединение', angle: 0, orb: 12.25 },
        { a: 'Марс', b: 'Юпитер', name: 'Трин', angle: 120, orb: 2.4 },
        { a: 'Меркурий', b: 'Сатурн', name: 'Оппозиция', angle: 180, orb: 8.4 },
      ],
    },
    premium: true,
  },
];

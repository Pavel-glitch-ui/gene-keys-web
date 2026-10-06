import { openrouter, OPENROUTER_MODEL } from './openrouter';

export interface GeneKeysKeyAspect {
  name: string;
  shadow: string;
  gift: string;
  siddhi: string;
  note?: string;
}

export interface GeneKeysAIAnalysis {
  formatNotice: string;
  activationSequence: {
    lifesWork: GeneKeysKeyAspect;
    evolution: GeneKeysKeyAspect;
    radiance: GeneKeysKeyAspect;
    purpose: GeneKeysKeyAspect;
    vectorOfRealization: string;
    growthZone: string;
    vitalitySource: string;
  };
  venusSequence: {
    attraction: GeneKeysKeyAspect;
    iq: GeneKeysKeyAspect;
    eq: GeneKeysKeyAspect;
    sq: GeneKeysKeyAspect;
    coreWound: GeneKeysKeyAspect;
    relationshipPatterns: string;
    woundTransformation: string;
  };
  pearlSequence: {
    vocation: GeneKeysKeyAspect;
    culture: GeneKeysKeyAspect;
    brand: GeneKeysKeyAspect;
    pearl: GeneKeysKeyAspect;
    monetizationStrategy: string;
    collectiveRole: string;
  };
  finalSynthesis: {
    coreVector: string;
    recurringScenarios: string;
    transformationPoint: string;
    shadowToGiftPath: string;
    practicalActionPlan: string[];
  };
}

export interface UserAssessmentInput {
  name: string;
  focus?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  testTitle: string;
  scores?: number[];
  domains?: Array<{ id: string; label: string }>;
  reflectionText?: string;
}

export async function generateGeneKeysAnalysis(
  input: UserAssessmentInput
): Promise<GeneKeysAIAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

  // If no API key configured, use deterministic fallback
  if (!apiKey || apiKey === 'dummy-openrouter-key') {
    return generateFallbackAnalysis(input);
  }

  const systemPrompt = `Ты действуешь как аналитик системы Gene Keys по методологии Richard Rudd и специалист по интерпретации хологенетического профиля личности.
Твоя задача — рассчитать и интерпретировать профиль пользователя через систему 64 Генных Ключей и три основные последовательности: Активации, Венеры и Жемчужины.

Перед началом анализа определи формат расчёта:
- если пользователем указаны дата, время и место рождения — выполни интерпретацию на основе полной модели хологенетического профиля;
- если указана только дата рождения — выполни символическую архетипическую интерпретацию на основе системы 64 Генных Ключей и прямо обозначь, что анализ носит психологико-символический характер и не является точным расчётом полного профиля Gene Keys.

Выполни анализ через три последовательности:
1. Последовательность Активации (жизненное предназначение): Life's Work, Evolution, Radiance, Purpose (для каждого: Тень, Дар, Сиддхи + вектор реализации, зона роста, источник устойчивости).
2. Последовательность Венеры (эмоциональные паттерны и отношения): Attraction, IQ, EQ, SQ, Core Wound (для каждого: Тень, Дар, Сиддхи + сценарии в отношениях, эмоциональные реакции, детские модели привязанности, трансформация базовой травмы).
3. Последовательность Жемчужины (социальная реализация и материальный поток): Vocation, Culture, Brand, Pearl (для каждого: Тень, Дар, Сиддхи + естественный способ монетизации, роль в коллективе, раскрытие материального потенциала).
4. Итоговый синтез: главный вектор, повторяющиеся сценарии, точка трансформации, переход Тень -> Дар, практический путь.

Ответ СТРОГО верни в формате валидного JSON-объекта со следующей структурой:
{
  "formatNotice": "Текст формата расчета (символический или полный)",
  "activationSequence": {
    "lifesWork": { "name": "Ключ (например, 25 Ключ)", "shadow": "Название тени", "gift": "Название дара", "siddhi": "Название сиддхи", "note": "краткое пояснение" },
    "evolution": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "...", "note": "..." },
    "radiance": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "...", "note": "..." },
    "purpose": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "...", "note": "..." },
    "vectorOfRealization": "основной вектор реализации",
    "growthZone": "зона внутреннего роста",
    "vitalitySource": "источник устойчивости и жизненной энергии"
  },
  "venusSequence": {
    "attraction": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "iq": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "eq": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "sq": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "coreWound": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "relationshipPatterns": "поведенческие сценарии в отношениях и привязанность",
    "woundTransformation": "механизм трансформации базовой травмы в зрелость"
  },
  "pearlSequence": {
    "vocation": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "culture": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "brand": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "pearl": { "name": "...", "shadow": "...", "gift": "...", "siddhi": "..." },
    "monetizationStrategy": "естественный способ монетизации и стратегия роста дохода",
    "collectiveRole": "роль личности в коллективных системах"
  },
  "finalSynthesis": {
    "coreVector": "главный архетипический вектор личности",
    "recurringScenarios": "повторяющиеся жизненные сценарии",
    "transformationPoint": "ключевая точка внутренней трансформации",
    "shadowToGiftPath": "переход из состояния Тени в состояние Дара",
    "practicalActionPlan": ["Неделя 1: фокус...", "Неделя 2: фокус...", "Неделя 3: фокус...", "Неделя 4: фокус..."]
  }
}
Язык ответа: русский. Избегай категоричных утверждений.`;

  const userPayload = `Входные данные пользователя:
Имя: ${input.name || 'Исследователь'}
Фокус внимания: ${input.focus || 'Общий портрет'}
Дата рождения: ${input.birthDate || 'Не указана (символический анализ)'}
Время рождения: ${input.birthTime || 'Не указано'}
Место рождения: ${input.birthPlace || 'Не указано'}
Пройденное исследование: ${input.testTitle}
Шкалы исследования: ${input.domains?.map((d, i) => `${d.label}: ${input.scores?.[i] ?? 'N/A'}`).join(', ') || 'N/A'}
Личные заметки и рефлексия: ${input.reflectionText || 'Без дополнительного текста'}`;

  try {
    const response = await openrouter.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPayload },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Пустой ответ от OpenRouter API');
    }

    const parsed = JSON.parse(content) as GeneKeysAIAnalysis;
    return parsed;
  } catch (error) {
    console.error('[OpenRouter Gene Keys API Error, falling back to local model]:', error);
    return generateFallbackAnalysis(input);
  }
}

function generateFallbackAnalysis(input: UserAssessmentInput): GeneKeysAIAnalysis {
  const hasFullNatal = Boolean(input.birthDate && input.birthTime && input.birthPlace);

  return {
    formatNotice: hasFullNatal
      ? `Анализ рассчитан на основе хологенетической модели для даты ${input.birthDate} ${input.birthTime} (${input.birthPlace}).`
      : 'Анализ носит психологико-символический характер на основе 64 Генных Ключей Ричарда Радда и не является точным астрономическим расчетом.',
    activationSequence: {
      lifesWork: {
        name: '25-й Генный Ключ',
        shadow: 'Сужение (Холодность)',
        gift: 'Принятие',
        siddhi: 'Вселенская Любовь',
        note: 'Определяет вашу естественную реализацию в мире через безусловное принятие обстоятельств.',
      },
      evolution: {
        name: '46-й Генный Ключ',
        shadow: 'Серьезность',
        gift: 'Восторг',
        siddhi: 'Экстаз',
        note: 'Зона внутреннего вызова: отпустить гиперконтроль и научиться доверять телу и ритму жизни.',
      },
      radiance: {
        name: '10-й Генный Ключ',
        shadow: 'Самоодержимость',
        gift: 'Естественность',
        siddhi: 'Бытие',
        note: 'Внутренний источник витальности — способность оставаться подлинным в любой социальной среде.',
      },
      purpose: {
        name: '15-й Генный Ключ',
        shadow: 'Серость',
        gift: 'Магнетизм',
        siddhi: 'Цветение',
        note: 'Глубинный якорь: способность объединять непохожих людей и принимать весь спектр жизни.',
      },
      vectorOfRealization: 'Переход от сужения восприятия и критики к широкому принятию многообразия процессов.',
      growthZone: 'Преодоление потребности в постоянном ментальном контроле через контакт с телом и спонтанностью.',
      vitalitySource: 'Сохранение естественного темпа жизни без искусственного ускорения и сравнения себя с другими.',
    },
    venusSequence: {
      attraction: {
        name: '4-й Генный Ключ',
        shadow: 'Нетерпимость',
        gift: 'Понимание',
        siddhi: 'Прощение',
      },
      iq: {
        name: '23-й Генный Ключ',
        shadow: 'Сложность',
        gift: 'Простота',
        siddhi: 'Квинтэссенция',
      },
      eq: {
        name: '43-й Генный Ключ',
        shadow: 'Глухота',
        gift: 'Проницательность',
        siddhi: 'Озарение',
      },
      sq: {
        name: '1-й Генный Ключ',
        shadow: 'Энтропия',
        gift: 'Свежесть',
        siddhi: 'Красота',
      },
      coreWound: {
        name: 'Базовая травма Отвержения (1-я линия)',
        shadow: 'Изоляция и защитный холод',
        gift: 'Глубокая внутренняя устойчивость',
        siddhi: 'Чистая близость',
      },
      relationshipPatterns: 'В близких связях при возникновении неопределенности включается защитная дистанция или поиск логических объяснений вместо прямого проживания чувств.',
      woundTransformation: 'Трансформация происходит, когда страх быть непонятым сменяется готовностью оставаться в уязвимом контакте.',
    },
    pearlSequence: {
      vocation: {
        name: '25-й Генный Ключ (Линия 2)',
        shadow: 'Замкнутость',
        gift: 'Легкость партнерства',
        siddhi: 'Универсальное служение',
      },
      culture: {
        name: '14-й Генный Ключ',
        shadow: 'Компромисс',
        gift: 'Компетентность',
        siddhi: 'Изобилие',
      },
      brand: {
        name: '8-й Генный Ключ',
        shadow: 'Посредственность',
        gift: 'Аутентичность',
        siddhi: 'Изысканность',
      },
      pearl: {
        name: '35-й Генный Ключ',
        shadow: 'Голод (Жажда новизны)',
        gift: 'Приключение',
        siddhi: 'Безграничность',
      },
      monetizationStrategy: 'Монетизация через создание уникальных продуктов и аутентичную экспертизу, без подражания массовым шаблонам.',
      collectiveRole: 'Архитектор смыслов и интегратор: соединение разрозненных идей в простые и работающие инструменты.',
    },
    finalSynthesis: {
      coreVector: 'Движение от защитной замкнутости и интеллектуализации к искренней естественности и смелому проявлению Даров.',
      recurringScenarios: 'Повторяющаяся попытка найти "идеальный момент" перед важным шагом, приводящая к откладыванию решений.',
      transformationPoint: 'Момент признания: Тень — это не ошибка, а сжатый ресурс, требующий внимания и бережного раскрытия.',
      shadowToGiftPath: 'Заметить реакцию сжатия -> не критиковать себя -> сделать паузу -> выбрать действие из состояния Дара.',
      practicalActionPlan: [
        'Неделя 1 (Наблюдение): Отслеживайте ситуации, когда возникает желание закрыться или доказать правоту.',
        'Неделя 2 (Принятие): Практикуйте 2-минутную паузу дыхания перед тем, как ответить в напряженном диалоге.',
        'Неделя 3 (Проявление Дара): Совершите одно действие в работе из состояния аутентичности, а не ожиданий окружающих.',
        'Неделя 4 (Интеграция): Зафиксируйте в дневнике, как изменилось ощущение тела и уровень энергии при отказе от гиперконтроля.',
      ],
    },
  };
}

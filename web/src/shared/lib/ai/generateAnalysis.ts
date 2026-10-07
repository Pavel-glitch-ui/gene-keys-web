import { openai, OPENAI_MODEL } from './openai';
import { safeParseLlmJson } from './jsonHelper';
import {
  ARCHETYPE_SYSTEM_PROMPT,
  buildArchetypeUserPrompt,
  GENE_KEYS_SYSTEM_PROMPT,
  buildGeneKeysUserPrompt,
  IKIGAI_SYSTEM_PROMPT,
  buildIkigaiUserPrompt,
  NATAL_CARD_SYSTEM_PROMPT,
  buildNatalCardUserPrompt,
} from './prompts';

import type { GeneKeysCalculatedProfile, NatalChartCalculationResult } from '../calculator';

export interface AssessmentRequestData {
  testId: string;
  userName?: string;
  answers: Array<{
    questionId?: string;
    questionText: string;
    answerText?: string;
    selectedOptions?: string[];
  }>;
  calculationData?: unknown;
}

export interface GeneratedAnalysisResult {
  success: boolean;
  testId: string;
  data: unknown;
  rawText?: string;
  error?: string;
}

export interface IkigaiQuadrant {
  title: string;
  core_insights: string;
  signals_of_flow: string[];
  hidden_drainers: string[];
}

export interface IkigaiAnalysisData {
  ikigai_formula: string;
  synthesis_summary: string;
  quadrants: {
    passion: IkigaiQuadrant;
    skills: {
      title: string;
      core_competencies: string[];
      unique_combination: string;
      blind_spots: string;
    };
    market_demand: {
      title: string;
      proven_demand: string[];
      monetization_angles: string[];
      barriers: string;
    };
    world_need: {
      title: string;
      meaning_anchors: string[];
      target_audience: string;
      contribution_format: string;
    };
  };
  intersections: {
    passion_and_skill: { name: string; description: string };
    skill_and_market: { name: string; description: string };
    market_and_mission: { name: string; description: string };
    mission_and_passion: { name: string; description: string };
  };
  tensions_and_tradeoffs: string;
  implementation_roadmap: Array<{
    phase: number;
    title: string;
    action: string;
    metric: string;
  }>;
}

export interface ArchetypeAnalysisData {
  character_card: {
    archetypal_basis: string;
    public_role: string;
    main_motive?: string;
    strength: string;
    contradiction: string;
    shadow_risk: string;
    signature_expression?: string;
    monetization_hypothesis?: string;
    first_action?: string;
  };
  book: {
    title: string;
    subtitle: string;
    sections: Array<{
      id: number;
      title: string;
      body: string;
    }>;
  };
  plan_30_days: Array<{
    week: number;
    action: string;
    deliverable?: string;
    indicator?: string;
  }>;
}

export interface NatalAnalysisData {
  natal_overview: {
    title: string;
    core_motto: string;
    synthesis: string;
  };
  big_three: {
    sun: {
      sign: string;
      house?: number;
      degree?: string;
      essence: string;
    };
    moon: {
      sign: string;
      house?: number;
      degree?: string;
      essence: string;
    };
    ascendant: {
      sign: string;
      degree?: string;
      essence: string;
    };
  };
  planetary_dynamics?: {
    mind_and_voice?: { planet?: string; insight: string };
    desires_and_values?: { planet?: string; insight: string };
    drive_and_will?: { planet?: string; insight: string };
    growth_and_boundaries?: { planets?: string; insight: string };
  };
  key_aspect_tensions?: Array<{
    aspect: string;
    orb?: number;
    psychological_tension: string;
    integration_step: string;
  }>;
  life_domains?: {
    vocation_and_mc?: string;
    relationships?: string;
    resources?: string;
  };
  integration_practices?: Array<{
    area: string;
    recommendation: string;
    reflection_question?: string;
  }>;
}

export function getFallbackIkigai(userName: string = 'Искатель'): IkigaiAnalysisData {
  return {
    ikigai_formula: 'Соединение системной экспертизы и творческой свободы для создания понятных решений, приносящих осязаемую пользу людям и устойчивый доход.',
    synthesis_summary: `Для ${userName} текущая точка сборки находится на стыке развитых навыков и стремления к подлинной автономии. Главный ресурс — способность структурировать сложное и удерживать фокус, когда задача искренне увлекает. Зона роста — перевод внутренних стандартов в понятные рынку предложения без обесценивания личного времени.`,
    quadrants: {
      passion: {
        title: 'Что ты любишь',
        core_insights: 'Живой интерес возникает в задачах с видимым влиянием и ясной внутренней логикой, где есть место исследованию и самостоятельному темпу.',
        signals_of_flow: [
          'Погружение в процесс проектирования и поиска неочевидных связей',
          'Ощущение драйва при решении сложных нетривиальных задач',
          'Удовлетворение от доведения идеи до чистого рабочего результата',
        ],
        hidden_drainers: [
          'Монотонная рутина и необходимость имитировать бурную деятельность',
          'Вынужденные компромиссы при отсутствии общего видения с окружением',
        ],
      },
      skills: {
        title: 'В чём ты силён',
        core_competencies: [
          'Аналитическое мышление и внимание к ключевым деталям',
          'Умение переводить хаотичные вводные в понятный план действий',
          'Практическая надежность и доведение начатого до финала',
        ],
        unique_combination: 'Связка стратегического видения и аккуратного методичного исполнения без лишней суеты.',
        blind_spots: 'Склонность к гиперконтролю и завышенным требованиям к себе до первой проверки гипотезы.',
      },
      market_demand: {
        title: 'За что готовы платить',
        proven_demand: [
          'Качественная экспертиза и надежное решение прикладных проблем',
          'Оптимизация и наведение порядка в рабочих процессах',
          'Создание законченных продуктов и прикладных инструментов',
        ],
        monetization_angles: [
          'Персональное консультирование и экспертное сопровождение проектов',
          'Создание авторских методик и структурированных сервисов',
          'Решение точечных сложных задач с оплатой за результат',
        ],
        barriers: 'Нежелание агрессивно продавать и занижение ценности своего времени.',
      },
      world_need: {
        title: 'В чём нуждается мир',
        meaning_anchors: [
          'Ясность, спокойствие и предсказуемость в атмосфере неопределенности',
          'Помощь другим людям в обретении устойчивых опор и уверенности',
          'Создание этичных и долговечных решений, улучшающих качество жизни',
        ],
        target_audience: 'Люди и команды, ищущие глубину, честный профессионализм и практическую пользу.',
        contribution_format: 'Создание поддерживающей среды и инструментов, дающих конкретный измеримый прогресс.',
      },
    },
    intersections: {
      passion_and_skill: {
        name: 'Увлечение (Страсть + Мастерство)',
        description: 'Пространство высокого мастерства и удовольствия от процесса. Вы чувствуете себя уверенно, но без внешней упаковки это рискует оставаться дорогим хобби.',
      },
      skill_and_market: {
        name: 'Профессия (Мастерство + Востребованность)',
        description: 'Надежный источник дохода и подтвержденная ценность. Важно следить, чтобы рутинные обязательства не вытесняли живой интерес.',
      },
      market_and_mission: {
        name: 'Призвание (Востребованность + Миссия)',
        description: 'Ответ на реальный запрос людей с готовностью платить. Дает чувство значимости и социального подтверждения.',
      },
      mission_and_passion: {
        name: 'Миссия (Миссия + Страсть)',
        description: 'Вдохновляющий вектор и внутренний огонь. Требует практического заземления в бизнес-модель, чтобы не вызывать выгорания.',
      },
    },
    tensions_and_tradeoffs: 'Ключевой внутренний конфликт разворачивается между желанием творческой автономии и необходимостью регулярной дисциплины рыночного спроса. Баланс достигается через упаковку сильных навыков в стандартизированные предложения, освобождающие время для экспериментов.',
    implementation_roadmap: [
      {
        phase: 1,
        title: 'Микро-эксперимент (1–2 недели)',
        action: 'Сформулируйте одно точечное предложение, опирающееся на ведущую сильную сторону, и покажите его 3 потенциальным заказчикам.',
        metric: 'Получение качественной обратной связи и выявление ключевых болей аудитории.',
      },
      {
        phase: 2,
        title: 'Стабилизация и отклик (1–2 месяца)',
        action: 'Проведите 2 пилотных проекта по фиксированной цене, документируя затраченное время и удовлетворенность процессом.',
        metric: 'Первые подтвержденные результаты, кейс с отзывом и понимание себестоимости работы.',
      },
      {
        phase: 3,
        title: 'Устойчивая интеграция (3–6 месяцев)',
        action: 'Закрепите пропорцию 70/30: 70% времени на стабильный подтвержденный поток и 30% на развитие новых направлений и отдых.',
        metric: 'Предсказуемый ежемесячный доход при сохранении высокого уровня энергии и радости от процесса.',
      },
    ],
  };
}

export function getFallbackArchetype(userName: string = 'Исследователь'): ArchetypeAnalysisData {
  return {
    character_card: {
      archetypal_basis: 'Искатель / Творец',
      public_role: 'Интегратор смыслов и первопроходец',
      main_motive: 'Поиск подлинности, свободы проявления и создание уникальных решений.',
      strength: 'Способность видеть нестандартные связи и доводить сложные концепции до ясности.',
      contradiction: 'Тяга к независимости против потребности в признании и надежной команде.',
      shadow_risk: 'Вечный поиск идеального момента и обесценивание промежуточных результатов.',
      signature_expression: '«Всё главное проявляется через смелость быть собой.»',
      monetization_hypothesis: 'Упаковка авторской экспертизы в понятные практические продукты и консультирование.',
      first_action: 'Зафиксировать свою ключевую ценность и открыто заявить о ней аудитории.',
    },
    book: {
      title: 'Персональная книга бренда',
      subtitle: `Архетипическая архитектура и позиционирование для ${userName}`,
      sections: [
        {
          id: 1,
          title: '1. Основа характера и ведущий архетип',
          body: 'Ваша внутренняя опора строится на архетипе Искателя с ярким включением Творца. Это проявляется в потребности исследовать неизведанное и трансформировать опыт в осязаемые решения.',
        },
        {
          id: 2,
          title: '2. Внутренний конфликт и противоречие',
          body: 'Желание полной свободы действий иногда вступает в противоречие с необходимостью методичной регулярной рутины. Баланс достигается через ритмичные спринты.',
        },
        {
          id: 3,
          title: '3. Публичная роль и позиционирование',
          body: 'Аудитория воспринимает вас как проводника к ясности. Ваша позиция — эксперт, который не навязывает догмы, а показывает работающие ориентиры.',
        },
        {
          id: 4,
          title: '4. Подтвержденные сильные стороны',
          body: 'Глубокий анализ, системность, умение отделять главное от шелухи и создавать эстетичные решения.',
        },
        {
          id: 5,
          title: '5. Теневая цена стратегии',
          body: 'Риск интеллектуализации вместо прямого действия и стремление довести всё до совершенства до первого контакта с реальностью.',
        },
      ],
    },
    plan_30_days: [
      {
        week: 1,
        action: 'Сформулируйте ключевое сообщение бренда и опишите свою публичную роль в 3 предложениях.',
        deliverable: 'Манифест позиционирования.',
        indicator: 'Ясность в описании профиля.',
      },
      {
        week: 2,
        action: 'Опубликуйте разбор кейса или личный инсайт из состояния ведущего архетипа.',
        deliverable: 'Экспертный материал.',
        indicator: 'Отклик и диалог с аудиторией.',
      },
      {
        week: 3,
        action: 'Протестируйте предложение пилотной консультации или продукта среди теплого круга.',
        deliverable: 'Презентация предложения.',
        indicator: 'Первые заявки.',
      },
      {
        week: 4,
        action: 'Подведите итоги месяца и закрепите регулярный ритм проявления.',
        deliverable: 'Календарь проявления на следующий квартал.',
        indicator: 'Уверенность и системный поток.',
      },
    ],
  };
}

export function getFallbackNatal(userName: string = 'Исследователь'): NatalAnalysisData {
  return {
    natal_overview: {
      title: 'Натальная карта · Архитектура личности',
      core_motto: 'Синтез воли, интуиции и точного практического действия.',
      synthesis: `Для ${userName} натальная архитектура отражает сочетание яркого творческого импульса и потребности в структурной надежности. Центральная задача — соединить амбициозное видение с заботой о внутреннем эмоциональном ресурсе.`,
    },
    big_three: {
      sun: {
        sign: 'Овен',
        house: 1,
        degree: '15°',
        essence: 'Осознанное «Я», воля к авторству своей жизни, смелость начинать новое и вести за собой.',
      },
      moon: {
        sign: 'Телец',
        house: 2,
        degree: '8°',
        essence: 'Потребность в эмоциональной стабильности, комфорте, заземлении и надежных материальных опорах.',
      },
      ascendant: {
        sign: 'Близнецы',
        degree: '22°',
        essence: 'Социальный фасад: любознательность, контактность, живой ум и способность быстро адаптироваться.',
      },
    },
    planetary_dynamics: {
      mind_and_voice: {
        planet: 'Меркурий',
        insight: 'Быстрое структурное мышление, умение переводить сложные вещи на простой человеческий язык.',
      },
      desires_and_values: {
        planet: 'Венера',
        insight: 'Высокие стандарты качества, ценность гармонии, красоты и честного взаимовыгодного партнерства.',
      },
      drive_and_will: {
        planet: 'Марс',
        insight: 'Точечный направленный напор при наличии понятной цели. Неэффективность при монотонном принуждении.',
      },
      growth_and_boundaries: {
        planets: 'Юпитер и Сатурн',
        insight: 'Баланс широты горизонта (Юпитер) и требовательной внутренней дисциплины (Сатурн).',
      },
    },
    key_aspect_tensions: [
      {
        aspect: 'Связка Солнце — Луна',
        orb: 2.1,
        psychological_tension: 'Баланс между стремлением к активным прорывам и потребностью в покое и безопасности.',
        integration_step: 'Не жертвовать сном и телом ради работы; планировать отдых как неотъемлемую часть стратегии.',
      },
    ],
    life_domains: {
      vocation_and_mc: 'Публичная реализация через авторские проекты и лидерство смыслов.',
      relationships: 'Равноправное партнерство, основанное на уважении к автономии друг друга.',
      resources: 'Материальная стабильность как прямое следствие применения аутентичных талантов.',
    },
    integration_practices: [
      {
        area: 'Осознанное проявление',
        recommendation: 'Начинайте утро с 10 минут тишины без гаджетов для настройки на внутреннее «Я».',
        reflection_question: 'В какой сфере сегодня важнее проявить смелость, а в какой — терпение?',
      },
      {
        area: 'Эмоциональный ресурс',
        recommendation: 'Регулярная физическая активность и контакт с телом для снятия ментального перенапряжения.',
        reflection_question: 'Что сейчас дает наибольшее ощущение опоры и безопасности?',
      },
    ],
  };
}

export function getFallbackAnalysisForTest(testId: string, userName: string = 'Исследователь'): unknown {
  if (testId === 'igigay') {
    return getFallbackIkigai(userName);
  }
  if (testId === 'archetype') {
    return getFallbackArchetype(userName);
  }
  if (testId === 'natal') {
    return getFallbackNatal(userName);
  }
  return null;
}

/**
 * Universal dispatcher for generating AI analysis across all 4 studies:
 * - archetype: 12 Archetypes
 * - genes: Gene Keys Golden Path
 * - igigay: Ikigai Personal Realization
 * - natal: Natal Chart Psychological Architecture
 */
export async function generateAnalysis(
  payload: AssessmentRequestData
): Promise<GeneratedAnalysisResult> {
  const { testId, userName, answers, calculationData } = payload;
  const apiKey = process.env.OPENAI_API_KEY;

  let systemPrompt = '';
  let userPrompt = '';

  switch (testId) {
    case 'archetype':
      systemPrompt = ARCHETYPE_SYSTEM_PROMPT;
      userPrompt = buildArchetypeUserPrompt({
        userName,
        stage: 'report',
        answers: answers.map((a) => ({
          questionId: a.questionId || 'q',
          questionText: a.questionText,
          selectedOptions: a.selectedOptions,
          customText: a.answerText,
        })),
      });
      break;

    case 'genes': {
      const gkData = calculationData as GeneKeysCalculatedProfile | undefined;
      systemPrompt = GENE_KEYS_SYSTEM_PROMPT;
      userPrompt = buildGeneKeysUserPrompt({
        userName,
        birthData: {
          date: gkData?.input?.date || '1990-01-01',
          time: gkData?.input?.time || '12:00',
          city: gkData?.input?.place || 'Москва',
        },
        calculatedSpheres: (gkData?.spheres as unknown as Record<string, { gate: number; line: number; sphereLabel?: string }>) || {},
        answers: answers.map((a) => ({
          questionId: a.questionId || 'q',
          questionText: a.questionText,
          answerText: a.answerText || (a.selectedOptions || []).join(', ') || 'Да',
        })),
      });
      break;
    }

    case 'igigay':
      systemPrompt = IKIGAI_SYSTEM_PROMPT;
      userPrompt = buildIkigaiUserPrompt({
        userName,
        answers: answers.map((a) => ({
          questionId: a.questionId || 'q',
          questionText: a.questionText,
          selectedText: (a.selectedOptions || []).join(', '),
          reflectionText: a.answerText,
        })),
      });
      break;

    case 'natal': {
      const natalData = calculationData as NatalChartCalculationResult | undefined;
      systemPrompt = NATAL_CARD_SYSTEM_PROMPT;
      userPrompt = buildNatalCardUserPrompt({
        userName,
        chartData: natalData || {
          date: '1990-01-01',
          time: '12:00',
          place: 'Москва',
          ascendant: { sign: 'Овен', degree: 15, longitude: 15 },
          planets: [],
          aspects: [],
        },
        answers: answers.map((a) => ({
          questionText: a.questionText,
          answerText: a.answerText || (a.selectedOptions || []).join(', ') || 'Да',
        })),
      });
      break;
    }

    default:
      return {
        success: false,
        testId,
        data: null,
        error: `Неизвестный идентификатор теста: ${testId}`,
      };
  }

  // If no API key configured, use test-specific fallback directly
  if (!apiKey || apiKey === 'dummy-openai-key') {
    const fallbackData = getFallbackAnalysisForTest(testId, userName);
    if (fallbackData) {
      return {
        success: true,
        testId,
        data: fallbackData,
        rawText: JSON.stringify(fallbackData),
      };
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const content = response.choices?.[0]?.message?.content || '';

    try {
      const parsedData = safeParseLlmJson(content);
      return {
        success: true,
        testId,
        data: parsedData,
        rawText: content,
      };
    } catch {
      console.warn(`[AI Parsing Warning] Failed to parse JSON for test ${testId}, checking fallback`);
      const fallbackData = getFallbackAnalysisForTest(testId, userName);
      if (fallbackData) {
        return {
          success: true,
          testId,
          data: fallbackData,
          rawText: content,
        };
      }
      return {
        success: false,
        testId,
        data: null,
        rawText: content,
        error: 'Не удалось разобрать JSON-ответ от языковой модели.',
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Ошибка вызова AI API';
    console.error(`[AI API Error for ${testId}]:`, errorMsg);
    const fallbackData = getFallbackAnalysisForTest(testId, userName);
    if (fallbackData) {
      console.info(`[AI Fallback Activated for ${testId}]`);
      return {
        success: true,
        testId,
        data: fallbackData,
        error: errorMsg,
      };
    }
    return {
      success: false,
      testId,
      data: null,
      error: errorMsg,
    };
  }
}

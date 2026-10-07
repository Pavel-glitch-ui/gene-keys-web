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

export function getFallbackAnalysisForTest(testId: string, userName: string = 'Исследователь'): unknown {
  if (testId === 'igigay') {
    return getFallbackIkigai(userName);
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

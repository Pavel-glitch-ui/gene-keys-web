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
    return {
      success: false,
      testId,
      data: null,
      error: errorMsg,
    };
  }
}

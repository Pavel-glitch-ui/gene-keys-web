import type { TestSchema, Domain } from '@/entities/test/model/types';
import type {
  UserAnswer,
  UserProfile,
  DimensionReportItem,
  InteractionItem,
  PlanStepItem,
  DetailedReportData,
} from '@/entities/report/model/types';
import type { NatalChartData } from '@/entities/natal/model/types';

export const LABELS_FOR_ANSWERS = [
  'Совсем не про меня',
  'Скорее не про меня',
  'По-разному',
  'Скорее про меня',
  'Очень похоже на меня',
];

export function isReflection(q: { type: string }): boolean {
  return q.type === 'reflection';
}

export function scoreTest(test: TestSchema, answers: UserAnswer[]): number[] {
  return test.domains.map((d) => {
    const entries = test.questions
      .map((q, i) => ({ q, value: answers[i] }))
      .filter((x): x is { q: typeof x.q; value: number } => x.q.domain === d.id && !isReflection(x.q) && typeof x.value === 'number');

    if (entries.length === 0) return 50;

    const sum = entries.reduce((s, x) => s + (x.q.reverse ? 4 - x.value : x.value), 0);
    return Math.round((sum / (entries.length * 4)) * 100);
  });
}

export function getDomainText(domain: Domain, score: number): string {
  if (score < 35) return domain.low;
  if (score > 65) return domain.high;
  return domain.mid;
}

export function buildDetailedReport(
  test: TestSchema,
  answers: UserAnswer[],
  scores: number[],
  profile?: UserProfile,
  natal?: NatalChartData
): DetailedReportData {
  const top = Math.max(...scores);
  const low = Math.min(...scores);
  const highest = test.domains.filter((_, i) => scores[i] === top);
  const lowest = test.domains.filter((_, i) => scores[i] === low);
  const equal = top === low;

  const openQuestions = test.questions
    .map((q, i) => ({ q, answer: answers[i] }))
    .filter((x) => isReflection(x.q));

  const answeredOpen = openQuestions.filter(
    (x) =>
      typeof x.answer === 'object' &&
      x.answer !== null &&
      'text' in x.answer &&
      x.answer.text?.trim().length > 0 &&
      !x.answer.skipped
  );

  const focus = profile?.focus || 'Общий портрет';

  const title = equal
    ? 'Многогранный профиль без единственного акцента'
    : test.id === 'archetype'
    ? 'Ваши ведущие роли: ' + highest.map((d) => d.label).join(', ')
    : 'Ваша заметная опора: ' + highest.map((d) => d.label.toLowerCase()).join(', ');

  const summary = equal
    ? 'Все шкалы получили одинаковый индекс. Это не означает, что все качества проявляются одинаково в жизни: одинаковая сумма может складываться из разных ответов. Основные ориентиры — конкретные утверждения, жизненные примеры и различия внутри тем.'
    : `Больше подтверждений в ваших ответах получили темы «${highest.map((d) => d.label).join('», «')}» (${top}/100). Меньше — «${lowest.map((d) => d.label).join('», «')}» (${low}/100). Это не рейтинг ценности, а ориентир, на что опереться в контексте «${focus.toLowerCase()}».`;

  const domains: DimensionReportItem[] = test.domains.map((d, i) => {
    const evidenceQuestions = test.questions
      .map((q, qIndex) => ({
        q,
        index: qIndex,
        answer: answers[qIndex],
        value: typeof answers[qIndex] === 'number' ? (q.reverse ? 4 - (answers[qIndex] as number) : (answers[qIndex] as number)) : 2,
      }))
      .filter((x) => x.q.domain === d.id && !isReflection(x.q))
      .sort((a, b) => Math.abs(b.value - 2) - Math.abs(a.value - 2));

    const values = evidenceQuestions.map((e) => e.value);
    const spread = values.length > 0 ? Math.max(...values) - Math.min(...values) : 0;
    const reflectionMatch = openQuestions.find((x) => x.q.domain === d.id);
    const context = d.context || 'Рассматривайте эту тему вместе с обстоятельствами вашей жизни.';

    let nuance = 'В ответах есть умеренные различия. Обратите внимание на условия, в которых нужный способ действовать дается легче.';
    if (spread >= 3) {
      nuance = 'В этой теме ответы заметно различаются: есть и согласие, и несогласие. Общий индекс сглаживает различие. Сравните ситуации: возможно, проявление зависит от людей, задачи или вашего состояния.';
    } else if (spread === 0) {
      nuance = 'В этой теме вы дали полностью согласованные по направлению ответы, что описывает цельность образа в опросе.';
    }

    let quote = '';
    if (
      reflectionMatch &&
      typeof reflectionMatch.answer === 'object' &&
      reflectionMatch.answer !== null &&
      'text' in reflectionMatch.answer &&
      !reflectionMatch.answer.skipped
    ) {
      quote = reflectionMatch.answer.text || '';
    }

    const score = scores[i] ?? 50;

    return {
      id: d.id,
      label: d.label,
      score,
      reading: getDomainText(d, score),
      context,
      evidence: evidenceQuestions.slice(0, 3).map((e) => ({
        question: e.q.text,
        answer: typeof e.answer === 'number' ? LABELS_FOR_ANSWERS[e.answer] : '—',
        reverse: e.q.reverse,
      })),
      nuance,
      quote,
      mirror: d.mirror || 'В какой ситуации это качество помогает, а когда требует другого подхода?',
      action: d.action,
    };
  });

  const interactions: InteractionItem[] = [];

  if (test.id === 'bigfive') {
    const val = (id: string) => {
      const idx = test.domains.findIndex((d) => d.id === id);
      return idx >= 0 ? scores[idx] : 50;
    };
    interactions.push({
      title: 'Идеи и воплощение',
      text:
        val('openness') > val('conscientiousness') + 20
          ? 'Интерес к идеям выражен сильнее привычки к организации. Полезнее ограничить число активных проектов и задать маленький цикл завершения, чем искать еще больше вдохновения.'
          : val('conscientiousness') > val('openness') + 20
          ? 'Организация выражена сильнее тяги к новым идеям. Ясная структура помогает вам двигаться, а для обновления подхода стоит заранее оставлять небольшое пространство эксперимента.'
          : 'Интерес к идеям и организация получили сопоставимые индексы. Попробуйте связать один замысел с конкретным сроком и критерием «достаточно готово».',
    });
    interactions.push({
      title: 'Контакт и границы',
      text:
        val('agreeableness') > 65
          ? 'Высокий отклик на сотрудничество полезно сопоставить с выражением несогласия. Важный вопрос: удается ли одновременно услышать другого и назвать свою потребность?'
          : 'Сопоставьте свой способ общения с реакцией на несогласие. Прямота и контакт не исключают друг друга: можно яснее формулировать позицию и проверять, как она была услышана.',
    });
  } else if (test.id === 'archetype') {
    interactions.push({
      title: 'Роль — это выбор, а не обязанность',
      text: `Посмотрите на ${highest.map((d) => d.label).join(', ')} как на привычный способ искать важное. Вопрос не в том, чтобы соответствовать образу, а в том, можете ли вы выйти из него, когда ситуация требует другого.`,
    });
    interactions.push({
      title: 'Место для менее привычного',
      text: `Роли ${lowest.map((d) => d.label).join(', ')} получили меньше подтверждений. Это не дефицит, а пространство для новых способов действия при необходимости.`,
    });
  } else if (test.id === 'genes') {
    interactions.push({
      title: 'От защиты к доступному действию',
      text: `В теме «${lowest[0]?.label || ''}» индекс ниже других. Вернитесь к недавнему эпизоду: какую потребность вы защищали и какой прямой шаг мог бы быть доступен?`,
    });
    interactions.push({
      title: 'Как одна опора поддерживает другую',
      text: `Тема «${highest[0]?.label || ''}» получила больше подтверждений. Используйте именно ее силу в небольшом действии, связанном с более трудной сферой.`,
    });
  } else if (test.id === 'igigay') {
    interactions.push({
      title: 'Точка сборки Икигай',
      text: `Сферы «${highest[0]?.label || 'Страсть'}» и «${highest[1]?.label || 'Навыки'}» дают максимальную энергию. Сопоставьте их с теми сферами, где индекс скромнее, чтобы найти устойчивый баланс между радостью и реальной востребованностью.`,
    });
    interactions.push({
      title: 'Зона материализации и проверки',
      text: `Сфера «${lowest[0]?.label || 'Востребованность'}» требует внимания. Запланируйте один минимальный шаг проверки спроса без обесценивания любимого дела.`,
    });
  } else if (test.id === 'natal') {
    interactions.push({
      title: 'Символическая карта и реальный опыт',
      text: 'Астрологические положения планет и домов отражают психологические векторы. Совпадение ваших ответов с ключевыми аспектами показывает, насколько осознанно вы проживаете свой потенциал.',
    });
    interactions.push({
      title: 'Интеграция полярностей',
      text: `Тема «${highest[0]?.label || 'Самовыражение'}» проявлена ярко, в то время как «${lowest[0]?.label || 'Баланс'}» выступает точкой роста. Используйте осознанность для преодоления внутренних противоречий.`,
    });
  } else {
    interactions.push({
      title: 'Карта и прожитый опыт — два разных слоя',
      text: 'Фактические ответы о вашей жизни и символическая карта взаимно обогащают друг друга. Совпадение дает повод для размышления; несовпадение подчеркивает вашу уникальность.',
    });
  }

  const primaryLowest = lowest[0] || test.domains[0];
  const primaryHighest = highest[0] || test.domains[0];

  const plan: PlanStepItem[] = [
    {
      title: 'Неделя 1 · Наблюдать',
      text: 'Выберите одну повторяющуюся ситуацию. Трижды зафиксируйте: факты, первую реакцию, скрытую потребность и итог. Задача — увидеть последовательность без оценки.',
    },
    {
      title: 'Неделя 2 · Попробовать',
      text: (primaryLowest?.action || 'Сделайте один посильный шаг') + '. Сделайте это дважды в комфортных обстоятельствах и отметьте, что изменилось.',
    },
    {
      title: 'Неделя 3 · Поддержать',
      text: (primaryHighest?.action || 'Обопритесь на сильную сторону') + '. Обратите внимание, какие люди и условия помогают этой опоре проявляться естественнее.',
    },
    {
      title: 'Неделя 4 · Пересмотреть',
      text: 'Сравните текущие наблюдения с первой неделей. Что повторилось, что изменилось? Выберите один способ действия, который хотите закрепить.',
    },
  ];

  const quality = `Основание: ${test.questions.filter((q) => !isReflection(q)).length} ответов на утверждения и ${answeredOpen.length} из ${openQuestions.length} личных примеров. Открытые ответы приведены как ваши слова; алгоритм не ставит диагнозов, а предлагает гипотезы для исследования.`;

  return {
    title,
    summary,
    domains,
    interactions,
    plan,
    quality,
    note: test.note,
  };
}

import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import type { GeneKeysAIAnalysis } from '../ai/generateGeneKeysAnalysis';
import type { IkigaiAnalysisData } from '../ai/generateAnalysis';

export interface GeneratePdfParams {
  testId?: string;
  title: string;
  name: string;
  focus: string;
  date: string;
  domains?: { label: string; id: string }[];
  scores?: number[];
  aiAnalysis?: GeneKeysAIAnalysis;
  analysisData?: unknown;
}

function wrapText(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';

  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= maxChars) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function renderIkigaiPages(
  doc: PDFDocument,
  params: GeneratePdfParams,
  ikigai: IkigaiAnalysisData,
  fontBody: PDFFont,
  fontBold: PDFFont,
  logoImg: any
) {
  const W = 595.28;
  const H = 841.89;

  const black = rgb(0.04, 0.04, 0.04);
  const pureBlack = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const zinc200 = rgb(0.85, 0.85, 0.87);
  const zinc400 = rgb(0.60, 0.60, 0.64);
  const zinc600 = rgb(0.35, 0.35, 0.38);
  const purpleAccent = rgb(0.55, 0.30, 0.95);
  const purpleBadge = rgb(0.18, 0.12, 0.28);
  const amberAccent = rgb(0.92, 0.72, 0.40);
  const redSoft = rgb(0.95, 0.45, 0.55);
  const cyanSoft = rgb(0.35, 0.82, 0.92);
  const greenSoft = rgb(0.40, 0.88, 0.58);

  const drawPageHeader = (page: any, pageTitle: string, pageNum: number) => {
    page.drawLine({
      start: { x: 50, y: H - 45 },
      end: { x: W - 50, y: H - 45 },
      thickness: 0.75,
      color: zinc600,
    });
    page.drawText('тень®  |  Персональный Икигай', {
      x: 50,
      y: H - 38,
      size: 8,
      font: fontBold,
      color: purpleAccent,
    });
    page.drawText(pageTitle, {
      x: 230,
      y: H - 38,
      size: 8,
      font: fontBody,
      color: zinc400,
    });
    page.drawText(`Стр. ${pageNum}`, {
      x: W - 80,
      y: H - 38,
      size: 8,
      font: fontBody,
      color: zinc400,
    });
  };

  const drawPageFooter = (page: any) => {
    page.drawLine({
      start: { x: 50, y: 40 },
      end: { x: W - 50, y: 40 },
      thickness: 0.5,
      color: zinc600,
    });
    page.drawText('Конфиденциально • Разбор подготовлен искусственным интеллектом пространства «Тень»', {
      x: 50,
      y: 28,
      size: 7.5,
      font: fontBody,
      color: zinc600,
    });
  };

  // =============================================================
  // PAGE 1: COVER
  // =============================================================
  const page1 = doc.addPage([W, H]);
  page1.drawRectangle({ x: 0, y: 0, width: W, height: H, color: pureBlack });

  page1.drawRectangle({
    x: 35,
    y: 35,
    width: W - 70,
    height: H - 70,
    borderWidth: 1,
    borderColor: zinc600,
    color: pureBlack,
  });

  if (logoImg) {
    page1.drawImage(logoImg, { x: 60, y: H - 95, width: 32, height: 32 });
    page1.drawImage(logoImg, { x: W - 170, y: 110, width: 95, height: 95 });
  }

  page1.drawText('тень®', {
    x: logoImg ? 102 : 60,
    y: H - 85,
    size: 24,
    font: fontBold,
    color: white,
  });

  page1.drawText('П Р О С Т Р А Н С Т В О   Г Л У Б И Н Н О Й   Д И А Г Н О С Т И К И', {
    x: logoImg ? 102 : 60,
    y: H - 100,
    size: 7,
    font: fontBody,
    color: purpleAccent,
  });

  page1.drawText(params.title || 'Икигай: Точка сборки', {
    x: 60,
    y: H - 160,
    size: 24,
    font: fontBold,
    color: white,
  });

  page1.drawText('ХОЛОГЕНЕТИЧЕСКАЯ МОДЕЛЬ ИКИГАЙ · 4 СФЕРЫ РЕАЛИЗАЦИИ', {
    x: 60,
    y: H - 188,
    size: 10,
    font: fontBold,
    color: purpleAccent,
  });

  page1.drawText('Практический аудит: Страсть • Мастерство • Спрос • Миссия', {
    x: 60,
    y: H - 206,
    size: 9,
    font: fontBody,
    color: zinc400,
  });

  // Formula badge
  const formula = ikigai.ikigai_formula || 'Поиск устойчивого баланса радости, мастерства, пользы и дохода.';
  const formulaLines = wrapText(formula, 75);
  const badgeH = Math.max(70, 30 + formulaLines.length * 15);
  const badgeY = H - 230 - badgeH;

  page1.drawRectangle({
    x: 55,
    y: badgeY,
    width: W - 110,
    height: badgeH,
    color: purpleBadge,
    borderWidth: 1,
    borderColor: purpleAccent,
  });

  page1.drawText('ПЕРСОНАЛЬНАЯ ФОРМУЛА ИКИГАЙ:', {
    x: 70,
    y: badgeY + badgeH - 18,
    size: 8.5,
    font: fontBold,
    color: amberAccent,
  });

  let curFY = badgeY + badgeH - 34;
  for (const fl of formulaLines) {
    page1.drawText(fl, {
      x: 70,
      y: curFY,
      size: 9.5,
      font: fontBold,
      color: white,
    });
    curFY -= 14;
  }

  // Scores and Domains Bar Chart
  let yScores = badgeY - 26;
  page1.drawText('БАЛАНС 4 СФЕР ПО РЕЗУЛЬТАТАМ ИССЛЕДОВАНИЯ:', {
    x: 60,
    y: yScores,
    size: 9,
    font: fontBold,
    color: white,
  });
  yScores -= 18;

  const defaultDomains = [
    { label: 'Страсть (Люблю)' },
    { label: 'Мастерство (Умею)' },
    { label: 'Востребованность (Платят)' },
    { label: 'Польза и смысл (Нужно миру)' },
  ];
  const doms = (params.domains && params.domains.length > 0) ? params.domains : defaultDomains;
  const scores = (params.scores && params.scores.length > 0) ? params.scores : [75, 60, 80, 50];

  for (let i = 0; i < doms.length && i < 4; i++) {
    const d = doms[i];
    const s = Math.round(scores[i] ?? 50);
    page1.drawText(d.label, {
      x: 60,
      y: yScores,
      size: 8.5,
      font: fontBody,
      color: zinc200,
    });

    const barX = 240;
    const maxBarW = 220;
    page1.drawRectangle({
      x: barX,
      y: yScores - 2,
      width: maxBarW,
      height: 7,
      color: rgb(0.16, 0.16, 0.20),
    });

    const curW = Math.max(4, Math.min(maxBarW, (s / 100) * maxBarW));
    const barColor = i === 0 ? redSoft : i === 1 ? cyanSoft : i === 2 ? amberAccent : greenSoft;
    page1.drawRectangle({
      x: barX,
      y: yScores - 2,
      width: curW,
      height: 7,
      color: barColor,
    });

    page1.drawText(`${s}%`, {
      x: barX + maxBarW + 10,
      y: yScores,
      size: 8.5,
      font: fontBold,
      color: white,
    });

    yScores -= 17;
  }

  // Meta block
  page1.drawText('ИССЛЕДОВАНИЕ ПОДГОТОВЛЕНО ДЛЯ:', {
    x: 60,
    y: 195,
    size: 8,
    font: fontBold,
    color: zinc400,
  });

  page1.drawText(params.name || 'Исследователь', {
    x: 60,
    y: 168,
    size: 20,
    font: fontBold,
    color: white,
  });

  page1.drawText(`Фокус внимания: ${params.focus || 'Общий портрет'}`, {
    x: 60,
    y: 146,
    size: 9,
    font: fontBody,
    color: zinc200,
  });

  page1.drawText(`Дата формирования: ${params.date}`, {
    x: 60,
    y: 128,
    size: 8.5,
    font: fontBody,
    color: zinc400,
  });

  page1.drawText('Пространство самопознания «Тень» • Конфиденциальный разбор', {
    x: 60,
    y: 55,
    size: 7.5,
    font: fontBody,
    color: zinc600,
  });

  // =============================================================
  // PAGE 2: 4 КВАДРАНТА (СФЕРЫ)
  // =============================================================
  const page2 = doc.addPage([W, H]);
  page2.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });
  drawPageHeader(page2, '1. Четыре сферы реализации', 2);
  drawPageFooter(page2);

  page2.drawText('Четыре сферы реализации (Квадранты)', {
    x: 50,
    y: H - 80,
    size: 18,
    font: fontBold,
    color: white,
  });

  page2.drawText('Глубинный аудит страсти, мастерства, рыночного спроса и миссии', {
    x: 50,
    y: H - 98,
    size: 9.5,
    font: fontBody,
    color: purpleAccent,
  });

  const q = ikigai.quadrants || ({} as any);
  let yQ = H - 128;

  const drawQuadrantBlock = (
    num: number,
    title: string,
    accent: any,
    core: string,
    bullets1Label: string,
    bullets1: string[] | undefined,
    bullets2Label: string,
    bullets2: string[] | string | undefined
  ) => {
    page2.drawText(`${num}. ${title.toUpperCase()}`, {
      x: 50,
      y: yQ,
      size: 10,
      font: fontBold,
      color: accent,
    });
    yQ -= 15;

    const coreLines = wrapText(core, 85);
    for (const cl of coreLines) {
      page2.drawText(cl, { x: 55, y: yQ, size: 8, font: fontBody, color: zinc200 });
      yQ -= 11.5;
    }
    yQ -= 3;

    page2.drawText(`• ${bullets1Label}:`, { x: 55, y: yQ, size: 8, font: fontBold, color: white });
    yQ -= 11.5;
    const b1List = Array.isArray(bullets1) ? bullets1 : bullets1 ? [bullets1] : [];
    for (const b of b1List) {
      const bLines = wrapText(`- ${b}`, 82);
      for (const bl of bLines) {
        page2.drawText(bl, { x: 65, y: yQ, size: 7.5, font: fontBody, color: zinc400 });
        yQ -= 10.5;
      }
    }
    yQ -= 3;

    page2.drawText(`• ${bullets2Label}:`, { x: 55, y: yQ, size: 8, font: fontBold, color: amberAccent });
    yQ -= 11.5;
    const b2List = Array.isArray(bullets2) ? bullets2 : bullets2 ? [bullets2] : [];
    for (const b of b2List) {
      const bLines = wrapText(`- ${b}`, 82);
      for (const bl of bLines) {
        page2.drawText(bl, { x: 65, y: yQ, size: 7.5, font: fontBody, color: zinc400 });
        yQ -= 10.5;
      }
    }
    yQ -= 10;
  };

  drawQuadrantBlock(
    1,
    q.passion?.title || 'Страсть (Что ты любишь)',
    redSoft,
    q.passion?.core_insights || 'Живой интерес к творческим и исследовательским задачам.',
    'Маркеры состояния потока',
    q.passion?.signals_of_flow || ['Погружение в процесс проектирования', 'Драйв от решения задач'],
    'Скрытые утечки энергии',
    q.passion?.hidden_drainers || ['Монотонная отчетность']
  );

  drawQuadrantBlock(
    2,
    q.skills?.title || 'Мастерство (В чём ты силён)',
    cyanSoft,
    q.skills?.unique_combination || 'Сочетание системного анализа и практической надежности.',
    'Ключевые компетенции',
    q.skills?.core_competencies || ['Аналитическое мышление', 'Организация процессов'],
    'Слепые зоны и вызовы',
    q.skills?.blind_spots || 'Склонность к гиперконтролю'
  );

  drawQuadrantBlock(
    3,
    q.market_demand?.title || 'Востребованность (За что готовы платить)',
    amberAccent,
    q.market_demand?.barriers || 'Необходимость более четкой внешней упаковки ценности.',
    'Подтвержденный спрос',
    q.market_demand?.proven_demand || ['Экспертиза в прикладных задачах'],
    'Ракурсы монетизации',
    q.market_demand?.monetization_angles || ['Консультирование и комплексные проекты']
  );

  drawQuadrantBlock(
    4,
    q.world_need?.title || 'Миссия (В чём нуждается мир)',
    greenSoft,
    q.world_need?.contribution_format || 'Создание надежных и понятных инструментов для людей.',
    'Якоря ценности и смысла',
    q.world_need?.meaning_anchors || ['Ясность и устойчивость в хаосе'],
    'Целевая аудитория',
    q.world_need?.target_audience || 'Профессионалы и клиенты, ищущие глубину и результат'
  );

  // =============================================================
  // PAGE 3: ПЕРЕСЕЧЕНИЯ И СИНТЕЗ
  // =============================================================
  const page3 = doc.addPage([W, H]);
  page3.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });
  drawPageHeader(page3, '2. Пересечения и Синтез', 3);
  drawPageFooter(page3);

  page3.drawText('Пересечения сфер и Баланс приоритетов', {
    x: 50,
    y: H - 80,
    size: 18,
    font: fontBold,
    color: white,
  });

  page3.drawText('Стыки квадрантов, скрытые компромиссы и синтез точки сборки', {
    x: 50,
    y: H - 98,
    size: 9.5,
    font: fontBody,
    color: purpleAccent,
  });

  let yP3 = H - 128;
  page3.drawText('ПЕРЕСЕЧЕНИЯ СФЕР (ТОЧКИ СБОРКИ):', {
    x: 50,
    y: yP3,
    size: 9.5,
    font: fontBold,
    color: white,
  });
  yP3 -= 18;

  const intr = ikigai.intersections || ({} as any);
  const intrList = [
    { label: intr?.passion_and_skill?.name || 'Увлечение (Страсть + Мастерство)', desc: intr?.passion_and_skill?.description || 'Пространство высокого мастерства и удовольствия от процесса.', col: redSoft },
    { label: intr?.skill_and_market?.name || 'Профессия (Мастерство + Спрос)', desc: intr?.skill_and_market?.description || 'Надежный источник дохода и подтвержденная ценность.', col: cyanSoft },
    { label: intr?.market_and_mission?.name || 'Призвание (Спрос + Миссия)', desc: intr?.market_and_mission?.description || 'Ответ на реальный запрос людей с готовностью платить.', col: amberAccent },
    { label: intr?.mission_and_passion?.name || 'Миссия (Миссия + Страсть)', desc: intr?.mission_and_passion?.description || 'Вдохновляющий вектор и внутренний огонь.', col: greenSoft },
  ];

  for (const item of intrList) {
    page3.drawText(`• ${item.label}`, {
      x: 55,
      y: yP3,
      size: 9,
      font: fontBold,
      color: item.col,
    });
    yP3 -= 13;

    const dLines = wrapText(item.desc, 85);
    for (const dl of dLines) {
      page3.drawText(dl, { x: 65, y: yP3, size: 8, font: fontBody, color: zinc200 });
      yP3 -= 11.5;
    }
    yP3 -= 6;
  }

  yP3 -= 10;
  page3.drawText('КОНФЛИКТЫ ПРИОРИТЕТОВ И ВНУТРЕННИЕ КОМПРОМИССЫ:', {
    x: 50,
    y: yP3,
    size: 9.5,
    font: fontBold,
    color: amberAccent,
  });
  yP3 -= 16;

  const tensLines = wrapText(ikigai.tensions_and_tradeoffs || 'Необходим баланс творческой автономии и рыночной дисциплины. Баланс достигается через упаковку сильных навыков в стандартизированные предложения.', 85);
  for (const tl of tensLines) {
    page3.drawText(tl, { x: 55, y: yP3, size: 8.5, font: fontBody, color: zinc200 });
    yP3 -= 12.5;
  }

  yP3 -= 14;
  page3.drawText('ИТОГОВЫЙ СИНТЕЗ ТОЧКИ СБОРКИ:', {
    x: 50,
    y: yP3,
    size: 9.5,
    font: fontBold,
    color: purpleAccent,
  });
  yP3 -= 16;

  const synthLines = wrapText(ikigai.synthesis_summary || 'Устойчивый баланс достигается через постепенную проверку гипотез и опору на подтвержденные сильные стороны.', 85);
  for (const sl of synthLines) {
    page3.drawText(sl, { x: 55, y: yP3, size: 8.5, font: fontBody, color: white });
    yP3 -= 12.5;
  }

  // =============================================================
  // PAGE 4: ДОРОЖНАЯ КАРТА
  // =============================================================
  const page4 = doc.addPage([W, H]);
  page4.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });
  drawPageHeader(page4, '3. Дорожная карта', 4);
  drawPageFooter(page4);

  page4.drawText('Дорожная карта реализации на 3 этапа', {
    x: 50,
    y: H - 80,
    size: 18,
    font: fontBold,
    color: white,
  });

  page4.drawText('Пошаговый переход от рефлексии к устойчивым практическим результатам', {
    x: 50,
    y: H - 98,
    size: 9.5,
    font: fontBody,
    color: purpleAccent,
  });

  let yP4 = H - 128;
  page4.drawText('ПЛАН ВНЕДРЕНИЯ ПО ФАЗАМ:', {
    x: 50,
    y: yP4,
    size: 9.5,
    font: fontBold,
    color: white,
  });
  yP4 -= 18;

  const roadmap = (ikigai.implementation_roadmap && ikigai.implementation_roadmap.length > 0)
    ? ikigai.implementation_roadmap
    : [
        { phase: 1, title: 'Микро-эксперимент (1–2 недели)', action: 'Сформулируйте одно точечное предложение, опирающееся на ведущую сильную сторону.', metric: 'Получение обратной связи от 3 потенциальных заказчиков.' },
        { phase: 2, title: 'Стабилизация и отклик (1–2 месяца)', action: 'Проведите пилотный проект по фиксированной цене, документируя затраты времени.', metric: 'Первый подтвержденный кейс и отзыв.' },
        { phase: 3, title: 'Устойчивая интеграция (3–6 месяцев)', action: 'Закрепите пропорцию 70% на базовый поток и 30% на новые инициативы.', metric: 'Стабильный ежемесячный доход и высокий уровень энергии.' },
      ];

  for (const phase of roadmap) {
    page4.drawText(`ФАЗА ${phase.phase}: ${(phase.title || '').toUpperCase()}`, {
      x: 55,
      y: yP4,
      size: 9,
      font: fontBold,
      color: amberAccent,
    });
    yP4 -= 14;

    page4.drawText('Действие:', { x: 65, y: yP4, size: 8, font: fontBold, color: purpleAccent });
    yP4 -= 12;

    const actLines = wrapText(phase.action || '', 82);
    for (const al of actLines) {
      page4.drawText(al, { x: 75, y: yP4, size: 8, font: fontBody, color: zinc200 });
      yP4 -= 11.5;
    }

    page4.drawText('Метрика результата:', { x: 65, y: yP4, size: 8, font: fontBold, color: cyanSoft });
    yP4 -= 12;

    const metLines = wrapText(phase.metric || '', 82);
    for (const ml of metLines) {
      page4.drawText(ml, { x: 75, y: yP4, size: 8, font: fontBody, color: zinc400 });
      yP4 -= 11.5;
    }
    yP4 -= 10;
  }

  yP4 -= 8;
  page4.drawText('ПРИНЦИПЫ УДЕРЖАНИЯ ФОКУСА И ПРАКТИКИ:', {
    x: 50,
    y: yP4,
    size: 9.5,
    font: fontBold,
    color: greenSoft,
  });
  yP4 -= 16;

  const practices = [
    { title: 'Микро-шаги вместо резких решений', text: 'Не бросайте текущие обязательства. Тестируйте новую гипотезу 2-3 часа в неделю в комфортном ритме.' },
    { title: 'Дневник энергии и отклика', text: 'После каждого ключевого дела отмечайте, стало ли больше сил или наступило опустошение.' },
    { title: 'Проверка спроса фактами', text: 'Сверяйте гипотезы реальными запросами и оплатами, не прячьтесь в бесконечную подготовку продукта.' },
    { title: 'Баланс 70/30', text: '70% времени уделяйте стабильному фундаменту и 30% — смелым экспериментам и раскрытию способностей.' },
  ];

  for (const pr of practices) {
    page4.drawText(`• ${pr.title}:`, { x: 55, y: yP4, size: 8.5, font: fontBold, color: white });
    yP4 -= 12;

    const prLines = wrapText(pr.text, 82);
    for (const prl of prLines) {
      page4.drawText(prl, { x: 65, y: yP4, size: 8, font: fontBody, color: zinc200 });
      yP4 -= 11;
    }
    yP4 -= 4;
  }
}

export async function generateAssessmentPdf(params: GeneratePdfParams): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const possibleFontsDirs = [
    path.resolve(process.cwd(), 'src/shared/assets/fonts'),
    path.resolve(process.cwd(), 'web/src/shared/assets/fonts'),
    path.resolve(__dirname, '../../../../src/shared/assets/fonts'),
    path.resolve(__dirname, '../../../assets/fonts'),
  ];

  let regularPath = '';
  let boldPath = '';

  for (const dir of possibleFontsDirs) {
    const reg = path.join(dir, 'arial.ttf');
    const bld = path.join(dir, 'arialbd.ttf');
    if (fs.existsSync(reg) && fs.existsSync(bld)) {
      regularPath = reg;
      boldPath = bld;
      break;
    }
  }

  if (!regularPath || !boldPath) {
    throw new Error('Required Cyrillic fonts (arial.ttf, arialbd.ttf) not found');
  }

  const regularBytes = fs.readFileSync(regularPath);
  const boldBytes = fs.readFileSync(boldPath);

  const fontBody = await doc.embedFont(regularBytes);
  const fontBold = await doc.embedFont(boldBytes);

  const logoPath = path.resolve(process.cwd(), 'public/logo.png');
  let logoImg: any = null;
  if (fs.existsSync(logoPath)) {
    try {
      logoImg = await doc.embedPng(fs.readFileSync(logoPath));
    } catch (e) {
      console.error('[PDF Embed Logo Error]:', e);
    }
  }

  const isIkigai =
    params.testId === 'igigay' ||
    params.title?.toLowerCase().includes('икигай') ||
    (Boolean(params.analysisData) && typeof params.analysisData === 'object' && 'ikigai_formula' in (params.analysisData as any));

  if (isIkigai) {
    const ikigaiData = (params.analysisData || {}) as IkigaiAnalysisData;
    await renderIkigaiPages(doc, params, ikigaiData, fontBody, fontBold, logoImg);
    return await doc.save();
  }

  const W = 595.28;
  const H = 841.89;

  // Strict True Black & White palette with purple functional accent
  const black = rgb(0.04, 0.04, 0.04);
  const pureBlack = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const zinc200 = rgb(0.85, 0.85, 0.87);
  const zinc400 = rgb(0.60, 0.60, 0.64);
  const zinc600 = rgb(0.35, 0.35, 0.38);
  const purpleAccent = rgb(0.55, 0.30, 0.95);
  const purpleBadge = rgb(0.18, 0.12, 0.28);
  const amberAccent = rgb(0.92, 0.72, 0.40);

  const ai = params.aiAnalysis;

  // Helper for drawing headers
  const drawPageHeader = (page: any, pageTitle: string, pageNum: number) => {
    // Top border line
    page.drawLine({
      start: { x: 50, y: H - 45 },
      end: { x: W - 50, y: H - 45 },
      thickness: 0.75,
      color: zinc600,
    });

    page.drawText('тень®  |  Хологенетический профиль', {
      x: 50,
      y: H - 38,
      size: 8,
      font: fontBold,
      color: purpleAccent,
    });

    page.drawText(pageTitle, {
      x: 230,
      y: H - 38,
      size: 8,
      font: fontBody,
      color: zinc400,
    });

    page.drawText(`Стр. ${pageNum}`, {
      x: W - 80,
      y: H - 38,
      size: 8,
      font: fontBody,
      color: zinc400,
    });
  };

  // Helper for drawing footer
  const drawPageFooter = (page: any) => {
    page.drawLine({
      start: { x: 50, y: 40 },
      end: { x: W - 50, y: 40 },
      thickness: 0.5,
      color: zinc600,
    });

    page.drawText('Конфиденциально • Разбор подготовлен искусственным интеллектом пространства «Тень»', {
      x: 50,
      y: 28,
      size: 7.5,
      font: fontBody,
      color: zinc600,
    });
  };

  // -------------------------------------------------------------
  // PAGE 1: COVER (STRICT TRUE BLACK)
  // -------------------------------------------------------------
  const page1 = doc.addPage([W, H]);
  page1.drawRectangle({ x: 0, y: 0, width: W, height: H, color: pureBlack });

  // Minimalist hairline frame
  page1.drawRectangle({
    x: 35,
    y: 35,
    width: W - 70,
    height: H - 70,
    borderWidth: 1,
    borderColor: zinc600,
    color: pureBlack,
  });

  if (logoImg) {
    page1.drawImage(logoImg, {
      x: 60,
      y: H - 100,
      width: 34,
      height: 34,
    });
    // Also draw large emblem on cover right side
    page1.drawImage(logoImg, {
      x: W - 180,
      y: 130,
      width: 110,
      height: 110,
    });
  }

  page1.drawText('тень®', {
    x: logoImg ? 104 : 60,
    y: H - 88,
    size: 26,
    font: fontBold,
    color: white,
  });

  page1.drawText('П Р О С Т Р А Н С Т В О   Г Л У Б И Н Н О Й   Д И А Г Н О С Т И К И', {
    x: logoImg ? 104 : 60,
    y: H - 106,
    size: 7.5,
    font: fontBody,
    color: purpleAccent,
  });

  // Main Document Title
  page1.drawText(params.title, {
    x: 60,
    y: H - 230,
    size: 26,
    font: fontBold,
    color: white,
  });

  page1.drawText('ХОЛОГЕНЕТИЧЕСКИЙ ПРОФИЛЬ ЛИЧНОСТИ', {
    x: 60,
    y: H - 260,
    size: 11,
    font: fontBold,
    color: purpleAccent,
  });

  page1.drawText('Анализ системы 64 Генных Ключей по методологии Ричарда Радда', {
    x: 60,
    y: H - 280,
    size: 10,
    font: fontBody,
    color: zinc400,
  });

  // Format notice badge
  if (ai?.formatNotice) {
    const noticeLines = wrapText(ai.formatNotice, 65);
    let noticeY = H - 320;
    for (const l of noticeLines) {
      page1.drawText(l, {
        x: 60,
        y: noticeY,
        size: 8.5,
        font: fontBody,
        color: zinc400,
      });
      noticeY -= 13;
    }
  }

  // Prepared for block
  page1.drawText('ИССЛЕДОВАНИЕ ПОДГОТОВЛЕНО ДЛЯ:', {
    x: 60,
    y: 210,
    size: 8.5,
    font: fontBold,
    color: zinc400,
  });

  page1.drawText(params.name || 'Исследователь', {
    x: 60,
    y: 180,
    size: 22,
    font: fontBold,
    color: white,
  });

  page1.drawText(`Фокус внимания: ${params.focus || 'Общий портрет'}`, {
    x: 60,
    y: 155,
    size: 9.5,
    font: fontBody,
    color: zinc200,
  });

  page1.drawText(`Дата формирования: ${params.date}`, {
    x: 60,
    y: 135,
    size: 9,
    font: fontBody,
    color: zinc400,
  });

  page1.drawText('Три последовательности: Активация • Венера • Жемчужина', {
    x: 60,
    y: 70,
    size: 8,
    font: fontBody,
    color: zinc600,
  });

  // -------------------------------------------------------------
  // PAGE 2: ПОСЛЕДОВАТЕЛЬНОСТЬ АКТИВАЦИИ
  // -------------------------------------------------------------
  const page2 = doc.addPage([W, H]);
  page2.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });
  drawPageHeader(page2, '1. Последовательность Активации', 2);
  drawPageFooter(page2);

  page2.drawText('Последовательность Активации', {
    x: 50,
    y: H - 80,
    size: 18,
    font: fontBold,
    color: white,
  });

  page2.drawText('Жизненное предназначение, первичные опоры и векторы реализации', {
    x: 50,
    y: H - 98,
    size: 9.5,
    font: fontBody,
    color: purpleAccent,
  });

  if (ai?.activationSequence) {
    const act = ai.activationSequence;
    const spheres = [
      { title: "ДЕЛО ЖИЗНИ (Life's Work)", item: act.lifesWork },
      { title: "ЭВОЛЮЦИЯ (Evolution)", item: act.evolution },
      { title: "СИЯНИЕ (Radiance)", item: act.radiance },
      { title: "ЦЕЛЬ (Purpose)", item: act.purpose },
    ];

    let yPos = H - 130;

    for (const s of spheres) {
      // Box header
      page2.drawText(s.title, {
        x: 50,
        y: yPos,
        size: 10,
        font: fontBold,
        color: white,
      });

      page2.drawText(s.item.name || 'Генный Ключ', {
        x: 240,
        y: yPos,
        size: 9.5,
        font: fontBold,
        color: amberAccent,
      });

      yPos -= 18;

      // Shadow, Gift, Siddhi row
      page2.drawText(`Тень: ${s.item.shadow}`, {
        x: 60,
        y: yPos,
        size: 8.5,
        font: fontBody,
        color: rgb(0.9, 0.4, 0.4),
      });

      page2.drawText(`Дар: ${s.item.gift}`, {
        x: 230,
        y: yPos,
        size: 8.5,
        font: fontBold,
        color: rgb(0.4, 0.9, 0.6),
      });

      page2.drawText(`Сиддхи: ${s.item.siddhi}`, {
        x: 400,
        y: yPos,
        size: 8.5,
        font: fontBody,
        color: purpleAccent,
      });

      yPos -= 16;

      if (s.item.note) {
        const lines = wrapText(s.item.note, 85);
        for (const line of lines) {
          page2.drawText(line, {
            x: 60,
            y: yPos,
            size: 8,
            font: fontBody,
            color: zinc400,
          });
          yPos -= 12;
        }
      }

      yPos -= 10;
    }

    // Additional narrative blocks
    yPos -= 10;
    page2.drawText('КЛЮЧЕВЫЕ ВЕКТОРЫ ЖИЗНЕННОЙ ЭНЕРГИИ:', {
      x: 50,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: white,
    });
    yPos -= 18;

    const notes = [
      { label: 'Основной вектор реализации:', text: act.vectorOfRealization },
      { label: 'Зона внутреннего роста:', text: act.growthZone },
      { label: 'Источник устойчивости и витальности:', text: act.vitalitySource },
    ];

    for (const n of notes) {
      page2.drawText(`• ${n.label}`, {
        x: 55,
        y: yPos,
        size: 8.5,
        font: fontBold,
        color: purpleAccent,
      });
      yPos -= 14;

      const lines = wrapText(n.text, 85);
      for (const line of lines) {
        page2.drawText(line, {
          x: 65,
          y: yPos,
          size: 8,
          font: fontBody,
          color: zinc200,
        });
        yPos -= 12;
      }
      yPos -= 6;
    }
  }

  // -------------------------------------------------------------
  // PAGE 3: ПОСЛЕДОВАТЕЛЬНОСТЬ ВЕНЕРЫ
  // -------------------------------------------------------------
  const page3 = doc.addPage([W, H]);
  page3.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });
  drawPageHeader(page3, '2. Последовательность Венеры', 3);
  drawPageFooter(page3);

  page3.drawText('Последовательность Венеры', {
    x: 50,
    y: H - 80,
    size: 18,
    font: fontBold,
    color: white,
  });

  page3.drawText('Эмоциональные паттерны, близкие отношения и трансформация базовой травмы', {
    x: 50,
    y: H - 98,
    size: 9.5,
    font: fontBody,
    color: purpleAccent,
  });

  if (ai?.venusSequence) {
    const ven = ai.venusSequence;
    const vSpheres = [
      { label: 'Притяжение (Attraction):', item: ven.attraction },
      { label: 'Интеллектуальная защита (IQ):', item: ven.iq },
      { label: 'Эмоциональный барьер (EQ):', item: ven.eq },
      { label: 'Духовное раскрытие (SQ):', item: ven.sq },
      { label: 'Базовая травма (Core Wound):', item: ven.coreWound },
    ];

    let yPos = H - 130;

    for (const v of vSpheres) {
      page3.drawText(v.label, {
        x: 50,
        y: yPos,
        size: 9.5,
        font: fontBold,
        color: white,
      });

      page3.drawText(v.item.name || '', {
        x: 260,
        y: yPos,
        size: 9,
        font: fontBold,
        color: amberAccent,
      });

      yPos -= 16;

      page3.drawText(`Тень: ${v.item.shadow}   |   Дар: ${v.item.gift}   |   Сиддхи: ${v.item.siddhi}`, {
        x: 60,
        y: yPos,
        size: 8,
        font: fontBody,
        color: zinc400,
      });

      yPos -= 18;
    }

    yPos -= 15;
    page3.drawText('СЦЕНАРИИ В ОТНОШЕНИЯХ И ПРИВЯЗАННОСТЬ:', {
      x: 50,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: white,
    });
    yPos -= 18;

    const relLines = wrapText(ven.relationshipPatterns, 85);
    for (const l of relLines) {
      page3.drawText(l, {
        x: 55,
        y: yPos,
        size: 8.5,
        font: fontBody,
        color: zinc200,
      });
      yPos -= 13;
    }

    yPos -= 15;
    page3.drawText('МЕХАНИЗМ ТРАНСФОРМАЦИИ ТРАВМЫ В ЗРЕЛОСТЬ:', {
      x: 50,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: white,
    });
    yPos -= 18;

    const woundLines = wrapText(ven.woundTransformation, 85);
    for (const l of woundLines) {
      page3.drawText(l, {
        x: 55,
        y: yPos,
        size: 8.5,
        font: fontBody,
        color: zinc200,
      });
      yPos -= 13;
    }
  }

  // -------------------------------------------------------------
  // PAGE 4: ПОСЛЕДОВАТЕЛЬНОСТЬ ЖЕМЧУЖИНЫ & ИТОГОВЫЙ СИНТЕЗ
  // -------------------------------------------------------------
  const page4 = doc.addPage([W, H]);
  page4.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });
  drawPageHeader(page4, '3. Жемчужина и Итоговый синтез', 4);
  drawPageFooter(page4);

  page4.drawText('Последовательность Жемчужины и Синтез', {
    x: 50,
    y: H - 80,
    size: 18,
    font: fontBold,
    color: white,
  });

  page4.drawText('Социальная реализация, материальный поток и практическая интеграция', {
    x: 50,
    y: H - 98,
    size: 9.5,
    font: fontBody,
    color: purpleAccent,
  });

  if (ai?.pearlSequence && ai?.finalSynthesis) {
    const pearl = ai.pearlSequence;
    const synth = ai.finalSynthesis;

    let yPos = H - 130;

    page4.drawText('СОЦИАЛЬНЫЕ АРХЕТИПЫ И МАТЕРИАЛЬНЫЙ ПОТОК:', {
      x: 50,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: white,
    });
    yPos -= 18;

    const pItems = [
      { label: 'Призвание (Vocation):', item: pearl.vocation },
      { label: 'Культура (Culture):', item: pearl.culture },
      { label: 'Бренд (Brand):', item: pearl.brand },
      { label: 'Жемчужина (Pearl):', item: pearl.pearl },
    ];

    for (const p of pItems) {
      page4.drawText(`${p.label} ${p.item.name} (${p.item.shadow} -> ${p.item.gift})`, {
        x: 55,
        y: yPos,
        size: 8.5,
        font: fontBody,
        color: zinc200,
      });
      yPos -= 14;
    }

    yPos -= 8;
    const monLines = wrapText(`Стратегия монетизации: ${pearl.monetizationStrategy}`, 85);
    for (const l of monLines) {
      page4.drawText(l, { x: 55, y: yPos, size: 8, font: fontBody, color: zinc400 });
      yPos -= 12;
    }

    yPos -= 16;
    page4.drawText('ИТОГОВЫЙ ПСИХОЛОГИЧЕСКИЙ СИНТЕЗ:', {
      x: 50,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: white,
    });
    yPos -= 18;

    const synthBlocks = [
      { title: 'Главный архетипический вектор:', text: synth.coreVector },
      { title: 'Повторяющиеся сценарии:', text: synth.recurringScenarios },
      { title: 'Ключевая точка трансформации:', text: synth.transformationPoint },
      { title: 'Мост перехода Тень -> Дар:', text: synth.shadowToGiftPath },
    ];

    for (const b of synthBlocks) {
      page4.drawText(b.title, {
        x: 55,
        y: yPos,
        size: 8.5,
        font: fontBold,
        color: purpleAccent,
      });
      yPos -= 13;

      const lines = wrapText(b.text, 85);
      for (const l of lines) {
        page4.drawText(l, {
          x: 65,
          y: yPos,
          size: 8,
          font: fontBody,
          color: zinc200,
        });
        yPos -= 12;
      }
      yPos -= 4;
    }

    // 4-Week Plan Box
    yPos -= 8;
    page4.drawText('ПРОГРАММА ИНТЕГРАЦИИ НА 4 НЕДЕЛИ:', {
      x: 50,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: amberAccent,
    });
    yPos -= 18;

    for (const step of synth.practicalActionPlan) {
      const stepLines = wrapText(step, 85);
      for (const sl of stepLines) {
        page4.drawText(sl, {
          x: 55,
          y: yPos,
          size: 7.8,
          font: fontBody,
          color: white,
        });
        yPos -= 11.5;
      }
      yPos -= 2;
    }
  }

  return await doc.save();
}

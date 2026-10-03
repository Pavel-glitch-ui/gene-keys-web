import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import type { GeneKeysAIAnalysis } from '../ai/generateGeneKeysAnalysis';

export interface GeneratePdfParams {
  title: string;
  name: string;
  focus: string;
  date: string;
  domains?: { label: string; id: string }[];
  scores?: number[];
  aiAnalysis?: GeneKeysAIAnalysis;
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

export async function generateAssessmentPdf(params: GeneratePdfParams): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  // Load Cyrillic Arial font
  const fontsDir = path.resolve(process.cwd(), 'src/shared/assets/fonts');
  const regularPath = path.join(fontsDir, 'arial.ttf');
  const boldPath = path.join(fontsDir, 'arialbd.ttf');

  const regularBytes = fs.existsSync(regularPath)
    ? fs.readFileSync(regularPath)
    : fs.readFileSync('C:/Windows/Fonts/arial.ttf');
  const boldBytes = fs.existsSync(boldPath)
    ? fs.readFileSync(boldPath)
    : fs.readFileSync('C:/Windows/Fonts/arialbd.ttf');

  const fontBody = await doc.embedFont(regularBytes);
  const fontBold = await doc.embedFont(boldBytes);

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

  // Brand header with logo image
  const logoPath = path.resolve(process.cwd(), 'public/logo.png');
  let logoImg: any = null;
  if (fs.existsSync(logoPath)) {
    try {
      logoImg = await doc.embedPng(fs.readFileSync(logoPath));
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
    } catch (e) {
      console.error('[PDF Embed Logo Error]:', e);
    }
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

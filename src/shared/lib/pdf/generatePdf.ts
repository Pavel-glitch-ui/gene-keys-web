import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

export interface GeneratePdfParams {
  title: string;
  name: string;
  focus: string;
  date: string;
  domains: { label: string; id: string }[];
  scores: number[];
  summary: string;
  plan: { title: string; text: string }[];
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

  // Curated color palette
  const inkDark = rgb(0.12, 0.08, 0.16); // #1f1429
  const purpleAccent = rgb(0.55, 0.42, 0.66); // #8e6ba8
  const goldAccent = rgb(0.81, 0.68, 0.57); // #cfae91
  const bgLight = rgb(0.98, 0.97, 0.99); // #faf8fc
  const grayText = rgb(0.4, 0.38, 0.45);
  const barBg = rgb(0.92, 0.88, 0.94);

  // PAGE 1: COVER PAGE
  const page1 = doc.addPage([W, H]);

  // Dark Cover Background
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: W,
    height: H,
    color: inkDark,
  });

  // Top Brand
  page1.drawText('тень®', {
    x: 60,
    y: H - 80,
    size: 26,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('П Р О С Т Р А Н С Т В О   С А М О П О З Н А Н И Я', {
    x: 60,
    y: H - 105,
    size: 9,
    font: fontBody,
    color: goldAccent,
  });

  // Main Title
  page1.drawText(params.title, {
    x: 60,
    y: H - 220,
    size: 30,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Персональный разбор личности и программа интеграции', {
    x: 60,
    y: H - 250,
    size: 13,
    font: fontBody,
    color: purpleAccent,
  });

  // Prepared for box
  page1.drawText('ПОДГОТОВЛЕНО ДЛЯ:', {
    x: 60,
    y: 200,
    size: 9,
    font: fontBold,
    color: goldAccent,
  });

  page1.drawText(params.name || 'Личное исследование', {
    x: 60,
    y: 175,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText(`Фокус исследования: ${params.focus}`, {
    x: 60,
    y: 150,
    size: 11,
    font: fontBody,
    color: purpleAccent,
  });

  page1.drawText(`Дата: ${params.date}`, {
    x: 60,
    y: 130,
    size: 10,
    font: fontBody,
    color: grayText,
  });

  // Footer bar on cover
  page1.drawLine({
    start: { x: 60, y: 70 },
    end: { x: W - 60, y: 70 },
    thickness: 1,
    color: rgb(0.3, 0.22, 0.38),
  });

  page1.drawText('КОНФИДЕНЦИАЛЬНЫЙ РАЗБОР · ТОЛЬКО ДЛЯ ВАС', {
    x: 60,
    y: 50,
    size: 8,
    font: fontBody,
    color: purpleAccent,
  });

  // PAGE 2: SUMMARY & DIMENSIONS
  const page2 = doc.addPage([W, H]);
  page2.drawRectangle({
    x: 0,
    y: 0,
    width: W,
    height: H,
    color: bgLight,
  });

  // Header line
  page2.drawText('ТЕНЬ / КАРТИНА ПРОФИЛЯ', {
    x: 60,
    y: H - 60,
    size: 8,
    font: fontBold,
    color: purpleAccent,
  });

  page2.drawText('Ваш профиль в одном взгляде', {
    x: 60,
    y: H - 95,
    size: 22,
    font: fontBold,
    color: inkDark,
  });

  // Scores chart bars
  let currentY = H - 150;
  page2.drawText('ВЫРАЖЕННОСТЬ ШКАЛ (ИНДЕКСЫ 0–100):', {
    x: 60,
    y: currentY,
    size: 9,
    font: fontBold,
    color: grayText,
  });

  currentY -= 25;

  params.domains.forEach((d, i) => {
    const score = params.scores[i] ?? 50;

    // Label
    page2.drawText(d.label, {
      x: 60,
      y: currentY,
      size: 10,
      font: fontBold,
      color: inkDark,
    });

    // Score text
    page2.drawText(`${score} / 100`, {
      x: W - 120,
      y: currentY,
      size: 10,
      font: fontBold,
      color: purpleAccent,
    });

    // Background track
    page2.drawRectangle({
      x: 200,
      y: currentY,
      width: 260,
      height: 7,
      color: barBg,
    });

    // Filled bar
    const filledWidth = Math.max(2, (260 * score) / 100);
    page2.drawRectangle({
      x: 200,
      y: currentY,
      width: filledWidth,
      height: 7,
      color: purpleAccent,
    });

    currentY -= 28;
  });

  // PAGE 3: 4-WEEK PROGRAM
  const page3 = doc.addPage([W, H]);
  page3.drawRectangle({
    x: 0,
    y: 0,
    width: W,
    height: H,
    color: bgLight,
  });

  page3.drawText('ТЕНЬ / ПРАКТИЧЕСКИЙ ПЛАН', {
    x: 60,
    y: H - 60,
    size: 8,
    font: fontBold,
    color: purpleAccent,
  });

  page3.drawText('Программа интеграции на 4 недели', {
    x: 60,
    y: H - 95,
    size: 22,
    font: fontBold,
    color: inkDark,
  });

  let planY = H - 150;
  params.plan.forEach((step, idx) => {
    // Step box
    page3.drawRectangle({
      x: 60,
      y: planY - 60,
      width: W - 120,
      height: 75,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.88, 0.84, 0.92),
      borderWidth: 1,
    });

    // Step badge
    page3.drawText(`ЭТАП 0${idx + 1} · ${step.title}`, {
      x: 75,
      y: planY - 10,
      size: 11,
      font: fontBold,
      color: purpleAccent,
    });

    // Step text
    page3.drawText(step.text.slice(0, 160) + '...', {
      x: 75,
      y: planY - 35,
      size: 9,
      font: fontBody,
      color: grayText,
    });

    planY -= 95;
  });

  // Footer on page 3
  page3.drawText('тень — быть ближе к себе · персональный отчет', {
    x: 60,
    y: 40,
    size: 8,
    font: fontBody,
    color: grayText,
  });

  return doc.save();
}

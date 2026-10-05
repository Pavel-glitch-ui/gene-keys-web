import { NextResponse } from 'next/server';
import { computeNatalChart, computeGeneKeysProfile } from '@/src/shared/lib/calculator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, input } = body;

    if (!input || !input.date) {
      return NextResponse.json(
        { success: false, error: 'Дата рождения обязательна для расчета.' },
        { status: 400 }
      );
    }

    if (type === 'genes') {
      const result = computeGeneKeysProfile(input);
      return NextResponse.json({ success: true, result });
    }

    // Default to natal
    const result = computeNatalChart(input);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка астрономического расчета';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

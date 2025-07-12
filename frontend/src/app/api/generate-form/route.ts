import { NextRequest, NextResponse } from 'next/server';
import { generateBookingFormFields } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid description' }, { status: 400 });
    }
    const result = await generateBookingFormFields(description);
    if (!result || typeof result !== 'object' || !result.classification || !result.extracted_fields) {
      return NextResponse.json({ error: 'Invalid response from Gemini' }, { status: 500 });
      }
    return NextResponse.json(result);
    } catch (e) {
    return NextResponse.json({ error: 'Gemini API error', details: String(e) }, { status: 500 });
  }
} 
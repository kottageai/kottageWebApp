import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid description' }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/generate/form-fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Backend API error', details: errorData }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to connect to backend API', details: String(e) }, { status: 500 });
  }
} 
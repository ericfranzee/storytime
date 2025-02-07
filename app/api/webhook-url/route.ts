import { NextResponse } from 'next/server';

export async function GET() {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'WEBHOOK_URL is not defined' }, { status: 500 });
  }
  return NextResponse.json({ webhookUrl });
}

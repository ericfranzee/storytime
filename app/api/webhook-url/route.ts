import { NextResponse } from 'next/server';
import getConfig from 'next/config'; // Import getConfig

// Remove explicit dotenv loading - rely on next.config.js now
// Remove runtime export unless specifically needed for other reasons

export async function GET() {
  const { serverRuntimeConfig } = getConfig();
  const webhookUrl = serverRuntimeConfig.WEBHOOK_URL;

  // Log the value obtained from serverRuntimeConfig
  // console.log(`[webhook-url] Value from serverRuntimeConfig.WEBHOOK_URL: ${webhookUrl}`); // Removed debug log

  if (!webhookUrl) {
    console.error('[webhook-url] WEBHOOK_URL not found in serverRuntimeConfig!');
    return NextResponse.json({ error: 'WEBHOOK_URL configuration missing' }, { status: 500 });
  }
  return NextResponse.json({ webhookUrl });
}

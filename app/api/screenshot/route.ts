import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: 'Microlink API error' }, { status: response.status });
    }

    const data = await response.json();
    const screenshotUrl = data?.data?.screenshot?.url;

    if (!screenshotUrl) {
      return NextResponse.json({ error: 'Screenshot not available' }, { status: 404 });
    }

    return NextResponse.json({ screenshotUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch screenshot' }, { status: 500 });
  }
}

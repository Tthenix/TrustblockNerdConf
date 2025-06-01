import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { userId, levelName = 'basic-kyc-level' } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const appToken = process.env.NEXT_PUBLIC_SUMSUB_APP_TOKEN;
    const secretKey = process.env.SUMSUB_SECRET_KEY;

    if (!appToken || !secretKey) {
      return NextResponse.json({ error: 'Sumsub configuration missing' }, { status: 500 });
    }

    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create request body
    const requestBody = JSON.stringify({
      userId,
      levelName,
      timestamp,
    });

    // Generate signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(timestamp + 'POST' + '/resources/accessTokens?userId=' + userId + requestBody)
      .digest('hex');

    // Make request to Sumsub API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUMSUB_API_URL}/resources/accessTokens?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-App-Access-Ts': timestamp.toString(),
        'X-App-Access-Sig': signature,
      },
      body: JSON.stringify({
        levelName,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Sumsub API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error('Error generating Sumsub access token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  const { email, amount, currency, metadata } = await request.json();
  const userId = metadata.userId;

  if (!email || !amount || !currency) {
    return NextResponse.json({ message: 'Email, amount, and currency are required' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
        currency,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const musicUrls = {
    "1": process.env.NEXT_PUBLIC_MUSIC_JOYFULL_URL,
    "2": process.env.NEXT_PUBLIC_MUSIC_HORROR_URL,
    "3": process.env.NEXT_PUBLIC_MUSIC_PIANO_URL,
    "4": process.env.NEXT_PUBLIC_MUSIC_NATURAL_URL,
    "5": process.env.NEXT_PUBLIC_MUSIC_LOVE_URL,
  };

  return NextResponse.json({ musicUrls });
}

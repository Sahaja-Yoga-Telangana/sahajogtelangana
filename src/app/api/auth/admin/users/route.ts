import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { connect } from "@/database/mongo.config";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 60;

export async function GET() {
  try {
    await connect();

    const users = await User.find({}, 'name role');

    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

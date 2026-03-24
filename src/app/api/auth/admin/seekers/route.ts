// src/app/api/auth/admin/seekers/route.ts

import { NextResponse } from 'next/server';
import { Seeker } from '@/models/Seeker'; // Adjust this import path as necessary
import { connect } from "@/database/mongo.config";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 60;

export async function GET() {
  try {
    connect();
    const seekers = await Seeker.find({}).sort({ addedAt: -1 });
    return NextResponse.json(seekers, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch seekers:', error);
    return NextResponse.json({ error: 'Failed to fetch seekers' }, { status: 500 });
  }
}
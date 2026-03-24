// src/app/api/auth/admin/program-requests/route.ts

import { NextResponse } from 'next/server';
import { CorporateRegister } from '@/models/CorporateRegister'; // Adjust this import path as necessary
import { connect } from "@/database/mongo.config";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 60;

export async function GET() {
  try {
    connect();
    const programRequests = await CorporateRegister.find({}).sort({ createdAt: -1 });
    return NextResponse.json(programRequests, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch program requests:', error);
    return NextResponse.json({ error: 'Failed to fetch program requests' }, { status: 500 });
  }
}
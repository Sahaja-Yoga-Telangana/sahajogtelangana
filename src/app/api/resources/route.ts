import { NextRequest, NextResponse } from "next/server";
import { PROPAGATION_CATEGORIES } from "@/data/resources";

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoryId = searchParams.get('category');

    let data = PROPAGATION_CATEGORIES;

    if (categoryId) {
      data = data.filter((c) => c.id === categoryId);
    }

    return NextResponse.json({
      status: 200,
      message: 'Resources fetched successfully',
      data,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({
      status: 500,
      message: 'Unable to fetch resources right now.',
    }, { status: 500 });
  }
}

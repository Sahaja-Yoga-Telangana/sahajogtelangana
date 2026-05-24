import { NextResponse } from "next/server";

const MESSAGE = "This route is disabled. Use the admin events interface to create or manage events.";

export async function GET() {
  return NextResponse.json({
    status: 410,
    message: MESSAGE,
  }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({
    status: 410,
    message: MESSAGE,
  }, { status: 410 });
}

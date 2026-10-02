import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL!, { tls: true, ssl: true });
    }

    const db = mongoose.connection.db;
    const rows = await db
      .collection("toursessions")
      .find({})
      .sort({ dateKey: 1, sno: 1 })
      .toArray();

    return NextResponse.json({ rows });
  } catch (err) {
    console.error("Tour schedule fetch error:", err);
    return NextResponse.json({ error: "Failed to load schedule" }, { status: 502 });
  }
}

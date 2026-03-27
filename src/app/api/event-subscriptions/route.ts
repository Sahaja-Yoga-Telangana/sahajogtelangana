import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";
import { EventSubscription } from "@/models/EventSubscription";

export async function POST(request: NextRequest) {
  await connect();

  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session?.user?.email) {
    return NextResponse.json(
      { status: 401, message: "Please log in to subscribe for event updates." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { status: 400, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (email !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { status: 400, message: "Please use the email address of the logged in yogi." },
        { status: 400 }
      );
    }

    const subscription = await EventSubscription.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          name: session.user.name || "",
          userId: session.user.id,
          isActive: true,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { status: 200, message: "You are subscribed for future event updates.", data: subscription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving event subscription:", error);
    return NextResponse.json(
      { status: 500, message: "Unable to save your subscription right now." },
      { status: 500 }
    );
  }
}

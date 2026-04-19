import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { getRequiredSession } from "@/lib/auth";
import { User } from "@/models/User";
import { FeatureRequest } from "@/models/FeatureRequest";

export async function POST(request: NextRequest) {
  await connect();

  const session = await getRequiredSession();
  if (!session?.user?.email) {
    return NextResponse.json({ status: 401, message: "Please log in first." }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const category = String(body.category || "").trim();
  const useCase = String(body.useCase || "").trim();

  if (!title || !description) {
    return NextResponse.json({ status: 400, message: "Feature title and description are required." }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email }).lean() as any;

  const featureRequest = await FeatureRequest.create({
    userId: user?._id,
    name: session.user.name || user?.name || "Sahaja Yogi",
    email: session.user.email,
    title,
    description,
    category,
    useCase,
  });

  return NextResponse.json({
    status: 201,
    message: "Your feature request has been submitted for admin review.",
    data: { id: String(featureRequest._id) },
  }, { status: 201 });
}

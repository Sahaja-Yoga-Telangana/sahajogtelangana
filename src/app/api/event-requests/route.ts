import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { getRequiredSession } from "@/lib/auth";
import { User } from "@/models/User";
import { EventRequest } from "@/models/EventRequest";

export async function POST(request: NextRequest) {
  await connect();

  const session = await getRequiredSession();
  if (!session?.user?.email) {
    return NextResponse.json({ status: 401, message: "Please log in first." }, { status: 401 });
  }

  const body = await request.json();
  const eventName = String(body.eventName || "").trim();
  const description = String(body.description || "").trim();
  const time = String(body.time || "").trim();
  const location = String(body.location || "").trim();
  const googleMapLink = String(body.googleMapLink || "").trim();
  const contactDetails = String(body.contactDetails || "").trim();
  const additionalNotes = String(body.additionalNotes || "").trim();
  const proposedStartDate = body.proposedStartDate ? new Date(body.proposedStartDate) : null;
  const proposedEndDate = body.proposedEndDate ? new Date(body.proposedEndDate) : null;
  const priceBelow12 = Number.isFinite(Number(body.priceBelow12)) ? Number(body.priceBelow12) : 0;
  const price12To24 = Number.isFinite(Number(body.price12To24)) ? Number(body.price12To24) : 0;
  const price25AndAbove = Number.isFinite(Number(body.price25AndAbove)) ? Number(body.price25AndAbove) : 0;
  const image = String(body.image || "").trim();
  const qrImage = String(body.qrImage || "").trim();

  if (!eventName || !description || !time || !location || !proposedStartDate || Number.isNaN(proposedStartDate.getTime())) {
    return NextResponse.json({
      status: 400,
      message: "Event name, description, proposed date, time, and location are required.",
    }, { status: 400 });
  }

  if (proposedEndDate && !Number.isNaN(proposedEndDate.getTime()) && proposedEndDate < proposedStartDate) {
    return NextResponse.json({
      status: 400,
      message: "The end date cannot be earlier than the start date.",
    }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email }).lean() as any;

  const eventRequest = await EventRequest.create({
    userId: user?._id,
    name: session.user.name || user?.name || "Sahaja Yogi",
    email: session.user.email,
    eventName,
    description,
    proposedStartDate,
    proposedEndDate: proposedEndDate && !Number.isNaN(proposedEndDate.getTime()) ? proposedEndDate : undefined,
    time,
    location,
    googleMapLink,
    contactDetails,
    priceBelow12,
    price12To24,
    price25AndAbove,
    image,
    qrImage,
    additionalNotes,
  });

  return NextResponse.json({
    status: 201,
    message: "Your event request has been submitted for admin review.",
    data: { id: String(eventRequest._id) },
  }, { status: 201 });
}

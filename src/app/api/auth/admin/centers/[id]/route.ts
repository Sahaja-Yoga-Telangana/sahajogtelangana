import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";
import { Center } from "@/models/Center";
import { centerSchema } from "@/validator/authValidationSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";
import { CenterConnection } from "@/models/CenterConnection";
import { User } from "@/models/User";
import { sendEmail } from "@/config/mail";

type RouteContext = { params: { id: string } };

async function assertAdmin() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  return !!session && session.user?.role === "Admin";
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  await connect();

  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(centerSchema);
    const output = await validator.validate(body);
    const previousCenter = (await Center.findById(params.id).lean()) as any;

    const center = await Center.findByIdAndUpdate(params.id, { $set: output }, { new: true });

    if (!center) {
      return NextResponse.json({ error: "Center not found" }, { status: 404 });
    }

    const hadMeaningfulCenterUpdate =
      previousCenter &&
      (
        previousCenter.day !== center.day ||
        previousCenter.time !== center.time ||
        previousCenter.address !== center.address ||
        previousCenter.weeklyUpdate !== center.weeklyUpdate ||
        previousCenter.announcement !== center.announcement
      );

    if (hadMeaningfulCenterUpdate) {
      const joinedConnections = await CenterConnection.find({ centerId: params.id, connectionType: "joined" }).lean();
      const emails = joinedConnections.map((item: any) => item.userEmail).filter(Boolean);
      const users = await User.find({ email: { $in: emails } }, { email: 1, name: 1 }).lean();

      const notificationResults = await Promise.allSettled(
        users
          .filter((user: any) => user.email)
          .map((user: any) =>
            sendEmail(
              user.email,
              `Update from ${center.zone} center`,
              `<div style="font-family:Arial,sans-serif;line-height:1.6"><p>Namaste ${user.name || ""},</p><p>There is an update from the <strong>${center.zone}</strong> center in ${center.city || "Hyderabad"}.</p>${center.weeklyUpdate ? `<p><strong>Weekly update:</strong> ${center.weeklyUpdate}</p>` : ""}${center.announcement ? `<p><strong>Announcement:</strong> ${center.announcement}</p>` : ""}<p><strong>Day:</strong> ${center.day}<br/><strong>Time:</strong> ${center.time}<br/><strong>Address:</strong> ${center.address}</p></div>`
            )
          )
      );

      const failedNotifications = notificationResults.filter((result) => result.status === "rejected");
      if (failedNotifications.length > 0) {
        console.error(`Failed to send ${failedNotifications.length} center update notification(s) for center ${params.id}.`);
      }
    }

    return NextResponse.json({ msg: "Center updated successfully!", data: center }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating center:", error);

    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json({ errors: error.messages }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  await connect();

  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const center = await Center.findByIdAndDelete(params.id);

    if (!center) {
      return NextResponse.json({ error: "Center not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Center deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting center:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

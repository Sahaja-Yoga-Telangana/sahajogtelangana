import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";
import { Center } from "@/models/Center";
import { centerSchema } from "@/validator/authValidationSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";

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

    const center = await Center.findByIdAndUpdate(params.id, { $set: output }, { new: true });

    if (!center) {
      return NextResponse.json({ error: "Center not found" }, { status: 404 });
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

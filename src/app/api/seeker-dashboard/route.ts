import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { exactEmailMatch, getSessionFromRequest, normalizeEmail } from "@/lib/auth";
import { User } from "@/models/User";
import { Seeker } from "@/models/Seeker";
import { VolunteerProfile } from "@/models/VolunteerProfile";

export const dynamic = "force-dynamic";

const FUNNEL_LABELS = ["New", "Contacted", "Follow-up scheduled", "Converted", "Dormant"];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nameFilter(name: string) {
  return { $regex: `^${escapeRegExp(name)}$`, $options: "i" };
}

// A seeker "belongs" to a volunteer when the volunteer added them, is (or was)
// assigned to them, completed a follow-up on them, or snoozed them.
function mineFilter(name: string) {
  return {
    $or: [
      { addedBy: nameFilter(name) },
      { assignedVolunteer: nameFilter(name) },
      { volunteerFollowUpCompletedBy: nameFilter(name) },
      { snoozedBy: nameFilter(name) },
    ],
  };
}

function isoWeekStart(date: Date): string {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday-start weeks
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    await connect();

    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401, headers: corsHeaders() });
    }

    const user = await User.findOne(
      { email: exactEmailMatch(normalizeEmail(session.email)) },
      { name: 1, role: 1 },
    ).lean();

    const role = String((user as any)?.role || "User").toLowerCase();
    if (role !== "volunteer" && role !== "admin") {
      return NextResponse.json(
        { error: "Only volunteers can view the seeker dashboard." },
        { status: 403, headers: corsHeaders() },
      );
    }

    const profile = await VolunteerProfile.findOne(
      { email: normalizeEmail(session.email) },
      { name: 1 },
    ).lean();
    const myName = (profile as any)?.name || (user as any)?.name || session.name || "";

    const mine = mineFilter(myName);
    const addedByMe = { addedBy: nameFilter(myName) };

    const [totalAdded, totalMine, funnelRaw, sourcesRaw, datesRaw, recentRaw, batchCount] =
      await Promise.all([
        Seeker.countDocuments(addedByMe),
        Seeker.countDocuments(mine),
        Seeker.aggregate([
          { $match: mine },
          { $group: { _id: "$followUpStatus", count: { $sum: 1 } } },
        ]),
        Seeker.aggregate([
          { $match: addedByMe },
          { $group: { _id: "$source", count: { $sum: 1 } } },
        ]),
        Seeker.aggregate([
          { $match: addedByMe },
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$addedAt" } }, count: { $sum: 1 } } },
        ]),
        Seeker.aggregate([
          { $match: mine },
          { $sort: { lastContactDate: -1, addedAt: -1 } },
          { $limit: 5 },
          { $project: { name: 1, followUpStatus: 1, lastContactDate: 1, addedAt: 1 } },
        ]),
        Seeker.countDocuments({
          assignedVolunteer: nameFilter(myName),
          $or: [
            { volunteerFollowUpCompletedAt: { $exists: false } },
            { volunteerFollowUpCompletedAt: null },
          ],
        }),
      ]);

    const countByStatus: Record<string, number> = {};
    for (const row of funnelRaw as { _id: string; count: number }[]) {
      const label = String(row._id || "").trim() || "New";
      countByStatus[label] = (countByStatus[label] || 0) + row.count;
    }

    const funnel = FUNNEL_LABELS.map((label) => ({
      label,
      count: countByStatus[label] || 0,
    }));
    for (const label of Object.keys(countByStatus)) {
      if (!FUNNEL_LABELS.includes(label)) {
        funnel.push({ label, count: countByStatus[label] });
      }
    }

    const converted = countByStatus["Converted"] || 0;
    const contacted = Math.max(0, totalMine - (countByStatus["New"] || 0));

    const sourceCount: Record<string, number> = {};
    for (const row of sourcesRaw as { _id: string; count: number }[]) {
      sourceCount[String(row._id || "Unknown")] = (sourceCount[String(row._id || "Unknown")] || 0) + row.count;
    }
    const sourceBreakdown = Object.entries(sourceCount).map(([label, count]) => ({
      label,
      count,
      percentage: totalAdded > 0 ? Math.round((count / totalAdded) * 100) : 0,
    }));

    const now = new Date();
    const weekStart = new Date(isoWeekStart(now));
    const dayCounts: Record<string, number> = {};
    for (const row of datesRaw as { _id: string; count: number }[]) {
      dayCounts[row._id] = row.count;
    }
    const weeklyTrend: { week: string; count: number }[] = [];
    for (let i = 7; i >= 0; i -= 1) {
      const start = new Date(weekStart.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const days = (d: Date) => d.toISOString().slice(0, 10);
      let count = 0;
      for (const [day, c] of Object.entries(dayCounts)) {
        if (day >= days(start) && day < days(end)) count += c;
      }
      weeklyTrend.push({
        week: `${start.getDate()}/${start.getMonth() + 1}`,
        count,
      });
    }

    const recentActivity = (recentRaw as any[]).map((seeker) => {
      const isNew = String(seeker.followUpStatus || "New").toLowerCase() === "new";
      const ts = seeker.lastContactDate || seeker.addedAt;
      return {
        seekerName: seeker.name || "Seeker",
        action: isNew ? "Added to the database" : `Marked as ${seeker.followUpStatus}`,
        date: ts ? new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "",
      };
    });

    return NextResponse.json(
      {
        data: {
          totalSeekers: totalMine,
          addedByMe: totalAdded,
          contacted,
          converted,
          currentBatch: batchCount,
          conversionRate: totalMine > 0 ? Math.round((converted / totalMine) * 100) : 0,
          conversionFunnel: funnel,
          sourceBreakdown,
          weeklyTrend,
          recentActivity,
        },
      },
      { headers: corsHeaders() },
    );
  } catch (error: any) {
    console.error("Seeker dashboard error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load seeker dashboard." },
      { status: 500, headers: corsHeaders() },
    );
  }
}

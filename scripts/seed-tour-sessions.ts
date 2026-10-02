import { connect } from "@/database/mongo.config";
import { TourSession } from "@/models/TourSession";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1_0zP_XOSV0w7UdJfZE1O5X_QnX_siRPWaP-itjeRTk8/gviz/tq?tqx=out:json";

function parseDate(value: string | null): string {
  if (!value) return "";
  const match = value.match(/Date\((\d+),(\d+),(\d+)/);
  if (!match) return value;
  return `${match[3]}/${String(Number(match[2]) + 1).padStart(2, "0")}/${match[1]}`;
}

function parseDateKey(value: string | null): string {
  if (!value) return "";
  const match = value.match(/Date\((\d+),(\d+),(\d+)/);
  if (!match) return "";
  return `${match[1]}-${String(Number(match[2]) + 1).padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function parseTime(value: string | null): string {
  if (!value) return "";
  const match = value.match(/Date\(\d+,\d+,\d+,(\d+),(\d+)/);
  if (!match) return value;
  let h = Number(match[1]);
  const m = String(Number(match[2])).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function parsePhone(value: unknown): string {
  if (value == null) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return String(Math.round(n));
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await connect();

  console.log("Fetching Google Sheet data...");
  const res = await fetch(SHEET_URL);
  const raw = await res.text();
  const match = raw.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
  if (!match) {
    console.error("Failed to parse sheet response");
    process.exit(1);
  }

  const data = JSON.parse(match[1]);
  const rows = (data.table?.rows || [])
    .map((row: any) => {
      const c = row.c || [];
      let branch = c[4]?.v || "";
      let principal = c[5]?.v || "";

      // Some rows have branch in c[5] instead of c[4] (manually edited)
      if (!branch && principal && typeof principal === "string") {
        const upper = principal.toUpperCase();
        // If it looks like a location (all caps or known patterns), treat as branch
        if (upper === upper && /^[A-Z][A-Z\s\-\/]+$/.test(principal.trim())) {
          branch = principal;
          principal = "";
        }
      }

      return {
        sno: c[2]?.v ?? 0,
        speaker: c[0]?.v || "",
        speakerPhone: parsePhone(c[1]?.v),
        institution: c[3]?.v || "",
        branch,
        principal,
        phone: parsePhone(c[6]?.v || c[7]?.v),
        date: parseDate(c[9]?.v || c[10]?.v),
        dateKey: parseDateKey(c[9]?.v || c[10]?.v),
        time: parseTime(c[10]?.v),
        remarks: c[11]?.v || "",
        students: c[12]?.v ?? null,
        direction: c[14]?.v || "",
        approvalBy: c[15]?.v || "",
        approvalContact: parsePhone(c[16]?.v),
        mapUrl: c[17]?.v || "",
        maxSpeakers: 4,
      };
    })
    .filter((r: any) => r.institution);

  console.log(`Parsed ${rows.length} rows from sheet.`);

  await TourSession.deleteMany({});
  console.log("Cleared existing TourSession documents.");

  await TourSession.insertMany(rows);
  console.log(`Imported ${rows.length} sessions into MongoDB.`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

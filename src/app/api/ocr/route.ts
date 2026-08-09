import { NextRequest, NextResponse } from "next/server";

const OCR_PROMPT = `You are an OCR scanner for Sahaja Yoga seeker registration sheets and handwriting sheets.
Extract seeker records from the provided image into a JSON array of objects.

For each seeker found in the image, extract:
- "name": string (Full Name of seeker, e.g. "Ramesh Reddy")
- "phone": string (10-digit Indian mobile number formatted as pure digits without spaces or country code e.g. "9876543210")
- "city": string (City / Town / Mandal name, e.g. "Hyderabad", "Warangal", "Nizamabad", "Secunderabad")
- "email": string (optional, empty string if not legible or not present)
- "preferredLanguage": string (optional, e.g. "Telugu", "Hindi", "English", "Odia", "Marathi")
- "notes": string (brief description or "OCR Scanned")

Return ONLY a valid JSON array of objects, e.g. [{"name":"...","phone":"...","city":"...","email":"","preferredLanguage":"Telugu","notes":"OCR Scanned"}].
Do NOT include markdown formatting, backticks, or explanatory text.`;

// Ultra-resilient parser for JSON, Markdown tables, Bullet lists, Key-Values, and raw OCR text
function parseSeekersFromAiResponse(text: string): any[] {
  if (!text || !text.trim()) {
    throw new Error("AI model returned empty text.");
  }

  let cleaned = text.trim();

  // 1. Direct or Markdown-stripped JSON parse
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    if (parsed && typeof parsed === "object") {
      for (const key of Object.keys(parsed)) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) return parsed[key];
      }
      if (parsed.name || parsed.phone) return [parsed];
    }
  } catch {
    // Continue to regex & heuristic parsing
  }

  // 2. Regex search for JSON array [ { ... } ]
  const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // Continue
    }
  }

  // 3. Regex search for single JSON object { ... }
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed && (parsed.name || parsed.phone)) return [parsed];
    } catch {
      // Continue
    }
  }

  // 4. Markdown Table parser (| Name | Phone | City | ...)
  const tableRows = cleaned.split("\n").filter((l) => l.includes("|") && !l.includes("---"));
  if (tableRows.length >= 2) {
    const headerRow = tableRows[0].toLowerCase();
    if (headerRow.includes("name") || headerRow.includes("phone")) {
      const seekers: any[] = [];
      const headers = tableRows[0].split("|").map((h) => h.trim().toLowerCase());
      const nameIdx = headers.findIndex((h) => h.includes("name"));
      const phoneIdx = headers.findIndex((h) => h.includes("phone") || h.includes("mobile") || h.includes("contact"));
      const cityIdx = headers.findIndex((h) => h.includes("city") || h.includes("town") || h.includes("place") || h.includes("address"));
      const langIdx = headers.findIndex((h) => h.includes("lang"));

      for (let i = 1; i < tableRows.length; i++) {
        const cols = tableRows[i].split("|").map((c) => c.trim());
        if (cols.length >= 2) {
          const name = nameIdx !== -1 ? cols[nameIdx] : cols[1];
          const phone = phoneIdx !== -1 ? cols[phoneIdx] : cols[2];
          const city = cityIdx !== -1 ? cols[cityIdx] : "Hyderabad";
          const preferredLanguage = langIdx !== -1 ? cols[langIdx] : "Telugu";

          if (name && (phone || name.length > 2)) {
            seekers.push({
              name: name.replace(/^[*_#\s]+|[*_#\s]+$/g, ""),
              phone: phone ? phone.replace(/\D/g, "") : "",
              city: city ? city.replace(/^[*_#\s]+|[*_#\s]+$/g, "") : "Hyderabad",
              preferredLanguage: preferredLanguage || "Telugu",
              notes: "OCR Scanned",
            });
          }
        }
      }
      if (seekers.length > 0) return seekers;
    }
  }

  // 5. Line-by-Line Key-Value & Phone Extractor
  const lines = cleaned.split("\n");
  const extractedSeekers: any[] = [];
  let currentSeeker: any = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for phone number (10 digits starting with 6, 7, 8, 9 or prefixed with 91)
    const phoneMatch = trimmed.match(/(?:\+?91[\s\-]?)?([6789]\d{9})/);
    const nameMatch = trimmed.match(/(?:name|seeker|person)\s*[:=-]\s*([A-Za-z\s.'’]+?)(?:,|\n|phone|mobile|city|language|$)/i);
    const cityMatch = trimmed.match(/(?:city|town|place|address|mandal|dist)\s*[:=-]\s*([A-Za-z\s]+?)(?:,|\n|phone|mobile|language|$)/i);
    const langMatch = trimmed.match(/(?:lang|language)\s*[:=-]\s*([A-Za-z\s]+?)(?:,|\n|$)/i);

    // Numbered item or bullet point start (e.g. "1. Ramesh Reddy - 9876543210 - Hyderabad")
    const isNewItem = /^(\d+[\.\)]|\*|\-|\•)\s+/.test(trimmed);

    if (isNewItem && currentSeeker && (currentSeeker.name || currentSeeker.phone)) {
      extractedSeekers.push(currentSeeker);
      currentSeeker = null;
    }

    if (!currentSeeker) {
      currentSeeker = { name: "", phone: "", city: "Hyderabad", preferredLanguage: "Telugu", notes: "OCR Scanned" };
    }

    if (nameMatch) {
      currentSeeker.name = nameMatch[1].trim();
    } else if (isNewItem && !currentSeeker.name) {
      // Clean bullet and try using line text as name
      const withoutBullet = trimmed.replace(/^(\d+[\.\)]|\*|\-|\•)\s+/, "");
      const firstPart = withoutBullet.split(/[,-:|]/)[0]?.trim();
      if (firstPart && !/\d/.test(firstPart) && firstPart.length > 2) {
        currentSeeker.name = firstPart;
      }
    }

    if (phoneMatch) {
      currentSeeker.phone = phoneMatch[1];
    }
    if (cityMatch) {
      currentSeeker.city = cityMatch[1].trim();
    }
    if (langMatch) {
      currentSeeker.preferredLanguage = langMatch[1].trim();
    }

    // If both name and phone found on this line, save seeker
    if (currentSeeker.phone && (currentSeeker.name || isNewItem)) {
      if (!currentSeeker.name) {
        const words = trimmed.replace(phoneMatch ? phoneMatch[0] : "", "").replace(/[^\w\s]/g, " ").trim();
        const candidateName = words.split(/\s+/).slice(0, 3).join(" ");
        if (candidateName && candidateName.length > 2) {
          currentSeeker.name = candidateName;
        }
      }
      extractedSeekers.push(currentSeeker);
      currentSeeker = null;
    }
  }

  if (currentSeeker && (currentSeeker.name || currentSeeker.phone)) {
    extractedSeekers.push(currentSeeker);
  }

  if (extractedSeekers.length > 0) {
    return extractedSeekers;
  }

  throw new Error(`Could not parse seeker records from AI response. Output received: ${cleaned.substring(0, 150)}...`);
}

// 1. Google Gemini API Provider (Supports gemini-2.0-flash with backoff)
async function tryGemini(apiKey: string, base64Data: string, mimeType: string): Promise<any[]> {
  const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.0-pro-exp-02-05"];
  let lastError = "";

  for (const model of models) {
    try {
      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: OCR_PROMPT },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      // Handle 429 Free Tier Rate Limit by waiting 2.5 seconds
      if (response.status === 429) {
        console.warn(`Gemini (${model}) hit rate limit (429). Retrying after 2.5s backoff...`);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: OCR_PROMPT },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Data,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );
      }

      if (!response.ok) {
        const errText = await response.text();
        if (errText.includes("leaked") || errText.includes("PERMISSION_DENIED")) {
          lastError = `Gemini API key is blocked/leaked. Please generate a new key at aistudio.google.com`;
          console.warn(lastError);
          return [];
        }
        lastError = `Gemini (${model}) error ${response.status}: ${errText}`;
        console.warn(lastError);
        continue;
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = `Gemini (${model}) returned empty text`;
        continue;
      }

      return parseSeekersFromAiResponse(text);
    } catch (e: any) {
      lastError = `Gemini (${model}) exception: ${e.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(lastError || "All Gemini models failed.");
}

// 2. OpenRouter API Provider (Multi-Model Free Vision Router)
async function tryOpenRouter(apiKey: string, dataUri: string): Promise<any[]> {
  const models = [
    "openrouter/free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen-2.5-vl-72b-instruct:free",
  ];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
          "HTTP-Referer": "https://sahajayogatelangana.org",
          "X-Title": "Sahaja Yoga Telangana Seeker Scanner",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: OCR_PROMPT },
                {
                  type: "image_url",
                  image_url: {
                    url: dataUri,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `OpenRouter (${model}) error ${response.status}: ${errText}`;
        console.warn(lastError);
        continue;
      }

      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content;
      if (!text) {
        lastError = `OpenRouter (${model}) returned empty content`;
        continue;
      }

      return parseSeekersFromAiResponse(text);
    } catch (e: any) {
      lastError = `OpenRouter (${model}) exception: ${e.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(lastError || "All OpenRouter models failed.");
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ status: 400, message: "No image data provided" }, { status: 400 });
    }

    // Extract raw base64 data and mime type
    let mimeType = "image/jpeg";
    let base64Data = image;
    let dataUri = image;

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
        dataUri = image;
      }
    } else {
      dataUri = `data:${mimeType};base64,${base64Data}`;
    }

    // Provider Keys from Environment
    const openrouterKey = process.env.OPENROUTER_API_KEY || "";
    const geminiKey = process.env.GEMINI_API_KEY || "";

    let rawSeekers: any[] = [];
    let providerUsed = "";
    const errors: string[] = [];

    // 1. Try OpenRouter (Multi-model Vision Router with ultra-resilient parser)
    if (openrouterKey) {
      try {
        console.log("Attempting OCR with OpenRouter Vision router...");
        rawSeekers = await tryOpenRouter(openrouterKey, dataUri);
        providerUsed = "OpenRouter Vision";
      } catch (err: any) {
        errors.push(`OpenRouter: ${err.message}`);
      }
    }

    // 2. Try Gemini (with 2.5s backoff on 429)
    if (rawSeekers.length === 0 && geminiKey) {
      try {
        console.log("Attempting OCR with Google Gemini API...");
        const res = await tryGemini(geminiKey, base64Data, mimeType);
        if (res.length > 0) {
          rawSeekers = res;
          providerUsed = "Google Gemini";
        }
      } catch (err: any) {
        errors.push(`Gemini: ${err.message}`);
      }
    }

    // If all configured providers failed
    if (rawSeekers.length === 0) {
      console.error("All OCR providers failed:", errors);
      const combinedError = errors.join(" | ") || "No OCR provider keys configured.";
      return NextResponse.json(
        {
          status: 500,
          message: `Scan failed. ${combinedError}. Please verify your OPENROUTER_API_KEY or GEMINI_API_KEY in Vercel project environment variables.`,
          errors: errors,
        },
        { status: 500 }
      );
    }

    // Clean, format, and assign unique IDs to each seeker
    const formattedSeekers = rawSeekers.map((s: any, index: number) => {
      // Clean phone number: remove non-digits, country code +91 or leading 0
      let cleanPhone = String(s.phone || "").replace(/\D/g, "");
      if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
        cleanPhone = cleanPhone.substring(2);
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
        cleanPhone = cleanPhone.substring(1);
      }

      return {
        id: `ocr-${Date.now()}-${index}`,
        name: String(s.name || "").trim() || "Unknown Seeker",
        phone: cleanPhone,
        city: String(s.city || "").trim() || "Hyderabad",
        email: String(s.email || "").trim(),
        preferredLanguage: String(s.preferredLanguage || "").trim() || "English",
        notes: String(s.notes || "").trim() || `Scanned via ${providerUsed}`,
      };
    });

    return NextResponse.json(
      {
        status: 200,
        provider: providerUsed,
        data: formattedSeekers,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("OCR server route error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: error.message || "An unexpected server error occurred during scan.",
      },
      { status: 500 }
    );
  }
}

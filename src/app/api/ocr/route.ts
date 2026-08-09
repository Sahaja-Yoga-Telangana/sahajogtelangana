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

// Helper to clean and parse JSON from AI model output
function parseJsonArrayFromText(text: string): any[] {
  let cleaned = text.trim();

  // Strip markdown code blocks
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Try direct parse
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") {
      // If wrapped in an object like { "seekers": [...] } or { "data": [...] }
      for (const key of Object.keys(parsed)) {
        if (Array.isArray(parsed[key])) return parsed[key];
      }
      return [parsed];
    }
  } catch {
    // Regex extraction for JSON array [ ... ]
    const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fall through
      }
    }

    // Regex extraction for single object { ... }
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        const parsed = JSON.parse(objMatch[0]);
        return [parsed];
      } catch {
        // Fall through
      }
    }
  }

  throw new Error("Could not parse a valid JSON array from AI model response.");
}

// 1. Google Gemini API Provider (Supports v1beta and v1 endpoints)
async function tryGemini(apiKey: string, base64Data: string, mimeType: string): Promise<any[]> {
  const versions = ["v1beta", "v1"];
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError = "";

  for (const ver of versions) {
    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${apiKey}`,
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

        if (!response.ok) {
          const errText = await response.text();
          if (errText.includes("leaked") || errText.includes("PERMISSION_DENIED")) {
            lastError = `Gemini API key is blocked/leaked. Please generate a new key at aistudio.google.com`;
            console.warn(lastError);
            return []; // Skip to next provider immediately
          }
          lastError = `Gemini (${ver}/${model}) error ${response.status}: ${errText}`;
          console.warn(lastError);
          continue;
        }

        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          lastError = `Gemini (${ver}/${model}) returned empty text`;
          continue;
        }

        return parseJsonArrayFromText(text);
      } catch (e: any) {
        lastError = `Gemini (${ver}/${model}) exception: ${e.message}`;
        console.warn(lastError);
      }
    }
  }

  throw new Error(lastError || "All Gemini models failed.");
}

// 2. OpenRouter API Provider (Supports active vision endpoints)
async function tryOpenRouter(apiKey: string, dataUri: string): Promise<any[]> {
  const models = [
    "openrouter/free",
    "google/gemini-2.0-flash-exp:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "meta-llama/llama-3.2-11b-vision-instruct:free",
    "qwen/qwen-2.5-vl-72b-instruct:free",
    "google/gemini-2.0-flash-001",
    "meta-llama/llama-3.2-11b-vision-instruct",
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

      return parseJsonArrayFromText(text);
    } catch (e: any) {
      lastError = `OpenRouter (${model}) exception: ${e.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(lastError || "All OpenRouter models failed.");
}

// 3. Groq Cloud Vision API Provider (Active Model Check)
async function tryGroq(apiKey: string, dataUri: string): Promise<any[]> {
  const models = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
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
        lastError = `Groq (${model}) error ${response.status}: ${errText}`;
        console.warn(lastError);
        continue;
      }

      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content;
      if (!text) {
        lastError = `Groq (${model}) returned empty content`;
        continue;
      }

      return parseJsonArrayFromText(text);
    } catch (e: any) {
      lastError = `Groq (${model}) exception: ${e.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(lastError || "Groq vision model failed.");
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
    const geminiKey = process.env.GEMINI_API_KEY || "";
    const openrouterKey = process.env.OPENROUTER_API_KEY || "";
    const groqKey = process.env.GROQ_API_KEY || "";

    let rawSeekers: any[] = [];
    let providerUsed = "";
    const errors: string[] = [];

    // 1. Try Gemini (if key configured)
    if (geminiKey) {
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

    // 2. Try OpenRouter (Multi-model vision router)
    if (rawSeekers.length === 0 && openrouterKey) {
      try {
        console.log("Attempting OCR with OpenRouter Vision router...");
        rawSeekers = await tryOpenRouter(openrouterKey, dataUri);
        providerUsed = "OpenRouter Vision";
      } catch (err: any) {
        errors.push(`OpenRouter: ${err.message}`);
      }
    }

    // 3. Try Groq (if available)
    if (rawSeekers.length === 0 && groqKey) {
      try {
        console.log("Attempting OCR with Groq Cloud Vision...");
        rawSeekers = await tryGroq(groqKey, dataUri);
        providerUsed = "Groq Cloud Vision";
      } catch (err: any) {
        errors.push(`Groq: ${err.message}`);
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

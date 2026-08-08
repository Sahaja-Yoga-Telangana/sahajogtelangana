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

// 1. Google Gemini API Provider
async function tryGemini(apiKey: string, base64Data: string, mimeType: string): Promise<any[]> {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch(
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

      if (!response.ok) {
        const errText = await response.text();
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

      return parseJsonArrayFromText(text);
    } catch (e: any) {
      lastError = `Gemini (${model}) exception: ${e.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(lastError || "All Gemini models failed.");
}

// 2. Groq Cloud Vision API Provider (Free & Fast)
async function tryGroq(apiKey: string, dataUri: string): Promise<any[]> {
  const models = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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
          response_format: { type: "json_object" },
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

  throw new Error(lastError || "All Groq models failed.");
}

// 3. OpenRouter API Provider (Supports free & open-source vision models)
async function tryOpenRouter(apiKey: string, dataUri: string): Promise<any[]> {
  const models = [
    "meta-llama/llama-3.2-11b-vision-instruct:free",
    "google/gemini-flash-1.5-exp:free",
    "qwen/qwen-2-vl-72b-instruct:free",
  ];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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

    // Provider Keys
    const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyBcqiqjMmBF6mNIjRjHffZvHwx8gOu4Qvg";
    const groqKey = process.env.GROQ_API_KEY || "";
    const openrouterKey = process.env.OPENROUTER_API_KEY || "";

    let rawSeekers: any[] = [];
    let providerUsed = "";
    const errors: string[] = [];

    // 1. Try Gemini
    if (geminiKey) {
      try {
        console.log("Attempting OCR with Google Gemini API...");
        rawSeekers = await tryGemini(geminiKey, base64Data, mimeType);
        providerUsed = "Google Gemini";
      } catch (err: any) {
        errors.push(`Gemini: ${err.message}`);
      }
    }

    // 2. Try Groq (Free Fallback)
    if (rawSeekers.length === 0 && groqKey) {
      try {
        console.log("Attempting OCR with Groq Cloud Vision API fallback...");
        rawSeekers = await tryGroq(groqKey, dataUri);
        providerUsed = "Groq Cloud (Llama 3.2 Vision)";
      } catch (err: any) {
        errors.push(`Groq: ${err.message}`);
      }
    }

    // 3. Try OpenRouter (Free / Open Vision models)
    if (rawSeekers.length === 0 && openrouterKey) {
      try {
        console.log("Attempting OCR with OpenRouter Vision fallback...");
        rawSeekers = await tryOpenRouter(openrouterKey, dataUri);
        providerUsed = "OpenRouter Vision";
      } catch (err: any) {
        errors.push(`OpenRouter: ${err.message}`);
      }
    }

    // If all configured providers failed
    if (rawSeekers.length === 0) {
      console.error("All OCR providers failed:", errors);
      const combinedError = errors.join(" | ") || "No OCR provider keys configured or all providers returned an error.";
      return NextResponse.json(
        {
          status: 500,
          message: `Scan failed. ${combinedError}. Please verify your GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY in Vercel environment variables.`,
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

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ status: 400, message: "No image data provided" }, { status: 400 });
    }

    // Extract raw base64 data and mime type
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBcqiqjMmBF6mNIjRjHffZvHwx8gOu4Qvg";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an OCR scanner for Sahaja Yoga seeker registration sheets. Extract seeker records from the provided image into a JSON array of objects. 
For each seeker, extract exactly:
- 'name' (string)
- 'phone' (string, extract 10-digit mobile number, format as pure digits without spaces or country code e.g. "9876543210")
- 'city' (string)
- 'email' (string, optional, empty if not legible or not present)
- 'preferredLanguage' (string, optional, e.g. English, Telugu, Hindi, Odia)
- 'notes' (string, brief description or 'OCR Scanned')

Return ONLY a valid JSON array matching this structure. Do NOT include markdown code blocks, do NOT include backticks, and do NOT include any other text output.`
              },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No text response from Gemini model");
    }

    let seekers = [];
    try {
      // Clean up text if markdown backticks were returned despite the prompt
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      seekers = JSON.parse(cleanedText);
      // Ensure each seeker has a unique local ID
      seekers = seekers.map((s: any, index: number) => ({
        id: `ocr-${Date.now()}-${index}`,
        name: s.name || "Unknown Seeker",
        phone: s.phone || "",
        city: s.city || "Hyderabad",
        email: s.email || "",
        preferredLanguage: s.preferredLanguage || "English",
        notes: s.notes || "OCR Scanned"
      }));
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      throw new Error("Gemini did not return a valid JSON array.");
    }

    return NextResponse.json({
      status: 200,
      data: seekers
    }, { status: 200 });
  } catch (error: any) {
    console.error("OCR server route error:", error);
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

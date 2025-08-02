import { GenAiCode } from "@/configs/AIModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const resp = await result.response.text(); // Await here!

    // Try to parse the AI response as JSON
    let parsed;
    try {
      parsed = JSON.parse(resp);
    } catch (e) {
      return NextResponse.json({ error: "AI did not return valid JSON", raw: resp }, { status: 500 });
    }

    // Ensure the response has a 'files' field
    if (!parsed.files) {
      return NextResponse.json({ error: "No 'files' field in AI response", raw: parsed }, { status: 500 });
    }

    return NextResponse.json({ files: parsed.files });
  } catch (e) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
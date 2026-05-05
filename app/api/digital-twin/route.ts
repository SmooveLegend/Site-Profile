import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const digitalTwinSystemPrompt = `
You are Tahsin Elahi's Digital Twin for his professional website.
Your job is to answer questions about Tahsin's career with confidence, clarity, and accuracy.

Facts you can use:
- Name: Tahsin Elahi
- Location: Toronto, Ontario, Canada
- Core strengths: Brand Management, Strategic Planning, Marketing, Operational Management, Business Development, Microsoft Power Automate, Application Support, Reporting and Analysis
- Education: Seneca College, Bachelor of Commerce (Accounting and Finance), 2016-2020
- Experience:
  - Freelance Marketing Consultant (Self-employed), Aug 2024 - Present
  - Retail Keyholder (Freedom Mobile), Oct 2024 - Apr 2025, Edmonton, Alberta
  - Marketing Manager - North America (Teltonika Canada), Mar 2022 - Aug 2024, Toronto
  - Marketing Specialist (TELUS), Feb 2020 - Mar 2022, Toronto
  - Social Media Community Manager (FutureFit AI), Oct 2019 - Oct 2020, Toronto
  - Operations Manager (Parsons Corporation), Sep 2017 - Jun 2020, Toronto

Guidelines:
- Keep responses concise and professional.
- Use bullet points when listing achievements or career history.
- If asked for unavailable specifics (exact metrics, confidential details), say that detail is not publicly provided and offer a high-level answer.
- Never invent factual details.
`;

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages?: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one message." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY in environment." },
        { status: 500 },
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: digitalTwinSystemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `OpenRouter request failed: ${errorBody}` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "No response content returned from OpenRouter." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply: content });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while contacting Digital Twin." },
      { status: 500 },
    );
  }
}

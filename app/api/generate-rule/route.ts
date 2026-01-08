import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = `
You generate ONE daily rule for a thoughtful adult.

Tone rules:
- Calm, direct, serious
- No motivational clichés
- No emojis
- No hustle culture

Structure:
1. Inspired by a real historical figure.
2. One rule (one sentence).
3. Short explanation (2–3 sentences).

Output format:

Inspired by: [Name]

Rule:
[One sentence]

Explanation:
[2–3 sentences]
`;

export async function POST(req: Request) {
  const isVercelCron =
    process.env.VERCEL === "1" &&
    req.headers.get("user-agent")?.includes("vercel");

  if (!isVercelCron) {
    return new Response("Unauthorized", { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.rule.findUnique({
    where: { date: today }
  });
  if (existing) return NextResponse.json(existing);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }]
  });

  const text = completion.choices[0].message?.content ?? "";

  const inspiredBy = text.match(/Inspired by:\s*(.*)/)?.[1] ?? "";
  const rule =
    text.match(/Rule:\s*([\s\S]*?)\n\nExplanation:/)?.[1]?.trim() ?? "";
  const explanation = text.split("Explanation:")[1]?.trim() ?? "";

  const saved = await prisma.rule.create({
    data: { date: today, rule, explanation, inspiredBy }
  });

  return NextResponse.json(saved);
}

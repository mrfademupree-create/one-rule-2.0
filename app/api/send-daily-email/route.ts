import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) return new Response("Unauthorized", { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rule = await prisma.rule.findUnique({ where: { date: today } });
  if (!rule) return new Response("No rule yet");

  await resend.emails.send({
    from: "One Rule <onrule@yourdomain.com>",
    to: process.env.DAILY_EMAIL!,
    subject: "One Rule for Today",
    html: `<p><em>Inspired by ${rule.inspiredBy}</em></p><h2>${rule.rule}</h2><p>${rule.explanation}</p><p style="opacity:0.6">Carry this rule quietly.</p>`
  });

  return new Response("Sent");
}
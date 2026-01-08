import { prisma } from "@/lib/prisma";

export default async function Home() {
  const rule = await prisma.rule.findFirst({ orderBy: { date: "desc" } });

  return (
    <main style={{ maxWidth: 640, margin: "96px auto", padding: "0 16px", fontFamily: "Georgia, serif" }}>
      <h1 style={{ fontSize: 40 }}>One Rule</h1>
      <p style={{ opacity: 0.7, marginBottom: 48 }}>One serious rule per day. No noise.</p>
      {rule && (
        <>
          <p><em>Inspired by {rule.inspiredBy}</em></p>
          <h2 style={{ fontSize: 28 }}>{rule.rule}</h2>
          <p>{rule.explanation}</p>
        </>
      )}
      <p style={{ marginTop: 64, opacity: 0.5 }}>Updated daily.</p>
    </main>
  );
}
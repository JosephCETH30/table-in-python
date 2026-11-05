import { toSheetRow } from "@/lib/sheet-columns";

export async function POST(request: Request) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return Response.json({ error: "SHEETS_WEBHOOK_URL not set" }, { status: 500 });

  const data = await request.json().catch(() => null);
  if (!data || typeof data !== "object") return Response.json({ error: "bad body" }, { status: 400 });

  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // Apps Script rejects JSON preflight
    body: JSON.stringify(toSheetRow(data)),
  });
  // Apps Script answers 200 with an HTML error page when doPost throws, so check the body.
  const text = await upstream.text();
  if (!upstream.ok || text.trim() !== "ok") {
    console.error("[sheets] write failed:", upstream.status, text.slice(0, 500));
    return Response.json({ error: "sheet write failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}

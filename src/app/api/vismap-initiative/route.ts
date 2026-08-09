import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ASPECTS, type Aspect } from "@/vismap/v2/aspectData.generated";

export const runtime = "nodejs";

const MAX_TEXT_CHARS = 500;

/**
 * Auto-mapping inisiatif/goal (teks bebas) -> aspek KB (13 aspek kompetensi
 * Vismap V2) + skor minimum yang dibutuhkan per aspek, pakai Claude.
 * Dipakai VismapV2's fitur "Initiatives": user menulis goal, sistem
 * menerjemahkannya jadi syarat kompetensi, lalu dicocokkan ke skor aspek
 * partisipan (client-side, lihat computeInitiativeSuccess di initiatives.ts)
 * untuk menghasilkan % kemungkinan berhasil.
 */
const SYSTEM_PROMPT = `Kamu menerjemahkan satu inisiatif/goal kerja (teks bebas, Bahasa Indonesia atau Inggris) menjadi aspek kompetensi perilaku yang relevan beserta skor minimum yang dibutuhkan (skala 1-5) supaya orang tersebut punya peluang besar berhasil menjalankannya.

Aspek yang TERSEDIA (pilih HANYA dari daftar ini, tulis persis sama):
${ASPECTS.map(a => `- ${a}`).join("\n")}

Aturan:
- Pilih 2-4 aspek yang paling relevan dengan inisiatif tersebut. Jangan pilih semua aspek.
- minScore = skor minimum (1-5, boleh desimal .5) yang wajar dibutuhkan pada aspek itu untuk berhasil. Inisiatif yang menuntut/ambisius butuh minScore lebih tinggi (4-5); inisiatif ringan cukup 2.5-3.5.
- Selalu keluarkan lewat tool call "map_initiative", jangan menjawab dengan teks biasa.`;

const TOOL = {
  name: "map_initiative",
  description: "Petakan inisiatif ke aspek kompetensi relevan + skor minimum yang dibutuhkan.",
  input_schema: {
    type: "object" as const,
    properties: {
      aspects: {
        type: "array" as const,
        minItems: 2,
        maxItems: 4,
        items: {
          type: "object" as const,
          properties: {
            aspect: { type: "string" as const, enum: [...ASPECTS] },
            minScore: { type: "number" as const, minimum: 1, maximum: 5 },
          },
          required: ["aspect", "minScore"],
        },
      },
    },
    required: ["aspects"],
  },
};

export async function POST(req: NextRequest) {
  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
  if (text.length > MAX_TEXT_CHARS) {
    return NextResponse.json({ error: `text must be under ${MAX_TEXT_CHARS} chars` }, { status: 400 });
  }

  try {
    const anthropic = new Anthropic();
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "map_initiative" },
      messages: [{ role: "user", content: `Inisiatif: "${text}"` }],
    });

    const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    const input = toolUse?.input as { aspects?: { aspect: string; minScore: number }[] } | undefined;
    const rawAspects = input?.aspects ?? [];

    // Validasi ulang di server — jangan percaya mentah-mentah nama aspek/angka dari model.
    const aspects = rawAspects
      .filter((a): a is { aspect: Aspect; minScore: number } => ASPECTS.includes(a.aspect as Aspect))
      .map(a => ({ aspect: a.aspect, minScore: Math.max(1, Math.min(5, Number(a.minScore) || 3)) }))
      .slice(0, 4);

    if (aspects.length === 0) {
      return NextResponse.json({ error: "Model returned no valid aspects" }, { status: 502 });
    }

    return NextResponse.json({ aspects });
  } catch (err) {
    console.error("[vismap-initiative] mapping failed:", err);
    return NextResponse.json({ error: "Mapping failed" }, { status: 502 });
  }
}

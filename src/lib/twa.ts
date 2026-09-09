export async function callAI(system: string, prompt: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, prompt }),
  });
  if (!res.ok) {
    throw new Error((await res.text()) || "Request failed");
  }
  const data = (await res.json()) as { text?: string };
  return (data.text ?? "").trim();
}

export function splitSections(text: string, headings: string[]): string[] {
  // Split model output into chunks by known heading keywords.
  const lower = text.toLowerCase();
  const marks = headings.map((h) => ({ h, i: lower.indexOf(h.toLowerCase()) }));
  if (marks.some((m) => m.i < 0)) return headings.map((_, idx) => (idx === 0 ? text : ""));
  return marks.map((m, idx) => {
    const end = idx + 1 < marks.length ? marks[idx + 1].i : text.length;
    return text.slice(m.i, end).trim();
  });
}

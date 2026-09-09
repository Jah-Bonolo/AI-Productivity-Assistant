import { createFileRoute } from "@tanstack/react-router";

type Body = { system?: string; prompt?: string };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { system, prompt } = (await request.json()) as Body;
        if (!prompt || typeof prompt !== "string") {
          return new Response("Prompt is required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-6-astra",
            input: [
              ...(system
                ? [{ role: "system", content: [{ type: "input_text", text: system }] }]
                : []),
              { role: "user", content: [{ type: "input_text", text: prompt }] },
            ],
            stream: true,
            reasoning: { effort: "low", summary: "auto" },
          }),
        });

        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => "");
          const message =
            res.status === 429
              ? "Too many requests right now. Please try again in a moment."
              : res.status === 402
                ? "AI credits are exhausted for this workspace."
                : detail || "The AI service failed.";
          return new Response(message, { status: res.status || 500 });
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let text = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload);
              if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                text += evt.delta;
              } else if (evt.type === "response.completed" && !text) {
                text = evt.response?.output_text ?? "";
              }
            } catch {
              /* ignore partial frames */
            }
          }
        }

        return new Response(JSON.stringify({ text }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

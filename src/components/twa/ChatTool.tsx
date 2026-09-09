import { Loader2, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { callAI } from "@/lib/twa";

const SYSTEM = `You are TWA Assistant, the workplace AI companion of THE WORKING AI. Be concise, practical and professional. Use short paragraphs and bullets. Flag uncertainty rather than guessing.`;

const CHIPS = [
  "Help me prepare for a performance review",
  "Draft a polite follow-up to a late client",
  "Give me an agenda for a 30-minute stand-up",
  "How do I prioritise a overloaded week?",
];

type Msg = { role: "user" | "assistant"; content: string };

export function ChatTool() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const transcript = next
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      const reply = await callAI(SYSTEM, `${transcript}\n\nAssistant:`);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The assistant could not reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">AI Chatbot</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Ask anything about your workday — TWA answers in context.
        </p>
      </header>

      <Card className="flex h-[60vh] flex-col gap-0 overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Start a conversation, or tap a suggestion below.
            </p>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            ),
          )}
          {loading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-border space-y-3 border-t p-4">
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => send(c)}
                className="border-border bg-secondary text-muted-foreground hover:text-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={2}
              placeholder="Message TWA Assistant…"
              className="resize-none"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

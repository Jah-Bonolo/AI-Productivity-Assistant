import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OutputCard } from "./OutputCard";
import { ToolShell } from "./ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { callAI, splitSections } from "@/lib/twa";

const SYSTEM = `You are a research analyst for THE WORKING AI (TWA). Output exactly these three sections, each heading on its own line:
Executive Summary
Key Insights
Actionable Recommendations
Be factual, flag uncertainty, and never invent statistics or citations.`;

export function ResearchTool() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [depth, setDepth] = useState<"Brief Overview" | "Deep Dive">("Brief Overview");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState("");
  const [recs, setRecs] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a research topic first.");
      return;
    }
    setLoading(true);
    try {
      const text = await callAI(
        SYSTEM,
        `Topic: ${topic}\nDepth: ${depth}${context ? `\nContext: ${context}` : ""}`,
      );
      const [a, b, c] = splitSections(text, [
        "Executive Summary",
        "Key Insights",
        "Actionable Recommendations",
      ]);
      setSummary(a ?? text);
      setInsights(b ?? "");
      setRecs(c ?? "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="AI Research Assistant"
      subtitle="Condense any topic into a summary, insights, and next moves."
      inputs={
        <>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI adoption in South African retail"
            />
          </div>
          <div className="space-y-2">
            <Label>Depth</Label>
            <div className="bg-secondary grid grid-cols-2 gap-1 rounded-lg p-1">
              {(["Brief Overview", "Deep Dive"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDepth(d)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    depth === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (optional)</Label>
            <Textarea
              id="context"
              rows={5}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Who is this for, and what decision does it support?"
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <Search className="h-4 w-4" />
            {loading ? "Researching…" : "Run research"}
          </Button>
        </>
      }
      outputs={
        <>
          <OutputCard
            title="Executive summary"
            value={summary}
            onChange={setSummary}
            loading={loading}
            minRows={6}
          />
          <OutputCard
            title="Key insights"
            value={insights}
            onChange={setInsights}
            loading={loading}
            minRows={8}
          />
          <OutputCard
            title="Actionable recommendations"
            value={recs}
            onChange={setRecs}
            loading={loading}
            minRows={8}
          />
        </>
      }
    />
  );
}

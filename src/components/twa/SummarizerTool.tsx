import { Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OutputCard } from "./OutputCard";
import { ToolShell } from "./ToolShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { callAI, splitSections } from "@/lib/twa";

const SYSTEM = `You are an AI meeting assistant for THE WORKING AI (TWA). Analyze raw meeting notes and output exactly these three sections, each starting with the heading on its own line:
Executive Summary
Action Items & Assignees
Decisions & Deadlines
Use 2-3 concise sentences for the summary, bulleted lists with names for action items, and bullets with specific dates for decisions.`;

export function SummarizerTool() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [actions, setActions] = useState("");
  const [decisions, setDecisions] = useState("");

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Paste your raw meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const text = await callAI(SYSTEM, `Raw Notes:\n${notes}`);
      const [a, b, c] = splitSections(text, ["Executive Summary", "Action Items", "Decisions"]);
      setSummary(a ?? text);
      setActions(b ?? "");
      setDecisions(c ?? "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Meeting Notes Summarizer"
      subtitle="Turn messy notes into a summary, owned actions, and dated decisions."
      inputs={
        <>
          <div className="space-y-2">
            <Label htmlFor="notes">Raw meeting notes</Label>
            <Textarea
              id="notes"
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste the transcript or your rough notes here…"
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <Wand2 className="h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </>
      }
      outputs={
        <>
          <OutputCard
            title="Key summary"
            value={summary}
            onChange={setSummary}
            loading={loading}
            minRows={6}
          />
          <OutputCard
            title="Action items & owners"
            value={actions}
            onChange={setActions}
            loading={loading}
            minRows={7}
          />
          <OutputCard
            title="Decisions & deadlines"
            value={decisions}
            onChange={setDecisions}
            loading={loading}
            minRows={7}
          />
        </>
      }
    />
  );
}

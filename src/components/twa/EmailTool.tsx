import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OutputCard } from "./OutputCard";
import { ToolShell } from "./ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { callAI } from "@/lib/twa";

const SYSTEM = `You are an executive communications assistant for THE WORKING AI (TWA).
Format output strictly as:
Subject Line: [Insert Clear Subject]
Body: [Insert Email Body]
Call to Action: [Insert Clear Next Step]`;

export function EmailTool() {
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Formal");
  const [points, setPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!recipient.trim() || !points.trim()) {
      toast.error("Add a recipient and your key points first.");
      return;
    }
    setLoading(true);
    try {
      const text = await callAI(
        SYSTEM,
        `Draft a professional email based on these inputs:\n- Recipient: ${recipient}\n- Tone: ${tone}\n- Core Points: ${points}`,
      );
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Smart Email Generator"
      subtitle="Draft polished, on-tone emails in seconds — then edit before sending."
      inputs={
        <>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Head of Operations, Thandi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Topic / key points</Label>
            <Textarea
              id="points"
              rows={7}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Reschedule Thursday review, share Q3 numbers, ask for budget sign-off…"
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <Send className="h-4 w-4" />
            {loading ? "Drafting…" : "Generate email"}
          </Button>
        </>
      }
      outputs={
        <OutputCard
          title="Drafted email"
          value={output}
          onChange={setOutput}
          loading={loading}
          minRows={16}
        />
      }
    />
  );
}

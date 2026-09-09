import { CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { OutputCard } from "./OutputCard";
import { ToolShell } from "./ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { callAI } from "@/lib/twa";

const SYSTEM = `You are a productivity coach for THE WORKING AI (TWA). Convert tasks into an optimized time-blocked daily schedule.
Return ONLY schedule rows, one per line, in this exact pipe format and nothing else:
Time Slot | Task Name | Priority | Estimated Duration
Priority must be exactly High, Medium or Low. Group high-cognitive tasks in peak energy hours and include short breaks.`;

type Block = { time: string; task: string; priority: string; duration: string };

function parseBlocks(text: string): Block[] {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[-*\d.\s]+/, ""))
    .filter((line) => line.includes("|"))
    .map((line) => line.split("|").map((p) => p.trim()))
    .filter((parts) => parts.length >= 3 && !/^time slot$/i.test(parts[0] ?? ""))
    .map((parts) => ({
      time: parts[0] ?? "",
      task: parts[1] ?? "",
      priority: parts[2] ?? "Medium",
      duration: parts[3] ?? "",
    }));
}

const priorityClass = (p: string) => {
  const k = p.toLowerCase();
  if (k.startsWith("high")) return "bg-destructive/15 text-destructive border-destructive/30";
  if (k.startsWith("low")) return "bg-secondary text-muted-foreground border-border";
  return "bg-primary/15 text-primary border-primary/30";
};

export function PlannerTool() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("09:00 - 17:00");
  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState("");

  const blocks = useMemo(() => parseBlocks(raw), [raw]);

  const generate = async () => {
    if (!tasks.trim()) {
      toast.error("List your goals and tasks first.");
      return;
    }
    setLoading(true);
    try {
      const text = await callAI(
        SYSTEM,
        `- Task List & Goals:\n${tasks}\n- Shift Duration / Working Hours: ${hours}`,
      );
      setRaw(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="AI Task Planner"
      subtitle="Prioritise your day with a time-blocked schedule built around your energy."
      inputs={
        <>
          <div className="space-y-2">
            <Label htmlFor="tasks">Goals & tasks</Label>
            <Textarea
              id="tasks"
              rows={10}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Finish client proposal, 3 interviews, review budget, gym…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Working hours</Label>
            <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <CalendarClock className="h-4 w-4" />
            {loading ? "Planning…" : "Build my schedule"}
          </Button>
        </>
      }
      outputs={
        <>
          {blocks.length > 0 && !loading && (
            <Card className="gap-2 p-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase">Today's plan</h3>
              <ul className="divide-border divide-y">
                {blocks.map((b, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-muted-foreground font-mono text-xs">{b.time}</p>
                      <p className="truncate font-medium">{b.task}</p>
                      {b.duration && <p className="text-muted-foreground text-xs">{b.duration}</p>}
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClass(b.priority)}`}
                    >
                      {b.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <OutputCard
            title="Editable schedule"
            value={raw}
            onChange={setRaw}
            loading={loading}
            minRows={12}
            placeholder="Your time-blocked schedule appears here — edit any row and the plan updates."
          />
        </>
      }
    />
  );
}

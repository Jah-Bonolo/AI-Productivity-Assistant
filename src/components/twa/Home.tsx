import {
  ArrowRight,
  Bot,
  CalendarClock,
  Clock3,
  Mail,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type HomeToolId = "email" | "notes" | "planner" | "research" | "chat";

const TOOLS: {
  id: HomeToolId;
  title: string;
  copy: string;
  icon: typeof Mail;
}[] = [
  {
    id: "email",
    title: "Smart Email Generator",
    copy: "Draft polished emails in seconds, with the tone you choose.",
    icon: Mail,
  },
  {
    id: "notes",
    title: "Meeting Notes Summarizer",
    copy: "Turn raw notes into decisions, owners and action items.",
    icon: NotebookPen,
  },
  {
    id: "planner",
    title: "AI Task Planner",
    copy: "Prioritise your day with a time-blocked, energy-aware schedule.",
    icon: CalendarClock,
  },
  {
    id: "research",
    title: "AI Research Assistant",
    copy: "Get an executive summary, insights and next moves on any topic.",
    icon: Search,
  },
  {
    id: "chat",
    title: "AI Chatbot",
    copy: "Ask anything about your workday and get practical answers.",
    icon: Bot,
  },
];

const STATS = [
  { icon: Clock3, value: "8.5h", label: "Hours saved per week" },
  { icon: Zap, value: "12×", label: "Faster response time" },
  { icon: ShieldCheck, value: "100%", label: "Editable & private" },
];

export function Home({ onOpen }: { onOpen: (id: HomeToolId) => void }) {
  return (
    <div className="space-y-8">
      <section className="bg-hero border-border shadow-elegant relative overflow-hidden rounded-2xl border p-8 md:p-12">
        <span className="border-border bg-background/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          <Sparkles className="text-primary h-3.5 w-3.5" />
          Powered by AI
        </span>
        <h2 className="mt-5 max-w-2xl text-3xl leading-tight font-black tracking-tight md:text-5xl">
          Your <span className="text-brand-gradient">AI workplace</span> assistant
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl text-sm md:text-base">
          Automate emails, summarize meetings, plan your week and research smarter — all from
          one beautifully simple workspace.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={() => onOpen("email")} className="bg-brand-gradient shadow-elegant">
            Start with email <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => onOpen("chat")}>
            Open AI chat
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <div className="bg-accent text-accent-foreground grid h-11 w-11 shrink-0 place-items-center rounded-xl">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-muted-foreground truncate text-xs">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Productivity tools</h3>
          <p className="text-muted-foreground text-sm">Pick a tool to get started.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((t) => (
            <Card
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(t.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(t.id);
                }
              }}
              className="hover:border-primary/50 hover:shadow-elegant cursor-pointer gap-3 p-5 transition-all"
            >
              <div className="bg-brand-gradient text-primary-foreground grid h-11 w-11 place-items-center rounded-xl">
                <t.icon className="h-5 w-5" />
              </div>
              <h4 className="font-semibold tracking-tight">{t.title}</h4>
              <p className="text-muted-foreground text-sm">{t.copy}</p>
              <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                Open tool <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

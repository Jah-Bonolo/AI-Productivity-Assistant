import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Building2,
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

import { ChatTool } from "@/components/twa/ChatTool";
import { EmailTool } from "@/components/twa/EmailTool";
import { Home, type HomeToolId } from "@/components/twa/Home";
import { PlannerTool } from "@/components/twa/PlannerTool";
import { ResearchTool } from "@/components/twa/ResearchTool";
import { SummarizerTool } from "@/components/twa/SummarizerTool";
import { ThemeToggle } from "@/components/twa/ThemeToggle";
import { Wordmark } from "@/components/twa/Wordmark";
import { WorkspacesTool } from "@/components/twa/WorkspacesTool";
import { AccountMenu } from "@/components/twa/AccountMenu";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE WORKING AI (TWA) — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "TWA is an AI workspace for drafting emails, summarising meetings, planning your day, researching topics and chatting with an assistant.",
      },
      { property: "og:title", content: "THE WORKING AI (TWA) — AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, plan your day and research faster — all in one AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const NAV = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "email", label: "Smart Email Generator", icon: Mail },
  { id: "notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { id: "planner", label: "AI Task Planner", icon: CalendarClock },
  { id: "research", label: "AI Research Assistant", icon: Search },
  { id: "chat", label: "AI Chatbot", icon: Bot },
  { id: "workplaces", label: "Connected Workplaces", icon: Building2 },
] as const;

type ViewId = (typeof NAV)[number]["id"];

function Dashboard() {
  const [active, setActive] = useState<ViewId>("home");
  const [navOpen, setNavOpen] = useState(false);

  const open = (id: ViewId) => {
    setActive(id);
    setNavOpen(false);
  };

  return (
    <div className="bg-background text-foreground min-h-screen md:flex">
      <aside
        className={`bg-sidebar text-sidebar-foreground border-sidebar-border md:sticky md:top-0 md:h-screen md:w-72 md:shrink-0 md:border-r ${
          navOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="border-sidebar-border border-b px-5 py-5">
          <Wordmark />
        </div>
        <nav className="space-y-1 p-3">
          <p className="text-muted-foreground px-3 py-2 text-[11px] font-semibold tracking-wider uppercase">
            Workspace
          </p>
          {NAV.map((t) => (
            <button
              key={t.id}
              onClick={() => open(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                active === t.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <t.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/80 sticky top-0 z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 backdrop-blur md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="border-border bg-secondary/60 text-muted-foreground flex min-w-0 items-center gap-2 justify-self-start rounded-full border px-3 py-1.5 text-xs">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">AI-generated content may require human review</span>
          </div>
          <div className="flex items-center gap-2 justify-self-end">
            <ThemeToggle />
            <AccountMenu />
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <h1 className="sr-only">THE WORKING AI dashboard</h1>
          {active === "home" && <Home onOpen={(id: HomeToolId) => open(id)} />}
          {active === "email" && <EmailTool />}
          {active === "notes" && <SummarizerTool />}
          {active === "planner" && <PlannerTool />}
          {active === "research" && <ResearchTool />}
          {active === "chat" && <ChatTool />}
          {active === "workplaces" && <WorkspacesTool />}
        </main>

        <footer className="border-border text-muted-foreground border-t px-4 py-4 text-center text-xs md:px-8">
          AI outputs are generated algorithmically and should be reviewed for accuracy before
          professional use.
        </footer>
      </div>
    </div>
  );
}

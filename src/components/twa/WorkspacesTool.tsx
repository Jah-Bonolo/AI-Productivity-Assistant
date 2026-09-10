import {
  Building2,
  Loader2,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { callAI } from "@/lib/twa";

type Workspace = {
  id: string;
  name: string;
  company: string;
  branch: string | null;
  location: string | null;
  description: string | null;
  join_code: string;
  created_by: string;
};

type Post = {
  id: string;
  title: string;
  body: string;
  category: string;
  author_id: string;
  created_at: string;
};

type Reply = {
  id: string;
  post_id: string;
  body: string;
  is_ai: boolean;
  author_id: string | null;
  created_at: string;
};

const SYSTEM = `You are TWA Advisor, an experienced business and operations consultant helping teams from different branches and companies work better together. Give concrete, practical advice in short paragraphs and bullets. Be specific about next steps, risks and who should own what. Never invent facts about the company.`;

export function WorkspacesTool() {
  const { user, displayName, loading: authLoading } = useAuth();
  const [directory, setDirectory] = useState<Workspace[]>([]);
  const [myIds, setMyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: ws }, { data: mem }] = await Promise.all([
      supabase.from("workspaces").select("*").order("created_at", { ascending: false }),
      supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id),
    ]);
    setDirectory((ws as Workspace[]) ?? []);
    setMyIds(((mem as { workspace_id: string }[]) ?? []).map((m) => m.workspace_id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  if (authLoading) {
    return <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Header />
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Sign in to create a workplace, join a branch with a code and talk with colleagues.
          </p>
        </Card>
      </div>
    );
  }

  const active = directory.find((w) => w.id === activeId) ?? null;

  if (active) {
    return (
      <WorkspaceRoom
        workspace={active}
        me={{ id: user.id, name: displayName ?? "Someone" }}
        onBack={() => setActiveId(null)}
      />
    );
  }

  const mine = directory.filter((w) => myIds.includes(w.id));
  const others = directory.filter((w) => !myIds.includes(w.id));

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <CreateWorkspace userId={user.id} onDone={load} />
          <JoinWorkspace userId={user.id} onDone={load} />
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase">Your workplaces</h3>
            {loading && <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />}
            {!loading && mine.length === 0 && (
              <p className="text-muted-foreground text-sm">
                You haven&apos;t joined a workplace yet. Create one or join with a code.
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {mine.map((w) => (
                <WorkspaceCard key={w.id} w={w} joined onOpen={() => setActiveId(w.id)} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Directory — other branches &amp; companies
            </h3>
            {others.length === 0 && (
              <p className="text-muted-foreground text-sm">No other workplaces listed yet.</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((w) => (
                <WorkspaceCard
                  key={w.id}
                  w={w}
                  onOpen={async () => {
                    const { error } = await supabase
                      .from("workspace_members")
                      .insert({ workspace_id: w.id, user_id: user.id });
                    if (error) toast.error(error.message);
                    else {
                      toast.success(`Joined ${w.name}`);
                      await load();
                      setActiveId(w.id);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h2 className="text-2xl font-bold tracking-tight">Connected Workplaces</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Link branches of your company — or partner companies — and solve business problems together
        with people and AI.
      </p>
    </header>
  );
}

function WorkspaceCard({
  w,
  joined,
  onOpen,
}: {
  w: Workspace;
  joined?: boolean;
  onOpen: () => void;
}) {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-start gap-3">
        <div className="bg-brand-gradient text-primary-foreground grid h-9 w-9 shrink-0 place-items-center rounded-lg">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{w.name}</p>
          <p className="text-muted-foreground truncate text-xs">
            {w.company}
            {w.branch ? ` — ${w.branch}` : ""}
            {w.location ? ` · ${w.location}` : ""}
          </p>
        </div>
      </div>
      {w.description && (
        <p className="text-muted-foreground line-clamp-2 text-xs">{w.description}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        {joined ? (
          <Badge variant="secondary" className="text-[10px]">
            Code {w.join_code}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-[11px]">Open to connect</span>
        )}
        <Button size="sm" variant={joined ? "default" : "outline"} onClick={onOpen}>
          {joined ? "Open" : "Join"}
        </Button>
      </div>
    </Card>
  );
}

function CreateWorkspace({ userId, onDone }: { userId: string; onDone: () => Promise<void> }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    branch: "",
    location: "",
    description: "",
  });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!form.name.trim() || !form.company.trim()) {
      toast.error("Add a workplace name and company.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("workspaces")
      .insert({
        name: form.name.trim(),
        company: form.company.trim(),
        branch: form.branch.trim() || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        created_by: userId,
      })
      .select("id, join_code")
      .single();
    if (error || !data) {
      toast.error(error?.message ?? "Could not create the workplace.");
      setBusy(false);
      return;
    }
    await supabase
      .from("workspace_members")
      .insert({ workspace_id: data.id, user_id: userId, role: "owner" });
    toast.success(`Workplace created — invite code ${data.join_code}`);
    setForm({ name: "", company: "", branch: "", location: "", description: "" });
    await onDone();
    setBusy(false);
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <h3 className="text-sm font-semibold">Create a workplace</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="ws-name">Workplace name</Label>
          <Input
            id="ws-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Sandton Operations"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="ws-company">Company</Label>
            <Input
              id="ws-company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Acme Group"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ws-branch">Branch</Label>
            <Input
              id="ws-branch"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              placeholder="Head office"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ws-location">Location</Label>
          <Input
            id="ws-location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Johannesburg"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ws-desc">What is this space for?</Label>
          <Textarea
            id="ws-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Sharing sales tactics between branches."
          />
        </div>
        <Button onClick={submit} disabled={busy} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create workplace
        </Button>
      </div>
    </Card>
  );
}

function JoinWorkspace({ userId, onDone }: { userId: string; onDone: () => Promise<void> }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const join = async () => {
    const value = code.trim().toUpperCase();
    if (!value) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("workspaces")
      .select("id, name")
      .eq("join_code", value)
      .maybeSingle();
    if (error || !data) {
      toast.error("No workplace found with that code.");
      setBusy(false);
      return;
    }
    const { error: joinError } = await supabase
      .from("workspace_members")
      .insert({ workspace_id: data.id, user_id: userId });
    if (joinError && !joinError.message.includes("duplicate")) toast.error(joinError.message);
    else toast.success(`Joined ${data.name}`);
    setCode("");
    await onDone();
    setBusy(false);
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        <h3 className="text-sm font-semibold">Join with an invite code</h3>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 4F9K2A"
          className="uppercase"
        />
        <Button onClick={join} disabled={busy || !code.trim()}>
          Join
        </Button>
      </div>
    </Card>
  );
}

function WorkspaceRoom({
  workspace,
  me,
  onBack,
}: {
  workspace: Workspace;
  me: { id: string; name: string };
  onBack: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data: p } = await supabase
      .from("workspace_posts")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });
    const list = (p as Post[]) ?? [];
    setPosts(list);
    const { count } = await supabase
      .from("workspace_members")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id);
    setMemberCount(count ?? 0);
    if (list.length) {
      const { data: r } = await supabase
        .from("workspace_replies")
        .select("*")
        .in(
          "post_id",
          list.map((x) => x.id),
        )
        .order("created_at", { ascending: true });
      setReplies((r as Reply[]) ?? []);
    } else {
      setReplies([]);
    }
  }, [workspace.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const post = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Add a title and a message.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("workspace_posts").insert({
      workspace_id: workspace.id,
      author_id: me.id,
      title: title.trim(),
      body: body.trim(),
    });
    if (error) toast.error(error.message);
    else {
      setTitle("");
      setBody("");
      await load();
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> All workplaces
        </Button>
        <Badge variant="secondary" className="text-[11px]">
          <Users className="mr-1 h-3 w-3" /> {memberCount} member{memberCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="outline" className="text-[11px]">
          Invite code {workspace.join_code}
        </Badge>
      </div>

      <header>
        <h2 className="text-2xl font-bold tracking-tight">{workspace.name}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {workspace.company}
          {workspace.branch ? ` — ${workspace.branch}` : ""}
          {workspace.location ? ` · ${workspace.location}` : ""}
        </p>
      </header>

      <Card className="gap-3 p-5">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to discuss?"
        />
        <Textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share the situation, the numbers and what you need help with…"
        />
        <div className="flex justify-end">
          <Button onClick={post} disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Post to workplace
          </Button>
        </div>
      </Card>

      {posts.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No discussions yet — start the first one above.
        </p>
      )}

      <div className="space-y-4">
        {posts.map((p) => (
          <PostThread
            key={p.id}
            post={p}
            workspace={workspace}
            replies={replies.filter((r) => r.post_id === p.id)}
            me={me}
            onChanged={load}
          />
        ))}
      </div>
    </div>
  );
}

function PostThread({
  post,
  workspace,
  replies,
  me,
  onChanged,
}: {
  post: Post;
  workspace: Workspace;
  replies: Reply[];
  me: { id: string; name: string };
  onChanged: () => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(false);

  const reply = async () => {
    if (!text.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("workspace_replies")
      .insert({ post_id: post.id, author_id: me.id, body: text.trim() });
    if (error) toast.error(error.message);
    else {
      setText("");
      await onChanged();
    }
    setBusy(false);
  };

  const askAI = async () => {
    setAsking(true);
    try {
      const thread = replies
        .map((r) => `${r.is_ai ? "TWA Advisor" : "Colleague"}: ${r.body}`)
        .join("\n");
      const advice = await callAI(
        SYSTEM,
        `Workplace: ${workspace.name} (${workspace.company}${workspace.branch ? `, ${workspace.branch}` : ""}).\n\nDiscussion: ${post.title}\n${post.body}\n\n${thread}\n\nGive advice that helps this branch and its partner branches improve.`,
      );
      const { error } = await supabase
        .from("workspace_replies")
        .insert({ post_id: post.id, body: advice, is_ai: true, author_id: null });
      if (error) toast.error(error.message);
      else await onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The advisor could not reply.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <Card className="gap-4 p-5">
      <div>
        <h3 className="font-semibold">{post.title}</h3>
        <p className="mt-1 text-sm whitespace-pre-wrap">{post.body}</p>
      </div>

      {replies.length > 0 && (
        <div className="border-border space-y-3 border-l-2 pl-4">
          {replies.map((r) => (
            <div key={r.id} className="text-sm">
              <p
                className={`text-xs font-semibold ${r.is_ai ? "text-brand-gradient" : "text-muted-foreground"}`}
              >
                {r.is_ai ? "TWA Advisor" : r.author_id === me.id ? me.name : "Colleague"}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <Textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add your experience or advice…"
          className="resize-none"
        />
        <Button onClick={reply} disabled={busy || !text.trim()} variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" /> Reply
        </Button>
        <Button onClick={askAI} disabled={asking}>
          {asking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Ask AI
        </Button>
      </div>
    </Card>
  );
}

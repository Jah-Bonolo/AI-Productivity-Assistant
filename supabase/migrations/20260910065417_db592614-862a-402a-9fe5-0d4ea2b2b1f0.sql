
CREATE TABLE public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  branch text,
  location text,
  description text,
  join_code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_members TO authenticated;
GRANT ALL ON public.workspace_members TO service_role;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_workspace_member(_workspace_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = _workspace_id AND m.user_id = _user_id)
$$;

CREATE TABLE public.workspace_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'discussion',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_posts TO authenticated;
GRANT ALL ON public.workspace_posts TO service_role;
ALTER TABLE public.workspace_posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.workspace_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.workspace_posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  is_ai boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_replies TO authenticated;
GRANT ALL ON public.workspace_replies TO service_role;
ALTER TABLE public.workspace_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone signed in can browse workspaces" ON public.workspaces FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create workspaces" ON public.workspaces FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators update workspaces" ON public.workspaces FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators delete workspaces" ON public.workspaces FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Members visible to workspace members" ON public.workspace_members FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Users join workspaces" ON public.workspace_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users leave workspaces" ON public.workspace_members FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Members read posts" ON public.workspace_posts FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Members create posts" ON public.workspace_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Authors update posts" ON public.workspace_posts FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors delete posts" ON public.workspace_posts FOR DELETE TO authenticated USING (author_id = auth.uid());

CREATE POLICY "Members read replies" ON public.workspace_replies FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.workspace_posts p WHERE p.id = post_id AND public.is_workspace_member(p.workspace_id, auth.uid())));
CREATE POLICY "Members create replies" ON public.workspace_replies FOR INSERT TO authenticated WITH CHECK ((author_id = auth.uid() OR (is_ai AND author_id IS NULL)) AND EXISTS (SELECT 1 FROM public.workspace_posts p WHERE p.id = post_id AND public.is_workspace_member(p.workspace_id, auth.uid())));
CREATE POLICY "Authors delete replies" ON public.workspace_replies FOR DELETE TO authenticated USING (author_id = auth.uid());

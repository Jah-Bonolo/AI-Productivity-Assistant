import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function ToolShell({
  title,
  subtitle,
  inputs,
  outputs,
}: {
  title: string;
  subtitle: string;
  inputs: ReactNode;
  outputs: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <Card className="h-fit gap-4 p-5">{inputs}</Card>
        <div className="space-y-4">{outputs}</div>
      </div>
    </div>
  );
}

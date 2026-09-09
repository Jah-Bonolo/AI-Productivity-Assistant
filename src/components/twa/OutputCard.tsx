import { Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  title: string;
  value: string;
  onChange: (next: string) => void;
  loading?: boolean;
  placeholder?: string;
  minRows?: number;
};

export function OutputCard({
  title,
  value,
  onChange,
  loading = false,
  placeholder = "Your generated result will appear here — you can edit it freely.",
  minRows = 10,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="gap-3 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h3 className="truncate text-sm font-semibold tracking-wide text-foreground uppercase">
          {title}
        </h3>
        <Button size="sm" variant="secondary" onClick={copy} disabled={!value}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2 py-10 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating…
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          className="resize-y font-mono text-sm leading-relaxed"
        />
      )}
    </Card>
  );
}

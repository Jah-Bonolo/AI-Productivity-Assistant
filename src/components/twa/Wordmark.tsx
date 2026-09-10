import logo from "@/assets/twa-logo.png";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="bg-card border-border grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border p-1">
        <img
          src={logo}
          alt="THE WORKING AI monogram"
          width={44}
          height={44}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm leading-tight font-extrabold tracking-tight">
          THE <span className="text-brand-gradient">WORKING</span> AI
        </p>
        {!compact && (
          <p className="text-muted-foreground truncate text-[11px] tracking-wide">
            Work smarter, every single day
          </p>
        )}
      </div>
    </div>
  );
}

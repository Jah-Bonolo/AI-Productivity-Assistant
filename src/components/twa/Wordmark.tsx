export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="bg-brand-gradient shadow-elegant grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black tracking-tight text-white">
        TWA
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

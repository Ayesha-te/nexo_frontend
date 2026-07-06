import { ReactNode } from "react";
import { LucideIcon, Sparkles } from "lucide-react";

type PageShellProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
};

export const glassCardClass =
  "overflow-hidden rounded-2xl border-white/60 bg-white/60 shadow-[0_18px_50px_-38px_hsl(var(--nexo-dark)/0.55)] backdrop-blur-xl";

export function PageShell({ icon: Icon, title, description, children, maxWidth = "max-w-5xl" }: PageShellProps) {
  return (
    <div className="relative -m-4 overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_28%),radial-gradient(circle_at_88%_12%,hsl(var(--secondary)/0.18),transparent_24%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.55))] px-4 py-5 sm:px-6 md:-m-6 lg:px-8 animate-fade-in">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,hsl(var(--primary)/0.30)_1px,transparent_1px),radial-gradient(circle,hsl(var(--secondary)/0.24)_1px,transparent_1px)] [background-position:0_0,22px_28px] [background-size:48px_48px,68px_68px]" />
      <div className={`relative mx-auto min-w-0 space-y-6 ${maxWidth}`}>
        <section className="rounded-2xl border border-white/60 bg-white/55 p-4 shadow-[0_20px_60px_-38px_hsl(var(--nexo-dark)/0.48)] backdrop-blur-xl sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/15">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">
                <Sparkles className="h-3 w-3" />
                User panel
              </div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>
              {description ? <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p> : null}
            </div>
          </div>
        </section>
        {children}
      </div>
    </div>
  );
}

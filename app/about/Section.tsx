import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Section({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl3 border border-stroke bg-card shadow-soft backdrop-blur-xl shadow-inset my-5">
      <div className="flex items-center justify-between border-b border-stroke px-7 py-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-accent">
            {title.slice(0, 1)}
          </span>
          <div>
            <div className="text-xl font-extrabold text-text">{title}</div>
            {subtitle ? <div className="text-xs text-text/60">{subtitle}</div> : null}
          </div>
        </div>
        {right}
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex bg-green-800 items-center rounded-md border border-accent/30 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent", className)}>
      {children}
    </span>
  );
}

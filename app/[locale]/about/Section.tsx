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
    <section className="my-10 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 transition-all sm:p-12">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-slate-100 pb-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black text-white shadow-lg shadow-blue-600/20">
            {title.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {right && <div>{right}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-black tracking-widest text-slate-600 uppercase shadow-sm',
        className
      )}
    >
      {children}
    </span>
  );
}

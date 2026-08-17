import type { ReactNode } from "react";
import { Card } from "@/components/Card";

export default function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-5 select-none text-[72px] font-extrabold leading-none tracking-tight text-zinc-100"
      >
        {number}
      </span>
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-xs font-bold text-white shadow-md shadow-brand-500/30">
            {number}
          </span>
          <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            {icon}
          </span>
        </div>
        <h3 className="mt-5 text-base font-semibold text-zinc-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </Card>
  );
}

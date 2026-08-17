import type { ReactNode } from "react";
import { Card } from "@/components/Card";

export default function StatCard({
  icon,
  label,
  value,
  delta,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <Card className="p-5 transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          {icon}
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          {delta}
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-zinc-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </Card>
  );
}

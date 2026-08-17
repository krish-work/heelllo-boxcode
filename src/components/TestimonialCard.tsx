import { Card } from "@/components/Card";
import { StarIcon } from "@/components/icons";

export default function TestimonialCard({
  quote,
  name,
  role,
  initials,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
}) {
  return (
    <Card className="flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10">
      <div
        className="flex gap-0.5 text-amber-400"
        role="img"
        aria-label="Rated 5 out of 5 stars"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="size-4" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-7 text-zinc-700">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-xs font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">{name}</p>
          <p className="truncate text-xs text-zinc-500">{role}</p>
        </div>
      </div>
    </Card>
  );
}

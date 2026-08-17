import { cn } from "@/lib/utils";

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 shadow-md shadow-brand-500/30">
        <svg
          viewBox="0 0 20 20"
          className="size-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m7.5 6.5 3.5 3.5-3.5 3.5" />
          <path d="M12 13.5h2.5" />
        </svg>
      </span>
      <span
        className={cn(
          "text-[17px] font-bold tracking-tight",
          tone === "dark" ? "text-zinc-900" : "text-white"
        )}
      >
        Heelllo{" "}
        <span className={tone === "dark" ? "text-brand-600" : "text-brand-300"}>
          Boxcode
        </span>
      </span>
    </span>
  );
}

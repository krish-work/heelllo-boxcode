/**
 * Tiny className joiner — keeps class composition readable without
 * pulling in a dependency. Swap for clsx + tailwind-merge later if needed.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { MenuIcon, XIcon } from "@/components/icons";

type NavLink = {
  label: string;
  /** Section id to scroll to; null means "scroll back to top" (Home). */
  target: string | null;
};

const links: NavLink[] = [
  { label: "Home", target: null },
  { label: "Features", target: "features" },
  { label: "How It Works", target: "how-it-works" },
  { label: "Testimonials", target: "testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const scrollTo = (target: string) => {
    close();
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTop = () => {
    close();
    document
      .getElementById("landing-scroller")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClick = (target: string | null) =>
    target ? scrollTo(target) : scrollTop();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/70 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={scrollTop}
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          aria-label="Back to top"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleClick(link.target)}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {link.label}
            </button>
          ))}
          <Button href="/dashboard" size="sm" className="ml-2">
            Get Started
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid size-10 place-items-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleClick(link.target)}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                {link.label}
              </button>
            ))}
            <Button href="/dashboard" onClick={close} className="mt-2 w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

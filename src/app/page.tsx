import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import FeatureCard from "@/components/FeatureCard";
import StepCard from "@/components/StepCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/Button";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  QuoteIcon,
  SparklesIcon,
} from "@/components/icons";
import { features, steps, testimonials } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex h-svh flex-col">
      <Navbar />

      <main
        id="landing-scroller"
        className="snap-scroller h-svh snap-y snap-mandatory overflow-y-scroll overscroll-contain"
      >
        {/* ------------------------------- Hero ------------------------------- */}
        <section className="relative flex h-svh snap-start items-center justify-center overflow-hidden">
          <div aria-hidden className="absolute inset-0">
            <div className="absolute left-1/2 top-[-10%] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-brand-200/50 blur-[130px]" />
            <div className="absolute bottom-[-15%] left-[8%] h-[320px] w-[320px] rounded-full bg-violet-200/50 blur-[110px]" />
            <div className="absolute right-[6%] top-[25%] h-[260px] w-[260px] rounded-full bg-sky-200/40 blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-700">
                <SparklesIcon className="size-3.5" />
                Now in beta — free for small teams
              </span>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
                Heelllo{" "}
                <span className="bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Boxcode
                </span>
              </h1>
            </Reveal>

            <Reveal delay={240}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
                The friendly workspace for shipping software — plan, build, and
                launch your next project from one place.
              </p>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" href="/dashboard">
                  Get Started
                </Button>
                <Button size="lg" variant="secondary" href="/dashboard">
                  View the demo <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </Reveal>

            <Reveal delay={480}>
              <div className="mt-16 flex flex-col items-center gap-2 text-zinc-400">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Scroll to explore
                </span>
                <ChevronDownIcon className="size-5 animate-bounce" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------- Features ----------------------------- */}
        <section
          id="features"
          className="flex min-h-svh snap-start items-center bg-zinc-50/80 py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                Features
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Everything you need to ship faster
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Placeholder copy describing what the tool does — swap in your
                real value props later.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <Reveal key={feature.id} delay={i * 100} className="h-full">
                  <FeatureCard
                    icon={<feature.icon className="size-5" />}
                    title={feature.title}
                    description={feature.description}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- How It Works --------------------------- */}
        <section
          id="how-it-works"
          className="flex min-h-svh snap-start items-center bg-white py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                How it works
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                From idea to launch in three steps
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Placeholder copy walking through the product flow — make it your
                own later.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={step.id} delay={i * 120} className="h-full">
                  <StepCard
                    number={step.number}
                    icon={<step.icon className="size-5" />}
                    title={step.title}
                    description={step.description}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- Testimonials --------------------------- */}
        <section
          id="testimonials"
          className="flex min-h-svh snap-start items-center bg-zinc-50/80 py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                <QuoteIcon className="size-3.5" />
                Testimonials
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Loved by teams like yours
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Placeholder quotes from happy customers — swap in real ones when
                you have them.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 120} className="h-full">
                  <TestimonialCard
                    quote={t.quote}
                    name={t.name}
                    role={t.role}
                    initials={t.initials}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------- CTA -------------------------------- */}
        <section
          id="cta"
          className="relative flex h-svh snap-start items-center justify-center overflow-hidden bg-zinc-950"
        >
          <div aria-hidden className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/25 blur-[160px]" />
            <div className="absolute bottom-[-20%] right-[10%] h-[300px] w-[300px] rounded-full bg-violet-600/25 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Your next big thing starts here.
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                Sign in, invite your team, and ship your first project in
                minutes. No credit card required.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-10">
                <Button size="lg" href="/dashboard">
                  Enter App <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

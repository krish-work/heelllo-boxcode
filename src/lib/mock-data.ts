import type { ComponentType, SVGProps } from "react";
import {
  BoltIcon,
  ChartIcon,
  RocketIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/icons";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

/* ---------------------------------- Landing -------------------------------- */

export type Feature = {
  id: string;
  icon: SvgIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    id: "scaffolding",
    icon: BoltIcon,
    title: "Instant scaffolding",
    description:
      "Spin up a project from a template in seconds — config included, ceremony excluded.",
  },
  {
    id: "analytics",
    icon: ChartIcon,
    title: "Live analytics",
    description:
      "See traffic, signups, and conversions update in real time, no setup required.",
  },
  {
    id: "security",
    icon: ShieldIcon,
    title: "Secure by default",
    description:
      "Roles, SSO, and audit logs baked in. Your data stays yours, always.",
  },
  {
    id: "teams",
    icon: UsersIcon,
    title: "Built for teams",
    description:
      "Comments, approvals, and shared boards keep everyone moving in sync.",
  },
];

/* ---------------------------------- Chat ---------------------------------- */

export type ChatMessageSeed = {
  role: "bot" | "user";
  content: string;
};

export type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessageSeed[];
};

export const chatThreads: ChatThread[] = [
  {
    id: "thread-1",
    title: "Onboarding setup help",
    messages: [
      {
        role: "bot",
        content:
          "Hi! I can help you get set up. What would you like to configure first?",
      },
      {
        role: "user",
        content: "How do I invite teammates?",
      },
      {
        role: "bot",
        content:
          "Head to Team → Invite in the sidebar, then paste their email addresses. Each person gets a magic link to join your workspace.",
      },
    ],
  },
  {
    id: "thread-2",
    title: "API keys & secrets",
    messages: [
      {
        role: "bot",
        content: "I can help with API keys. What's the issue?",
      },
      {
        role: "user",
        content: "I rotated my key and now builds are failing.",
      },
      {
        role: "bot",
        content:
          "Update the new key under Project → Settings → Secrets, then redeploy. Old keys are invalidated immediately, so builds should recover on the next run.",
      },
    ],
  },
  {
    id: "thread-3",
    title: "Deploying to Vercel",
    messages: [
      {
        role: "bot",
        content: "Happy to help with Vercel deploys!",
      },
      {
        role: "user",
        content: "My preview deploy is stuck.",
      },
      {
        role: "bot",
        content:
          "Try hitting “Redeploy” from the deployment view. If it stays stuck, check the build log — the failing step is usually called out at the bottom.",
      },
    ],
  },
  {
    id: "thread-4",
    title: "Team permissions",
    messages: [
      {
        role: "bot",
        content: "Permission questions? Fire away.",
      },
      {
        role: "user",
        content: "Can members see all projects?",
      },
      {
        role: "bot",
        content:
          "By default, no — roles control visibility. Admins can adjust access per project under Settings → Members.",
      },
    ],
  },
  {
    id: "thread-5",
    title: "Billing questions",
    messages: [
      {
        role: "bot",
        content: "Billing questions are my favorite. What's up?",
      },
      {
        role: "user",
        content: "How does the free plan work?",
      },
      {
        role: "bot",
        content:
          "Free for up to 3 members and 5 projects — no credit card required. You can upgrade anytime from the Billing page.",
      },
    ],
  },
];

export const mockReplies: string[] = [
  "Sounds good — here's what I'd suggest: keep the first deploy small, then iterate. Happy to walk you through it step by step.",
  "Got it. That's a common one — the short answer is to try the New Chat flow and it should get you unstuck. I'll have the real docs wired in soon.",
  "Good question! Once the backend is connected, I'll answer from your real data. For now, this is a mock reply from the demo.",
  "That's on the roadmap 🚀 Anything else you'd like to explore while we're here?",
  "You're on the right track. Want me to summarize the key steps for you?",
];

export type Step = {
  id: string;
  number: string;
  icon: SvgIcon;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    id: "workspace",
    number: "01",
    icon: UsersIcon,
    title: "Create your workspace",
    description:
      "Sign up and invite your team in a couple of clicks. You'll be up and running before the coffee's done.",
  },
  {
    id: "build",
    number: "02",
    icon: BoltIcon,
    title: "Build your first project",
    description:
      "Start from a template or a blank canvas — scaffolding, config, and previews included.",
  },
  {
    id: "ship",
    number: "03",
    icon: RocketIcon,
    title: "Ship and iterate",
    description:
      "Deploy to production with one click and watch live analytics roll in as you iterate.",
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Heelllo Boxcode replaced three tools for us. Our team ships faster and actually enjoys the workspace.",
    name: "Priya Sharma",
    role: "Product Lead, Nimbus",
    initials: "PS",
  },
  {
    id: "t2",
    quote:
      "Setup took five minutes and the whole team was on board by lunch. The cleanest tool we've tried.",
    name: "Marcus Chen",
    role: "Founder, Loopstack",
    initials: "MC",
  },
  {
    id: "t3",
    quote:
      "It just gets out of the way. Planning, building, and shipping finally live in one calm place.",
    name: "Ana Torres",
    role: "Frontend Engineer, Deltaworks",
    initials: "AT",
  },
];

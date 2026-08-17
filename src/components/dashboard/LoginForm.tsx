"use client";

import { useState } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { login, signup, setToken, type User } from "@/lib/api";

type Mode = "login" | "signup";
type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

const inputBase =
  "h-11 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:ring-4 focus:ring-brand-500/10";

function Field({
  label,
  error,
  icon,
  rightSlot,
  className,
  ...rest
}: {
  label: string;
  error?: string;
  icon: ReactNode;
  rightSlot?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>
        <input
          {...rest}
          className={cn(
            inputBase,
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
              : "border-zinc-200 focus:border-brand-500",
            className
          )}
        />
        {rightSlot}
      </span>
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}

const brandPoints = [
  "Ship projects in minutes",
  "Enterprise-grade security",
  "Team-first workflows",
];

export default function LoginForm({
  onLogin,
}: {
  onLogin: (user: User) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setFormError(null);
    setConfirm("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};

    if (isSignup && !name.trim()) next.name = "Please enter your full name.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6)
      next.password = "Use at least 6 characters.";
    if (isSignup && confirm !== password) next.confirm = "Passwords don't match.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setFormError(null);
    try {
      const data = isSignup
        ? await signup(name.trim(), email.trim(), password)
        : await login(email.trim(), password);
      setToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 p-10 text-white lg:flex">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-10 size-72 rounded-full bg-violet-300/20 blur-3xl"
          />
          <div className="relative">
            <Logo tone="light" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Build in the open.
            </h2>
            <p className="mt-4 text-white/70">
              One workspace to plan, build, and ship — with the whole team.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/85">
              {brandPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-white/15">
                    <CheckIcon className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-sm italic text-white/60">
            “The fastest way we&apos;ve ever shipped an internal tool.”
          </p>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10">
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="mt-6 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              {isSignup
                ? "Start your free workspace in seconds."
                : "Sign in to open your workspace."}
            </p>
          </div>

          {/* Login / Signup toggle */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-zinc-100 p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  "rounded-full py-2 text-sm font-semibold transition-all",
                  mode === m
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {isSignup && (
              <Field
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                icon={<UserIcon className="size-4.5" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            )}
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="ada@company.com"
              icon={<MailIcon className="size-4.5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Field
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              icon={<LockIcon className="size-4.5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4.5" />
                  ) : (
                    <EyeIcon className="size-4.5" />
                  )}
                </button>
              }
            />
            {isSignup && (
              <Field
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                icon={<LockIcon className="size-4.5" />}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />
            )}

            {formError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </p>
            )}
            <Button type="submit" size="md" className="w-full" disabled={loading}>
              {loading
                ? isSignup
                  ? "Creating account…"
                  : "Signing in…"
                : isSignup
                  ? "Create account"
                  : "Continue to dashboard"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-zinc-400">
            Your details are sent securely to the Heelllo Boxcode backend.
          </p>
        </div>
      </div>
    </div>
  );
}

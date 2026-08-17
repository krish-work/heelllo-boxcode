"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import DashboardShell from "./DashboardShell";
import { fetchMe, getToken, setToken, type User } from "@/lib/api";

/**
 * Owns the auth state for the dashboard. On first load it restores the
 * session from a stored JWT via /api/auth/me, then shows the login form
 * (no user) or the dashboard shell (logged in).
 */
export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="grid min-h-svh place-items-center bg-zinc-50">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span className="size-4 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-500" />
          Loading your workspace…
        </div>
      </div>
    );
  }

  return user ? (
    <DashboardShell user={user} onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={setUser} />
  );
}

import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Almarifah" },
      {
        name: "description",
        content:
          "Sign in to Almarifah to submit essays and poems, follow their review status, and manage your contributor profile.",
      },
      { property: "og:title", content: "Sign in or create an account — Almarifah" },
      {
        property: "og:description",
        content: "Contributor and editor access for Almarifah.",
      },
      { property: "og:url", content: "/auth" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials"))
    return "Email or password is incorrect. Check them and try again — or use “Forgot password?” below.";
  if (lower.includes("email not confirmed"))
    return "Your account isn't confirmed yet. Open the confirmation email we sent you, then sign in.";
  if (lower.includes("user already registered"))
    return "An account with this email already exists. Sign in instead.";
  if (lower.includes("password") && lower.includes("at least"))
    return "Your password is too short — use at least 6 characters.";
  if (lower.includes("rate limit"))
    return "Too many attempts. Please wait a few minutes and try again.";
  return msg;
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<"confirm" | "reset" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setSent(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("reset");
        toast.success("Reset link sent — check your email.");
        return;
      }
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent("confirm");
          toast.success("Account created — check your email to confirm it.");
          return;
        }
        toast.success("Welcome to Almarifah.");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      setError("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  const title =
    mode === "signup"
      ? "Create your account"
      : mode === "forgot"
        ? "Reset your password"
        : "Welcome back";
  const subtitle =
    mode === "signup"
      ? "Join Almarifah to submit your essays and poems for review."
      : mode === "forgot"
        ? "Enter your account email and we'll send you a link to set a new password."
        : "Sign in to your contributor or editor account.";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

      {sent ? (
        <div className="mt-8 rounded-md border border-border p-5 text-sm">
          <p className="font-medium">Check your inbox</p>
          <p className="mt-2 text-muted-foreground">
            {sent === "reset" ? (
              <>
                If an account exists for {email}, we've sent a password reset link. Open it
                to choose a new password, then sign in.
              </>
            ) : (
              <>
                We sent a confirmation link to {email}. Open it to activate your account, then
                sign in.
              </>
            )}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => switchMode("signin")}>
            Back to sign in
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={busy}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={busy}
                aria-invalid={Boolean(error)}
              />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      className="text-xs font-medium text-accent hover:underline"
                      onClick={() => switchMode("forgot")}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  disabled={busy}
                  aria-invalid={Boolean(error)}
                />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{error}</span>
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {busy
                ? mode === "signup"
                  ? "Creating account…"
                  : mode === "forgot"
                    ? "Sending reset link…"
                    : "Signing in…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
            </Button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button variant="outline" onClick={handleGoogle} disabled={busy} className="w-full">
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Continue with Google
              </Button>
            </>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-accent hover:underline"
                  onClick={() => switchMode("signin")}
                >
                  Sign in
                </button>
              </>
            ) : mode === "forgot" ? (
              <>
                Remembered it?{" "}
                <button
                  type="button"
                  className="font-medium text-accent hover:underline"
                  onClick={() => switchMode("signin")}
                >
                  Back to sign in
                </button>
              </>
            ) : (
              <>
                First time here?{" "}
                <button
                  type="button"
                  className="font-medium text-accent hover:underline"
                  onClick={() => switchMode("signup")}
                >
                  Create an account
                </button>
              </>
            )}
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link to="/contact" className="hover:text-accent">
              Questions about submissions?
            </Link>
          </p>
        </>
      )}
    </section>
  );
}

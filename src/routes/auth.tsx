import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Alma'rifa" },
      {
        name: "description",
        content:
          "Sign in to Alma'rifa to submit essays and poems, follow their review status, and manage your contributor profile.",
      },
      { property: "og:title", content: "Sign in or create an account — Alma'rifa" },
      {
        property: "og:description",
        content: "Contributor and editor access for Alma'rifa.",
      },
      { property: "og:url", content: "/auth" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
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
          setSent(true);
          toast.success("Account created — check your email to confirm it.");
          return;
        }
        toast.success("Welcome to Alma'rifa.");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signup"
          ? "Join Alma'rifa to submit your essays and poems for review."
          : "Sign in to your contributor or editor account."}
      </p>

      {sent ? (
        <div className="mt-8 rounded-md border border-border p-5 text-sm">
          <p className="font-medium">Check your inbox</p>
          <p className="mt-2 text-muted-foreground">
            We sent a confirmation link to {email}. Open it to activate your account, then
            sign in.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSent(false);
              setMode("signin");
            }}
          >
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" onClick={handleGoogle} disabled={busy} className="w-full">
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "First time here?"}{" "}
            <button
              type="button"
              className="font-medium text-accent hover:underline"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
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

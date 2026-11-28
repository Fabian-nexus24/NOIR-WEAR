"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

type Mode = "signin" | "signup";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}

function isAdminPath(path: string) {
  return path === "/admin" || path.startsWith("/admin/");
}

function authMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials") || normalized.includes("user not found")) {
    return "Invalid email or password.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirm your email using the link we sent before signing in.";
  }
  if (normalized.includes("password should be at least") || normalized.includes("weak_password")) {
    return "Choose a stronger password with at least 8 characters.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Too many attempts. Please wait a little and try again.";
  }
  return "We couldn’t complete that request. Please try again.";
}

export default function AuthForm({ initialNext }: { initialNext?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    setMessage("");

    if (!isSupabaseConfigured()) {
      setError("Authentication is unavailable in this preview until the project’s Supabase environment is present.");
      return;
    }
    setIsSubmitting(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
              `${window.location.origin}/auth/callback?next=/account`,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: phone.trim(),
            },
          },
        });
        if (signUpError) throw signUpError;
        if (data.session && data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
          });
          await mutate("noir-session");
          router.replace("/account");
          router.refresh();
          return;
        }
        setMessage("Your account is created. Check your email to confirm your address, then sign in.");
        setMode("signin");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;

        const { data: isAdmin, error: adminError } = await supabase.rpc("is_noir_admin");
        if (adminError) {
          await supabase.auth.signOut();
          setError("We couldn’t verify your account access. Please try again.");
          return;
        }

        await mutate("noir-session");
        const requestedPath = safeNextPath(initialNext ?? null);
        const destination = isAdmin === true
          ? requestedPath && isAdminPath(requestedPath) ? requestedPath : "/admin/dashboard"
          : requestedPath && !isAdminPath(requestedPath) ? requestedPath : "/account";
        router.replace(destination);
        router.refresh();
      }
    } catch (caught) {
      setError(authMessage(caught instanceof Error ? caught.message : ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[68vh] bg-white px-4 py-12 text-[#0A0A0A] sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <Link href="/" aria-label="NOIR Urban Wear home" className="inline-flex flex-col items-center">
            <span className="text-3xl font-black leading-none tracking-[-0.06em]">NOIR</span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em]">URBAN WEAR</span>
          </Link>
          <p className="mt-6 text-sm text-neutral-600">Your NOIR account, your way.</p>
        </div>

        <section className="border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_-38px_rgba(0,0,0,0.24)] sm:p-8" aria-labelledby="auth-heading">
          <h1 id="auth-heading" className="text-xl font-semibold tracking-tight">Account access</h1>
          <p className="mt-1 text-sm text-neutral-600">Sign in or create an account to continue.</p>

          <div className="mt-6 grid grid-cols-2 border border-neutral-200 p-1" role="tablist" aria-label="Account action">
            {(["signin", "signup"] as const).map((item) => (
              <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => { setMode(item); setError(""); setMessage(""); }} className={`px-3 py-2.5 text-sm font-medium transition-colors ${mode === item ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:bg-neutral-50"}`}>
                {item === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {error && <p className="mt-5 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">{error}</p>}
          {message && <p className="mt-5 border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700" role="status">{message}</p>}

          <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm font-medium">First name<Input autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required maxLength={80} className="h-11 rounded-none border-neutral-300 text-sm" /></label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">Last name<Input autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required maxLength={80} className="h-11 rounded-none border-neutral-300 text-sm" /></label>
                <label className="col-span-2 flex flex-col gap-1.5 text-sm font-medium">Phone number <span className="font-normal text-neutral-500">(optional)</span><Input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={32} className="h-11 rounded-none border-neutral-300 text-sm" /></label>
              </div>
            )}
            <label className="flex flex-col gap-1.5 text-sm font-medium">Email address<Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} className="h-11 rounded-none border-neutral-300 text-sm" /></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">Password
              <span className="relative">
                <Input type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "signup" ? 8 : undefined} maxLength={128} className="h-11 rounded-none border-neutral-300 pr-11 text-sm" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-neutral-500 hover:text-[#0A0A0A]">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </span>
            </label>
            <Button type="submit" disabled={isSubmitting} className="mt-1 h-11 w-full rounded-none bg-[#0A0A0A] text-sm font-semibold text-white hover:bg-neutral-800">
              {isSubmitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
              {!isSubmitting && <ArrowRight data-icon="inline-end" aria-hidden="true" />}
            </Button>
          </form>
        </section>
        <p className="mt-5 text-center text-xs leading-5 text-neutral-500">By continuing, you agree to use your account for NOIR Urban Wear services.</p>
      </div>
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordForm({
  hasValidSession,
  isConfigured,
}: {
  hasValidSession: boolean;
  isConfigured: boolean;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await createClient().auth.updateUser({ password });
      if (updateError) {
        const normalized = updateError.message.toLowerCase();
        if (normalized.includes("password should be at least") || normalized.includes("weak_password")) {
          setError("Choose a stronger password with at least 8 characters.");
        } else {
          setError("We couldn’t update your password. Request a new reset link and try again.");
        }
        return;
      }
      setIsComplete(true);
    } catch {
      setError("We couldn’t update your password. Request a new reset link and try again.");
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
        </div>

        <section className="border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_-38px_rgba(0,0,0,0.24)] sm:p-8" aria-labelledby="reset-password-heading">
          {!isConfigured ? (
            <>
              <h1 id="reset-password-heading" className="text-xl font-semibold tracking-tight">Password reset unavailable</h1>
              <p className="mt-2 text-sm text-neutral-600">Account authentication is not configured in this environment yet.</p>
              <Button asChild className="mt-6 h-11 w-full rounded-none bg-[#0A0A0A] text-sm font-semibold text-white hover:bg-neutral-800">
                <Link href="/login">Return to sign in</Link>
              </Button>
            </>
          ) : !hasValidSession ? (
            <>
              <h1 id="reset-password-heading" className="text-xl font-semibold tracking-tight">Reset link expired</h1>
              <p className="mt-2 text-sm text-neutral-600">This password reset link is invalid or has expired. Request a new link to continue.</p>
              <Button asChild className="mt-6 h-11 w-full rounded-none bg-[#0A0A0A] text-sm font-semibold text-white hover:bg-neutral-800">
                <Link href="/login">Return to sign in</Link>
              </Button>
            </>
          ) : isComplete ? (
            <>
              <h1 id="reset-password-heading" className="text-xl font-semibold tracking-tight">Password updated</h1>
              <p className="mt-2 text-sm text-neutral-600" role="status">Your new password is ready. You can continue shopping.</p>
              <Button asChild className="mt-6 h-11 w-full rounded-none bg-[#0A0A0A] text-sm font-semibold text-white hover:bg-neutral-800">
                <Link href="/shop">Continue to shop</Link>
              </Button>
            </>
          ) : (
            <>
              <h1 id="reset-password-heading" className="text-xl font-semibold tracking-tight">Choose a new password</h1>
              <p className="mt-2 text-sm text-neutral-600">Use at least 8 characters for your new password.</p>
              {error && <p className="mt-5 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">{error}</p>}
              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1.5 text-sm font-medium">New password<Input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} maxLength={128} className="h-11 rounded-none border-neutral-300 text-sm" /></label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">Confirm new password<Input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} maxLength={128} className="h-11 rounded-none border-neutral-300 text-sm" /></label>
                <Button type="submit" disabled={isSubmitting} className="mt-1 h-11 w-full rounded-none bg-[#0A0A0A] text-sm font-semibold text-white hover:bg-neutral-800">
                  {isSubmitting ? "Updating password…" : "Update password"}
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

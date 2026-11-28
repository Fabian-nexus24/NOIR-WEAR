import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reset your password | NOIR Urban Wear",
  description: "Set a new password for your NOIR Urban Wear account.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const isConfigured = isSupabaseConfigured();
  let hasValidSession = false;

  if (isConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    hasValidSession = Boolean(user);
  }

  return <ResetPasswordForm hasValidSession={hasValidSession} isConfigured={isConfigured} />;
}

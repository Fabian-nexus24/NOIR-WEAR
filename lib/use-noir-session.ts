"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useEffect } from "react";
import useSWR from "swr";

export type NoirSession = { id: string; email: string; isAdmin: boolean } | null;

async function loadSession(): Promise<NoirSession> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: isAdmin } = await supabase.rpc("is_noir_admin");
  return { id: user.id, email: user.email ?? "", isAdmin: isAdmin === true };
}

export function useNoirSession() {
  const { data: session, mutate } = useSWR<NoirSession>("noir-session", loadSession, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void mutate();
    });
    return () => subscription.unsubscribe();
  }, [mutate]);

  return { session: session ?? null, isLoaded: session !== undefined, refresh: mutate };
}

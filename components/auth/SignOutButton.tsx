"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useNoirSession } from "@/lib/use-noir-session";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const { refresh } = useNoirSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true);
        await createClient().auth.signOut();
        await refresh();
        router.replace("/");
        router.refresh();
      }}
      className="mt-5 rounded-none border-neutral-300 bg-white text-sm text-[#0A0A0A] hover:bg-neutral-50"
    >
      {isSigningOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}

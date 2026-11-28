import Link from "next/link";
import { ShieldCheck, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="account-access-heading" className="relative w-full max-w-sm border border-neutral-200 bg-white p-6 text-[#0A0A0A] shadow-2xl sm:p-7">
        <button type="button" onClick={onClose} aria-label="Close account access" className="absolute right-3 top-3 inline-flex size-9 items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-[#0A0A0A]">
          <X aria-hidden="true" className="size-4" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">NOIR URBAN WEAR</p>
        <h2 id="account-access-heading" className="mt-2 text-xl font-semibold tracking-tight">Account access</h2>
        <p className="mt-1 text-sm text-neutral-600">Sign in to view your account or manage the store.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild onClick={onClose} className="h-11 rounded-none bg-[#0A0A0A] text-sm text-white hover:bg-neutral-800">
            <Link href="/login"><UserRound data-icon="inline-start" aria-hidden="true" />Customer sign in</Link>
          </Button>
          <Button asChild onClick={onClose} variant="outline" className="h-11 rounded-none border-neutral-300 bg-white text-sm text-[#0A0A0A] hover:bg-neutral-50">
            <Link href="/login?role=admin"><ShieldCheck data-icon="inline-start" aria-hidden="true" />Admin sign in</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

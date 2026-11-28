import SignOutButton from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatKES } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Your account | NOIR Urban Wear",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return <main className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-2xl font-semibold">Your account</h1><p className="mt-3 text-sm text-neutral-600">Account data will appear here when Supabase is configured for this environment.</p></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("first_name,last_name,phone").eq("id", user!.id).maybeSingle(),
    supabase.from("orders").select("id,order_number,status,total_kes,created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <main className="min-h-[70vh] bg-white px-4 py-10 text-[#0A0A0A] sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">NOIR ACCOUNT</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome{profile?.first_name ? `, ${profile.first_name}` : " back"}.</h1>
        <p className="mt-2 text-sm text-neutral-600">{user?.email}</p>
        {profile?.phone && <p className="mt-1 text-sm text-neutral-600">{profile.phone}</p>}
        <SignOutButton />
        <section className="mt-9 border border-neutral-200" aria-labelledby="orders-heading">
          <div className="border-b border-neutral-200 px-4 py-4 sm:px-6"><h2 id="orders-heading" className="text-lg font-semibold">Your orders</h2></div>
          {orders?.length ? <ul className="divide-y divide-neutral-200">{orders.map((order) => <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm sm:px-6"><div><p className="font-medium">{order.order_number}</p><p className="mt-1 text-xs capitalize text-neutral-500">{String(order.status).replaceAll("_", " ")} · {new Date(order.created_at).toLocaleDateString()}</p></div><strong>{formatKES(Number(order.total_kes)).replace("KES", "KSh")}</strong></li>)}</ul> : <div className="px-4 py-10 text-center text-sm text-neutral-600 sm:px-6">You haven&apos;t placed an order yet. <Link href="/shop" className="font-medium underline underline-offset-4">Explore the shop</Link>.</div>}
        </section>
      </div>
    </main>
  );
}

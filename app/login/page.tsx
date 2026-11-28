import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in or create an account | NOIR Urban Wear",
  description: "Access your NOIR Urban Wear customer or admin account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; next?: string }>;
}) {
  const { role, next } = await searchParams;
  return <AuthForm initialAccess={role === "admin" ? "admin" : "customer"} initialNext={next} />;
}

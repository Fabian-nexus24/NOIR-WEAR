import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "NOIR Urban Wear — Admin",
  description: "Manage the NOIR Urban Wear catalogue, customer orders, and store settings.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}

import { ArrowDownRight, ArrowUpRight, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersPanel";
import { formatKES } from "@/lib/utils";
import type { AdminOrder } from "@/lib/admin-dashboard-storage";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  orders: AdminOrder[];
  onNavigate: (section: "overview" | "products" | "orders" | "settings") => void;
};

export default function AdminOverviewPanel({ products, orders, onNavigate }: Props) {
  const onSaleCount = products.filter(
    (product) => product.originalPrice !== undefined && product.originalPrice > product.price,
  ).length;
  const activeOrderCount = orders.filter((order) => order.status !== "Completed").length;
  const orderVolume = orders.reduce((sum, order) => sum + order.total, 0);
  const metrics = [
    { label: "Total Products", value: String(products.length), icon: Package },
    { label: "On Sale", value: String(onSaleCount), icon: ArrowDownRight },
    { label: "Active Orders", value: String(activeOrderCount), icon: ShoppingBag },
    { label: "Order Volume (KSh)", value: formatKES(orderVolume).replace("KES", "KSh"), icon: ArrowUpRight },
  ];

  return (
    <section aria-labelledby="overview-heading" className="flex flex-col gap-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 id="overview-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
            Store overview
          </h2>
          <p className="mt-1 text-sm text-neutral-600">A quick snapshot of the NOIR catalogue and sample orders.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-fit rounded-sm border-neutral-300 bg-white text-sm text-[#0A0A0A] shadow-none hover:bg-neutral-50"
          onClick={() => onNavigate("products")}
        >
          Manage products
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="rounded-none border-neutral-200 bg-white shadow-none">
            <CardHeader className="flex-row items-center justify-between gap-2 p-4 pb-2 sm:p-5 sm:pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">{label}</CardTitle>
              <Icon aria-hidden="true" className="size-4 shrink-0 text-neutral-500" />
            </CardHeader>
            <CardContent className="p-4 pt-1 sm:p-5 sm:pt-2">
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border-neutral-200 bg-white shadow-none">
        <CardHeader className="flex-row items-center justify-between gap-3 border-b border-neutral-200 p-4 sm:p-5">
          <div>
            <CardTitle className="text-base font-semibold">Recent orders</CardTitle>
            <p className="mt-1 text-sm text-neutral-500">Sample records for the order workflow.</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="shrink-0 rounded-sm px-2 text-sm text-neutral-700"
            onClick={() => onNavigate("orders")}
          >
            View orders
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <AdminOrdersTable orders={orders.slice(0, 4)} interactive={false} />
        </CardContent>
      </Card>
    </section>
  );
}

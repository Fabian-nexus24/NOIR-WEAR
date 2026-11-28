"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/utils";
import {
  ORDER_STATUSES,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin-dashboard-storage";

type Props = {
  orders: AdminOrder[];
  whatsappNumber: string;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
};

const filters = ["All", ...ORDER_STATUSES] as const;
type OrderFilter = (typeof filters)[number];

export default function AdminOrdersPanel({ orders, whatsappNumber, onStatusChange }: Props) {
  const [filter, setFilter] = useState<OrderFilter>("All");
  const filteredOrders = useMemo(
    () => filter === "All" ? orders : orders.filter((order) => order.status === filter),
    [filter, orders],
  );

  return (
    <section aria-labelledby="orders-heading" className="flex flex-col gap-6">
      <div>
        <h2 id="orders-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">Orders</h2>
        <p className="mt-1 text-sm text-neutral-600">Review customer orders, update fulfillment status, or open a WhatsApp message.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter orders by status">
        {filters.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={filter === status}
            onClick={() => setFilter(status)}
            className={`shrink-0 border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 ${
              filter === status
                ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length ? (
        <div className="overflow-hidden border border-neutral-200 bg-white">
          <AdminOrdersTable
            orders={filteredOrders}
            interactive
            whatsappNumber={whatsappNumber}
            onStatusChange={onStatusChange}
          />
        </div>
      ) : (
        <div className="border border-neutral-200 px-6 py-12 text-center text-sm text-neutral-600">
          No orders match this status.
        </div>
      )}
    </section>
  );
}

export function AdminOrdersTable({
  orders,
  interactive,
  whatsappNumber = "",
  onStatusChange,
}: {
  orders: AdminOrder[];
  interactive: boolean;
  whatsappNumber?: string;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}) {
  const phoneNumber = whatsappNumber.replace(/\D/g, "");

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead className="bg-neutral-50 text-xs font-medium text-neutral-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Order ID</th>
            <th scope="col" className="px-4 py-3 font-medium">Customer</th>
            <th scope="col" className="px-4 py-3 font-medium">Items</th>
            <th scope="col" className="px-4 py-3 font-medium">Total</th>
            <th scope="col" className="px-4 py-3 font-medium">Fulfillment</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            {interactive && <th scope="col" className="px-4 py-3 font-medium">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {orders.map((order) => {
            const message = `Hello NOIR Urban Wear, I’m following up about order ${order.id}.`;
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            return (
              <tr key={order.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-[#0A0A0A]">
                  <span>{order.id}</span>
                  <span className="mt-1 block text-xs font-normal text-neutral-500">{order.createdAt}</span>
                </td>
                <td className="px-4 py-4 text-neutral-700">{order.customer}</td>
                <td className="max-w-[280px] px-4 py-4 text-neutral-600">
                  <ul className="flex flex-col gap-1">
                    {order.items.map((item, index) => (
                      <li key={`${order.id}-${index}`}>
                        {item.name} · {item.size} · Qty {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium">{formatKES(order.total).replace("KES", "KSh")}</td>
                <td className="whitespace-nowrap px-4 py-4 text-neutral-600">{order.fulfillment}</td>
                <td className="px-4 py-4">
                  {interactive ? (
                    <label className="sr-only" htmlFor={`status-${order.id}`}>Update {order.id} status</label>
                  ) : null}
                  {interactive ? (
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      onChange={(event) => onStatusChange?.(order.id, event.target.value as OrderStatus)}
                      className="min-w-40 border border-neutral-300 bg-white px-2.5 py-2 text-sm text-[#0A0A0A] outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]"
                    >
                      {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  ) : (
                    <span className={`inline-flex whitespace-nowrap border px-2.5 py-1 text-xs font-medium ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  )}
                </td>
                {interactive && (
                  <td className="px-4 py-4">
                    <Button
                      asChild
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-sm border-neutral-300 bg-white text-sm text-[#0A0A0A] shadow-none hover:bg-neutral-50"
                    >
                      <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Message store about ${order.id} on WhatsApp`}>
                        <MessageCircle data-icon="inline-start" aria-hidden="true" />
                        Message
                      </a>
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function statusClass(status: OrderStatus) {
  if (status === "Completed") return "border-neutral-200 bg-neutral-100 text-neutral-700";
  if (status === "Ready for Pickup") return "border-neutral-300 bg-white text-[#0A0A0A]";
  return "border-neutral-200 bg-neutral-50 text-neutral-700";
}

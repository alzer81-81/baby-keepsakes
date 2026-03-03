import Link from "next/link";

import { prisma } from "@/lib/db";
import { PosterDesignSpec } from "@/lib/design-spec";

function getCountry(order: { shippingCountry: string | null }): string {
  return order.shippingCountry || "-";
}

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-stone-100 p-6">
      <div className="mx-auto max-w-6xl rounded-2xl border border-stone-300 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">Admin Orders</h1>
        <p className="mt-1 text-sm text-stone-600">Protected by basic auth using ADMIN_BASIC_USER / ADMIN_BASIC_PASS.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-300 text-left text-xs uppercase tracking-wide text-stone-600">
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Theme</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Shipping Country</th>
                <th className="px-3 py-2">PDF</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const parsed = JSON.parse(order.designJson) as PosterDesignSpec;
                return (
                  <tr key={order.id} className="border-b border-stone-200">
                    <td className="px-3 py-3 text-stone-700">{order.createdAt.toISOString().slice(0, 10)}</td>
                    <td className="px-3 py-3 font-semibold text-stone-900">
                      {parsed.baby.firstName} {parsed.baby.lastName}
                    </td>
                    <td className="px-3 py-3 text-stone-700">{order.theme}</td>
                    <td className="px-3 py-3 text-stone-700">{order.status}</td>
                    <td className="px-3 py-3 text-stone-700">{getCountry(order)}</td>
                    <td className="px-3 py-3">
                      {order.pdfPath ? (
                        <Link href={`/api/admin/orders/${order.id}/pdf`} className="font-medium text-blue-700 underline">
                          Download PDF
                        </Link>
                      ) : (
                        <span className="text-stone-400">Not ready</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

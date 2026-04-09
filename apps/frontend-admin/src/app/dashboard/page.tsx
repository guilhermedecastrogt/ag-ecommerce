"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrders, fetchProducts, fetchUsers, fetchCategories, type Order } from "@/lib/api";

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: "blue" | "red" | "green" | "amber";
}) {
  const colors = {
    blue: "bg-blue/8 text-blue",
    red: "bg-red/8 text-red",
    green: "bg-green-500/10 text-green-600",
    amber: "bg-amber-400/10 text-amber-600",
  };
  return (
    <div className="bg-white rounded-xl border border-neutral-border p-6">
      <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-blue/40 mb-3">
        {label}
      </p>
      <p className={`text-3xl font-[var(--font-display)] font-extrabold ${colors[color].split(" ")[1]}`}>
        {value}
      </p>
      {sub && <p className="text-blue/35 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  PAID: "bg-green-50 text-green-700 border-green-100",
  CANCELLED: "bg-red/5 text-red/70 border-red/10",
};

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      fetchOrders(accessToken),
      fetchProducts(accessToken),
      fetchUsers(accessToken),
      fetchCategories(accessToken),
    ])
      .then(([o, p, u, c]) => {
        setOrders(o);
        setProductCount(p.length);
        setUserCount(u.length);
        setCategoryCount(c.length);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const revenue = orders.filter((o) => o.status === "PAID").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const recent = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/60 mb-1">
          Visão Geral
        </p>
        <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide">
          Dashboard
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-border h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Receita total" value={formatBRL(revenue)} sub="Pedidos pagos" color="blue" />
            <StatCard label="Pedidos" value={orders.length} sub={`${pending} pendentes`} color="amber" />
            <StatCard label="Produtos" value={productCount} sub={`${categoryCount} categorias`} color="red" />
            <StatCard label="Usuários" value={userCount} color="green" />
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-border">
              <h2 className="font-[var(--font-display)] text-blue text-sm font-extrabold uppercase tracking-wide">
                Pedidos recentes
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-border">
                    {["ID", "Usuário", "Total", "Status", "Data"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[0.65rem] font-extrabold text-blue/40 uppercase tracking-[0.12em]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  {recent.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-light/50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-blue/60">#{o.id}</td>
                      <td className="px-5 py-3 text-blue/60">user #{o.userId}</td>
                      <td className="px-5 py-3 font-[var(--font-display)] font-extrabold text-blue">{formatBRL(o.total)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.6rem] font-extrabold uppercase tracking-wider border ${STATUS_STYLE[o.status] ?? "bg-blue/5 text-blue/50 border-blue/10"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-blue/35 text-xs">
                        {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

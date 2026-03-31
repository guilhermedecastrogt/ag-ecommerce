"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, type AdminUser } from "@/lib/api";

export default function UsuariosPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    fetchUsers(accessToken)
      .then((data) => setUsers(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Erro"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/60 mb-1">Gestão</p>
          <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide">Usuários</h1>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="bg-white border border-neutral-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-blue placeholder-blue/30 focus:outline-none focus:border-blue/40 focus:ring-2 focus:ring-blue/8 transition-all w-56"
          />
        </div>
      </div>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
        {loading ? (
          <div className="space-y-px">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-neutral-light animate-pulse" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-border">
                {["ID", "Nome", "E-mail", "Cadastro"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.65rem] font-extrabold text-blue/40 uppercase tracking-[0.12em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-light/40 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-blue/40">#{u.id}</td>
                  <td className="px-5 py-3 font-semibold text-blue">{u.name}</td>
                  <td className="px-5 py-3 text-blue/50 text-xs">{u.email}</td>
                  <td className="px-5 py-3 text-blue/35 text-xs">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-blue/30 text-sm">Nenhum usuário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <p className="text-blue/25 text-xs mt-3">{filtered.length} usuário{filtered.length !== 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

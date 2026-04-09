"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/lib/api";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function CategoriasPage() {
  const { accessToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    if (!accessToken) return;
    fetchCategories(accessToken)
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const openNew = () => { setEditing(null); setForm({ name: "", slug: "" }); setShowModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug }); setShowModal(true); };

  const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((f) => ({ name, slug: editing ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, form, accessToken);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCategory(form, accessToken);
        setCategories((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken || !confirm("Excluir esta categoria?")) return;
    setDeleteId(id);
    try {
      await deleteCategory(id, accessToken);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    } finally {
      setDeleteId(null);
    }
  };

  const inputClass = "w-full bg-neutral-light border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-blue placeholder-blue/25 focus:outline-none focus:border-blue/40 focus:ring-2 focus:ring-blue/8 transition-all";
  const labelClass = "block text-[0.65rem] font-extrabold text-blue/45 uppercase tracking-[0.12em] mb-1.5";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/60 mb-1">Catálogo</p>
          <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide">Categorias</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue text-white font-extrabold uppercase tracking-[0.08em] text-xs px-4 py-2.5 rounded-xl hover:bg-red transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nova categoria
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
        {loading ? (
          <div className="space-y-px">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-neutral-light animate-pulse" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-border">
                {["ID", "Nome", "Slug", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.65rem] font-extrabold text-blue/40 uppercase tracking-[0.12em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-light/40 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-blue/40">#{c.id}</td>
                  <td className="px-5 py-3 font-semibold text-blue">{c.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-blue/40">{c.slug}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="text-blue/40 hover:text-blue transition-colors p-1 rounded-lg hover:bg-blue/5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(c.id)} disabled={deleteId === c.id} className="text-red/40 hover:text-red transition-colors p-1 rounded-lg hover:bg-red/5 disabled:opacity-30">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-blue/30 text-sm">Nenhuma categoria.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-neutral-border w-full max-w-sm shadow-2xl">
            <div className="px-6 py-5 border-b border-neutral-border flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-blue text-lg font-extrabold uppercase tracking-wide">
                {editing ? "Editar categoria" : "Nova categoria"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-blue/30 hover:text-blue transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nome</label>
                <input value={form.name} onChange={setName} className={inputClass} placeholder="Bombas" />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputClass} placeholder="bombas" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-border flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="text-sm font-bold text-blue/50 hover:text-blue px-4 py-2.5 rounded-xl border border-neutral-border hover:border-blue/20 transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="text-sm font-extrabold text-white bg-blue px-5 py-2.5 rounded-xl hover:bg-red transition-colors disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type Category,
} from "@/lib/api";

const EMPTY: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  slug: "",
  price: 0,
  stock: 0,
  description: "",
  imageUrl: "",
  categoryId: 0,
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ProdutosPage() {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id" | "createdAt" | "updatedAt">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    if (!accessToken) return;
    Promise.all([fetchProducts(accessToken), fetchCategories(accessToken)])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, price: p.price, stock: p.stock, description: p.description, imageUrl: p.imageUrl, categoryId: p.categoryId });
    setShowModal(true);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = k === "price" || k === "stock" || k === "categoryId" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({
      ...f,
      [k]: val,
      ...(k === "name" && !editing ? { slug: slugify(e.target.value as string) } : {}),
    }));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProduct(editing.id, form, accessToken);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct(form, accessToken);
        setProducts((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken || !confirm("Excluir este produto?")) return;
    setDeleteId(id);
    try {
      await deleteProduct(id, accessToken);
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-red/60 mb-1">Catálogo</p>
          <h1 className="font-[var(--font-display)] text-blue text-3xl font-extrabold uppercase tracking-wide">Produtos</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue text-white font-extrabold uppercase tracking-[0.08em] text-xs px-4 py-2.5 rounded-xl hover:bg-red transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Novo produto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-neutral-light animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-border">
                  {["ID", "Nome", "Categoria", "Preço", "Estoque", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[0.65rem] font-extrabold text-blue/40 uppercase tracking-[0.12em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-light/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-blue/40">#{p.id}</td>
                    <td className="px-5 py-3 font-semibold text-blue text-sm max-w-[200px] truncate">{p.name}</td>
                    <td className="px-5 py-3 text-blue/50 text-xs">{categories.find((c) => c.id === p.categoryId)?.name ?? "—"}</td>
                    <td className="px-5 py-3 font-[var(--font-display)] font-extrabold text-blue">{formatBRL(p.price)}</td>
                    <td className="px-5 py-3 text-blue/60">{p.stock}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="text-blue/40 hover:text-blue transition-colors p-1 rounded-lg hover:bg-blue/5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id} className="text-red/40 hover:text-red transition-colors p-1 rounded-lg hover:bg-red/5 disabled:opacity-30">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-blue/30 text-sm">Nenhum produto.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-neutral-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-5 border-b border-neutral-border flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-blue text-lg font-extrabold uppercase tracking-wide">
                {editing ? "Editar produto" : "Novo produto"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-blue/30 hover:text-blue transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nome</label>
                <input value={form.name} onChange={set("name")} className={inputClass} placeholder="Nome do produto" />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input value={form.slug} onChange={set("slug")} className={inputClass} placeholder="slug-do-produto" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Preço (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={set("price")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Estoque</label>
                  <input type="number" min="0" value={form.stock} onChange={set("stock")} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Categoria</label>
                <select value={form.categoryId} onChange={set("categoryId")} className={inputClass + " bg-neutral-light"}>
                  <option value={0}>Selecione</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>URL da imagem</label>
                <input value={form.imageUrl} onChange={set("imageUrl")} className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className={labelClass}>Descrição</label>
                <textarea value={form.description} onChange={set("description")} rows={3} className={inputClass + " resize-none"} placeholder="Descrição do produto" />
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

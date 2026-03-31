"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchProducts, fetchCategories, Product, Category } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { IconShoppingCart, IconSearch } from "@/components/Icons";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-neutral-border overflow-hidden animate-pulse">
      <div className="h-44 bg-neutral-border/60" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-neutral-border/80 rounded w-1/3" />
        <div className="h-4 bg-neutral-border/60 rounded w-3/4" />
        <div className="h-3 bg-neutral-border/40 rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-neutral-border/60 rounded w-1/3" />
          <div className="h-8 bg-neutral-border/40 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, slug: product.slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/loja/${product.slug}`}
      className="group relative bg-white rounded-xl border border-neutral-border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-blue/8 hover:-translate-y-0.5 hover:border-blue/20"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-[#f0f3f7] to-[#e4e9f0] overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-blue/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </div>
        )}

        {/* Category tag */}
        {product.category && (
          <div className="absolute top-2.5 left-2.5 bg-blue/90 backdrop-blur-sm text-white text-[0.55rem] font-extrabold tracking-[0.15em] uppercase px-2 py-1 rounded-md">
            {product.category.name}
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-neutral-dark/80 text-white text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
              Sem estoque
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/[0.03] transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-[var(--font-display)] text-blue text-[0.8rem] font-bold uppercase tracking-wide leading-snug mb-1.5 group-hover:text-red transition-colors duration-200 line-clamp-2 min-h-[2.4rem]">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-blue/35 text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-neutral-border">
          <div>
            <span className="font-[var(--font-display)] text-blue font-extrabold text-[1.2rem] leading-none tracking-wide">
              {formatBRL(product.price)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`shrink-0 flex items-center gap-1.5 text-[0.65rem] font-extrabold tracking-[0.08em] uppercase py-2 px-3 rounded-lg transition-all duration-200 ${
              added
                ? "bg-green-600 text-white scale-95"
                : outOfStock
                  ? "bg-neutral-light text-blue/25 cursor-not-allowed"
                  : "bg-blue text-white hover:bg-red active:scale-95"
            }`}
          >
            {added ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <IconShoppingCart className="w-3.5 h-3.5" />
            )}
            {added ? "OK!" : "Add"}
          </button>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
    </Link>
  );
}

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.categoryId === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* ── Hero ── */}
      <div className="relative bg-[#001429] overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Diagonal red slash */}
        <div
          className="absolute top-0 right-0 w-[35%] h-full bg-red/[0.07]"
          style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 10% 100%)" }}
        />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.15em] uppercase text-white/30 mb-6">
            <Link href="/" className="hover:text-white/60 transition-colors">Início</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/50">Loja</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[2px] bg-red" />
                <span className="text-red text-[0.65rem] font-extrabold tracking-[0.2em] uppercase">Catálogo</span>
              </div>
              <h1 className="font-[var(--font-display)] text-white text-4xl md:text-5xl xl:text-6xl font-extrabold uppercase leading-[0.92] tracking-wide">
                Peças e módulos<br />
                <span className="text-red">diesel</span>
              </h1>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
              +50 anos de expertise. Entrega para todo o Brasil.
            </p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="border-b border-neutral-border bg-white sticky top-[63px] z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative shrink-0 w-full sm:w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue/30" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-light border border-neutral-border rounded-lg pl-9 pr-4 py-2 text-sm text-blue placeholder-blue/30 focus:outline-none focus:border-blue/40 focus:bg-white transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 flex-1" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[0.7rem] font-extrabold uppercase tracking-[0.08em] transition-all ${
                activeCategory === "all" ? "bg-blue text-white" : "bg-neutral-light text-blue/50 hover:text-blue hover:bg-blue/5"
              }`}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[0.7rem] font-extrabold uppercase tracking-[0.08em] transition-all ${
                  activeCategory === c.id ? "bg-blue text-white" : "bg-neutral-light text-blue/50 hover:text-blue hover:bg-blue/5"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-red/70 font-semibold mb-4">{error}</p>
            <button onClick={load} className="text-sm font-bold text-blue border border-blue/20 px-5 py-2.5 rounded-xl hover:bg-blue hover:text-white transition-colors">
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue/5 flex items-center justify-center">
              <IconSearch className="w-7 h-7 text-blue/20" />
            </div>
            <p className="font-[var(--font-display)] text-blue text-lg font-extrabold uppercase tracking-wide mb-2">Sem resultados</p>
            <p className="text-blue/40 text-sm">Tente outros termos ou selecione outra categoria.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-blue/35 text-[0.7rem] font-bold uppercase tracking-[0.12em] mb-5">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
              {search && <span> para "{search}"</span>}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

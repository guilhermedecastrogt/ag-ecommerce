"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { fetchProductBySlug, fetchProducts, Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { IconShoppingCart } from "@/components/Icons";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([fetchProductBySlug(slug), fetchProducts()])
      .then(([prod, all]) => {
        setProduct(prod);
        setRelated(all.filter((p) => p.id !== prod.id && p.categoryId === prod.categoryId).slice(0, 4));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Produto não encontrado."))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, slug: product.slug, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-4 bg-neutral-border rounded w-48 mb-10 animate-pulse" />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-neutral-border rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-5 bg-neutral-border rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-neutral-border rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-border rounded animate-pulse" />
              <div className="h-4 bg-neutral-border rounded w-5/6 animate-pulse" />
              <div className="h-12 bg-neutral-border rounded w-1/3 animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center gap-4">
        <p className="text-red/70 font-semibold">{error || "Produto não encontrado."}</p>
        <Link href="/loja" className="text-sm font-bold text-blue border border-blue/20 px-5 py-2.5 rounded-xl hover:bg-blue hover:text-white transition-colors">
          Voltar à loja
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase text-blue/35 mb-10 flex-wrap">
          <Link href="/" className="hover:text-blue/60 transition-colors">Início</Link>
          <span className="text-blue/20">/</span>
          <Link href="/loja" className="hover:text-blue/60 transition-colors">Loja</Link>
          {product.category && (
            <>
              <span className="text-blue/20">/</span>
              <span className="text-blue/50">{product.category.name}</span>
            </>
          )}
        </nav>

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 mb-16">
          {/* Image panel */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-2xl border border-neutral-border overflow-hidden flex items-center justify-center group">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-blue/10">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                  <span className="text-xs tracking-widest uppercase font-bold">Sem imagem</span>
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col">
            {product.category && (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px] bg-red" />
                <span className="text-[0.65rem] font-extrabold tracking-[0.2em] uppercase text-blue/50">{product.category.name}</span>
              </div>
            )}

            <h1 className="font-[var(--font-display)] text-blue text-2xl md:text-3xl xl:text-4xl font-extrabold uppercase tracking-wide leading-[1] mb-4">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-blue/55 text-sm leading-relaxed mb-6 border-l-2 border-neutral-border pl-4">
                {product.description}
              </p>
            )}

            {/* Price block */}
            <div className="bg-white rounded-xl border border-neutral-border p-5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-[var(--font-display)] text-blue text-4xl font-extrabold tracking-wide">
                  {formatBRL(product.price)}
                </span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${inStock ? "bg-green-50 text-green-700" : "bg-red/8 text-red/70"}`}>
                  <span className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red"}`} />
                  {inStock ? `${product.stock} em estoque` : "Sem estoque"}
                </div>
              </div>

              {/* Quantity stepper */}
              {inStock && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-border rounded-lg overflow-hidden bg-neutral-light">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-blue hover:bg-white transition-colors font-bold text-lg">−</button>
                    <span className="w-10 text-center text-sm font-extrabold text-blue select-none">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-blue hover:bg-white transition-colors font-bold text-lg">+</button>
                  </div>
                  <span className="text-blue/35 text-xs font-semibold">
                    = {formatBRL(product.price * quantity)}
                  </span>
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div className="space-y-2.5">
              {inStock && (
                <button
                  onClick={handleAdd}
                  className={`w-full flex items-center justify-center gap-2 font-extrabold uppercase tracking-[0.1em] text-sm py-4 rounded-xl transition-all duration-200 ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-blue text-white hover:bg-red active:scale-[0.99]"
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Adicionado ao carrinho!
                    </>
                  ) : (
                    <>
                      <IconShoppingCart className="w-4 h-4" />
                      Adicionar ao carrinho
                    </>
                  )}
                </button>
              )}
              <Link href="/carrinho" className="w-full flex items-center justify-center gap-2 font-bold uppercase tracking-[0.08em] text-sm py-3.5 rounded-xl border border-blue/20 text-blue hover:bg-blue hover:text-white transition-all duration-200">
                Ver carrinho
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[2px] bg-red" />
              <h2 className="font-[var(--font-display)] text-blue text-xl font-extrabold uppercase tracking-wide">
                Produtos relacionados
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/loja/${p.slug}`} className="bg-white rounded-xl border border-neutral-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                  <h3 className="font-[var(--font-display)] text-blue text-xs font-bold uppercase tracking-wide group-hover:text-red transition-colors mb-2.5 line-clamp-2 min-h-[2rem]">
                    {p.name}
                  </h3>
                  <span className="font-[var(--font-display)] text-blue font-extrabold text-lg">{formatBRL(p.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

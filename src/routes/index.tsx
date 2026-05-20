import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, useProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgroTech Catalog — Premium Agricultural & Livestock Yields" },
      {
        name: "description",
        content:
          "Buy premium agricultural and livestock products directly from the source. Fresh poultry, coconuts, and plants delivered with care.",
      },
    ],
  }),
  component: HomePage,
});

const TABS = ["Semua", ...CATEGORIES] as const;
type Tab = (typeof TABS)[number];

function HomePage() {
  const products = useProducts();
  const [tab, setTab] = useState<Tab>("Semua");

  const filtered = useMemo(
    () => (tab === "Semua" ? products : products.filter((p) => p.category === tab)),
    [products, tab],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary via-background to-background">
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,oklch(0.78_0.15_75/0.15),transparent_50%),radial-gradient(circle_at_80%_70%,oklch(0.42_0.09_150/0.18),transparent_55%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Fresh from the farm
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              Premium Agricultural & Livestock Yields
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Beli langsung dari sumbernya. Hasil unggulan peternakan dan perkebunan pilihan,
              dikemas dengan standar kualitas terbaik dan dikirim langsung ke tangan Anda
              melalui WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Katalog Produk
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} produk tersedia
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  tab === t
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center text-muted-foreground">
            Belum ada produk pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border bg-secondary/40 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} AgroTech Catalog — Dari petani untuk Anda.
        </div>
      </footer>
    </div>
  );
}

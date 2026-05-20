import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, formatRupiah, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">{product.specs}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Harga</p>
            <p className="font-display text-2xl font-semibold text-primary">
              {formatRupiah(product.price)}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="w-full gap-2 bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:bg-[var(--whatsapp)]/90"
        >
          <a href={buildWhatsAppLink(product)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Beli via WhatsApp
          </a>
        </Button>
      </div>
    </article>
  );
}

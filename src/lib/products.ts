import { useEffect, useState } from "react";

export type Category = "Ayam / Unggas" | "Kelapa & Tanaman";

export interface Product {
  id: string;
  name: string;
  category: Category;
  specs: string;
  price: number;
  image: string;
}

export const CATEGORIES: Category[] = ["Ayam / Unggas", "Kelapa & Tanaman"];

const STORAGE_KEY = "agrotech_products_v1";

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Ayam Cemani Jantan",
    category: "Ayam / Unggas",
    specs: "Umur: 10 bulan, Berat: 2.4 kg",
    price: 900000,
    image:
      "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800&q=80",
  },
  {
    id: "p2",
    name: "Kelapa Kuning Bali",
    category: "Kelapa & Tanaman",
    specs: "Berat ± 1.5 - 2 kg",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1581375074612-d1fd0e661aeb?w=800&q=80",
  },
  {
    id: "p3",
    name: "Biji Tanaman Kopi",
    category: "Kelapa & Tanaman",
    specs: "Umur: 2 bulan",
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80",
  },
];

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export const buildWhatsAppLink = (p: Product) => {
  const msg = `Halo AgroTech Catalog! 👋\n\nSaya tertarik untuk membeli produk berikut:\n\n*Produk:* ${p.name}\n*Kategori:* ${p.category}\n*Spesifikasi:* ${p.specs}\n*Harga:* ${formatRupiah(p.price)}\n\nMohon info lebih lanjut mengenai ketersediaan dan pengiriman. Terima kasih!`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
};

function load(): Product[] {
  if (typeof window === "undefined") return initialProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProducts;
    return JSON.parse(raw) as Product[];
  } catch {
    return initialProducts;
  }
}

function save(items: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

type Listener = (items: Product[]) => void;
const listeners = new Set<Listener>();
let cache: Product[] | null = null;

function getAll(): Product[] {
  if (cache === null) cache = load();
  return cache;
}

function emit() {
  const items = getAll();
  listeners.forEach((l) => l(items));
}

export const productStore = {
  list: getAll,
  add(p: Omit<Product, "id">) {
    cache = [...getAll(), { ...p, id: `p_${Date.now()}` }];
    save(cache);
    emit();
  },
  update(id: string, p: Omit<Product, "id">) {
    cache = getAll().map((x) => (x.id === id ? { ...p, id } : x));
    save(cache);
    emit();
  },
  remove(id: string) {
    cache = getAll().filter((x) => x.id !== id);
    save(cache);
    emit();
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useProducts() {
  const [items, setItems] = useState<Product[]>(() => getAll());
  useEffect(() => {
    setItems(getAll());
    const off = productStore.subscribe(setItems);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = load();
        setItems(cache);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      off();
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return items;
}

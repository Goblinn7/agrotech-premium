import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { LogOut, Pencil, Plus, Trash2, ArrowLeft, Upload, X } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth, useAuth } from "@/lib/auth";
import {
  CATEGORIES,
  formatRupiah,
  productStore,
  useProducts,
  type Category,
  type Product,
} from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — AgroTech Catalog" },
      { name: "description", content: "Manage AgroTech Catalog inventory." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const loggedIn = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {loggedIn ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

function LoginForm() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!auth.login(u, p)) setErr("Username atau password salah.");
    else setErr("");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke katalog
      </Link>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-foreground">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Masuk untuk mengelola katalog produk.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="u">Username</Label>
            <Input id="u" value={u} onChange={(e) => setU(e.target.value)} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Password</Label>
            <Input id="p" type="password" value={p} onChange={(e) => setP(e.target.value)} />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full">Masuk</Button>
        </form>
      </div>
    </div>
  );
}

const emptyForm = {
  name: "",
  category: "Ayam / Unggas" as Category,
  specs: "",
  price: 0,
  image: "",
};

function Dashboard() {
  const products = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      specs: p.specs,
      price: p.price,
      image: p.image,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specs || !form.image || form.price <= 0) return;
    if (editingId) productStore.update(editingId, form);
    else productStore.add(form);
    reset();
  };

  const remove = (id: string) => {
    if (confirm("Hapus produk ini?")) {
      productStore.remove(id);
      if (editingId === id) reset();
    }
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Dashboard Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola produk yang ditampilkan di katalog publik.
          </p>
        </div>
        <Button variant="outline" onClick={() => auth.logout()} className="gap-2">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        <form
          onSubmit={submit}
          className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-20"
        >
          <h2 className="font-display text-xl font-semibold text-foreground">
            {editingId ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as Category })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="specs">Spesifikasi</Label>
              <Input
                id="specs"
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                placeholder="Umur: 10 bulan, Berat: 2.4 kg"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image">Gambar Produk</Label>
              {form.image ? (
                <div className="relative">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 transition-colors hover:bg-muted/50">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Klik untuk unggah gambar</span>
                  <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP</span>
                  <input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                    required={!editingId}
                  />
                </label>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                {editingId ? "Simpan Perubahan" : "Tambah Produk"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={reset}>
                  Batal
                </Button>
              )}
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Inventaris ({products.length})
            </h2>
          </div>
          {products.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              Belum ada produk. Tambah produk pertama Anda.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.category}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.specs}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatRupiah(p.price)}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
                    <Button size="sm" variant="outline" onClick={() => startEdit(p)} className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => remove(p.id)}
                      className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Hapus</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

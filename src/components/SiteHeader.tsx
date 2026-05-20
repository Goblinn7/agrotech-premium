import { Link } from "@tanstack/react-router";
import { Leaf, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-foreground">AgroTech</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Catalog</p>
          </div>
        </Link>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link to="/admin">
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Admin</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}

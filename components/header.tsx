import Link from "next/link";
import { signOut } from "@/app/actions";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Biens" },
  { href: "/interventions", label: "Interventions" },
  { href: "/history", label: "Historique" }
];

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Central Chanel Manager</p>
          <h1 className="text-lg font-semibold">Checklist Ménage Airbnb</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-600 hover:text-brand-600">
              {link.label}
            </Link>
          ))}
          <form action={signOut}>
            <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:border-slate-400 hover:text-slate-900">
              Déconnexion
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

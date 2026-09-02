"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Ofertas", icon: "🔍" },
  { href: "/estoque", label: "Revenda", icon: "📦" },
];

export default function TopNav({ userEmail, onLogout }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-base/80 border-b border-line">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {LINKS.map((link) => {
            const ativo = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition ${
                  ativo
                    ? "bg-ember/15 text-ember font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 hidden sm:inline">{userEmail}</span>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

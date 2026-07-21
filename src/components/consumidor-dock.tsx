"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/perto-de-mim", label: "Perto de mim", icone: "📍" },
  { href: "/favoritos", label: "Favoritos", icone: "⭐" },
  { href: "/historico", label: "Histórico", icone: "🧾" },
  { href: "/assinatura", label: "Assinatura", icone: "💳" },
];

export default function ConsumidorDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
    >
      <div className="flex items-end gap-1 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-lg px-2 py-2 shadow-2xl shadow-black/50">
        {ITENS.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200 cursor-pointer hover:-translate-y-1.5 ${
                ativo ? "-translate-y-1.5" : ""
              }`}
            >
              <span
                className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
                  ativo
                    ? "opacity-100 bg-gradient-to-b from-amber-400/20 to-transparent"
                    : "opacity-0 group-hover:opacity-100 bg-neutral-800"
                }`}
              />
              <span
                className={`relative text-2xl transition-transform duration-200 group-hover:scale-125 ${
                  ativo ? "scale-110 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : ""
                }`}
              >
                {item.icone}
              </span>
              <span
                className={`relative text-[10px] font-medium transition-colors ${
                  ativo ? "text-amber-300" : "text-neutral-500 group-hover:text-neutral-200"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

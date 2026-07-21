"use client";

import { useState } from "react";
import Link from "next/link";
import ConsumidorDock from "@/components/consumidor-dock";

const PLANOS = [
  { id: "basico", nome: "Básico", preco: "R$3,90/mês", detalhe: "Até 4 cupons por mês" },
  { id: "premium", nome: "Premium", preco: "R$6,90/mês", detalhe: "Cupons ilimitados" },
] as const;

export default function AssinaturaPage() {
  const [carregando, setCarregando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function assinar(plano: string) {
    setCarregando(plano);
    setErro(null);
    const res = await fetch("/api/assinatura/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plano }),
    });
    const data = await res.json();
    setCarregando(null);

    if (!res.ok) {
      setErro(data.erro ?? "Erro ao iniciar assinatura.");
      return;
    }
    location.assign(data.initPoint);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 py-6 pb-28">
        <Link href="/" className="text-sm text-neutral-400 hover:text-amber-300 transition-colors">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-extrabold mt-4 mb-1">Escolha seu plano</h1>
        <p className="text-neutral-400 mb-6">
          1 mês grátis já em uso. Após o período, escolha um plano para continuar gerando cupons.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {PLANOS.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:border-amber-400/30 transition-colors"
            >
              <h2 className="font-semibold text-lg">{p.nome}</h2>
              <p className="text-3xl font-extrabold my-1 bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
                {p.preco}
              </p>
              <p className="text-sm text-neutral-400 mb-4">{p.detalhe}</p>
              <button
                onClick={() => assinar(p.id)}
                disabled={carregando === p.id}
                className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-3 py-2 w-full disabled:opacity-40 hover:brightness-110 transition"
              >
                {carregando === p.id ? "Redirecionando..." : "Assinar"}
              </button>
            </div>
          ))}
        </div>

        {erro && <p className="text-red-400 text-sm mt-4">{erro}</p>}
      </div>
      <ConsumidorDock />
    </div>
  );
}

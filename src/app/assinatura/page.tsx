"use client";

import { useState } from "react";

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
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-1">Escolha seu plano</h1>
      <p className="text-neutral-500 mb-6">
        1 mês grátis já em uso. Após o período, escolha um plano para continuar gerando cupons.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLANOS.map((p) => (
          <div key={p.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{p.nome}</h2>
            <p className="text-2xl font-bold my-1">{p.preco}</p>
            <p className="text-sm text-neutral-500 mb-4">{p.detalhe}</p>
            <button
              onClick={() => assinar(p.id)}
              disabled={carregando === p.id}
              className="bg-black text-white rounded px-3 py-2 w-full disabled:opacity-50"
            >
              {carregando === p.id ? "Redirecionando..." : "Assinar"}
            </button>
          </div>
        ))}
      </div>

      {erro && <p className="text-red-600 text-sm mt-4">{erro}</p>}
    </main>
  );
}

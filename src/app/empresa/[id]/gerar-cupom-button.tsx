"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GerarCupomButton({ ofertaId }: { ofertaId: string }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function gerar() {
    setCarregando(true);
    setErro(null);
    const res = await fetch("/api/cupom/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ofertaId }),
    });
    const data = await res.json();
    setCarregando(false);

    if (!res.ok) {
      setErro(data.erro ?? "Erro ao gerar cupom.");
      return;
    }
    router.push(`/cupom/${data.cupom.id}`);
  }

  return (
    <div>
      <button
        onClick={gerar}
        disabled={carregando}
        className="bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
      >
        {carregando ? "Gerando..." : "Gerar cupom"}
      </button>
      {erro && <p className="text-red-600 text-xs mt-1">{erro}</p>}
    </div>
  );
}

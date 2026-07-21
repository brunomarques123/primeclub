"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OfertaProxima = {
  id: string;
  descricao: string;
  percentual_desconto: number;
  distanciaKm: number;
  empresas: { id: string; nome: string; categoria: string } | null;
};

export default function PertoDeMimPage() {
  const [ofertas, setOfertas] = useState<OfertaProxima[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      const id = setTimeout(() => setErro("Geolocalização não suportada neste navegador."), 0);
      return () => clearTimeout(id);
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`/api/ofertas/perto?lat=${latitude}&lng=${longitude}`);
        const data = await res.json();
        setOfertas(data.ofertas ?? []);
      },
      () => setErro("Não foi possível obter sua localização. Permita o acesso e tente novamente.")
    );
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-6">
        <Link href="/" className="text-sm text-neutral-400 hover:text-amber-300 transition-colors">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-extrabold mt-4 mb-6">Ofertas perto de mim</h1>

        {erro && <p className="text-red-400">{erro}</p>}
        {!erro && ofertas === null && <p className="text-neutral-400">Buscando sua localização...</p>}
        {ofertas?.length === 0 && (
          <p className="text-neutral-500 border border-dashed border-neutral-800 rounded-2xl p-6 text-center">
            Nenhuma oferta em um raio de 10km.
          </p>
        )}

        <div className="grid gap-4">
          {ofertas?.map((oferta) => (
            <Link
              key={oferta.id}
              href={`/empresa/${oferta.empresas?.id}`}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:border-amber-400/30 transition-colors"
            >
              <p className="text-xs uppercase tracking-wide text-amber-300">{oferta.empresas?.categoria}</p>
              <h2 className="font-semibold mt-0.5">{oferta.empresas?.nome}</h2>
              <p className="text-sm text-neutral-400">{oferta.descricao}</p>
              <div className="flex justify-between items-end mt-2">
                <p className="text-xl font-extrabold bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
                  {oferta.percentual_desconto}% OFF
                </p>
                <p className="text-sm text-neutral-500">{oferta.distanciaKm.toFixed(1)} km</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

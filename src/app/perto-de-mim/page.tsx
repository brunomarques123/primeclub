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
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-6">Ofertas perto de mim</h1>

      {erro && <p className="text-red-600">{erro}</p>}
      {!erro && ofertas === null && <p>Buscando sua localização...</p>}
      {ofertas?.length === 0 && <p className="text-neutral-500">Nenhuma oferta em um raio de 10km.</p>}

      <div className="grid gap-4">
        {ofertas?.map((oferta) => (
          <Link
            key={oferta.id}
            href={`/empresa/${oferta.empresas?.id}`}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <p className="text-xs uppercase text-neutral-500">{oferta.empresas?.categoria}</p>
            <h2 className="font-semibold">{oferta.empresas?.nome}</h2>
            <p className="text-sm">{oferta.descricao}</p>
            <div className="flex justify-between mt-1">
              <p className="text-lg font-bold">{oferta.percentual_desconto}% OFF</p>
              <p className="text-sm text-neutral-500">{oferta.distanciaKm.toFixed(1)} km</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import GerarCupomButton from "./gerar-cupom-button";
import { favoritar, avaliar } from "./actions";
import ConsumidorDock from "@/components/consumidor-dock";

export default async function EmpresaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: empresa } = await supabase.from("empresas").select("*").eq("id", id).single();
  if (!empresa) notFound();

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("id, descricao, percentual_desconto")
    .eq("empresa_id", id)
    .eq("status", "aprovada");

  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select("nota")
    .eq("empresa_id", id);

  const mediaNota = avaliacoes?.length
    ? (avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-6 pb-28">
        <Link href="/" className="text-sm text-neutral-400 hover:text-amber-300 transition-colors">
          ← Voltar
        </Link>

        <p className="text-xs uppercase tracking-wide text-amber-300 mt-4">{empresa.categoria}</p>
        <h1 className="text-2xl font-extrabold">{empresa.nome}</h1>
        <p className="text-sm text-neutral-400">{empresa.endereco}</p>
        {mediaNota && <p className="text-sm mt-1">⭐ {mediaNota} / 5</p>}

        <form action={favoritar} className="mt-3">
          <input type="hidden" name="empresaId" value={empresa.id} />
          <button className="text-sm text-amber-300 hover:underline">☆ Favoritar</button>
        </form>

        <h2 className="text-lg font-semibold mt-8 mb-3">Ofertas ativas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ofertas?.length === 0 && (
            <p className="text-neutral-500 border border-dashed border-neutral-800 rounded-2xl p-6 text-center">
              Nenhuma oferta ativa no momento.
            </p>
          )}
          {ofertas?.map((oferta) => (
            <div
              key={oferta.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 flex items-center justify-between hover:border-amber-400/30 transition-colors"
            >
              <div>
                <p className="text-sm text-neutral-300">{oferta.descricao}</p>
                <p className="text-2xl font-extrabold mt-1 bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
                  {oferta.percentual_desconto}% OFF
                </p>
              </div>
              <GerarCupomButton ofertaId={oferta.id} />
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mt-8 mb-3">Avaliar estabelecimento</h2>
        <form
          action={avaliar}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >
          <input type="hidden" name="empresaId" value={empresa.id} />
          <select
            name="nota"
            required
            className="border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-lg px-3 py-2 w-fit focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} estrela{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            name="comentario"
            placeholder="Comentário (opcional)"
            className="border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-4 py-2 w-fit hover:brightness-110 transition"
          >
            Enviar avaliação
          </button>
        </form>
      </div>
      <ConsumidorDock />
    </div>
  );
}

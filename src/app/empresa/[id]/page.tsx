import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import GerarCupomButton from "./gerar-cupom-button";
import { favoritar, avaliar } from "./actions";

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
    <main className="mx-auto max-w-2xl p-6">
      <p className="text-xs uppercase text-neutral-500">{empresa.categoria}</p>
      <h1 className="text-2xl font-bold">{empresa.nome}</h1>
      <p className="text-sm text-neutral-500">{empresa.endereco}</p>
      {mediaNota && <p className="text-sm mt-1">⭐ {mediaNota} / 5</p>}

      <form action={favoritar} className="mt-2">
        <input type="hidden" name="empresaId" value={empresa.id} />
        <button className="text-sm underline">☆ Favoritar</button>
      </form>

      <h2 className="text-lg font-semibold mt-6 mb-2">Ofertas ativas</h2>
      <div className="grid gap-4">
        {ofertas?.length === 0 && <p className="text-neutral-500">Nenhuma oferta ativa no momento.</p>}
        {ofertas?.map((oferta) => (
          <div key={oferta.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm">{oferta.descricao}</p>
              <p className="text-lg font-bold">{oferta.percentual_desconto}% OFF</p>
            </div>
            <GerarCupomButton ofertaId={oferta.id} />
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-2">Avaliar estabelecimento</h2>
      <form action={avaliar} className="flex flex-col gap-3 border rounded-lg p-4">
        <input type="hidden" name="empresaId" value={empresa.id} />
        <select name="nota" required className="border rounded px-3 py-2 w-fit">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} estrela{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <textarea name="comentario" placeholder="Comentário (opcional)" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-black text-white rounded px-3 py-2 w-fit">
          Enviar avaliação
        </button>
      </form>
    </main>
  );
}

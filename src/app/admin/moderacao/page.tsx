import { createClient } from "@/lib/supabase/server";
import { moderarOferta } from "./actions";

export default async function ModeracaoPage() {
  const supabase = await createClient();

  const { data: pendentes } = await supabase
    .from("ofertas")
    .select("id, descricao, percentual_desconto, empresas(nome)")
    .eq("status", "pendente")
    .order("criada_em", { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">Moderação de ofertas</h1>
      <p className="text-neutral-400 mb-8">Revise antes de deixar uma oferta ir ao ar.</p>

      <div className="grid gap-4">
        {pendentes?.length === 0 && (
          <p className="text-neutral-500 border border-dashed border-neutral-800 rounded-2xl p-6 text-center">
            Nenhuma oferta pendente. 🎉
          </p>
        )}
        {pendentes?.map((oferta) => (
          <div
            key={oferta.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:border-purple-400/30 transition-colors"
          >
            <p className="text-xs uppercase tracking-wide text-purple-300">
              {(oferta.empresas as unknown as { nome: string } | null)?.nome}
            </p>
            <p className="mt-1">{oferta.descricao}</p>
            <p className="text-2xl font-extrabold mt-1 bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
              {oferta.percentual_desconto}% OFF
            </p>

            <div className="flex gap-2 mt-4">
              <form action={moderarOferta}>
                <input type="hidden" name="ofertaId" value={oferta.id} />
                <input type="hidden" name="decisao" value="aprovada" />
                <button className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-full px-4 py-1.5 text-sm transition-colors">
                  Aprovar
                </button>
              </form>
              <form action={moderarOferta}>
                <input type="hidden" name="ofertaId" value={oferta.id} />
                <input type="hidden" name="decisao" value="rejeitada" />
                <button className="bg-neutral-800 hover:bg-red-900 text-neutral-300 hover:text-red-200 font-semibold rounded-full px-4 py-1.5 text-sm transition-colors">
                  Rejeitar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

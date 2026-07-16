import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { criarOferta, encerrarOferta } from "./actions";
import ValidarCupom from "./validar-cupom";

export default async function PainelEmpresaPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: empresa } = await supabase
    .from("empresas")
    .select("*")
    .eq("usuario_id", auth.user.id)
    .single();

  if (!empresa) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <p>Este login ainda não está vinculado a nenhuma empresa parceira.</p>
      </main>
    );
  }

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("*")
    .eq("empresa_id", empresa.id)
    .order("criada_em", { ascending: false });

  return (
    <main className="mx-auto max-w-2xl p-6 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">{empresa.nome}</h1>
        <p className="text-sm text-neutral-500">{empresa.categoria}</p>
      </div>

      <ValidarCupom />

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Nova oferta</h2>
        <form action={criarOferta} className="flex flex-col gap-3">
          <input name="descricao" placeholder="Descrição da oferta" required className="border rounded px-3 py-2" />
          <input
            name="percentual"
            type="number"
            min={1}
            max={100}
            placeholder="% de desconto"
            required
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="bg-black text-white rounded px-3 py-2 w-fit">
            Enviar para moderação
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Minhas ofertas</h2>
        <div className="grid gap-3">
          {ofertas?.map((oferta) => (
            <div key={oferta.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm">{oferta.descricao}</p>
                <p className="text-xs text-neutral-500">
                  {oferta.percentual_desconto}% OFF — status: {oferta.status}
                </p>
              </div>
              {oferta.status !== "encerrada" && (
                <form action={encerrarOferta}>
                  <input type="hidden" name="ofertaId" value={oferta.id} />
                  <button className="text-sm underline">Encerrar</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

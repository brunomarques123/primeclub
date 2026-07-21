import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { criarOferta, encerrarOferta } from "./actions";
import { sair } from "@/app/logout/actions";
import ValidarCupom from "@/components/validar-cupom";

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
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-6">
        <p>Este login ainda não está vinculado a nenhuma empresa parceira.</p>
      </div>
    );
  }

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("*")
    .eq("empresa_id", empresa.id)
    .order("criada_em", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 py-6 flex flex-col gap-8">
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrimeClub" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold">{empresa.nome}</h1>
              <p className="text-sm text-amber-300 uppercase tracking-wide text-xs">{empresa.categoria}</p>
            </div>
          </div>
          <form action={sair}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-full text-neutral-400 hover:bg-red-950 hover:text-red-300 transition-colors"
            >
              Sair
            </button>
          </form>
        </header>

        <ValidarCupom />

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <h2 className="font-semibold text-lg mb-3">Nova oferta</h2>
          <form action={criarOferta} className="flex flex-col gap-3">
            <input
              name="descricao"
              placeholder="Descrição da oferta"
              required
              className="border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
            <input
              name="percentual"
              type="number"
              min={1}
              max={100}
              placeholder="% de desconto"
              required
              className="border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-4 py-2 w-fit hover:brightness-110 transition"
            >
              Enviar para moderação
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3">Minhas ofertas</h2>
          <div className="grid gap-3">
            {ofertas?.map((oferta) => (
              <div
                key={oferta.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-neutral-300">{oferta.descricao}</p>
                  <p className="text-xs text-neutral-500">
                    {oferta.percentual_desconto}% OFF — status: {oferta.status}
                  </p>
                </div>
                {oferta.status !== "encerrada" && (
                  <form action={encerrarOferta}>
                    <input type="hidden" name="ofertaId" value={oferta.id} />
                    <button className="text-sm text-red-400 hover:underline">Encerrar</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

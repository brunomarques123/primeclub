import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { moderarOferta } from "./actions";

export default async function ModeracaoPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel")
    .eq("id", auth.user.id)
    .single();
  if (usuario?.papel !== "admin") redirect("/");

  const { data: pendentes } = await supabase
    .from("ofertas")
    .select("id, descricao, percentual_desconto, empresas(nome)")
    .eq("status", "pendente")
    .order("criada_em", { ascending: true });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Moderação de ofertas</h1>

      <div className="grid gap-4">
        {pendentes?.length === 0 && <p className="text-neutral-500">Nenhuma oferta pendente.</p>}
        {pendentes?.map((oferta) => (
          <div key={oferta.id} className="border rounded-lg p-4">
            <p className="text-sm text-neutral-500">
              {(oferta.empresas as unknown as { nome: string } | null)?.nome}
            </p>
            <p>{oferta.descricao}</p>
            <p className="font-bold">{oferta.percentual_desconto}% OFF</p>

            <div className="flex gap-2 mt-3">
              <form action={moderarOferta}>
                <input type="hidden" name="ofertaId" value={oferta.id} />
                <input type="hidden" name="decisao" value="aprovada" />
                <button className="bg-green-600 text-white rounded px-3 py-1 text-sm">Aprovar</button>
              </form>
              <form action={moderarOferta}>
                <input type="hidden" name="ofertaId" value={oferta.id} />
                <input type="hidden" name="decisao" value="rejeitada" />
                <button className="bg-red-600 text-white rounded px-3 py-1 text-sm">Rejeitar</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

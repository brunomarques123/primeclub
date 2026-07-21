import { createClient } from "@/lib/supabase/server";
import NovaEmpresaForm from "./novo-empresa-form";
import { criarOfertaAdmin } from "./actions";

export default async function AdminEmpresasPage() {
  const supabase = await createClient();

  const { data: empresas } = await supabase
    .from("empresas")
    .select("*")
    .order("criado_em", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Empresas parceiras</h1>
        <p className="text-neutral-400">Cadastre novos parceiros e publique ofertas para eles.</p>
      </div>

      <div className="lg:grid lg:grid-cols-[380px_1fr] lg:items-start gap-6">
        <NovaEmpresaForm />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 mt-6 lg:mt-0">
        {empresas?.map((empresa) => (
          <div
            key={empresa.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:border-blue-400/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-lg">{empresa.nome}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  empresa.ativo
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                }`}
              >
                {empresa.ativo ? "ativa" : "inativa"}
              </span>
            </div>
            <p className="text-xs uppercase tracking-wide text-blue-300 mb-3">{empresa.categoria}</p>

            <form action={criarOfertaAdmin} className="flex flex-wrap gap-2 items-center">
              <input type="hidden" name="empresaId" value={empresa.id} />
              <input
                name="descricao"
                placeholder="Descrição da oferta"
                required
                className="border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
              <input
                name="percentual"
                type="number"
                min={1}
                max={100}
                placeholder="% OFF"
                required
                className="border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-neutral-950 font-semibold rounded-lg px-4 py-1.5 text-sm hover:brightness-110 transition"
              >
                Criar oferta já aprovada
              </button>
            </form>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

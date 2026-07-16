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
      <h1 className="text-2xl font-bold">Empresas parceiras</h1>

      <NovaEmpresaForm />

      <div className="grid gap-3">
        {empresas?.map((empresa) => (
          <div key={empresa.id} className="border rounded-lg p-4">
            <p className="font-semibold">{empresa.nome}</p>
            <p className="text-sm text-neutral-500 mb-3">
              {empresa.categoria} — {empresa.ativo ? "ativa" : "inativa"}
            </p>

            <form action={criarOfertaAdmin} className="flex flex-wrap gap-2 items-center">
              <input type="hidden" name="empresaId" value={empresa.id} />
              <input
                name="descricao"
                placeholder="Descrição da oferta"
                required
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[160px]"
              />
              <input
                name="percentual"
                type="number"
                min={1}
                max={100}
                placeholder="% OFF"
                required
                className="border rounded px-2 py-1 text-sm w-20"
              />
              <button type="submit" className="bg-black text-white rounded px-3 py-1 text-sm">
                Criar oferta já aprovada
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

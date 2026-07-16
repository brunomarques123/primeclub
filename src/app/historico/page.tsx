import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type CupomHistorico = {
  id: string;
  status: string;
  validado_em: string | null;
  ofertas: {
    descricao: string;
    percentual_desconto: number;
    empresas: { nome: string } | null;
  } | null;
};

const SELOS = [
  { minimo: 1, nome: "Curioso", descricao: "Usou o primeiro cupom" },
  { minimo: 5, nome: "Explorador", descricao: "Já visitou 5 lugares diferentes com cupom" },
  { minimo: 15, nome: "Nômade Urbano", descricao: "15 cupons resgatados em Bauru" },
];

export default async function HistoricoPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: cupons } = await supabase
    .from("cupons")
    .select("id, status, validado_em, ofertas(descricao, percentual_desconto, empresas(nome))")
    .eq("usuario_id", auth.user.id)
    .eq("status", "validado")
    .order("validado_em", { ascending: false });

  const historico = (cupons as unknown as CupomHistorico[]) ?? [];
  const selosConquistados = SELOS.filter((s) => historico.length >= s.minimo);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-2">Meu histórico</h1>
      <p className="text-neutral-500 mb-6">{historico.length} cupons resgatados até agora.</p>

      {selosConquistados.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selosConquistados.map((s) => (
            <span key={s.nome} className="border rounded-full px-3 py-1 text-sm" title={s.descricao}>
              🏅 {s.nome}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-3">
        {historico.length === 0 && <p className="text-neutral-500">Nenhum cupom utilizado ainda.</p>}
        {historico.map((c) => (
          <div key={c.id} className="border rounded-lg p-4">
            <p className="text-sm text-neutral-500">{c.ofertas?.empresas?.nome}</p>
            <p>{c.ofertas?.descricao}</p>
            <p className="font-bold">{c.ofertas?.percentual_desconto}% OFF</p>
            {c.validado_em && (
              <p className="text-xs text-neutral-500 mt-1">
                Usado em {new Date(c.validado_em).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

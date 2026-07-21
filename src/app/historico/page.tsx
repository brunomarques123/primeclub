import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 py-6">
        <Link href="/" className="text-sm text-neutral-400 hover:text-amber-300 transition-colors">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-extrabold mt-4 mb-1">Meu histórico</h1>
        <p className="text-neutral-400 mb-6">{historico.length} cupons resgatados até agora.</p>

        {selosConquistados.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selosConquistados.map((s) => (
              <span
                key={s.nome}
                className="border border-amber-400/30 bg-amber-400/10 text-amber-300 rounded-full px-3 py-1 text-sm"
                title={s.descricao}
              >
                🏅 {s.nome}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-3">
          {historico.length === 0 && (
            <p className="text-neutral-500 border border-dashed border-neutral-800 rounded-2xl p-6 text-center">
              Nenhum cupom utilizado ainda.
            </p>
          )}
          {historico.map((c) => (
            <div key={c.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <p className="text-xs uppercase tracking-wide text-amber-300">{c.ofertas?.empresas?.nome}</p>
              <p className="text-neutral-300 mt-0.5">{c.ofertas?.descricao}</p>
              <p className="text-xl font-extrabold mt-1 bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
                {c.ofertas?.percentual_desconto}% OFF
              </p>
              {c.validado_em && (
                <p className="text-xs text-neutral-500 mt-1">
                  Usado em {new Date(c.validado_em).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

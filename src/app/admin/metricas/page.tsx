import { createAdminClient } from "@/lib/supabase/admin";

export default async function MetricasPage() {
  const admin = createAdminClient();

  const [{ count: totalUsuarios }, { count: assinantesAtivos }, { data: cupons }, { count: empresasAtivas }, { data: ofertas }] =
    await Promise.all([
      admin.from("usuarios").select("id", { count: "exact", head: true }).eq("papel", "consumidor"),
      admin
        .from("usuarios")
        .select("id", { count: "exact", head: true })
        .eq("papel", "consumidor")
        .neq("plano", "trial")
        .eq("status_assinatura", "ativa"),
      admin.from("cupons").select("status"),
      admin.from("empresas").select("id", { count: "exact", head: true }).eq("ativo", true),
      admin.from("ofertas").select("id, percentual_desconto, empresas(categoria)"),
    ]);

  const totalCupons = cupons?.length ?? 0;
  const cuponsValidados = cupons?.filter((c) => c.status === "validado").length ?? 0;
  const taxaResgate = totalCupons ? ((cuponsValidados / totalCupons) * 100).toFixed(1) : "0";
  const taxaConversaoTrial =
    totalUsuarios && assinantesAtivos ? ((assinantesAtivos / totalUsuarios) * 100).toFixed(1) : "0";

  const categorias = ((ofertas as unknown as { empresas: { categoria: string } | null }[]) ?? []).reduce(
    (acc, o) => {
      const cat = o.empresas?.categoria ?? "outros";
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const categoriaPopular = Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  const cards = [
    { label: "Usuários cadastrados", valor: totalUsuarios ?? 0 },
    { label: "Assinantes pagantes ativos", valor: assinantesAtivos ?? 0 },
    { label: "Conversão trial → pago", valor: `${taxaConversaoTrial}%` },
    { label: "Cupons gerados", valor: totalCupons },
    { label: "Taxa de resgate de cupons", valor: `${taxaResgate}%` },
    { label: "Empresas ativas", valor: empresasAtivas ?? 0 },
    { label: "Categoria mais popular", valor: categoriaPopular },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Métricas</h1>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-4">
            <p className="text-sm text-neutral-500">{c.label}</p>
            <p className="text-2xl font-bold">{c.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

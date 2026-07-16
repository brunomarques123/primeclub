import Link from "next/link";

const ATALHOS = [
  { href: "/admin/empresas", titulo: "Empresas", descricao: "Cadastrar empresas e criar ofertas" },
  { href: "/admin/moderacao", titulo: "Moderação", descricao: "Aprovar ou rejeitar ofertas pendentes" },
  { href: "/admin/validar-cupom", titulo: "Validar cupom", descricao: "Validar cupom de qualquer empresa" },
  { href: "/admin/metricas", titulo: "Métricas", descricao: "Indicadores do negócio" },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Painel administrativo</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {ATALHOS.map((a) => (
          <Link key={a.href} href={a.href} className="border rounded-lg p-4 hover:shadow transition">
            <h2 className="font-semibold">{a.titulo}</h2>
            <p className="text-sm text-neutral-500">{a.descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

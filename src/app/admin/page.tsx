import Link from "next/link";

const ATALHOS = [
  {
    href: "/admin/empresas",
    titulo: "Empresas",
    descricao: "Cadastrar empresas e criar ofertas",
    icone: "🏬",
    corDe: "from-blue-500/20",
    corAnel: "hover:ring-blue-400/40",
    corTexto: "group-hover:text-blue-300",
  },
  {
    href: "/admin/moderacao",
    titulo: "Moderação",
    descricao: "Aprovar ou rejeitar ofertas pendentes",
    icone: "🛡️",
    corDe: "from-purple-500/20",
    corAnel: "hover:ring-purple-400/40",
    corTexto: "group-hover:text-purple-300",
  },
  {
    href: "/admin/validar-cupom",
    titulo: "Validar cupom",
    descricao: "Validar cupom de qualquer empresa",
    icone: "🎟️",
    corDe: "from-emerald-500/20",
    corAnel: "hover:ring-emerald-400/40",
    corTexto: "group-hover:text-emerald-300",
  },
  {
    href: "/admin/metricas",
    titulo: "Métricas",
    descricao: "Indicadores do negócio",
    icone: "📊",
    corDe: "from-amber-500/20",
    corAnel: "hover:ring-amber-400/40",
    corTexto: "group-hover:text-amber-300",
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">Painel administrativo</h1>
      <p className="text-neutral-400 mb-8">Gerencie empresas, ofertas e acompanhe os números do PrimeClub.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ATALHOS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-5 ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-xl ${a.corAnel}`}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.corDe} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative flex items-start gap-4">
              <span className="text-3xl">{a.icone}</span>
              <div>
                <h2 className={`font-semibold text-lg text-neutral-100 transition-colors ${a.corTexto}`}>
                  {a.titulo}
                </h2>
                <p className="text-sm text-neutral-400">{a.descricao}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

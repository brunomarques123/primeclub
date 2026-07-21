import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sair } from "@/app/logout/actions";

type OfertaComEmpresa = {
  id: string;
  descricao: string;
  percentual_desconto: number;
  empresas: {
    id: string;
    nome: string;
    categoria: string;
    endereco: string | null;
  } | null;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; modo?: string }>;
}) {
  const { categoria, modo } = await searchParams;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel")
    .eq("id", auth.user.id)
    .single();
  const papel = usuario?.papel ?? null;

  if (modo !== "consumidor") {
    if (papel === "admin") redirect("/admin");
    if (papel === "empresa") redirect("/empresa/painel");
  }

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("id, descricao, percentual_desconto, empresas(id, nome, categoria, endereco)")
    .eq("status", "aprovada")
    .order("criada_em", { ascending: false });

  const todas = (ofertas as unknown as OfertaComEmpresa[] | null) ?? [];
  const filtradas = categoria ? todas.filter((o) => o.empresas?.categoria === categoria) : todas;

  const categorias = Array.from(
    new Set(todas.map((o) => o.empresas?.categoria).filter(Boolean) as string[])
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-6">
        <header className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrimeClub" width={40} height={40} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight">
              PrimeClub{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                Bauru
              </span>
            </span>
          </Link>
          <nav className="flex gap-1 text-sm items-center flex-wrap bg-neutral-900 rounded-full p-1 border border-neutral-800">
            <Link href="/perto-de-mim" className="px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-amber-300 transition-colors">
              Perto de mim
            </Link>
            <Link href="/favoritos" className="px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-amber-300 transition-colors">
              Favoritos
            </Link>
            <Link href="/historico" className="px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-amber-300 transition-colors">
              Histórico
            </Link>
            <Link href="/assinatura" className="px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-amber-300 transition-colors">
              Assinatura
            </Link>
            {papel === "admin" && (
              <Link href="/admin" className="px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-amber-300 transition-colors">
                Painel administrativo
              </Link>
            )}
            <form action={sair}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-full text-neutral-400 hover:bg-red-950 hover:text-red-300 transition-colors"
              >
                Sair
              </button>
            </form>
          </nav>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
              !categoria
                ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 border-transparent font-semibold"
                : "border-neutral-800 text-neutral-300 hover:border-amber-400/40"
            }`}
          >
            Todas
          </Link>
          {categorias.map((c) => (
            <Link
              key={c}
              href={`/?categoria=${encodeURIComponent(c)}`}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                categoria === c
                  ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 border-transparent font-semibold"
                  : "border-neutral-800 text-neutral-300 hover:border-amber-400/40"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid gap-4">
          {filtradas.length === 0 && (
            <p className="text-neutral-500 border border-dashed border-neutral-800 rounded-2xl p-8 text-center">
              Nenhuma oferta ativa no momento.
            </p>
          )}
          {filtradas.map((oferta) => (
            <Link
              key={oferta.id}
              href={`/empresa/${oferta.empresas?.id}`}
              className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:-translate-y-0.5 hover:shadow-xl hover:border-amber-400/30 transition-all"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wide text-amber-300">{oferta.empresas?.categoria}</p>
                <h2 className="font-semibold text-lg mt-0.5">{oferta.empresas?.nome}</h2>
                <p className="text-sm text-neutral-400">{oferta.descricao}</p>
                <p className="text-2xl font-extrabold mt-2 bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
                  {oferta.percentual_desconto}% OFF
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

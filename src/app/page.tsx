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
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) redirect("/login");

  let papel: string | null = null;
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel")
    .eq("id", auth.user.id)
    .single();
  papel = usuario?.papel ?? null;

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
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="PrimeClub" width={40} height={40} className="rounded" />
          <span className="text-xl font-bold">PrimeClub — Bauru</span>
        </Link>
        <nav className="flex gap-4 text-sm items-center flex-wrap">
          <Link href="/perto-de-mim">Perto de mim</Link>
          <Link href="/favoritos">Favoritos</Link>
          <Link href="/historico">Histórico</Link>
          <Link href="/assinatura">Assinatura</Link>
          {papel === "empresa" && <Link href="/empresa/painel">Painel da empresa</Link>}
          {papel === "admin" && (
            <>
              <Link href="/admin/empresas">Empresas</Link>
              <Link href="/admin/moderacao">Moderação</Link>
              <Link href="/admin/validar-cupom">Validar cupom</Link>
              <Link href="/admin/metricas">Métricas</Link>
            </>
          )}
          <form action={sair}>
            <button type="submit">Sair</button>
          </form>
        </nav>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/"
          className={`px-3 py-1 rounded-full border text-sm ${!categoria ? "bg-black text-white" : ""}`}
        >
          Todas
        </Link>
        {categorias.map((c) => (
          <Link
            key={c}
            href={`/?categoria=${encodeURIComponent(c)}`}
            className={`px-3 py-1 rounded-full border text-sm ${categoria === c ? "bg-black text-white" : ""}`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {filtradas.length === 0 && (
          <p className="text-neutral-500">Nenhuma oferta ativa no momento.</p>
        )}
        {filtradas.map((oferta) => (
          <Link
            key={oferta.id}
            href={`/empresa/${oferta.empresas?.id}`}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <p className="text-xs uppercase text-neutral-500">{oferta.empresas?.categoria}</p>
            <h2 className="font-semibold">{oferta.empresas?.nome}</h2>
            <p className="text-sm">{oferta.descricao}</p>
            <p className="text-lg font-bold mt-1">{oferta.percentual_desconto}% OFF</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

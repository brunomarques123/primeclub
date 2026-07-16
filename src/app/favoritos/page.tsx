import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FavoritosPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: favoritos } = await supabase
    .from("favoritos")
    .select("empresas(id, nome, categoria)")
    .eq("usuario_id", auth.user.id);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Favoritos</h1>
      <div className="grid gap-3">
        {favoritos?.length === 0 && <p className="text-neutral-500">Nenhuma empresa favoritada ainda.</p>}
        {favoritos?.map((f, i) => {
          const empresa = f.empresas as unknown as { id: string; nome: string; categoria: string } | null;
          if (!empresa) return null;
          return (
            <Link key={i} href={`/empresa/${empresa.id}`} className="border rounded-lg p-4 hover:shadow">
              <p className="text-xs uppercase text-neutral-500">{empresa.categoria}</p>
              <p className="font-semibold">{empresa.nome}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

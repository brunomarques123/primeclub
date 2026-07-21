import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConsumidorDock from "@/components/consumidor-dock";

export default async function FavoritosPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: favoritos } = await supabase
    .from("favoritos")
    .select("empresas(id, nome, categoria)")
    .eq("usuario_id", auth.user.id);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 py-6 pb-28">
        <Link href="/" className="text-sm text-neutral-400 hover:text-amber-300 transition-colors">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-extrabold mt-4 mb-6">Favoritos</h1>
        <div className="grid gap-3">
          {favoritos?.length === 0 && (
            <p className="text-neutral-500 border border-dashed border-neutral-800 rounded-2xl p-6 text-center">
              Nenhuma empresa favoritada ainda.
            </p>
          )}
          {favoritos?.map((f, i) => {
            const empresa = f.empresas as unknown as { id: string; nome: string; categoria: string } | null;
            if (!empresa) return null;
            return (
              <Link
                key={i}
                href={`/empresa/${empresa.id}`}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:border-amber-400/30 transition-colors"
              >
                <p className="text-xs uppercase tracking-wide text-amber-300">{empresa.categoria}</p>
                <p className="font-semibold">{empresa.nome}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <ConsumidorDock />
    </div>
  );
}

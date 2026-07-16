import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sair } from "@/app/logout/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel")
    .eq("id", auth.user.id)
    .single();
  if (usuario?.papel !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="PrimeClub" width={36} height={36} className="rounded" />
          <span className="text-lg font-bold">PrimeClub Admin</span>
        </Link>
        <nav className="flex gap-4 text-sm items-center flex-wrap">
          <Link href="/admin/empresas">Empresas</Link>
          <Link href="/admin/moderacao">Moderação</Link>
          <Link href="/admin/validar-cupom">Validar cupom</Link>
          <Link href="/admin/metricas">Métricas</Link>
          <Link href="/" className="text-neutral-500">
            Ver como consumidor
          </Link>
          <form action={sair}>
            <button type="submit">Sair</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}

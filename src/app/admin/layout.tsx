import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sair } from "@/app/logout/actions";
import AdminDock from "@/components/admin-dock";

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-6 pb-28">
        <header className="flex items-center justify-between mb-8 gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrimeClub" width={40} height={40} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight">
              PrimeClub{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                Admin
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/?modo=consumidor"
              title="Ver como consumidor"
              className="grid h-10 w-10 place-items-center rounded-full border border-neutral-800 bg-neutral-900 cursor-pointer text-lg transition-all hover:scale-110 hover:border-neutral-600 hover:bg-neutral-800"
            >
              👁️
            </Link>
            <form action={sair}>
              <button
                type="submit"
                title="Sair"
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-800 bg-neutral-900 cursor-pointer text-lg transition-all hover:scale-110 hover:border-red-500/40 hover:bg-red-950"
              >
                🚪
              </button>
            </form>
          </div>
        </header>
        {children}
      </div>
      <AdminDock />
    </div>
  );
}

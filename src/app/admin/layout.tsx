import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sair } from "@/app/logout/actions";

const NAV = [
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/moderacao", label: "Moderação" },
  { href: "/admin/validar-cupom", label: "Validar cupom" },
  { href: "/admin/metricas", label: "Métricas" },
];

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
      <div className="mx-auto max-w-5xl px-6 py-6">
        <header className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrimeClub" width={40} height={40} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight">
              PrimeClub{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                Admin
              </span>
            </span>
          </Link>
          <nav className="flex gap-1 text-sm items-center flex-wrap bg-neutral-900 rounded-full p-1 border border-neutral-800">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-amber-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/?modo=consumidor"
              className="px-3 py-1.5 rounded-full text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
            >
              Ver como consumidor
            </Link>
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
        {children}
      </div>
    </div>
  );
}

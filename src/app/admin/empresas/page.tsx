import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NovaEmpresaForm from "./novo-empresa-form";

export default async function AdminEmpresasPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel")
    .eq("id", auth.user.id)
    .single();
  if (usuario?.papel !== "admin") redirect("/");

  const { data: empresas } = await supabase
    .from("empresas")
    .select("*")
    .order("criado_em", { ascending: false });

  return (
    <main className="mx-auto max-w-2xl p-6 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Empresas parceiras</h1>

      <NovaEmpresaForm />

      <div className="grid gap-3">
        {empresas?.map((empresa) => (
          <div key={empresa.id} className="border rounded-lg p-4">
            <p className="font-semibold">{empresa.nome}</p>
            <p className="text-sm text-neutral-500">
              {empresa.categoria} — {empresa.ativo ? "ativa" : "inativa"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

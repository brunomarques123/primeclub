import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ValidarCupom from "@/components/validar-cupom";

export default async function AdminValidarCupomPage() {
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
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Validar cupom (qualquer empresa)</h1>
      <ValidarCupom />
    </main>
  );
}

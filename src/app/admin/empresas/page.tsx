import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cadastrarEmpresa } from "./actions";

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

      <form action={cadastrarEmpresa} className="border rounded-lg p-4 grid gap-3">
        <h2 className="font-semibold">Cadastrar nova empresa</h2>
        <input name="nome" placeholder="Nome do estabelecimento" required className="border rounded px-3 py-2" />
        <input name="cnpj" placeholder="CNPJ" required className="border rounded px-3 py-2" />
        <input name="categoria" placeholder="Categoria (ex: Alimentação, Beleza)" required className="border rounded px-3 py-2" />
        <input name="endereco" placeholder="Endereço" className="border rounded px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input name="latitude" type="number" step="any" placeholder="Latitude" className="border rounded px-3 py-2" />
          <input name="longitude" type="number" step="any" placeholder="Longitude" className="border rounded px-3 py-2" />
        </div>
        <hr />
        <p className="text-sm text-neutral-500">Login do painel da empresa (opcional agora, pode ser criado depois)</p>
        <input name="emailLogin" type="email" placeholder="E-mail de login" className="border rounded px-3 py-2" />
        <input name="senhaLogin" type="password" placeholder="Senha provisória" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-black text-white rounded px-3 py-2 w-fit">
          Cadastrar
        </button>
      </form>

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

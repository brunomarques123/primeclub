"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cpfValido, limparCpf } from "@/lib/cpf";
import { redirect } from "next/navigation";

export type CadastroState = { erro?: string };

export async function cadastrar(
  _prev: CadastroState,
  formData: FormData
): Promise<CadastroState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const cpf = limparCpf(String(formData.get("cpf") ?? ""));
  const telefone = String(formData.get("telefone") ?? "").trim();
  const aceite = formData.get("aceite") === "on";

  if (!nome || !email || !senha || !cpf) {
    return { erro: "Preencha todos os campos obrigatórios." };
  }
  if (!cpfValido(cpf)) {
    return { erro: "CPF inválido." };
  }
  if (!aceite) {
    return { erro: "É necessário aceitar os Termos de Uso e a Política de Privacidade." };
  }

  // Impede reaproveitar o mês grátis: CPF é único e permanente, independente do e-mail usado.
  const admin = createAdminClient();
  const { data: cpfExistente } = await admin
    .from("usuarios")
    .select("id")
    .eq("cpf", cpf)
    .maybeSingle();

  if (cpfExistente) {
    return { erro: "Este CPF já possui cadastro no PrimeClub." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (authError || !authData.user) {
    return { erro: authError?.message ?? "Não foi possível criar a conta." };
  }

  const { error: insertError } = await admin.from("usuarios").insert({
    id: authData.user.id,
    nome,
    email,
    cpf,
    telefone,
    papel: "consumidor",
    plano: "trial",
    status_assinatura: "ativa",
    trial_usado: true,
  });

  if (insertError) {
    return { erro: "Erro ao registrar dados do usuário: " + insertError.message };
  }

  redirect("/");
}

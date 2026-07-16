"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CadastrarEmpresaState = { erro?: string };

export async function cadastrarEmpresa(
  _prev: CadastrarEmpresaState,
  formData: FormData
): Promise<CadastrarEmpresaState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { erro: "Não autenticado." };

  const nome = String(formData.get("nome"));
  const cnpj = String(formData.get("cnpj")).replace(/\D/g, "");
  const categoria = String(formData.get("categoria"));
  const endereco = String(formData.get("endereco") ?? "");
  const latitude = formData.get("latitude") ? Number(formData.get("latitude")) : null;
  const longitude = formData.get("longitude") ? Number(formData.get("longitude")) : null;
  const emailLogin = String(formData.get("emailLogin") ?? "").trim().toLowerCase();
  const senhaLogin = String(formData.get("senhaLogin") ?? "");

  const admin = createAdminClient();

  const { data: cnpjExistente } = await admin
    .from("empresas")
    .select("id")
    .eq("cnpj", cnpj)
    .maybeSingle();
  if (cnpjExistente) {
    return { erro: "Já existe uma empresa cadastrada com esse CNPJ." };
  }

  let usuarioId: string | null = null;

  if (emailLogin && senhaLogin) {
    const { data: novoUsuario, error: authError } = await admin.auth.admin.createUser({
      email: emailLogin,
      password: senhaLogin,
      email_confirm: true,
    });
    if (authError || !novoUsuario.user) {
      return {
        erro:
          authError?.message === "A user with this email address has already been registered"
            ? "Já existe um usuário com esse e-mail de login. Use outro e-mail ou deixe em branco para cadastrar sem login por enquanto."
            : authError?.message ?? "Erro ao criar login da empresa.",
      };
    }
    usuarioId = novoUsuario.user.id;

    const { error: insertUsuarioError } = await admin.from("usuarios").insert({
      id: usuarioId,
      nome,
      email: emailLogin,
      cpf: cnpj, // empresas não têm CPF; usa CNPJ como identificador único do registro de usuário
      papel: "empresa",
    });
    if (insertUsuarioError) {
      await admin.auth.admin.deleteUser(usuarioId);
      return { erro: "Erro ao registrar login da empresa: " + insertUsuarioError.message };
    }
  }

  const { error: insertEmpresaError } = await admin.from("empresas").insert({
    usuario_id: usuarioId,
    nome,
    cnpj,
    categoria,
    endereco,
    latitude,
    longitude,
    contrato_assinado: true,
  });

  if (insertEmpresaError) {
    return { erro: "Erro ao cadastrar empresa: " + insertEmpresaError.message };
  }

  revalidatePath("/admin/empresas");
  return {};
}

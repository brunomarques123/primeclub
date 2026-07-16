"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function cadastrarEmpresa(formData: FormData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado.");

  const nome = String(formData.get("nome"));
  const cnpj = String(formData.get("cnpj")).replace(/\D/g, "");
  const categoria = String(formData.get("categoria"));
  const endereco = String(formData.get("endereco") ?? "");
  const latitude = formData.get("latitude") ? Number(formData.get("latitude")) : null;
  const longitude = formData.get("longitude") ? Number(formData.get("longitude")) : null;
  const emailLogin = String(formData.get("emailLogin") ?? "").trim().toLowerCase();
  const senhaLogin = String(formData.get("senhaLogin") ?? "");

  const admin = createAdminClient();

  let usuarioId: string | null = null;

  if (emailLogin && senhaLogin) {
    const { data: novoUsuario, error: authError } = await admin.auth.admin.createUser({
      email: emailLogin,
      password: senhaLogin,
      email_confirm: true,
    });
    if (authError || !novoUsuario.user) {
      throw new Error(authError?.message ?? "Erro ao criar login da empresa.");
    }
    usuarioId = novoUsuario.user.id;

    await admin.from("usuarios").insert({
      id: usuarioId,
      nome,
      email: emailLogin,
      cpf: cnpj, // empresas não têm CPF; usa CNPJ como identificador único do registro de usuário
      papel: "empresa",
    });
  }

  await admin.from("empresas").insert({
    usuario_id: usuarioId,
    nome,
    cnpj,
    categoria,
    endereco,
    latitude,
    longitude,
    contrato_assinado: true,
  });

  revalidatePath("/admin/empresas");
}

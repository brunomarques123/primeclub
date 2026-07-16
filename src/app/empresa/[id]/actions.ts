"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function favoritar(formData: FormData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado.");

  const empresaId = String(formData.get("empresaId"));
  await supabase.from("favoritos").upsert({ usuario_id: auth.user.id, empresa_id: empresaId });
  revalidatePath(`/empresa/${empresaId}`);
}

export async function avaliar(formData: FormData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado.");

  const empresaId = String(formData.get("empresaId"));
  const nota = Number(formData.get("nota"));
  const comentario = String(formData.get("comentario") ?? "");

  await supabase
    .from("avaliacoes")
    .upsert({ empresa_id: empresaId, usuario_id: auth.user.id, nota, comentario });

  revalidatePath(`/empresa/${empresaId}`);
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function criarOferta(formData: FormData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado.");

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id")
    .eq("usuario_id", auth.user.id)
    .single();
  if (!empresa) throw new Error("Nenhuma empresa vinculada a este login.");

  const descricao = String(formData.get("descricao") ?? "");
  const percentual = Number(formData.get("percentual"));

  await supabase.from("ofertas").insert({
    empresa_id: empresa.id,
    descricao,
    percentual_desconto: percentual,
    status: "pendente",
  });

  revalidatePath("/empresa/painel");
}

export async function encerrarOferta(formData: FormData) {
  const supabase = await createClient();
  const ofertaId = String(formData.get("ofertaId"));
  await supabase.from("ofertas").update({ status: "encerrada" }).eq("id", ofertaId);
  revalidatePath("/empresa/painel");
}

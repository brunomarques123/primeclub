"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { enviarNotificacaoOfertaProxima } from "@/lib/onesignal";

export async function moderarOferta(formData: FormData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado.");

  const ofertaId = String(formData.get("ofertaId"));
  const decisao = String(formData.get("decisao")) as "aprovada" | "rejeitada";

  const { data: oferta } = await supabase
    .from("ofertas")
    .update({ status: decisao, moderada_em: new Date().toISOString(), moderada_por: auth.user.id })
    .eq("id", ofertaId)
    .select("descricao, empresas(nome, latitude, longitude)")
    .single();

  if (decisao === "aprovada" && oferta) {
    const empresa = oferta.empresas as unknown as { nome: string; latitude: number | null; longitude: number | null } | null;
    if (empresa?.latitude != null && empresa?.longitude != null) {
      await enviarNotificacaoOfertaProxima({
        titulo: `Nova oferta em ${empresa.nome}`,
        mensagem: oferta.descricao,
        latitude: empresa.latitude,
        longitude: empresa.longitude,
        raioKm: 10,
      });
    }
  }

  revalidatePath("/admin/moderacao");
}

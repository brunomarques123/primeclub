import { NextRequest, NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { mercadoPagoClient } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

// Mercado Pago envia notificações de mudança de status da assinatura (autorizada, pausada, cancelada).
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.type !== "subscription_preapproval" && body.action !== "updated") {
    return NextResponse.json({ ok: true });
  }

  const preApprovalId = body.data?.id;
  if (!preApprovalId) return NextResponse.json({ ok: true });

  const preApproval = new PreApproval(mercadoPagoClient());
  const dados = await preApproval.get({ id: preApprovalId });

  const usuarioId = dados.external_reference;
  if (!usuarioId) return NextResponse.json({ ok: true });

  const statusMap: Record<string, string> = {
    authorized: "ativa",
    paused: "atrasada",
    cancelled: "cancelada",
  };
  const statusAssinatura = statusMap[dados.status ?? ""] ?? "expirada";

  const admin = createAdminClient();
  await admin.from("usuarios").update({ status_assinatura: statusAssinatura }).eq("id", usuarioId);

  return NextResponse.json({ ok: true });
}

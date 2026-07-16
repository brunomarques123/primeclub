import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { criarAssinatura, PLANOS } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user?.email) {
    return NextResponse.json({ erro: "É necessário estar logado." }, { status: 401 });
  }

  const { plano } = await request.json();
  if (plano !== "basico" && plano !== "premium") {
    return NextResponse.json({ erro: "Plano inválido." }, { status: 400 });
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("trial_usado, plano")
    .eq("id", auth.user.id)
    .single();

  // Mês grátis: só é aplicado automaticamente pelo status inicial "trial" do usuário;
  // ao assinar um plano pago, o Mercado Pago já cobra a partir do próximo ciclo.
  const assinatura = await criarAssinatura({
    email: auth.user.email,
    plano,
    usuarioId: auth.user.id,
  });

  return NextResponse.json({ initPoint: assinatura.init_point, planoInfo: PLANOS[plano as keyof typeof PLANOS], usuarioAtual: usuario });
}

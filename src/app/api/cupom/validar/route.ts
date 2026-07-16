import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Aceita tanto o payload do QR Code quanto o código alfanumérico manual (fallback).
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ erro: "É necessário estar logado como empresa." }, { status: 401 });
  }

  const { entrada } = await request.json();
  if (!entrada) {
    return NextResponse.json({ erro: "Informe o código ou QR Code do cupom." }, { status: 400 });
  }

  const { data: cupom } = await supabase
    .from("cupons")
    .select("*")
    .or(`qr_payload.eq.${entrada},codigo.eq.${entrada}`)
    .maybeSingle();

  if (!cupom) {
    return NextResponse.json({ erro: "Cupom não encontrado." }, { status: 404 });
  }
  if (cupom.status === "validado") {
    return NextResponse.json({ erro: "Cupom já foi utilizado." }, { status: 409 });
  }
  if (new Date(cupom.expira_em) < new Date()) {
    await supabase.from("cupons").update({ status: "expirado" }).eq("id", cupom.id);
    return NextResponse.json({ erro: "Cupom expirado." }, { status: 409 });
  }

  const { data: atualizado, error } = await supabase
    .from("cupons")
    .update({ status: "validado", validado_em: new Date().toISOString() })
    .eq("id", cupom.id)
    .select()
    .single();

  if (error) {
    // Falha aqui costuma ser RLS: o cupom não pertence a uma oferta desta empresa.
    return NextResponse.json({ erro: "Você não tem permissão para validar este cupom." }, { status: 403 });
  }

  return NextResponse.json({ cupom: atualizado });
}

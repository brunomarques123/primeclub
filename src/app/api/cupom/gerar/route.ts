import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes, randomUUID } from "crypto";

const EXPIRA_EM_MINUTOS = 15;

function gerarCodigo() {
  return randomBytes(4).toString("hex").toUpperCase(); // ex: A1B2C3D4
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ erro: "É necessário estar logado." }, { status: 401 });
  }

  const { ofertaId } = await request.json();
  if (!ofertaId) {
    return NextResponse.json({ erro: "ofertaId é obrigatório." }, { status: 400 });
  }

  const { data: oferta } = await supabase
    .from("ofertas")
    .select("id, status")
    .eq("id", ofertaId)
    .single();

  if (!oferta || oferta.status !== "aprovada") {
    return NextResponse.json({ erro: "Oferta indisponível." }, { status: 404 });
  }

  const expiraEm = new Date(Date.now() + EXPIRA_EM_MINUTOS * 60 * 1000).toISOString();

  const { data: cupom, error } = await supabase
    .from("cupons")
    .insert({
      oferta_id: ofertaId,
      usuario_id: auth.user.id,
      codigo: gerarCodigo(),
      qr_payload: randomUUID(),
      status: "gerado",
      expira_em: expiraEm,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  return NextResponse.json({ cupom });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { distanciaKm } from "@/lib/geo";

const RAIO_KM = 10;

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ erro: "lat/lng inválidos" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("id, descricao, percentual_desconto, empresas(id, nome, categoria, latitude, longitude)")
    .eq("status", "aprovada");

  type Row = {
    id: string;
    descricao: string;
    percentual_desconto: number;
    empresas: { id: string; nome: string; categoria: string; latitude: number | null; longitude: number | null } | null;
  };

  const proximas = ((ofertas as unknown as Row[]) ?? [])
    .filter((o) => o.empresas?.latitude != null && o.empresas?.longitude != null)
    .map((o) => ({
      ...o,
      distanciaKm: distanciaKm(lat, lng, o.empresas!.latitude!, o.empresas!.longitude!),
    }))
    .filter((o) => o.distanciaKm <= RAIO_KM)
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  return NextResponse.json({ ofertas: proximas });
}

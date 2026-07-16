import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

export default async function CupomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cupom } = await supabase.from("cupons").select("*").eq("id", id).single();
  if (!cupom) notFound();

  const qrDataUrl = await QRCode.toDataURL(cupom.qr_payload);
  const expirado = new Date(cupom.expira_em) < new Date();

  return (
    <main className="mx-auto max-w-sm p-6 text-center">
      <h1 className="text-xl font-bold mb-1">Seu cupom</h1>
      <p className="text-sm text-neutral-500 mb-6">Apresente no caixa do estabelecimento.</p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} alt="QR Code do cupom" className="mx-auto mb-4" />

      <p className="text-2xl font-mono tracking-widest">{cupom.codigo}</p>

      <p className="mt-4 text-sm">
        Status:{" "}
        <span className="font-semibold">
          {expirado && cupom.status === "gerado" ? "expirado" : cupom.status}
        </span>
      </p>
      {cupom.status === "gerado" && !expirado && (
        <p className="text-xs text-neutral-500 mt-1">
          Válido até {new Date(cupom.expira_em).toLocaleTimeString("pt-BR")}
        </p>
      )}
    </main>
  );
}

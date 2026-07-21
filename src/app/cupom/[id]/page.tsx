import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

export default async function CupomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cupom } = await supabase.from("cupons").select("*").eq("id", id).single();
  if (!cupom) notFound();

  const qrDataUrl = await QRCode.toDataURL(cupom.qr_payload, { margin: 1, width: 240 });
  const expirado = new Date(cupom.expira_em) < new Date();
  const statusExibido = expirado && cupom.status === "gerado" ? "expirado" : cupom.status;

  const statusCor =
    statusExibido === "validado"
      ? "text-emerald-400"
      : statusExibido === "expirado"
      ? "text-red-400"
      : "text-amber-300";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center shadow-2xl">
        <h1 className="text-xl font-bold mb-1">Seu cupom</h1>
        <p className="text-sm text-neutral-400 mb-6">Apresente no caixa do estabelecimento.</p>

        <div className="bg-white rounded-xl p-4 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR Code do cupom" className="mx-auto" />
        </div>

        <p className="text-2xl font-mono tracking-widest mt-4">{cupom.codigo}</p>

        <p className="mt-4 text-sm">
          Status: <span className={`font-semibold ${statusCor}`}>{statusExibido}</span>
        </p>
        {cupom.status === "gerado" && !expirado && (
          <p className="text-xs text-neutral-500 mt-1">
            Válido até {new Date(cupom.expira_em).toLocaleTimeString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  );
}

import { MercadoPagoConfig, PreApproval } from "mercadopago";

export const PLANOS = {
  basico: { nome: "Básico", preco: 3.9, limiteCupons: 4 },
  premium: { nome: "Premium", preco: 6.9, limiteCupons: null }, // null = ilimitado
} as const;

export function mercadoPagoClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
}

export async function criarAssinatura(params: {
  email: string;
  plano: keyof typeof PLANOS;
  usuarioId: string;
}) {
  const preApproval = new PreApproval(mercadoPagoClient());
  const plano = PLANOS[params.plano];

  return preApproval.create({
    body: {
      reason: `PrimeClub - Plano ${plano.nome}`,
      payer_email: params.email,
      external_reference: params.usuarioId,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: plano.preco,
        currency_id: "BRL",
      },
      back_url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      status: "authorized",
    },
  });
}

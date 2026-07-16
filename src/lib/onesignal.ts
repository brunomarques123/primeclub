const ONESIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

export async function enviarNotificacaoOfertaProxima(params: {
  titulo: string;
  mensagem: string;
  latitude: number;
  longitude: number;
  raioKm: number;
}) {
  await fetch(ONESIGNAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      headings: { pt: params.titulo },
      contents: { pt: params.mensagem },
      filters: [
        {
          field: "location",
          radius: params.raioKm * 1000,
          lat: params.latitude,
          long: params.longitude,
        },
      ],
    }),
  });
}

"use client";

import { useState } from "react";

export default function ValidarCupom() {
  const [entrada, setEntrada] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function validar() {
    setCarregando(true);
    setMensagem(null);
    const res = await fetch("/api/cupom/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entrada: entrada.trim() }),
    });
    const data = await res.json();
    setCarregando(false);

    if (!res.ok) {
      setMensagem({ tipo: "erro", texto: data.erro });
      return;
    }
    setMensagem({ tipo: "ok", texto: "Cupom validado com sucesso!" });
    setEntrada("");
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold mb-2">Validar cupom</h2>
      <p className="text-sm text-neutral-500 mb-3">
        Digite o código de 8 dígitos apresentado pelo cliente (ou o payload do QR Code).
      </p>
      <div className="flex gap-2">
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Código do cupom"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={validar}
          disabled={carregando || !entrada}
          className="bg-black text-white rounded px-4 disabled:opacity-50"
        >
          {carregando ? "Validando..." : "Validar"}
        </button>
      </div>
      {mensagem && (
        <p className={`text-sm mt-2 ${mensagem.tipo === "ok" ? "text-green-600" : "text-red-600"}`}>
          {mensagem.texto}
        </p>
      )}
    </div>
  );
}

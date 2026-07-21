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
    <div className="rounded-2xl border border-neutral-800/60 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 text-neutral-100 shadow-lg">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <span>🎟️</span> Validar cupom
      </h2>
      <p className="text-sm text-neutral-400 mb-3">
        Digite o código de 8 dígitos apresentado pelo cliente (ou o payload do QR Code).
      </p>
      <div className="flex gap-2">
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Código do cupom"
          className="border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <button
          onClick={validar}
          disabled={carregando || !entrada}
          className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-4 disabled:opacity-40 hover:brightness-110 transition"
        >
          {carregando ? "Validando..." : "Validar"}
        </button>
      </div>
      {mensagem && (
        <p className={`text-sm mt-2 font-medium ${mensagem.tipo === "ok" ? "text-emerald-400" : "text-red-400"}`}>
          {mensagem.texto}
        </p>
      )}
    </div>
  );
}

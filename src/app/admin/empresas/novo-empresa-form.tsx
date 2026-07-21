"use client";

import { useActionState } from "react";
import { cadastrarEmpresa, type CadastrarEmpresaState } from "./actions";

const estadoInicial: CadastrarEmpresaState = {};

const inputClass =
  "border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

export default function NovaEmpresaForm() {
  const [state, formAction, pending] = useActionState(cadastrarEmpresa, estadoInicial);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 grid gap-3"
    >
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <span>➕</span> Cadastrar nova empresa
      </h2>
      <input name="nome" placeholder="Nome do estabelecimento" required className={inputClass} />
      <input name="cnpj" placeholder="CNPJ" required className={inputClass} />
      <input name="categoria" placeholder="Categoria (ex: Alimentação, Beleza)" required className={inputClass} />
      <input name="endereco" placeholder="Endereço" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <input name="latitude" type="number" step="any" placeholder="Latitude" className={inputClass} />
        <input name="longitude" type="number" step="any" placeholder="Longitude" className={inputClass} />
      </div>
      <hr className="border-neutral-800" />
      <p className="text-sm text-neutral-400">
        Login do painel da empresa — recomendado preencher, para que ela consiga validar cupons e criar ofertas.
      </p>
      <input
        name="emailLogin"
        type="email"
        placeholder="E-mail de login"
        autoComplete="off"
        className={inputClass}
      />
      <input
        name="senhaLogin"
        type="password"
        placeholder="Senha provisória"
        autoComplete="new-password"
        className={inputClass}
      />

      {state.erro && <p className="text-red-400 text-sm">{state.erro}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-4 py-2 w-fit disabled:opacity-40 hover:brightness-110 transition"
      >
        {pending ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}

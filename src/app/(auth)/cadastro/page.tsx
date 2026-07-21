"use client";

import { useActionState } from "react";
import { cadastrar, type CadastroState } from "./actions";

const estadoInicial: CadastroState = {};

const inputClass =
  "border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(cadastrar, estadoInicial);

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 text-center">Criar conta</h1>
      <p className="text-sm text-neutral-400 text-center mb-6">
        1 mês grátis para novos usuários. Válido uma única vez por CPF.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <input name="nome" placeholder="Nome completo" required className={inputClass} />
        <input name="email" type="email" placeholder="E-mail" required className={inputClass} />
        <input name="cpf" placeholder="CPF" required className={inputClass} />
        <input name="telefone" placeholder="Telefone" className={inputClass} />
        <input name="senha" type="password" placeholder="Senha" required minLength={6} className={inputClass} />

        <label className="flex items-start gap-2 text-sm text-neutral-400">
          <input name="aceite" type="checkbox" required className="mt-1 accent-amber-400" />
          <span>
            Li e aceito os Termos de Uso e a Política de Privacidade, incluindo o uso do meu CPF
            para controle do período gratuito.
          </span>
        </label>

        {state.erro && <p className="text-red-400 text-sm">{state.erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-3 py-2.5 disabled:opacity-40 hover:brightness-110 transition"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </>
  );
}

"use client";

import { useActionState } from "react";
import { cadastrar, type CadastroState } from "./actions";

const estadoInicial: CadastroState = {};

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(cadastrar, estadoInicial);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-1">Criar conta</h1>
      <p className="text-sm text-neutral-500 mb-6">
        1 mês grátis para novos usuários. Válido uma única vez por CPF.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <input name="nome" placeholder="Nome completo" required className="border rounded px-3 py-2" />
        <input name="email" type="email" placeholder="E-mail" required className="border rounded px-3 py-2" />
        <input name="cpf" placeholder="CPF" required className="border rounded px-3 py-2" />
        <input name="telefone" placeholder="Telefone" className="border rounded px-3 py-2" />
        <input
          name="senha"
          type="password"
          placeholder="Senha"
          required
          minLength={6}
          className="border rounded px-3 py-2"
        />

        <label className="flex items-start gap-2 text-sm">
          <input name="aceite" type="checkbox" required className="mt-1" />
          <span>
            Li e aceito os Termos de Uso e a Política de Privacidade, incluindo o uso do meu CPF
            para controle do período gratuito.
          </span>
        </label>

        {state.erro && <p className="text-red-600 text-sm">{state.erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </main>
  );
}

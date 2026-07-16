"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "./actions";

const estadoInicial: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, estadoInicial);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <input name="email" type="email" placeholder="E-mail" required className="border rounded px-3 py-2" />
        <input name="senha" type="password" placeholder="Senha" required className="border rounded px-3 py-2" />

        {state.erro && <p className="text-red-600 text-sm">{state.erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm mt-4">
        Não tem conta?{" "}
        <Link href="/cadastro" className="underline">
          Criar conta grátis
        </Link>
      </p>
    </main>
  );
}

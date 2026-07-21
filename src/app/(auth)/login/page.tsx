"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "./actions";

const estadoInicial: LoginState = {};

const inputClass =
  "border border-neutral-700 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, estadoInicial);

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 text-center">Bem-vindo de volta</h1>
      <p className="text-sm text-neutral-400 text-center mb-6">Entre para ver as ofertas perto de você.</p>

      <form action={formAction} className="flex flex-col gap-4">
        <input name="email" type="email" placeholder="E-mail" required className={inputClass} />
        <input name="senha" type="password" placeholder="Senha" required className={inputClass} />

        {state.erro && <p className="text-red-400 text-sm">{state.erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 font-semibold rounded-lg px-3 py-2.5 disabled:opacity-40 hover:brightness-110 transition"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm mt-6 text-center text-neutral-400">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-amber-300 hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </>
  );
}

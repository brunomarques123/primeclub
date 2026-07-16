"use client";

import { useActionState } from "react";
import { cadastrarEmpresa, type CadastrarEmpresaState } from "./actions";

const estadoInicial: CadastrarEmpresaState = {};

export default function NovaEmpresaForm() {
  const [state, formAction, pending] = useActionState(cadastrarEmpresa, estadoInicial);

  return (
    <form action={formAction} className="border rounded-lg p-4 grid gap-3">
      <h2 className="font-semibold">Cadastrar nova empresa</h2>
      <input name="nome" placeholder="Nome do estabelecimento" required className="border rounded px-3 py-2" />
      <input name="cnpj" placeholder="CNPJ" required className="border rounded px-3 py-2" />
      <input name="categoria" placeholder="Categoria (ex: Alimentação, Beleza)" required className="border rounded px-3 py-2" />
      <input name="endereco" placeholder="Endereço" className="border rounded px-3 py-2" />
      <div className="grid grid-cols-2 gap-3">
        <input name="latitude" type="number" step="any" placeholder="Latitude" className="border rounded px-3 py-2" />
        <input name="longitude" type="number" step="any" placeholder="Longitude" className="border rounded px-3 py-2" />
      </div>
      <hr />
      <p className="text-sm text-neutral-500">Login do painel da empresa (opcional agora, pode ser criado depois)</p>
      <input
        name="emailLogin"
        type="email"
        placeholder="E-mail de login"
        autoComplete="off"
        className="border rounded px-3 py-2"
      />
      <input
        name="senhaLogin"
        type="password"
        placeholder="Senha provisória"
        autoComplete="new-password"
        className="border rounded px-3 py-2"
      />

      {state.erro && <p className="text-red-600 text-sm">{state.erro}</p>}

      <button type="submit" disabled={pending} className="bg-black text-white rounded px-3 py-2 w-fit disabled:opacity-50">
        {pending ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}

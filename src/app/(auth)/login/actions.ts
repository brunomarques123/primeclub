"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LoginState = { erro?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error || !data.user) {
    return { erro: "E-mail ou senha inválidos." };
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel")
    .eq("id", data.user.id)
    .single();

  if (usuario?.papel === "admin") redirect("/admin");
  if (usuario?.papel === "empresa") redirect("/empresa/painel");
  redirect("/");
}

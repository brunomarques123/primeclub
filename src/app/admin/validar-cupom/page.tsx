import ValidarCupom from "@/components/validar-cupom";

export default function AdminValidarCupomPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">Validar cupom</h1>
      <p className="text-neutral-400 mb-8">Funciona para cupons de qualquer empresa parceira.</p>
      <ValidarCupom />
    </div>
  );
}

export function limparCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

export function cpfValido(cpf: string): boolean {
  const digits = limparCpf(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calcDigito = (base: string) => {
    let soma = 0;
    let peso = base.length + 1;
    for (const char of base) {
      soma += Number(char) * peso--;
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcDigito(digits.slice(0, 9));
  const d2 = calcDigito(digits.slice(0, 9) + d1);

  return digits === digits.slice(0, 9) + String(d1) + String(d2);
}

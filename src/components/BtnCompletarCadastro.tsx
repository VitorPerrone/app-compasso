"use client";

import { useRouter } from "next/navigation";

export interface BtnCompletarCadastroProps {
  /** Rota para onde o usuário será redirecionado */
  href?: string;
  /** Texto do botão */
  label?: string;
}

export default function BtnCompletarCadastro({
  href = "/completar-cadastro",
  label = "Completar Cadastro",
}: BtnCompletarCadastroProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="bg-[#0A2647] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#0d2f57] transition focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:ring-offset-2"
    >
      {label}
    </button>
  );
}
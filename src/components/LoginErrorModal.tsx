"use client";

import { useEffect, useRef } from "react";
import BtnCompletarCadastro from "./BtnCompletarCadastro";

export interface LoginErrorModalProps {
  /** Controla se a modal está visível */
  isOpen: boolean;
  /** Chamado ao fechar (clique fora, X, botão "Fechar" ou Esc) */
  onClose: () => void;
  /** Título do erro */
  title?: string;
  /** Mensagem detalhando o erro */
  message?: string;
  /** Se informado, exibe um botão de ação (ex: focar no campo de senha, reenviar o form) */
  onRetry?: () => void;
  /** Texto do botão de ação */
  retryLabel?: string;
  showCompletarCadastro?: boolean;
  /** Rota para onde o botão "Completar cadastro" redireciona */
  completarCadastroHref?: string;
}

export default function LoginErrorModal({
  isOpen,
  onClose,
  title = "Não foi possível entrar",
  message = "Email não cadastrado em nossa plataforma. Cadastre-se ou escolha uma conta já registrada",
  onRetry,
  retryLabel = "Tentar novamente",
  showCompletarCadastro = true,
  completarCadastroHref = "/completar-cadastro",
}: LoginErrorModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fecha com a tecla Esc
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Foco automático no card ao abrir
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="login-error-title"
        aria-describedby="login-error-message"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-xl outline-none animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.007M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9Z"
              />
            </svg>
          </div>
 
          <div className="flex-1">
            <h2 id="login-error-title" className="text-base font-semibold text-gray-900">
              {title}
            </h2>
            <p id="login-error-message" className="mt-1 text-sm text-gray-600">
              {message}
            </p>
          </div>
 
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 
        <div className="mt-6 flex justify-center gap-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Fechar
          </button>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {retryLabel}
            </button>
          )}
          {showCompletarCadastro && (
            <BtnCompletarCadastro href={completarCadastroHref} />
          )}
        </div>
      </div>
    </div>
  );
}
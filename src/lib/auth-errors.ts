// lib/auth-errors.ts
import { AuthError } from '@supabase/supabase-js'

const errorMessages: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha inválidos',
  email_not_confirmed: 'Você precisa confirmar seu e-mail antes de entrar',
  user_not_found: 'Usuário não encontrado',
  user_already_exists: 'Este e-mail já está cadastrado',
  weak_password: 'A senha é muito fraca. Use pelo menos 6 caracteres',
  email_address_invalid: 'Endereço de e-mail inválido',
  over_request_rate_limit: 'Muitas tentativas. Tente novamente em alguns minutos',
  same_password: 'A nova senha deve ser diferente da atual',
  session_expired: 'Sua sessão expirou. Faça login novamente',
  signup_disabled: 'Cadastro desabilitado no momento',
}

export function translateAuthError(error: AuthError | null): string {
  if (!error) return ''

  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code]
  }

  // fallback: tenta bater pela mensagem original
  const fallbackByMessage: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha inválidos.',
    'Email not confirmed': 'Você precisa confirmar seu e-mail antes de entrar.',
    'User already registered': 'Este e-mail já está cadastrado.',
  }

  return fallbackByMessage[error.message] ?? 'Ocorreu um erro. Tente novamente.'
}
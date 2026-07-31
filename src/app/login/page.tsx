'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter, useSearchParams  } from 'next/navigation';
import LoginErrorModal from '../../components/LoginErrorModal';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

   useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      setMensagem('Email não cadastrado em nossa plataforma. Cadastre-se ou escolha uma conta já registrada');
      setHasError(true);
      router.replace('/login');
    }
  }, [searchParams, router]);


  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensagem('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMensagem(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // @ts-ignore: Forçar a propriedade flowType apesar da restrição de tipo
        flowType: 'pkce',
      },
    });

    if (error) {
      setMensagem(error.message);
      setHasError(true);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-xl font-bold text-slate-900 md:text-white">Compasso</Link>
      </div>

      <div className="w-full md:w-1/2 bg-slate-900 p-8 md:p-12 flex flex-col justify-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Bem-vindo de volta,</h1>
        <p className="text-lg md:text-xl text-slate-300">Continue a organizar o seu ministério com excelência.</p>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-left">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">E-mail</label>
              <input name="email" type="email" required placeholder="seu@email.com" className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase">Senha</label>
              <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-slate-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-slate-500">ou</span></div>
          </div>

          {/* Botão Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>

          <p className="mt-4 text-sm text-slate-600 text-center">
            Ainda não tem conta? <Link href="/registro" className="text-blue-600 font-semibold hover:underline">Criar conta</Link>
          </p>

          {mensagem && <p className="mt-4 text-red-600 text-sm font-medium text-center">{mensagem}</p>}
        </div>
      </div>
      <LoginErrorModal
        isOpen={hasError}
        onClose={() => setHasError(false)}
      />
    </main>
  );
}
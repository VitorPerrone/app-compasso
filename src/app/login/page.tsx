'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>
        <input name="email" type="email" placeholder="E-mail" className="w-full p-2 border rounded" required />
        <input name="password" type="password" placeholder="Senha" className="w-full p-2 border rounded" required />
        <button className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
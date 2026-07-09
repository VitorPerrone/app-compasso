'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase'; // A ponte que criámos
import { useRouter } from 'next/navigation';

export default function Registo() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function handleRegisto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    const formData = new FormData(e.currentTarget);
    const orgName = formData.get('orgName') as string;
    const leaderName = formData.get('leaderName') as string;
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;
    const router = useRouter();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar utilizador.');

      const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: orgName, slug }])
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          name: leaderName,
          email: email,
          role: 'ADMIN_ORG',
          organization_id: orgData.id
        }]);

      if (profileError) throw profileError;

      setMensagem('Registo concluído com sucesso! Bem-vindo ao Compasso.');
      router.push('/dashboard');
    } catch (error: any) {
      setMensagem(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Criar Organização
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Bem-vindo ao Compasso. Comece por registrar a sua igreja ou ministério.
        </p>

        <form onSubmit={handleRegisto} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Igreja/Organização</label>
            <input type="text" name="orgName" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: Igreja Batista Central" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">O seu Nome (Líder)</label>
            <input type="text" name="leaderName" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: João Silva" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" name="email" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" placeholder="joao@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Palavra-passe (Senha)</label>
            <input type="password" name="password" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" placeholder="Mínimo 6 caracteres" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'A registrar...' : 'Registrar Organização'}
          </button>
        </form>

        {mensagem && (
          <div className={`mt-4 p-3 rounded-md text-sm text-center ${mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensagem}
          </div>
        )}
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Registo() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    leaderName: '',
    email: '',
    password: ''
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleRegisto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const slug = formData.orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data: orgId, error: orgError } = await supabase.rpc('create_org', { 
        org_name: formData.orgName, 
        slug_text: slug 
      });

      if (orgError) throw orgError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user?.id,
          name: formData.leaderName,
          email: formData.email,
          role: 'ADMIN_ORG',
          organization_id: orgId
        }]);

      if (profileError) throw profileError;

      setMensagem('Registo concluído com sucesso!');
      setFormData({ orgName: '', leaderName: '', email: '', password: '' });
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error("Erro capturado:", error); // Log para depuração
      setMensagem(`Erro: ${error.message}`);
      
      // FORÇA A LIMPEZA IMEDIATA NO CATCH
      setFormData({ orgName: '', leaderName: '', email: '', password: '' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-xl font-bold text-slate-900 md:text-white">Compasso</Link>
      </div>

      <div className="w-full md:w-1/2 bg-slate-900 p-8 md:p-12 flex flex-col justify-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Bem vindo,</h1>
        <p className="text-lg md:text-xl text-slate-300">Inicie a sua jornada com o Compasso agora.</p>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-left">Crie a sua conta</h2>
          
          <form onSubmit={handleRegisto} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Nome da Igreja</label>
              <input type="text" name="orgName" value={formData.orgName} onChange={handleChange} required className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Igreja Batista Central" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Seu Nome</label>
              <input type="text" name="leaderName" value={formData.leaderName} onChange={handleChange} required className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" placeholder="João Silva" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" placeholder="joao@email.com" />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase">Senha</label>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"  placeholder="Insira a sua senha" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-slate-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition mt-2">
              {loading ? 'Processando...' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600 text-right">
            Já possui conta? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </p>

          {mensagem && <p className="mt-4 text-red-600 text-sm font-medium text-left">{mensagem}</p>}
        </div>
      </div>
    </main>
  );
}
'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Função para formatar o telefone enquanto o utilizador digita
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const match = digits.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]})${match[2]}-${match[3]}`;
  }
  return digits;
};

export default function CompletarCadastro() {
  const [formData, setFormData] = useState({ orgName: '', leaderName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const baseSlug = formData.orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // 1. Criar a organização via RPC
    const { data: orgId, error: orgError } = await supabase.rpc('create_org', { 
      org_name: formData.orgName, 
      slug_text: uniqueSlug 
    });

    if (orgError) {
      setErro("Não foi possível criar a organização. Tente um nome diferente.");
      setLoading(false);
      return;
    }

    // 2. Criar ou atualizar o perfil com upsert
    const { error: profileError } = await supabase.from('profiles').upsert([{
      id: user.id,
      name: formData.leaderName,
      email: user.email,
      phone: formData.phone,
      role: 'ADMIN_ORG',
      organization_id: orgId 
    }]);

    if (profileError) {
      setErro(`Erro ao salvar perfil: ${profileError.message}`);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-xl font-bold text-slate-900 md:text-white">Compasso</Link>
      </div>

      <div className="w-full md:w-1/2 bg-slate-900 p-8 md:p-12 flex flex-col justify-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Estamos quase lá!</h1>
        <p className="text-lg md:text-xl text-slate-300">Precisamos apenas de alguns detalhes para configurar a sua organização no Compasso.</p>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-left">Detalhes da Organização</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Nome da Igreja</label>
              <input 
                type="text" 
                required 
                placeholder="Igreja Batista Central" 
                className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                onChange={(e) => setFormData({...formData, orgName: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Seu Nome</label>
              <input 
                type="text" 
                required 
                placeholder="João Silva" 
                className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                onChange={(e) => setFormData({...formData, leaderName: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Telefone / WhatsApp</label>
              <input 
                type="tel" 
                required 
                placeholder="(00)00000-0000" 
                value={formData.phone}
                maxLength={14}
                className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition mt-4"
            >
              {loading ? 'Configurando...' : 'Finalizar Cadastro'}
            </button>
          </form>

          {erro && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {erro}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
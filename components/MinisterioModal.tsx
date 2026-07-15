'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react'; // Importamos o X aqui
import { supabase } from '@/src/lib/supabase';

export default function NovoMinisterioModal({ orgId }: { orgId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await supabase.from('ministries').insert({
      name: formData.get('name'),
      organization_id: orgId
    });

    setLoading(false);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800"
      >
        <Plus size={16} /> Novo Ministério
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)} // Fecha ao clicar no fundo
        >
          <div 
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche ele
          >
            {/* Botão X para fechar */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <h2 className="font-bold text-lg mb-4">Criar Ministério</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                name="name" 
                placeholder="Ex: Louvor" 
                required 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-900 outline-none" 
              />
              <button 
                disabled={loading} 
                className="w-full bg-slate-900 text-white py-2 rounded font-medium hover:bg-slate-800 transition"
              >
                {loading ? 'Criando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
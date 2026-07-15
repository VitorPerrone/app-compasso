'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function AddVoluntarioModal({ ministryId, ministryName }: { ministryId: string, ministryName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<{id: string, name: string}[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      supabase.from('profiles').select('id, name').then(({ data }) => {
        if (data) setUsuarios(data);
      });
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await supabase.from('ministry_users').insert({
      ministry_id: ministryId,
      user_id: formData.get('user_id'),
      function: formData.get('function') || 'Voluntário'
    });

    setLoading(false);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-1 text-slate-400 hover:text-slate-600"><Plus size={18} /></button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-lg mb-4">Adicionar em: {ministryName}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="user_id" required className="w-full p-2 border rounded">
                <option value="">Selecione um voluntário...</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <input name="function" placeholder="Função" className="w-full p-2 border rounded" />
              <button disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
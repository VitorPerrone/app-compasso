'use client';
import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import { Users, X, Plus } from 'lucide-react';

export default function NovoUsuarioModal({ orgId }: { orgId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([{ name: '', email: '' }]);
  const router = useRouter();

  const addRow = () => setUsers([...users, { name: '', email: '' }]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validUsers = users.filter(u => u.name.trim() !== '');
    const toInsert = validUsers.map(u => ({ ...u, organization_id: orgId }));
    console.log("Dados a enviar:", toInsert);
    await supabase.from('profiles').insert(toInsert);
    setIsOpen(false);
    setUsers([{ name: '', email: '' }]);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-white border border-slate-900 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50">
        <Users size={16} /> Novo Usuário
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400"><X size={20} /></button>
            <h2 className="font-bold text-lg mb-4">Cadastrar Usuários</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {users.map((u, i) => (
                <div key={i} className="flex gap-2">
                  <input placeholder="Nome" className="border p-2 rounded w-full" onChange={e => { users[i].name = e.target.value }} required />
                  <input placeholder="Email" type="email" className="border p-2 rounded w-full" onChange={e => { users[i].email = e.target.value }} />
                </div>
              ))}
              <button type="button" onClick={addRow} className="text-sm text-blue-600 font-bold">+ Adicionar mais um</button>
              <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded">Salvar Usuários</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
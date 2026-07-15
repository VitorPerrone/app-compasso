'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function FormNovoEvento() {
  const [loading, setLoading] = useState(false);
  const [ministries, setMinistries] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    async function fetchMinistries() {
      const { data } = await supabase.from('ministries').select('id, name');
      if (data) setMinistries(data);
    }
    fetchMinistries();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await supabase.from('events').insert({
      title: formData.get('title'),
      date_time: formData.get('date_time'),
      ministry_id: formData.get('ministry_id'),
    });

    setLoading(false);
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <input name="title" placeholder="Nome da Escala/Evento" required className="w-full p-2 border rounded" />
      <input type="datetime-local" name="date_time" required className="w-full p-2 border rounded" />
      
      <select name="ministry_id" required className="w-full p-2 border rounded">
        <option value="">Selecione o Ministério</option>
        {ministries.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      
      <button disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded">
        {loading ? 'Salvando...' : 'Criar Escala'}
      </button>
    </form>
  );
}
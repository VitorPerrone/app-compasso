'use client';

import { supabase } from '@/src/lib/supabase';
import { useEffect, useState } from 'react';

export default function TabelaEscalas() {
  const [escalas, setEscalas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEscalas() {
      // Pedimos os eventos da base de dados
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_time', { ascending: true });

      if (error) console.error('Erro ao buscar escalas:', error);
      else setEscalas(data || []);
    }

    fetchEscalas();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-700">Evento</th>
            <th className="p-4 font-semibold text-gray-700">Data</th>
          </tr>
        </thead>
        <tbody>
          {escalas.map((escala) => (
            <tr key={escala.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{escala.title}</td>
              <td className="p-4">{new Date(escala.date_time).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
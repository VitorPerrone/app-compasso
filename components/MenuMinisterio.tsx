'use client';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import { MoreVertical, Trash2, Edit2, Check, X } from 'lucide-react';

export default function MenuMinisterio({ id, name }: { id: string, name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete() {
    if (confirm(`Tem certeza que deseja apagar o ministério "${name}"?`)) {
      await supabase.from('ministries').delete().eq('id', id);
      setIsOpen(false);
      router.refresh();
    }
  }

  async function handleRename() {
    await supabase.from('ministries').update({ name: newName }).eq('id', id);
    setIsEditing(false);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-slate-900">
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 p-2">
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-1 border rounded text-sm"
                autoFocus
              />
              <button onClick={handleRename} className="text-green-600"><Check size={16} /></button>
            </div>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-50">
                <Edit2 size={14} /> Renomear
              </button>
              <button onClick={handleDelete} className="flex items-center gap-2 w-full p-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 size={14} /> Apagar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
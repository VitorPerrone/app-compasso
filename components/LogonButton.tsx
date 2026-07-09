'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 p-3 text-slate-400 hover:text-white transition w-full"
    >
      <LogOut size={20} /> Sair
    </button>
  );
}
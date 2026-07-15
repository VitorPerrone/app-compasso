import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '@/components/LogonButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: any; value: any; options: any; }[]) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user?.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-10 tracking-tight">Compasso</h2>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition">
              <LayoutDashboard size={20} /> Início
            </Link>
            <Link href="/dashboard/escalas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition">
              <Calendar size={20} /> Escalas
            </Link>
            <Link href="/dashboard/ministros" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition">
              <Users size={20} /> Voluntários
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
          <div className="text-sm text-slate-700 font-semibold">
            {profile?.name || 'Administrador'}
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import FormNovoEvento from '@/components/FormNovoEvento';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll(); } }
  });

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user?.id).single();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciamento de Eventos</h1>
      <FormNovoEvento orgId={profile?.organization_id} />
      {/* Tabela de listagem aqui */}
    </div>
  );
}
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AddVoluntarioModal from '@/components/AddVoluntarioModal';
import NovoMinisterioModal from '@/components/MinisterioModal';
import MenuMinisterio from '@/components/MenuMinisterio';
import NovoUsuarioModal from '@/components/NovoUsuarioModal'; // Importado o novo componente

export default async function MinistrosPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: any; value: any; options: any; }[]) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
      } 
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user?.id)
    .single();
    
  const { data: ministerios } = await supabase
    .from('ministries')
    .select(`
      id, 
      name, 
      ministry_users(
        function,
        profiles(name)
      )
    `)
    .eq('organization_id', profile?.organization_id);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ministérios e Equipes</h1>
          <p className="text-gray-500 text-sm">Gerencie seus voluntários por departamento.</p>
        </div>
        
        {/* Botões lado a lado */}
        <div className="flex gap-3">
          <NovoUsuarioModal orgId={profile?.organization_id} />
          <NovoMinisterioModal orgId={profile?.organization_id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ministerios && ministerios.length > 0 ? (
          ministerios.map((min) => (
            <div key={min.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-bold text-lg text-slate-900">{min.name}</h2>
                
                <div className="flex items-center gap-1">
                  <AddVoluntarioModal ministryId={min.id} ministryName={min.name} />
                  <MenuMinisterio id={min.id} name={min.name} />
                </div>
              </div>

              <div className="space-y-3">
                {min.ministry_users && min.ministry_users.length > 0 ? (
                  min.ministry_users.map((mu: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                        {mu.profiles?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{mu.profiles?.name || 'Sem nome'}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{mu.function}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic text-center py-4">Sem voluntários</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500">Nenhum ministério criado ainda. Clique em "Novo Ministério" acima para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
        },
      }
    );

    const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError && user) {
      // Verifica se o perfil já existe na base de dados
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // Se não encontrar perfil, força o completar cadastro
      if (!profile) {
        return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
      }
      
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
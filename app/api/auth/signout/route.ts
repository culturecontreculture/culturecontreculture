import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: 'Configuration Supabase incomplète' }, 
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // Supprimer le cookie de session
    const response = NextResponse.redirect(new URL('/achats/auth/login', request.url));
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');

    return response;
  } catch (err) {
    console.error('Erreur de déconnexion:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' }, 
      { status: 500 }
    );
  }
}
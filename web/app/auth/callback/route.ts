import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/feed';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successfully authenticated — redirect to feed (or wherever they were going)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's no code or an error occurred, redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_error`
  );
}

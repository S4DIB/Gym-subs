import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

export const createSupabaseBrowserClient = () => createPagesBrowserClient();

export const createSupabaseServerClient = (cookies: () => string | undefined) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key, {
    global: {
      headers: {
        Cookie: cookies() ?? "",
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};



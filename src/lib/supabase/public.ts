import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env-public";
import type { Database } from "@/types/database";

export function createPublicClient() {
  const env = getPublicEnv();
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

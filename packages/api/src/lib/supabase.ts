/**
 * Supabase Admin Client — COSMOS API
 *
 * Uses the SERVICE ROLE key (server-side only — never expose to the browser).
 * This bypasses Row Level Security so the API can read/write on behalf of any user.
 */

import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger.js";

const supabaseUrl      = process.env["SUPABASE_URL"] ?? "";
const serviceRoleKey   = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";
const credentialsReady = Boolean(supabaseUrl && serviceRoleKey);

if (!credentialsReady) {
  logger.warn(
    "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — " +
    "Supabase auth is disabled (verifySupabaseJwt will return null). " +
    "Set these env vars to enable JWT verification.",
  );
}

/**
 * Server-side admin client. Use this for all API route handlers.
 * It can bypass RLS; never send this client's credentials to the frontend.
 *
 * When credentials are missing (local dev / test runner without .env) we
 * use placeholder values so createClient() doesn't throw — the client will
 * simply fail on every network call, which verifySupabaseJwt() handles by
 * returning null (= unauthenticated).
 */
export const supabaseAdmin = createClient(
  supabaseUrl      || "https://placeholder.supabase.co",
  serviceRoleKey   || "placeholder-service-role-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  },
);

/**
 * Verify a Supabase JWT from the Authorization header.
 * Returns the user payload on success, null on failure.
 */
export async function verifySupabaseJwt(
  authHeader: string | undefined,
): Promise<{ id: string; email?: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  return { id: data.user.id, email: data.user.email };
}

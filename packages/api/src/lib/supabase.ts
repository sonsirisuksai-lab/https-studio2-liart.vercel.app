/**
 * Supabase Admin Client — COSMOS API
 *
 * Uses the SERVICE ROLE key (server-side only — never expose to the browser).
 * This bypasses Row Level Security so the API can read/write on behalf of any user.
 */

import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger.js";

const supabaseUrl = process.env["SUPABASE_URL"] ?? "";
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  logger.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — Supabase features will be unavailable.");
}

/**
 * Server-side admin client. Use this for all API route handlers.
 * It can bypass RLS; never send this client's credentials to the frontend.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

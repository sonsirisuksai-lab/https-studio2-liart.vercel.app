/**
 * Supabase JWT Auth Middleware — COSMOS API
 *
 * Validates the Bearer token from the Vercel frontend (set by @supabase/supabase-js
 * on the client) against the Supabase project. Attaches the user to req.user.
 *
 * Usage: protect mutating endpoints with `requireAuth` before the route handler.
 */

import type { Request, Response, NextFunction } from "express";
import { verifySupabaseJwt } from "../lib/supabase.js";

export interface AuthenticatedRequest extends Request {
  user: { id: string; email?: string };
}

/**
 * Hard auth guard — rejects unauthenticated requests with 401.
 * Use on mutating endpoints (dispatch, mission update).
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await verifySupabaseJwt(req.headers["authorization"]);
  if (!user) {
    res.status(401).json({ error: "unauthorized", message: "Valid Supabase session required." });
    return;
  }
  (req as AuthenticatedRequest).user = user;
  next();
}

/**
 * Soft auth — attaches user if token is present, lets the request through either way.
 * Use on read endpoints that have optional personalization.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await verifySupabaseJwt(req.headers["authorization"]);
  if (user) (req as AuthenticatedRequest).user = user;
  next();
}

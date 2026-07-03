// Session security utilities
export const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

export function checkSessionTimeout(lastActivity: number): boolean {
  return Date.now() - lastActivity > SESSION_TIMEOUT;
}

// packages/web/src/lib/health.ts
export const checkHealth = async () => {
  // Simple health check implementation
  return { status: 'ok', timestamp: new Date().toISOString() };
};

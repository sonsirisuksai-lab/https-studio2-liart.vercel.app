// packages/web/src/lib/analytics.ts
export const initAnalytics = () => {
  // Initialize analytics like Plausible, GA, etc.
  if (import.meta.env.VITE_ANALYTICS_ID) {
    console.log("Analytics initialized with ID:", import.meta.env.VITE_ANALYTICS_ID);
  }
};

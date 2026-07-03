import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Vite exposes env vars via import.meta.env (browser-safe); `process` is undefined in the browser.
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 0.3,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: "production",
  });
};

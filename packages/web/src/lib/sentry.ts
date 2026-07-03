import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 0.3,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: "production",
  });
};

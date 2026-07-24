"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const enabled =
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === "true";

function publicOnly<T extends { url: string }>(event: T): T | null {
  const url = new URL(event.url, window.location.origin);
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/api")
  ) {
    return null;
  }
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export function Observability() {
  if (!enabled) return null;
  return (
    <>
      <Analytics
        debug={false}
        beforeSend={(event: BeforeSendEvent) => publicOnly(event)}
      />
      <SpeedInsights debug={false} beforeSend={publicOnly} />
    </>
  );
}

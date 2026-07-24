"use client";

import { track } from "@vercel/analytics/react";
import { useEffect } from "react";

type EventProperties = Record<string, string | number | boolean | null>;

const enabled =
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === "true";

export function trackPublicEvent(name: string, properties?: EventProperties) {
  if (enabled) track(name, properties);
}

export function TrackEventOnView({
  name,
  properties,
}: {
  name: string;
  properties?: EventProperties;
}) {
  const serialized = JSON.stringify(properties ?? {});
  useEffect(() => {
    trackPublicEvent(name, JSON.parse(serialized) as EventProperties);
  }, [name, serialized]);
  return null;
}

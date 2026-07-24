"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { trackPublicEvent } from "./track-event";

type CommonProps = {
  eventName: string;
  eventTarget?: string;
  children: ReactNode;
  className?: string;
};

export function TrackedLink({
  eventName,
  eventTarget,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, keyof CommonProps>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackPublicEvent(eventName, eventTarget ? { target: eventTarget } : undefined);
        props.onClick?.(event);
      }}
    />
  );
}

export function TrackedAnchor({
  eventName,
  eventTarget,
  ...props
}: CommonProps & Omit<ComponentProps<"a">, keyof CommonProps>) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackPublicEvent(eventName, eventTarget ? { target: eventTarget } : undefined);
        props.onClick?.(event);
      }}
    />
  );
}

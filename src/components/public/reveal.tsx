"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealVariant = "fade" | "fade-up" | "fade-left" | "fade-right" | "scale-subtle" | "line-expand";
type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  threshold?: number;
  once?: boolean;
};

type RevealHandler = (visible: boolean, observer: IntersectionObserver) => void;

const handlers = new WeakMap<Element, RevealHandler>();
const observers = new Map<number, IntersectionObserver>();

function observerFor(threshold: number) {
  const existing = observers.get(threshold);
  if (existing) return existing;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => handlers.get(entry.target)?.(entry.isIntersecting, currentObserver));
    },
    { rootMargin: "0px 0px -8%", threshold },
  );
  observers.set(threshold, observer);
  return observer;
}

export function Reveal({ children, className = "", variant = "fade-up", delay = 0, threshold = 0.12, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      node.dataset.revealVisible = "true";
      return;
    }

    const normalizedThreshold = Math.min(1, Math.max(0, threshold));
    const observer = observerFor(normalizedThreshold);
    const initiallyVisible = node.getBoundingClientRect().top < window.innerHeight * (1 - normalizedThreshold);
    node.dataset.revealVisible = initiallyVisible ? "true" : "false";
    node.dataset.revealReady = "true";

    handlers.set(node, (visible, currentObserver) => {
      node.dataset.revealVisible = String(visible);
      if (visible && once) currentObserver.unobserve(node);
    });
    observer.observe(node);

    return () => {
      observer.unobserve(node);
      handlers.delete(node);
    };
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-reveal-variant={variant}
      style={{ "--reveal-delay": `${Math.min(Math.max(delay, 0), 600)}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

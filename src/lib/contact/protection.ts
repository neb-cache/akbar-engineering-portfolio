import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getContactOperationsEnv } from "@/lib/env";
import { logServerEvent } from "@/lib/observability/logger";
import type { ContactMessageInput } from "@/lib/validation/contact-message";

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 15 * 60;
const DUPLICATE_WINDOW_SECONDS = 10 * 60;
const memoryRateLimits = new Map<string, { count: number; expiresAt: number }>();
const memoryDuplicates = new Map<string, number>();

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function pruneMemory(now: number) {
  if (memoryRateLimits.size + memoryDuplicates.size < 500) return;
  for (const [key, value] of memoryRateLimits) {
    if (value.expiresAt <= now) memoryRateLimits.delete(key);
  }
  for (const [key, expiresAt] of memoryDuplicates) {
    if (expiresAt <= now) memoryDuplicates.delete(key);
  }
  while (memoryRateLimits.size > 1_000) {
    const oldest = memoryRateLimits.keys().next().value;
    if (!oldest) break;
    memoryRateLimits.delete(oldest);
  }
  while (memoryDuplicates.size > 1_000) {
    const oldest = memoryDuplicates.keys().next().value;
    if (!oldest) break;
    memoryDuplicates.delete(oldest);
  }
}

async function requestFingerprint() {
  const requestHeaders = await headers();
  const trustedForwardedIp = process.env.VERCEL
    ? requestHeaders.get("x-vercel-forwarded-for") ??
      requestHeaders.get("x-forwarded-for")
    : null;
  const ip = trustedForwardedIp?.split(",")[0]?.trim() ?? "local";
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 240) ?? "unknown";
  return digest(`${ip}|${userAgent}`);
}

async function upstashCommand(command: Array<string | number>) {
  const env = getContactOperationsEnv();
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  const response = await fetch(env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(3_500),
  });
  if (!response.ok) throw new Error(`Upstash request failed (${response.status}).`);
  return (await response.json()) as { result?: string | number | null; error?: string };
}

async function upstashPipeline(commands: Array<Array<string | number>>) {
  const env = getContactOperationsEnv();
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  const endpoint = `${env.UPSTASH_REDIS_REST_URL.replace(/\/$/, "")}/pipeline`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(3_500),
  });
  if (!response.ok) throw new Error(`Upstash pipeline failed (${response.status}).`);
  return (await response.json()) as Array<{
    result?: string | number | null;
    error?: string;
  }>;
}

function memoryRateLimit(key: string, now: number) {
  const existing = memoryRateLimits.get(key);
  if (!existing || existing.expiresAt <= now) {
    memoryRateLimits.set(key, { count: 1, expiresAt: now + RATE_WINDOW_SECONDS * 1000 });
    return true;
  }
  existing.count += 1;
  return existing.count <= RATE_LIMIT;
}

export async function allowContactSubmission() {
  const now = Date.now();
  pruneMemory(now);
  const identity = await requestFingerprint();
  const window = Math.floor(now / (RATE_WINDOW_SECONDS * 1000));
  const key = `portfolio:contact:rate:${identity}:${window}`;

  try {
    const result = await upstashPipeline([
      ["INCR", key],
      ["EXPIRE", key, RATE_WINDOW_SECONDS],
    ]);
    if (result) {
      const count = Number(result[0]?.result);
      return count <= RATE_LIMIT;
    }
  } catch (error) {
    logServerEvent("warn", {
      category: "contact",
      action: "rate_limit_store_unavailable",
      error,
    });
  }

  return memoryRateLimit(key, now);
}

export async function isDuplicateContact(input: ContactMessageInput) {
  const normalized = [
    input.email.trim().toLowerCase(),
    input.subject.trim().toLowerCase(),
    input.message.trim(),
  ].join("|");
  const key = `portfolio:contact:duplicate:${digest(normalized)}`;

  try {
    const result = await upstashCommand([
      "SET",
      key,
      "1",
      "NX",
      "EX",
      DUPLICATE_WINDOW_SECONDS,
    ]);
    if (result) return result.result !== "OK";
  } catch (error) {
    logServerEvent("warn", {
      category: "contact",
      action: "duplicate_store_unavailable",
      error,
    });
  }

  const now = Date.now();
  const expiresAt = memoryDuplicates.get(key);
  if (expiresAt && expiresAt > now) return true;
  memoryDuplicates.set(key, now + DUPLICATE_WINDOW_SECONDS * 1000);
  return false;
}

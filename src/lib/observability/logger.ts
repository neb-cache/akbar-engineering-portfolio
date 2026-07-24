import "server-only";

type LogLevel = "info" | "warn" | "error";

type SafeLogContext = {
  category: "auth" | "contact" | "database" | "health" | "public-data" | "storage";
  action: string;
  route?: string;
  error?: unknown;
  detail?: Record<string, string | number | boolean | null>;
};

function errorShape(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const value = error as { name?: unknown; code?: unknown };
  return {
    name: typeof value.name === "string" ? value.name : "Error",
    code:
      typeof value.code === "string" || typeof value.code === "number"
        ? String(value.code)
        : undefined,
  };
}

export function logServerEvent(level: LogLevel, context: SafeLogContext) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    errorId: level === "error" ? crypto.randomUUID() : undefined,
    category: context.category,
    action: context.action,
    route: context.route,
    error: errorShape(context.error),
    detail: context.detail,
  };

  const serialized = JSON.stringify(payload);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.info(serialized);
}

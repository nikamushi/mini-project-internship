export function parsePage(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function parseLimit(value: unknown): number {
  const n = Number(value);
  const limit = Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
  return Math.min(limit, 100);
}

export function parseOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function parseOptionalInt(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

export function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

export function parseSortOrder(value: unknown): "asc" | "desc" | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}
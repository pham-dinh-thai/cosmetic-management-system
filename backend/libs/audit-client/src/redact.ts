/**
 * Che các field nhạy cảm (password, secret, token) trước khi gửi log.
 * Áp dụng đệ quy cho object lồng nhau và mảng.
 */
export function redactSensitiveFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveFields(item));
  }
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(record)) {
    result[key] = /password|secret|token/i.test(key)
      ? '<redacted>'
      : redactSensitiveFields(record[key]);
  }
  return result;
}

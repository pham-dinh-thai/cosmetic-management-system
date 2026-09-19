export function extractApiMessage(error: unknown): string | null {
  const data = (
    error as { response?: { data?: { message?: string | string[] } } }
  )?.response?.data;
  const message = data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message ?? null;
}

const VIETNAMESE_MAPPINGS: Array<[RegExp, string]> = [
  [/already has a manager/i, "Phòng ban này đã có trưởng phòng khác, không thể chuyển quản lý vào đây"],
  [/already exists|duplicate/i, "Dữ liệu đã tồn tại (trùng email/mã)"],
  [/is not active/i, "Phòng ban đang không hoạt động"],
  [/not found/i, "Không tìm thấy bản ghi"],
  [/invalid/i, "Dữ liệu nhập không hợp lệ"],
  [/phone/i, "Số điện thoại không hợp lệ (10 số, bắt đầu 03/05/07/08/09)"],
];

export function friendlyErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const raw = extractApiMessage(error);
  if (!raw) return fallback;
  for (const [regex, text] of VIETNAMESE_MAPPINGS) {
    if (regex.test(raw)) return text;
  }
  return raw;
}
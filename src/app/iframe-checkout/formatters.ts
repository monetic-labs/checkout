export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2, 4);
} 
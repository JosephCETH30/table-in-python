const idFormatter = new Intl.NumberFormat("id-ID");

/** Strips everything but digits, e.g. for live currency-input formatting. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formats a raw digit string as "180.000" (Indonesian thousands grouping). */
export function formatThousands(rawDigits: string): string {
  if (!rawDigits) return "";
  return idFormatter.format(Number(rawDigits));
}

export function formatRupiah(value: number): string {
  return "Rp" + idFormatter.format(value || 0);
}

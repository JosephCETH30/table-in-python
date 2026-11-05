import type { DriverProfileData } from "@/lib/driver-profile";

type Kind = "text" | "date" | "number" | "rupiah";

/**
 * Column order, header label and cell type for the Google Sheet. Typed as a
 * full Record so adding a form field without a column here fails to compile.
 */
export const SHEET_COLUMNS: Record<keyof DriverProfileData, { label: string; kind: Kind }> = {
  ID_Responden: { label: "ID Responden", kind: "text" },
  Tanggal_Wawancara: { label: "Tanggal Wawancara", kind: "date" },
  Nama_Aplikator: { label: "Aplikator Utama", kind: "text" },
  Nama_Aplikator_Lainnya: { label: "Aplikator Lainnya", kind: "text" },
  Usia: { label: "Usia (tahun)", kind: "number" },
  Jenis_Kelamin: { label: "Jenis Kelamin", kind: "text" },
  Wilayah_Operasi: { label: "Wilayah Operasi", kind: "text" },
  Wilayah_Operasi_Detail: { label: "Detail Wilayah (Luar DKI)", kind: "text" },
  Jenis_Layanan: { label: "Jenis Layanan", kind: "text" },
  Lama_Menjadi_Mitra_Bulan: { label: "Lama Jadi Mitra (bulan)", kind: "number" },
  Status_Kepemilikan_Kendaraan: { label: "Kepemilikan Kendaraan", kind: "text" },
  Pekerjaan_Sampingan_Lain: { label: "Punya Pekerjaan Sampingan", kind: "text" },
  Pekerjaan_Sampingan_Detail: { label: "Pekerjaan Sampingan", kind: "text" },
  Jam_Kerja_Harian: { label: "Jam Kerja per Hari", kind: "number" },
  Shift_Dominan: { label: "Shift Dominan", kind: "text" },
  Jumlah_Order_Harian: { label: "Order per Hari", kind: "number" },
  Ikut_Program_Langganan_Prioritas: { label: "Ikut Langganan Prioritas", kind: "text" },
  Biaya_Langganan_Harian_Rp: { label: "Biaya Langganan / Hari", kind: "rupiah" },
  Pendapatan_Kotor_Harian_Estimasi_Rp: { label: "Pendapatan Kotor / Hari", kind: "rupiah" },
  Biaya_BBM_Harian_Rp: { label: "Biaya BBM / Hari", kind: "rupiah" },
  Sisa_Dibawa_Pulang_Harian_Rp: { label: "Dibawa Pulang / Hari", kind: "rupiah" },
  Perubahan_Pendapatan_Sejak_Perpres: { label: "Perubahan Pendapatan sejak Perpres", kind: "text" },
  Perubahan_Frekuensi_Order_Sejak_Perpres: { label: "Perubahan Jumlah Order sejak Perpres", kind: "text" },
  Frekuensi_Catatan: { label: "Catatan Perubahan Order", kind: "text" },
  Persepsi_Kelayakan_Pendapatan_1_5: { label: "Kelayakan Pendapatan (1–5)", kind: "number" },
  Persepsi_Transparansi_Skema_Potongan_1_5: { label: "Transparansi Potongan (1–5)", kind: "number" },
  Bersedia_Kasih_Bukti_Struk: { label: "Bersedia Beri Struk", kind: "text" },
  Catatan_Kualitatif: { label: "Catatan Kualitatif", kind: "text" },
};

// Sheets number formats. "" = leave on automatic.
const FORMAT: Record<Kind, string> = {
  text: "@", // keeps "D002" or "08…" from being reinterpreted
  date: "dd/mm/yyyy",
  number: "",
  rupiah: '"Rp"#,##0',
};

/** Payload for the Apps Script webhook: header setup info plus one row. */
export function toSheetRow(data: Partial<Record<string, unknown>>) {
  const keys = Object.keys(SHEET_COLUMNS) as (keyof DriverProfileData)[];
  return {
    keys,
    headers: keys.map((k) => SHEET_COLUMNS[k].label),
    formats: keys.map((k) => FORMAT[SHEET_COLUMNS[k].kind]),
    values: keys.map((k) => {
      const raw = typeof data[k] === "string" ? (data[k] as string).trim() : "";
      if (raw === "" || SHEET_COLUMNS[k].kind === "text" || SHEET_COLUMNS[k].kind === "date")
        return raw;
      const n = Number(raw.replace(",", "."));
      return Number.isFinite(n) ? n : raw;
    }),
  };
}

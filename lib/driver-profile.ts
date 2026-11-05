import { z } from "zod";

/**
 * Field names mirror the "Data_Profil_Driver" sheet columns 1:1 so a future
 * export step can map straight across without renaming anything.
 */
export interface DriverProfileData {
  ID_Responden: string;
  Tanggal_Wawancara: string;
  Nama_Aplikator: string;
  Nama_Aplikator_Lainnya: string;
  Usia: string;
  Jenis_Kelamin: string;
  Wilayah_Operasi: string;
  Wilayah_Operasi_Detail: string;
  Jenis_Layanan: string;
  Lama_Menjadi_Mitra_Bulan: string;
  Status_Kepemilikan_Kendaraan: string;
  Pekerjaan_Sampingan_Lain: string;
  Pekerjaan_Sampingan_Detail: string;
  Jam_Kerja_Harian: string;
  Shift_Dominan: string;
  Jumlah_Order_Harian: string;
  Ikut_Program_Langganan_Prioritas: string;
  Biaya_Langganan_Harian_Rp: string;
  Pendapatan_Kotor_Harian_Estimasi_Rp: string;
  Biaya_BBM_Harian_Rp: string;
  Sisa_Dibawa_Pulang_Harian_Rp: string;
  Perubahan_Pendapatan_Sejak_Perpres: string;
  Perubahan_Frekuensi_Order_Sejak_Perpres: string;
  Frekuensi_Catatan: string;
  Persepsi_Kelayakan_Pendapatan_1_5: string;
  Persepsi_Transparansi_Skema_Potongan_1_5: string;
  Bersedia_Kasih_Bukti_Struk: string;
  Catatan_Kualitatif: string;
}

export function emptyDriverProfile(): DriverProfileData {
  return {
    ID_Responden: "",
    Tanggal_Wawancara: new Date().toISOString().slice(0, 10),
    Nama_Aplikator: "",
    Nama_Aplikator_Lainnya: "",
    Usia: "",
    Jenis_Kelamin: "",
    Wilayah_Operasi: "",
    Wilayah_Operasi_Detail: "",
    Jenis_Layanan: "",
    Lama_Menjadi_Mitra_Bulan: "",
    Status_Kepemilikan_Kendaraan: "",
    Pekerjaan_Sampingan_Lain: "",
    Pekerjaan_Sampingan_Detail: "",
    Jam_Kerja_Harian: "",
    Shift_Dominan: "",
    Jumlah_Order_Harian: "",
    Ikut_Program_Langganan_Prioritas: "",
    Biaya_Langganan_Harian_Rp: "",
    Pendapatan_Kotor_Harian_Estimasi_Rp: "",
    Biaya_BBM_Harian_Rp: "",
    Sisa_Dibawa_Pulang_Harian_Rp: "",
    Perubahan_Pendapatan_Sejak_Perpres: "",
    Perubahan_Frekuensi_Order_Sejak_Perpres: "",
    Frekuensi_Catatan: "",
    Persepsi_Kelayakan_Pendapatan_1_5: "",
    Persepsi_Transparansi_Skema_Potongan_1_5: "",
    Bersedia_Kasih_Bukti_Struk: "",
    Catatan_Kualitatif: "",
  };
}

export const APLIKATOR_OPTIONS = ["Gojek", "Grab", "Maxim", "InDriver", "Lainnya"];

export const WILAYAH_OPTIONS = [
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Selatan",
  "Jakarta Timur",
  "Kepulauan Seribu",
  "Luar DKI",
];

export const LAYANAN_OPTIONS = [
  "GoRide/GrabBike (roda dua)",
  "GoCar/GrabCar (roda empat)",
  "GoSend/GrabExpress (kurir barang)",
  "Multi-layanan (lebih dari satu)",
];

export const KEPEMILIKAN_OPTIONS = [
  "Milik sendiri (lunas)",
  "Kredit/cicilan",
  "Sewa/rental harian",
  "Milik keluarga/pinjam",
];

export const SHIFT_OPTIONS = [
  "Pagi (05.00-11.00)",
  "Siang (11.00-17.00)",
  "Sore-Malam (17.00-23.00)",
  "Dini hari (23.00-05.00)",
  "Fleksibel/campur",
];

export const STEP_LABELS = [
  "Identitas Wawancara",
  "Profil Operasional",
  "Pendapatan & Biaya Harian",
  "Dampak Perpres 27/2026",
  "Verifikasi & Catatan",
  "Ringkasan",
] as const;

export const TOTAL_STEPS = STEP_LABELS.length;

const requiredText = (msg: string) => z.string().trim().min(1, msg);
const numericString = (msg: string, min: number, max?: number) =>
  z
    .string()
    .trim()
    .min(1, msg)
    .refine((v) => !Number.isNaN(Number(v)), msg)
    .refine((v) => Number(v) >= min, msg)
    .refine((v) => (max === undefined ? true : Number(v) <= max), msg);
const rupiahString = (msg: string) =>
  z
    .string()
    .trim()
    .min(1, msg)
    .refine((v) => Number(v) > 0, msg);

export const stepIdentitySchema = z.object({
  ID_Responden: requiredText("Isi ID responden."),
  Tanggal_Wawancara: requiredText("Pilih tanggal wawancara."),
  Nama_Aplikator: requiredText("Pilih aplikator utama."),
  Usia: numericString("Isi usia (17–75).", 17, 75),
  Jenis_Kelamin: requiredText("Pilih jenis kelamin."),
  Wilayah_Operasi: requiredText("Pilih wilayah operasi."),
});

export const stepOperationalSchema = z.object({
  Jenis_Layanan: requiredText("Pilih jenis layanan."),
  Lama_Menjadi_Mitra_Bulan: numericString("Isi lama menjadi mitra.", 0),
  Status_Kepemilikan_Kendaraan: requiredText("Pilih status kepemilikan."),
  Pekerjaan_Sampingan_Lain: requiredText("Pilih salah satu."),
  Jam_Kerja_Harian: numericString("Isi jam kerja harian (1–24).", 1, 24),
  Shift_Dominan: requiredText("Pilih shift dominan."),
});

export const stepIncomeSchema = z
  .object({
    Jumlah_Order_Harian: numericString("Isi jumlah order harian.", 0),
    Ikut_Program_Langganan_Prioritas: requiredText("Pilih salah satu."),
    Biaya_Langganan_Harian_Rp: z.string().trim(),
    Pendapatan_Kotor_Harian_Estimasi_Rp: rupiahString("Isi pendapatan kotor harian."),
    Biaya_BBM_Harian_Rp: rupiahString("Isi biaya BBM harian."),
    Sisa_Dibawa_Pulang_Harian_Rp: rupiahString("Isi sisa dibawa pulang."),
  })
  .superRefine((data, ctx) => {
    if (
      data.Ikut_Program_Langganan_Prioritas === "Ya" &&
      Number(data.Biaya_Langganan_Harian_Rp || 0) <= 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["Biaya_Langganan_Harian_Rp"],
        message: "Isi biaya langganan harian.",
      });
    }
  });

export const stepImpactSchema = z.object({
  Perubahan_Pendapatan_Sejak_Perpres: requiredText("Pilih salah satu."),
  Perubahan_Frekuensi_Order_Sejak_Perpres: requiredText("Pilih salah satu."),
  Persepsi_Kelayakan_Pendapatan_1_5: requiredText("Pilih skor 1–5."),
  Persepsi_Transparansi_Skema_Potongan_1_5: requiredText("Pilih skor 1–5."),
});

export const stepVerificationSchema = z.object({
  Bersedia_Kasih_Bukti_Struk: requiredText("Pilih salah satu."),
});

export const STEP_SCHEMAS = [
  stepIdentitySchema,
  stepOperationalSchema,
  stepIncomeSchema,
  stepImpactSchema,
  stepVerificationSchema,
] as const;

/**
 * Sementara dimatikan agar semua langkah bisa ditelusuri tanpa mengisi form.
 * Set ke `true` untuk mengaktifkan kembali validasi wajib-isi.
 */
export const ENFORCE_REQUIRED = false;

export function validateStep(step: number, data: DriverProfileData) {
  const schema = STEP_SCHEMAS[step - 1];
  if (!ENFORCE_REQUIRED || !schema) return { success: true as const, errors: {} as Record<string, string> };
  const result = schema.safeParse(data);
  if (result.success) return { success: true as const, errors: {} as Record<string, string> };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return { success: false as const, errors };
}

export function nextSuggestedId(existingCount: number) {
  return "D" + String(existingCount + 1).padStart(3, "0");
}

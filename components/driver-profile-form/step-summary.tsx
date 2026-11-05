"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { STEP_LABELS, type DriverProfileData } from "@/lib/driver-profile";

type Kind = "text" | "currency" | "number";

const GROUPS: { step: number; items: [keyof DriverProfileData, string, Kind?][] }[] = [
  {
    step: 1,
    items: [
      ["ID_Responden", "ID responden"],
      ["Tanggal_Wawancara", "Tanggal wawancara"],
      ["Nama_Aplikator", "Aplikator utama"],
      ["Usia", "Usia", "number"],
      ["Jenis_Kelamin", "Jenis kelamin"],
      ["Wilayah_Operasi", "Wilayah operasi"],
    ],
  },
  {
    step: 2,
    items: [
      ["Jenis_Layanan", "Jenis layanan"],
      ["Lama_Menjadi_Mitra_Bulan", "Lama menjadi mitra (bulan)", "number"],
      ["Status_Kepemilikan_Kendaraan", "Kepemilikan kendaraan"],
      ["Pekerjaan_Sampingan_Lain", "Pekerjaan sampingan"],
      ["Jam_Kerja_Harian", "Jam kerja per hari", "number"],
      ["Shift_Dominan", "Shift dominan"],
    ],
  },
  {
    step: 3,
    items: [
      ["Jumlah_Order_Harian", "Order per hari", "number"],
      ["Ikut_Program_Langganan_Prioritas", "Ikut langganan prioritas"],
      ["Biaya_Langganan_Harian_Rp", "Biaya langganan", "currency"],
      ["Pendapatan_Kotor_Harian_Estimasi_Rp", "Pendapatan kotor", "currency"],
      ["Biaya_BBM_Harian_Rp", "Biaya BBM", "currency"],
      ["Sisa_Dibawa_Pulang_Harian_Rp", "Sisa dibawa pulang", "currency"],
    ],
  },
  {
    step: 4,
    items: [
      ["Perubahan_Pendapatan_Sejak_Perpres", "Perubahan pendapatan"],
      ["Perubahan_Frekuensi_Order_Sejak_Perpres", "Perubahan jumlah order"],
      ["Persepsi_Kelayakan_Pendapatan_1_5", "Kelayakan pendapatan (1–5)", "number"],
      ["Persepsi_Transparansi_Skema_Potongan_1_5", "Transparansi potongan (1–5)", "number"],
    ],
  },
  {
    step: 5,
    items: [
      ["Bersedia_Kasih_Bukti_Struk", "Bersedia beri struk"],
      ["Catatan_Kualitatif", "Catatan kualitatif"],
    ],
  },
];

/**
 * Gross minus the costs the driver named minus take-home. What's left is
 * commission plus anything unreported (parking, food, …). A negative number
 * almost always means a typo, so it's worth showing before saving.
 */
function residual(data: DriverProfileData) {
  const gross = Number(data.Pendapatan_Kotor_Harian_Estimasi_Rp);
  if (!gross) return null;
  const sub =
    data.Ikut_Program_Langganan_Prioritas === "Ya" ? Number(data.Biaya_Langganan_Harian_Rp || 0) : 0;
  const rest =
    gross - Number(data.Biaya_BBM_Harian_Rp || 0) - sub - Number(data.Sisa_Dibawa_Pulang_Harian_Rp || 0);
  return { rest, pct: (rest / gross) * 100 };
}

export function StepSummary({
  data,
  onEdit,
}: {
  data: DriverProfileData;
  onEdit: (step: number) => void;
}) {
  const r = residual(data);

  return (
    <div className="flex flex-col gap-4 pt-4">
      {GROUPS.map((group) => (
        <section key={group.step} className="rounded-xl border px-4 pt-2 pb-3">
          <header className="flex items-center justify-between gap-3 border-b pb-2">
            <h3 className="text-base font-semibold">
              <span className="mr-2 text-muted-foreground tabular-nums">{group.step}</span>
              {STEP_LABELS[group.step - 1]}
            </h3>
            <Button variant="outline" className="-mr-1 h-10 rounded-lg px-4" onClick={() => onEdit(group.step)}>
              Ubah
            </Button>
          </header>
          <dl>
            {group.items.map(([key, label, kind]) => {
              const raw = data[key];
              const empty = !raw;
              let display: string = raw;
              if (!empty && kind === "currency") display = formatRupiah(Number(raw));
              if (key === "Nama_Aplikator" && raw === "Lainnya" && data.Nama_Aplikator_Lainnya)
                display = data.Nama_Aplikator_Lainnya;
              if (key === "Wilayah_Operasi" && raw.startsWith("Luar DKI") && data.Wilayah_Operasi_Detail)
                display = `${raw}, ${data.Wilayah_Operasi_Detail}`;
              if (key === "Pekerjaan_Sampingan_Lain" && raw === "Ya" && data.Pekerjaan_Sampingan_Detail)
                display = `Ya, ${data.Pekerjaan_Sampingan_Detail}`;
              if (key === "Perubahan_Frekuensi_Order_Sejak_Perpres" && !empty && data.Frekuensi_Catatan)
                display = `${raw} (${data.Frekuensi_Catatan})`;
              return (
                <div
                  key={key}
                  className="flex justify-between gap-4 border-b border-dashed py-2.5 text-base last:border-b-0"
                >
                  <dt className="shrink-0 basis-[45%] text-muted-foreground">{label}</dt>
                  <dd
                    className={cn(
                      "min-w-0 text-right break-words",
                      empty ? "text-muted-foreground/60" : "font-medium",
                      (kind === "currency" || kind === "number") && "tabular-nums"
                    )}
                  >
                    {empty ? "—" : display}
                  </dd>
                </div>
              );
            })}
          </dl>
          {group.step === 3 && r && (
            <p
              className={cn(
                "mt-2 rounded-lg p-3 text-sm leading-relaxed",
                r.rest < 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
              )}
            >
              Kotor − BBM − langganan − sisa ={" "}
              <span className="font-semibold text-foreground tabular-nums">
                {r.rest < 0 ? "−" : ""}
                {formatRupiah(Math.abs(r.rest))}
              </span>{" "}
              <span className="tabular-nums">({r.pct.toFixed(0)}% dari kotor)</span>.{" "}
              {r.rest < 0
                ? "Angkanya negatif. Cek lagi, kemungkinan ada salah ketik."
                : "Ini komisi aplikasi ditambah biaya lain yang tidak disebut."}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}

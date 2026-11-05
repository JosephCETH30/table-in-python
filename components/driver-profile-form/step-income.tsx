"use client";

import { TextField, ChoiceField, CurrencyField } from "@/components/driver-profile-form/fields";
import type { DriverProfileData } from "@/lib/driver-profile";
import type { StepProps } from "@/components/driver-profile-form/types";

export function StepIncome({ data, errors, onChange }: StepProps) {
  const set = (key: keyof DriverProfileData) => (v: string) => onChange(key, v);

  return (
    <div>
      <TextField
        n="3.1"
        name="Jumlah_Order_Harian"
        label="Jumlah order per hari"
        required
        type="number"
        inputMode="numeric"
        min={0}
        suffix="order"
        value={data.Jumlah_Order_Harian}
        onChange={set("Jumlah_Order_Harian")}
        placeholder="14"
        error={errors.Jumlah_Order_Harian}
      />
      <ChoiceField
        n="3.2"
        name="Ikut_Program_Langganan_Prioritas"
        label="Ikut program langganan / prioritas order?"
        required
        layout="row"
        value={data.Ikut_Program_Langganan_Prioritas}
        onChange={set("Ikut_Program_Langganan_Prioritas")}
        options={["Ya", "Tidak"]}
        error={errors.Ikut_Program_Langganan_Prioritas}
      />
      {data.Ikut_Program_Langganan_Prioritas === "Ya" && (
        <CurrencyField
          n="3.2a"
          name="Biaya_Langganan_Harian_Rp"
          label="Biaya langganan"
          value={data.Biaya_Langganan_Harian_Rp}
          onChange={set("Biaya_Langganan_Harian_Rp")}
          placeholder="15.000"
          error={errors.Biaya_Langganan_Harian_Rp}
        />
      )}
      <CurrencyField
        n="3.3"
        name="Pendapatan_Kotor_Harian_Estimasi_Rp"
        label="Pendapatan kotor (estimasi)"
        required
        value={data.Pendapatan_Kotor_Harian_Estimasi_Rp}
        onChange={set("Pendapatan_Kotor_Harian_Estimasi_Rp")}
        placeholder="180.000"
        hint="Sebelum dipotong komisi aplikasi, biaya layanan, atau BBM."
        error={errors.Pendapatan_Kotor_Harian_Estimasi_Rp}
      />
      <CurrencyField
        n="3.4"
        name="Biaya_BBM_Harian_Rp"
        label="Biaya BBM"
        required
        value={data.Biaya_BBM_Harian_Rp}
        onChange={set("Biaya_BBM_Harian_Rp")}
        placeholder="25.000"
        error={errors.Biaya_BBM_Harian_Rp}
      />
      <CurrencyField
        n="3.5"
        name="Sisa_Dibawa_Pulang_Harian_Rp"
        label="Sisa yang dibawa pulang"
        required
        value={data.Sisa_Dibawa_Pulang_Harian_Rp}
        onChange={set("Sisa_Dibawa_Pulang_Harian_Rp")}
        placeholder="95.000"
        hint="Uang bersih setelah semua potongan dan biaya."
        error={errors.Sisa_Dibawa_Pulang_Harian_Rp}
      />
    </div>
  );
}

"use client";

import { TextField, ChoiceField } from "@/components/driver-profile-form/fields";
import { LAYANAN_OPTIONS, KEPEMILIKAN_OPTIONS, SHIFT_OPTIONS, type DriverProfileData } from "@/lib/driver-profile";
import type { StepProps } from "@/components/driver-profile-form/types";

export function StepOperational({ data, errors, onChange }: StepProps) {
  const set = (key: keyof DriverProfileData) => (v: string) => onChange(key, v);

  return (
    <div>
      <ChoiceField
        n="2.1"
        name="Jenis_Layanan"
        label="Jenis layanan"
        required
        value={data.Jenis_Layanan}
        onChange={set("Jenis_Layanan")}
        options={LAYANAN_OPTIONS}
        error={errors.Jenis_Layanan}
      />
      <TextField
        n="2.2"
        name="Lama_Menjadi_Mitra_Bulan"
        label="Sudah berapa lama menjadi mitra?"
        required
        type="number"
        inputMode="numeric"
        min={0}
        suffix="bulan"
        value={data.Lama_Menjadi_Mitra_Bulan}
        onChange={set("Lama_Menjadi_Mitra_Bulan")}
        placeholder="30"
        error={errors.Lama_Menjadi_Mitra_Bulan}
      />
      <ChoiceField
        n="2.3"
        name="Status_Kepemilikan_Kendaraan"
        label="Status kepemilikan kendaraan"
        required
        value={data.Status_Kepemilikan_Kendaraan}
        onChange={set("Status_Kepemilikan_Kendaraan")}
        options={KEPEMILIKAN_OPTIONS}
        error={errors.Status_Kepemilikan_Kendaraan}
      />
      <ChoiceField
        n="2.4"
        name="Pekerjaan_Sampingan_Lain"
        label="Punya pekerjaan sampingan lain?"
        required
        layout="row"
        value={data.Pekerjaan_Sampingan_Lain}
        onChange={set("Pekerjaan_Sampingan_Lain")}
        options={["Ya", "Tidak"]}
        error={errors.Pekerjaan_Sampingan_Lain}
      />
      {data.Pekerjaan_Sampingan_Lain === "Ya" && (
        <TextField
          n="2.4a"
          name="Pekerjaan_Sampingan_Detail"
          label="Pekerjaan sampingannya apa?"
          value={data.Pekerjaan_Sampingan_Detail}
          onChange={set("Pekerjaan_Sampingan_Detail")}
          placeholder="Opsional"
        />
      )}
      <TextField
        n="2.5"
        name="Jam_Kerja_Harian"
        label="Jam kerja per hari"
        required
        type="number"
        inputMode="numeric"
        min={1}
        max={24}
        suffix="jam"
        value={data.Jam_Kerja_Harian}
        onChange={set("Jam_Kerja_Harian")}
        placeholder="9"
        error={errors.Jam_Kerja_Harian}
      />
      <ChoiceField
        n="2.6"
        name="Shift_Dominan"
        label="Shift paling sering"
        required
        value={data.Shift_Dominan}
        onChange={set("Shift_Dominan")}
        options={SHIFT_OPTIONS}
        error={errors.Shift_Dominan}
      />
    </div>
  );
}

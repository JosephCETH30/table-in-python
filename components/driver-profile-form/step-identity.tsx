"use client";

import { TextField, ChoiceField } from "@/components/driver-profile-form/fields";
import { APLIKATOR_OPTIONS, WILAYAH_OPTIONS, type DriverProfileData } from "@/lib/driver-profile";
import type { StepProps } from "@/components/driver-profile-form/types";

export function StepIdentity({ data, errors, onChange }: StepProps) {
  const set = (key: keyof DriverProfileData) => (v: string) => onChange(key, v);

  return (
    <div>
      <TextField
        n="1.1"
        name="ID_Responden"
        label="ID Responden"
        required
        value={data.ID_Responden}
        onChange={set("ID_Responden")}
        placeholder="D003"
        error={errors.ID_Responden}
        hint="Format D0xx. Terisi otomatis dari jumlah respon di perangkat ini; ubah bila perlu."
      />
      <TextField
        n="1.2"
        name="Tanggal_Wawancara"
        label="Tanggal wawancara"
        required
        type="date"
        value={data.Tanggal_Wawancara}
        onChange={set("Tanggal_Wawancara")}
        error={errors.Tanggal_Wawancara}
      />
      <ChoiceField
        n="1.3"
        name="Nama_Aplikator"
        label="Aplikator utama"
        required
        value={data.Nama_Aplikator}
        onChange={set("Nama_Aplikator")}
        options={APLIKATOR_OPTIONS}
        error={errors.Nama_Aplikator}
      />
      {data.Nama_Aplikator === "Lainnya" && (
        <TextField
          n="1.3a"
          name="Nama_Aplikator_Lainnya"
          label="Sebutkan aplikatornya"
          value={data.Nama_Aplikator_Lainnya}
          onChange={set("Nama_Aplikator_Lainnya")}
          placeholder="Nama aplikator"
        />
      )}
      <TextField
        n="1.4"
        name="Usia"
        label="Usia"
        required
        type="number"
        inputMode="numeric"
        min={17}
        max={75}
        suffix="tahun"
        value={data.Usia}
        onChange={set("Usia")}
        placeholder="29"
        error={errors.Usia}
      />
      <ChoiceField
        n="1.5"
        name="Jenis_Kelamin"
        label="Jenis kelamin"
        required
        layout="row"
        value={data.Jenis_Kelamin}
        onChange={set("Jenis_Kelamin")}
        options={["Laki-laki", "Perempuan"]}
        error={errors.Jenis_Kelamin}
      />
      <ChoiceField
        n="1.6"
        name="Wilayah_Operasi"
        label="Wilayah operasi utama"
        required
        value={data.Wilayah_Operasi}
        onChange={set("Wilayah_Operasi")}
        options={WILAYAH_OPTIONS.map((w) => (w === "Luar DKI" ? "Luar DKI (Bodetabek)" : w))}
        error={errors.Wilayah_Operasi}
      />
      {data.Wilayah_Operasi.startsWith("Luar DKI") && (
        <TextField
          n="1.6a"
          name="Wilayah_Operasi_Detail"
          label="Kota / kecamatan"
          value={data.Wilayah_Operasi_Detail}
          onChange={set("Wilayah_Operasi_Detail")}
          placeholder="Depok, Tangerang Selatan"
        />
      )}
    </div>
  );
}

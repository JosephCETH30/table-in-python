"use client";

import { ChoiceField, RatingField, TextField } from "@/components/driver-profile-form/fields";
import type { DriverProfileData } from "@/lib/driver-profile";
import type { StepProps } from "@/components/driver-profile-form/types";

const CHANGE = ["Naik", "Tetap", "Turun"];

export function StepImpact({ data, errors, onChange }: StepProps) {
  const set = (key: keyof DriverProfileData) => (v: string) => onChange(key, v);

  return (
    <div>
      <ChoiceField
        n="4.1"
        name="Perubahan_Pendapatan_Sejak_Perpres"
        label="Sejak Perpres berlaku, pendapatan…"
        required
        layout="row"
        value={data.Perubahan_Pendapatan_Sejak_Perpres}
        onChange={set("Perubahan_Pendapatan_Sejak_Perpres")}
        options={CHANGE}
        error={errors.Perubahan_Pendapatan_Sejak_Perpres}
      />
      <ChoiceField
        n="4.2"
        name="Perubahan_Frekuensi_Order_Sejak_Perpres"
        label="Sejak Perpres berlaku, jumlah order…"
        required
        layout="row"
        value={data.Perubahan_Frekuensi_Order_Sejak_Perpres}
        onChange={set("Perubahan_Frekuensi_Order_Sejak_Perpres")}
        options={CHANGE}
        error={errors.Perubahan_Frekuensi_Order_Sejak_Perpres}
      />
      <TextField
        n="4.2a"
        name="Frekuensi_Catatan"
        label="Catatan soal order"
        value={data.Frekuensi_Catatan}
        onChange={set("Frekuensi_Catatan")}
        placeholder="Opsional, mis. akun jadi sepi order"
      />
      <RatingField
        n="4.3"
        name="Persepsi_Kelayakan_Pendapatan_1_5"
        label="Seberapa layak pendapatan sekarang?"
        required
        value={data.Persepsi_Kelayakan_Pendapatan_1_5}
        onChange={set("Persepsi_Kelayakan_Pendapatan_1_5")}
        lowLabel="Sangat tidak layak"
        highLabel="Sangat layak"
        error={errors.Persepsi_Kelayakan_Pendapatan_1_5}
      />
      <RatingField
        n="4.4"
        name="Persepsi_Transparansi_Skema_Potongan_1_5"
        label="Seberapa transparan skema potongannya?"
        required
        value={data.Persepsi_Transparansi_Skema_Potongan_1_5}
        onChange={set("Persepsi_Transparansi_Skema_Potongan_1_5")}
        lowLabel="Sangat tidak transparan"
        highLabel="Sangat transparan"
        error={errors.Persepsi_Transparansi_Skema_Potongan_1_5}
      />
    </div>
  );
}

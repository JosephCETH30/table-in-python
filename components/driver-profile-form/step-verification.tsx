"use client";

import { ChoiceField, TextAreaField } from "@/components/driver-profile-form/fields";
import type { DriverProfileData } from "@/lib/driver-profile";
import type { StepProps } from "@/components/driver-profile-form/types";

export function StepVerification({ data, errors, onChange }: StepProps) {
  const set = (key: keyof DriverProfileData) => (v: string) => onChange(key, v);

  return (
    <div>
      <aside className="mt-4 mb-2 rounded-xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Catatan pewawancara.</span> Jika bersedia,
        minta foto atau screenshot struk order untuk sheet{" "}
        <code className="font-mono text-xs text-foreground">Verifikasi_Struk_Order</code>. Struk
        itulah yang membuktikan potongan riil secara matematis, dibandingkan klaim 92%.
      </aside>
      <ChoiceField
        n="5.1"
        name="Bersedia_Kasih_Bukti_Struk"
        label="Bersedia memberi bukti struk?"
        required
        layout="row"
        value={data.Bersedia_Kasih_Bukti_Struk}
        onChange={set("Bersedia_Kasih_Bukti_Struk")}
        options={["Ya", "Tidak"]}
        error={errors.Bersedia_Kasih_Bukti_Struk}
      />
      <TextAreaField
        n="5.2"
        name="Catatan_Kualitatif"
        label="Catatan kualitatif"
        value={data.Catatan_Kualitatif}
        onChange={set("Catatan_Kualitatif")}
        placeholder="Mis. merasa argo lebih kecil sejak ada biaya layanan baru."
        hint="Opsional. Kutipan langsung atau observasi bebas."
      />
    </div>
  );
}

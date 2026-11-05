"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Stepper } from "@/components/driver-profile-form/stepper";
import { StepIdentity } from "@/components/driver-profile-form/step-identity";
import { StepOperational } from "@/components/driver-profile-form/step-operational";
import { StepIncome } from "@/components/driver-profile-form/step-income";
import { StepImpact } from "@/components/driver-profile-form/step-impact";
import { StepVerification } from "@/components/driver-profile-form/step-verification";
import { StepSummary } from "@/components/driver-profile-form/step-summary";
import { SuccessPanel } from "@/components/driver-profile-form/success-panel";
import {
  emptyDriverProfile,
  nextSuggestedId,
  validateStep,
  STEP_LABELS,
  TOTAL_STEPS,
  type DriverProfileData,
} from "@/lib/driver-profile";
import { appendResponse, readResponses } from "@/lib/response-storage";

const SUMMARY_STEP = TOTAL_STEPS; // 6
type Phase = "form" | "success";

const STEP_INTROS = [
  "Data dasar responden dan sesi wawancara.",
  "Jenis layanan dan pola kerja sehari-hari.",
  "Rata-rata per hari kerja biasa, bukan hari terbaik.",
  "Bandingkan kondisi sebelum dan sesudah 1 Juli 2026.",
  "Kesediaan memberi bukti struk, lalu catatan bebas.",
  "Periksa sekali lagi bersama responden sebelum disimpan.",
];


export function DriverProfileForm() {
  const [phase, setPhase] = React.useState<Phase>("form");
  const [step, setStep] = React.useState(1);
  const [history, setHistory] = React.useState<DriverProfileData[]>(() => readResponses());
  const [data, setData] = React.useState<DriverProfileData>(() => ({
    ...emptyDriverProfile(),
    ID_Responden: nextSuggestedId(readResponses().length),
  }));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [lastSavedId, setLastSavedId] = React.useState("");
  const [synced, setSynced] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const topRef = React.useRef<HTMLDivElement>(null);

  function scrollTop() {
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function handleChange(key: keyof DriverProfileData, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleNext() {
    if (step <= 5) {
      const result = validateStep(step, data);
      if (!result.success) {
        setErrors(result.errors);
        const missing = Object.keys(result.errors);
        toast.error(`${missing.length} pertanyaan belum terisi dengan benar.`);
        // Jump to the first problem so the interviewer doesn't have to hunt.
        requestAnimationFrame(() => {
          document
            .getElementById(`q-${missing[0]}`)
            ?.scrollIntoView({ block: "start", behavior: "smooth" });
          document.getElementById(missing[0])?.focus({ preventScroll: true });
        });
        return;
      }
      setErrors({});
    }
    if (step === SUMMARY_STEP) {
      const saved = appendResponse(data);
      setSaving(true);
      const res = await fetch("/api/responses", {
        method: "POST",
        body: JSON.stringify(data),
      }).catch(() => null);
      setSaving(false);
      setSynced(!!res?.ok);
      if (!res?.ok) toast.error("Gagal kirim ke Google Sheet. Data tersimpan lokal di perangkat ini.");
      setHistory(saved);
      setLastSavedId(data.ID_Responden);
      setPhase("success");
      scrollTop();
      return;
    }
    setStep((s) => Math.min(s + 1, SUMMARY_STEP));
    scrollTop();
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
    scrollTop();
  }

  function handleEditFromSummary(target: number) {
    setStep(target);
    scrollTop();
  }

  function handleNewEntry() {
    const existing = readResponses();
    setData({ ...emptyDriverProfile(), ID_Responden: nextSuggestedId(existing.length) });
    setErrors({});
    setStep(1);
    setPhase("form");
    scrollTop();
  }

  const nextLabel =
    step === SUMMARY_STEP
      ? "Simpan respon"
      : step === SUMMARY_STEP - 1
        ? "Tinjau ringkasan"
        : `Lanjut ke bagian ${step + 1}`;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <header
        ref={topRef}
        className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3"
      >
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">Profil Mitra Ojol</h1>
          <p className="text-sm text-muted-foreground">Wawancara pengemudi · DKI Jakarta 2026</p>
        </div>
        <ThemeToggle />
      </header>

      {phase === "form" && <Stepper current={step} />}

      <main className="flex-1 px-4 pt-6 pb-36">
        {phase === "form" ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">{STEP_LABELS[step - 1]}</h2>
            <p className="mt-1 text-base leading-relaxed text-muted-foreground">
              {STEP_INTROS[step - 1]}
            </p>
            <div className="mt-2">
              {step === 1 && <StepIdentity data={data} errors={errors} onChange={handleChange} />}
              {step === 2 && (
                <StepOperational data={data} errors={errors} onChange={handleChange} />
              )}
              {step === 3 && <StepIncome data={data} errors={errors} onChange={handleChange} />}
              {step === 4 && <StepImpact data={data} errors={errors} onChange={handleChange} />}
              {step === 5 && (
                <StepVerification data={data} errors={errors} onChange={handleChange} />
              )}
              {step === 6 && <StepSummary data={data} onEdit={handleEditFromSummary} />}
            </div>
          </section>
        ) : (
          <SuccessPanel savedId={lastSavedId} synced={synced} history={history} />
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl gap-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {phase === "form" ? (
            <>
              <Button
                variant="outline"
                className={navBtn}
                disabled={step === 1}
                onClick={handleBack}
                aria-label="Kembali"
              >
                <ArrowLeftIcon className="size-5" />
              </Button>
              <Button className={cn(navBtn, "flex-1")} disabled={saving} onClick={handleNext}>
                {saving ? "Menyimpan…" : nextLabel}
                <ArrowRightIcon className="size-5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className={navBtn}
                onClick={() => {
                  setPhase("form");
                  setStep(SUMMARY_STEP);
                  scrollTop();
                }}
              >
                <ArrowLeftIcon className="size-5" />
                Ringkasan
              </Button>
              <Button className={cn(navBtn, "flex-1")} onClick={handleNewEntry}>
                Responden baru
                <ArrowRightIcon className="size-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Thumb-sized: the phone may be on a handlebar mount. */
const navBtn = "h-14 rounded-xl px-5 text-base";

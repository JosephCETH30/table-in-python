"use client";

import { Progress } from "@/components/ui/progress";
import { STEP_LABELS, TOTAL_STEPS } from "@/lib/driver-profile";

export function Stepper({ current }: { current: number }) {
  return (
    <div className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate font-medium">{STEP_LABELS[current - 1]}</span>
        <span className="shrink-0 text-muted-foreground tabular-nums">
          {current} dari {TOTAL_STEPS}
        </span>
      </div>
      <Progress value={(current / TOTAL_STEPS) * 100} aria-label="Kemajuan formulir" />
    </div>
  );
}

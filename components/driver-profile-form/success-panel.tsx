"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2Icon, CloudOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DriverProfileData } from "@/lib/driver-profile";

function copy(text: string, message: string) {
  navigator.clipboard?.writeText(text).then(() => toast.success(message));
}

const smallBtn = "h-10 rounded-lg px-3";

function HistoryRow({ entry }: { entry: DriverProfileData }) {
  const [open, setOpen] = React.useState(false);
  const json = React.useMemo(() => JSON.stringify(entry, null, 2), [entry]);
  const aplikator =
    entry.Nama_Aplikator === "Lainnya" && entry.Nama_Aplikator_Lainnya
      ? entry.Nama_Aplikator_Lainnya
      : entry.Nama_Aplikator || "—";

  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-base font-semibold">
          {entry.ID_Responden || "—"}
        </span>
        <span className="min-w-0 flex-1 truncate text-base">
          {aplikator}
          <span className="text-muted-foreground"> · {entry.Wilayah_Operasi || "—"}</span>
        </span>
        <span className="hidden text-sm text-muted-foreground tabular-nums min-[480px]:inline">
          {entry.Tanggal_Wawancara}
        </span>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" className={smallBtn} onClick={() => copy(json, "JSON disalin")}>
            Salin
          </Button>
          <Button variant="outline" className={smallBtn} onClick={() => setOpen((o) => !o)}>
            {open ? "Tutup" : "Lihat"}
          </Button>
        </div>
      </div>
      {open && (
        <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words text-muted-foreground">
          {json}
        </pre>
      )}
    </li>
  );
}

export function SuccessPanel({
  savedId,
  synced,
  history,
}: {
  savedId: string;
  synced: boolean;
  history: DriverProfileData[];
}) {
  const reversed = React.useMemo(() => [...history].reverse(), [history]);
  const StatusIcon = synced ? CheckCircle2Icon : CloudOffIcon;

  return (
    <div>
      <div className="rounded-xl border p-5">
        <StatusIcon className={synced ? "size-8" : "size-8 text-destructive"} />
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">Respon {savedId} tersimpan</h2>
        <p className="mt-1 text-base leading-relaxed text-muted-foreground">
          {synced
            ? "Sudah masuk ke Google Sheet dan tersimpan juga di perangkat ini."
            : "Belum masuk ke Google Sheet, baru tersimpan di perangkat ini. Salin JSON-nya kalau perlu dipindahkan manual."}
        </p>
      </div>

      <section className="mt-8">
        <header className="flex items-center justify-between gap-3 border-b pb-2">
          <h3 className="text-lg font-semibold">
            Respon di perangkat ini{" "}
            <span className="font-normal text-muted-foreground tabular-nums">{history.length}</span>
          </h3>
          {history.length > 0 && (
            <Button
              variant="outline"
              className={smallBtn}
              onClick={() => copy(JSON.stringify(history, null, 2), "Semua respon disalin")}
            >
              Salin semua
            </Button>
          )}
        </header>
        <ul className="divide-y">
          {reversed.map((entry, i) => (
            <HistoryRow key={history.length - i} entry={entry} />
          ))}
        </ul>
      </section>
    </div>
  );
}

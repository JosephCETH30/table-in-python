"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ORDER = ["system", "light", "dark"] as const;
const ICON = { system: MonitorIcon, light: SunIcon, dark: MoonIcon };
const LABEL = { system: "Ikuti sistem", light: "Terang", dark: "Gelap" };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  // next-themes' documented fix for the SSR/client theme mismatch: the real
  // theme is only known after mount, so render a neutral icon until then.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const current = (mounted ? theme : "system") as (typeof ORDER)[number];
  const Icon = ICON[current] ?? MonitorIcon;

  return (
    <Button
      variant="outline"
      className="size-11 rounded-xl"
      title={`Tema: ${LABEL[current] ?? "Ikuti sistem"}`}
      aria-label="Ganti tema"
      onClick={() => {
        const idx = ORDER.indexOf(current);
        setTheme(ORDER[(idx + 1) % ORDER.length]);
      }}
    >
      <Icon className="size-5" />
    </Button>
  );
}

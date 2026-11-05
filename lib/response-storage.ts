import type { DriverProfileData } from "@/lib/driver-profile";

const STORAGE_KEY = "ojol_survey_responses";

/**
 * Local-only, per-device storage for reviewing submitted entries while the
 * dataset export pipeline doesn't exist yet. Not shared, not authoritative.
 */
export function readResponses(): DriverProfileData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DriverProfileData[]) : [];
  } catch {
    return [];
  }
}

export function appendResponse(entry: DriverProfileData): DriverProfileData[] {
  const list = [...readResponses(), entry];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable (private mode, quota, etc.) — keep going in-memory
  }
  return list;
}

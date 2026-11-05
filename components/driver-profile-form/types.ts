import type { DriverProfileData } from "@/lib/driver-profile";

export interface StepProps {
  data: DriverProfileData;
  errors: Record<string, string>;
  onChange: (key: keyof DriverProfileData, value: string) => void;
}

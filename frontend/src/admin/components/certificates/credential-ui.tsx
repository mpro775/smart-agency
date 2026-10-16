import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
export function Field({
  label,
  ...props
}: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm">
      <span>{label}</span>
      <Input {...props} className="bg-slate-950 border-slate-700" />
    </label>
  );
}
export function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Label className="flex gap-3 items-center">
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      {label}
    </Label>
  );
}

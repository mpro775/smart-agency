import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadManagedImage, uploadPdfDocument } from "../../services/api";
import type { ManagedAsset } from "../../types";
import { errorMessage } from "./credential-utils";
export function ManagedAssetUpload({
  label,
  value,
  onChange,
  folder,
  pdf = false,
  disabled = false,
  onBusyChange,
}: {
  label: string;
  value?: ManagedAsset | null;
  onChange: (asset: ManagedAsset | null) => void;
  folder: string;
  pdf?: boolean;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid gap-3">
      <label className="grid gap-2 text-sm">
        <span>{label} — حتى 15 MB</span>
        <Input
          type="file"
          accept={
            pdf
              ? ".pdf,application/pdf"
              : "image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          }
          disabled={disabled || busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setBusy(true);
            onBusyChange?.(true);
            try {
              onChange(
                await (pdf
                  ? uploadPdfDocument(file, folder)
                  : uploadManagedImage(file, folder)),
              );
              toast.success("تم رفع الملف؛ احفظ لحفظ التغيير");
            } catch (error) {
              toast.error(errorMessage(error));
            } finally {
              setBusy(false);
              onBusyChange?.(false);
            }
          }}
        />
      </label>
      {busy && <p role="status">جاري رفع الملف...</p>}
      {value ? (
        <>
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 break-all"
          >
            {value.originalName || "فتح الملف"} (
            {(value.bytes / 1024).toFixed(1)} KB)
          </a>
          {!pdf && (
            <img
              src={value.url}
              alt={label}
              className="max-h-52 max-w-full object-contain rounded-lg"
            />
          )}
          {pdf && (
            <p className="text-sm text-emerald-400">
              PDF مرفوع {value.sha256 ? "• SHA-256 متوفرة" : "• البصمة مفقودة"}
            </p>
          )}
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onChange(null)}
            >
              إزالة الملف
            </Button>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-400">
          لم يتم رفع {pdf ? "ملف PDF" : "صورة"} بعد
        </p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Section } from "./credential-ui";
import { copyCredential, errorMessage } from "./credential-utils";
export function CertificateQrCard({
  certificateId,
  verificationUrl,
}: {
  certificateId: string;
  verificationUrl: string;
}) {
  const [png, setPng] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(verificationUrl, {
      width: 1024,
      margin: 4,
      errorCorrectionLevel: "H",
    })
      .then((value) => {
        if (!cancelled) setPng(value);
      })
      .catch((reason) => {
        if (!cancelled) setError(errorMessage(reason));
      });
    return () => {
      cancelled = true;
    };
  }, [verificationUrl]);
  async function download(svg: boolean) {
    try {
      const url = svg
        ? URL.createObjectURL(
            new Blob(
              [
                await QRCode.toString(verificationUrl, {
                  type: "svg",
                  margin: 4,
                  errorCorrectionLevel: "H",
                }),
              ],
              { type: "image/svg+xml" },
            ),
          )
        : png;
      if (!url) return;
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateId}-QR.${svg ? "svg" : "png"}`;
      link.click();
      if (svg) setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (reason) {
      toast.error(errorMessage(reason));
    }
  }
  return (
    <Section title="رقم الشهادة ورابط التحقق">
      <p dir="ltr" className="break-all font-mono">
        {certificateId}
      </p>
      <a
        dir="ltr"
        href={verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block break-all text-cyan-400"
      >
        {verificationUrl}
      </a>
      {png ? (
        <img src={png} alt="QR لرابط التحقق" className="w-52 h-52" />
      ) : (
        <p role="status">{error || "جاري إنشاء QR..."}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => void copyCredential(certificateId)}
        >
          نسخ الرقم
        </Button>
        <Button
          type="button"
          onClick={() => void copyCredential(verificationUrl)}
        >
          نسخ الرابط
        </Button>
        <Button
          type="button"
          disabled={!png}
          onClick={() => void download(false)}
        >
          تحميل QR PNG
        </Button>
        <Button type="button" onClick={() => void download(true)}>
          تحميل QR SVG
        </Button>
      </div>
    </Section>
  );
}

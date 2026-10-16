import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  Award,
  ShieldCheck,
  ShieldX,
  Search,
  FileDown,
  ExternalLink,
  UserRound,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/localization/LocaleLayout";
import { publicCertificatesService } from "@/services/certificates.service";

export default function VerifyPage() {
  const { certificateId } = useParams();
  const { locale, localePath } = useLocale();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const result = useQuery({
    queryKey: ["public-certificate", certificateId],
    queryFn: () => publicCertificatesService.verify(certificateId!),
    enabled: Boolean(certificateId),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  const c = result.data;
  const active = c?.status === "active" && c.authentic === true;
  const localized = (ar?: string, en?: string) =>
    locale === "en" ? en || ar : ar || en;
  const date = (value?: string) =>
    value
      ? new Intl.DateTimeFormat(locale === "ar" ? "ar-YE" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(value))
      : "—";
  const notFound =
    axios.isAxiosError(result.error) && result.error.response?.status === 404;
  return (
    <div className="min-h-screen bg-[#070e18] text-white pt-32 pb-24 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
            <Award className="h-9 w-9 text-cyan-300" />
          </div>
          <p className="text-cyan-300 text-sm tracking-wide">
            {t("verify.registry")}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold">
            {t("verify.title")}
          </h1>
          <p className="text-slate-400 leading-7">{t("verify.intro")}</p>
        </header>
        <form
          className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const id = input.trim().toUpperCase();
            if (id) navigate(localePath(`/verify/${encodeURIComponent(id)}`));
          }}
        >
          <label className="flex-1 grid gap-2">
            <span className="text-sm text-slate-300">{t("verify.id")}</span>
            <Input
              dir="ltr"
              autoComplete="off"
              maxLength={100}
              required
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="SA-INT-FE-2026-A8F4C91D"
              className="bg-slate-950 border-slate-600 text-white font-mono"
            />
          </label>
          <Button
            type="submit"
            className="sm:self-end gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950"
          >
            <Search size={18} />
            {t("verify.submit")}
          </Button>
        </form>
        {certificateId && result.isLoading && (
          <p role="status" className="text-center text-cyan-300">
            {t("verify.loading")}
          </p>
        )}
        {certificateId && result.isError && (
          <section
            role="alert"
            className="max-w-2xl mx-auto rounded-2xl border border-amber-400/30 bg-amber-400/5 p-8 text-center space-y-4"
          >
            <AlertCircle className="mx-auto text-amber-300" size={42} />
            <h2 className="text-2xl font-bold">
              {t(notFound ? "verify.notFound" : "verify.error")}
            </h2>
            <p className="text-slate-300">
              {t(notFound ? "verify.notFoundHint" : "verify.errorHint")}
            </p>
            {!notFound && (
              <Button variant="outline" onClick={() => void result.refetch()}>
                {t("verify.retry")}
              </Button>
            )}
          </section>
        )}
        {c && (
          <article className="space-y-6">
            <div
              className={`rounded-2xl p-6 border flex flex-wrap gap-4 items-center ${active ? "border-emerald-400/40 bg-emerald-400/10" : "border-red-400/40 bg-red-400/10"}`}
            >
              {active ? (
                <ShieldCheck size={42} className="text-emerald-300" />
              ) : (
                <ShieldX size={42} className="text-red-300" />
              )}
              <div>
                <h2
                  className={`text-xl md:text-2xl font-bold ${active ? "text-emerald-300" : "text-red-300"}`}
                >
                  {t(active ? "verify.active" : "verify.revoked")}
                </h2>
                <p className="text-slate-300 mt-1">
                  {t(active ? "verify.activeHint" : "verify.revokedHint")}
                </p>
                {c.revokedAt && (
                  <p className="mt-2">
                    {t("verify.revokedAt")}: {date(c.revokedAt)}
                  </p>
                )}
              </div>
            </div>
            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
              <aside className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-7 space-y-6 h-fit">
                <div className="flex justify-center">
                  {active && c.holder.photoUrl ? (
                    <img
                      src={c.holder.photoUrl}
                      alt={localized(c.holder.fullName, c.holder.fullNameEn)}
                      className="w-28 h-28 rounded-full object-cover border-4 border-cyan-300/20"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-cyan-200 text-3xl">
                      {localized(
                        c.holder.fullName,
                        c.holder.fullNameEn,
                      )?.[0] || <UserRound />}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-2xl">
                    {localized(c.holder.fullName, c.holder.fullNameEn)}
                  </h3>
                  <p className="text-slate-400 mt-2">
                    {locale === "ar" ? c.holder.fullNameEn : c.holder.fullName}
                  </p>
                </div>
                <div className="border-t border-slate-700 pt-5">
                  <p className="text-sm text-slate-400">{t("verify.id")}</p>
                  <p dir="ltr" className="font-mono text-sm mt-2 break-all">
                    {c.certificateId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">{t("verify.status")}</p>
                  <p className={active ? "text-emerald-300" : "text-red-300"}>
                    {t(active ? "verify.statusActive" : "verify.statusRevoked")}
                  </p>
                </div>
                {active &&
                  c.professionalLinks &&
                  Object.values(c.professionalLinks).some(Boolean) && (
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(c.professionalLinks)
                        .filter(([, url]) => Boolean(url))
                        .map(([key, url]) => (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-300 underline"
                          >
                            {key === "linkedinUrl"
                              ? "LinkedIn"
                              : key === "githubUrl"
                                ? "GitHub"
                                : t("verify.portfolio")}
                          </a>
                        ))}
                    </div>
                  )}
              </aside>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 md:p-9 space-y-8">
                <div>
                  <p className="text-cyan-300 mb-3">
                    {active && c.credential.type
                      ? t(`verify.type.${c.credential.type}`)
                      : t("verify.credential")}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {localized(
                      c.credential.specialization,
                      c.credential.specializationEn,
                    )}
                  </h3>
                  <p className="text-slate-300 mt-3 text-lg">
                    {localized(c.credential.title, c.credential.titleEn)}
                  </p>
                </div>
                <dl className="grid sm:grid-cols-2 gap-6 border-y border-slate-700/70 py-6">
                  {active && (
                    <>
                      <div>
                        <dt className="text-slate-400 text-sm">
                          {t("verify.period")}
                        </dt>
                        <dd className="mt-2">
                          {date(c.credential.trainingStartDate)} —{" "}
                          {date(c.credential.trainingEndDate)}
                        </dd>
                      </div>
                      {localized(
                        c.credential.durationLabel,
                        c.credential.durationLabelEn,
                      ) && (
                        <div>
                          <dt className="text-slate-400 text-sm">
                            {t("verify.duration")}
                          </dt>
                          <dd className="mt-2">
                            {localized(
                              c.credential.durationLabel,
                              c.credential.durationLabelEn,
                            )}
                          </dd>
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <dt className="text-slate-400 text-sm">
                      {t("verify.issuedAt")}
                    </dt>
                    <dd className="mt-2">{date(c.credential.issuedAt)}</dd>
                  </div>
                </dl>
                {active && Boolean(c.credential.skills?.length) && (
                  <section>
                    <h4 className="font-bold mb-3">{t("verify.skills")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(c.credential.skills ?? []).map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-2 rounded-lg bg-cyan-300/10 border border-cyan-300/20 text-cyan-100 text-sm"
                        >
                          {localized(skill.name, skill.nameEn)}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
                {active &&
                  localized(
                    c.credential.description,
                    c.credential.descriptionEn,
                  ) && (
                    <p className="text-slate-300 whitespace-pre-line leading-8">
                      {localized(
                        c.credential.description,
                        c.credential.descriptionEn,
                      )}
                    </p>
                  )}
                {active && c.supervisor && (
                  <section>
                    <h4 className="text-sm text-slate-400 mb-2">
                      {t("verify.supervisor")}
                    </h4>
                    <p className="font-semibold">
                      {localized(c.supervisor.name, c.supervisor.nameEn)}
                    </p>
                    <p className="text-slate-400 mt-1">
                      {localized(c.supervisor.title, c.supervisor.titleEn)}
                    </p>
                  </section>
                )}
                {active && c.issuer && (
                  <a
                    href={c.issuer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 inline-flex items-center gap-2"
                  >
                    {localized(c.issuer.name, c.issuer.nameEn)}
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
            {active && c.files && (
              <section className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 md:p-8 space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <h3 className="font-bold text-xl">{t("verify.view")}</h3>
                  <div className="flex flex-wrap gap-3">
                    {c.files.certificateImageUrl && (
                      <a
                        href={c.files.certificateImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 px-4 py-2 text-cyan-200"
                      >
                        <ExternalLink size={18} />
                        {t("verify.viewImage")}
                      </a>
                    )}
                    {c.files.certificatePdfUrl && (
                      <a
                        href={c.files.certificatePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-slate-950 font-medium"
                      >
                        <FileDown size={18} />
                        {t("verify.download")}
                      </a>
                    )}
                  </div>
                </div>
                {c.files.certificateImageUrl && (
                  <a
                    href={c.files.certificateImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={c.files.certificateImageUrl}
                      alt={t("verify.imageAlt")}
                      className="w-full max-h-[900px] object-contain rounded-xl bg-slate-950 mt-5"
                      loading="lazy"
                    />
                  </a>
                )}
              </section>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

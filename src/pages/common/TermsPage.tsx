import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white bg-[radial-gradient(1100px_540px_at_50%_-10%,rgba(132,204,22,0.10),transparent_70%),radial-gradient(900px_520px_at_50%_100%,rgba(6,182,212,0.10),transparent_65%)]" />
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("terms.title")}
        </h1>
        <p className="mt-2 text-black/70">{t("terms.lead")}</p>

        <div className="mt-6 space-y-4 text-sm leading-6 text-black/80">
          <p>{t("terms.p1")}</p>
          <p>{t("terms.p2")}</p>
          <p>{t("terms.p3")}</p>
        </div>

        <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400" />
      </div>
    </div>
  );
}

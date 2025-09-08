import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white bg-[radial-gradient(1100px_540px_at_50%_-10%,rgba(132,204,22,0.10),transparent_70%),radial-gradient(900px_520px_at_50%_100%,rgba(6,182,212,0.10),transparent_65%)]" />
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">404</h1>
        <p className="mt-2 text-lg">{t("notFound.title")}</p>
        <p className="mt-1 text-black/70">{t("notFound.desc")}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="cursor-pointer rounded-md border px-4 py-2 text-sm text-white shadow-sm transition active:scale-[0.98] bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 hover:shadow"
          >
            {t("notFound.home")}
          </Link>
          <Link
            to="/materials"
            className="cursor-pointer rounded-md border px-4 py-2 text-sm transition hover:bg-black/5 active:scale-[0.98]"
          >
            {t("notFound.materials")}
          </Link>
        </div>

        <div className="mt-10 h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
      </div>
    </div>
  );
}

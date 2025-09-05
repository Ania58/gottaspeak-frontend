import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white bg-[radial-gradient(1100px_550px_at_50%_-10%,rgba(132,204,22,0.10),transparent_70%),radial-gradient(900px_500px_at_50%_100%,rgba(6,182,212,0.10),transparent_65%)]" />

      <section className="mx-auto w-full max-w-6xl px-4 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div className="animate-[fadeSlide_.25s_ease-out]">
            <h1 className="text-3xl font-semibold leading-snug sm:text-4xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-3 text-black/70 sm:text-lg">{t("home.hero.subtitle")}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/materials"
                className="cursor-pointer rounded-md border px-4 py-2 text-sm text-white shadow-sm transition active:scale-[0.98] bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 hover:shadow"
              >
                {t("home.cta.explore")}
              </Link>
              <Link
                to="/contact"
                className="cursor-pointer rounded-md border px-4 py-2 text-sm transition hover:bg-black/5 active:scale-[0.98]"
              >
                {t("home.cta.contact")}
              </Link>
            </div>
          </div>

          <div className="relative h-48 sm:h-64">
            <div className="absolute right-4 top-2 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-lime-300/70 to-cyan-300/70 blur-2xl sm:h-56 sm:w-56" />
            <div className="absolute bottom-0 left-6 h-28 w-28 animate-[floaty_4s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-300/60 to-violet-300/60 blur-xl sm:h-40 sm:w-40" />
            <div className="absolute inset-0 rounded-2xl border bg-white/60 backdrop-blur-sm" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/materials"
            className="group rounded-xl border bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
            <h3 className="mt-3 text-lg font-medium">{t("home.cards.materials.title")}</h3>
            <p className="mt-1 text-sm text-black/70">{t("home.cards.materials.desc")}</p>
            <div className="mt-4 inline-block text-sm underline decoration-transparent underline-offset-2 transition group-hover:decoration-inherit">
              {t("home.cards.materials.link")}
            </div>
          </Link>

          <div className="rounded-xl border bg-white/80 p-5 opacity-95 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">{t("home.soon")}</span>
            </div>
            <h3 className="mt-3 text-lg font-medium">{t("home.cards.courses.title")}</h3>
            <p className="mt-1 text-sm text-black/70">{t("home.cards.courses.desc")}</p>
          </div>

          <Link
            to="/lessons"
            className="group rounded-xl border bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400" />
            <h3 className="mt-3 text-lg font-medium">{t("home.cards.lessons.title")}</h3>
            <p className="mt-1 text-sm text-black/70">{t("home.cards.lessons.desc")}</p>
            <div className="mt-4 inline-block text-sm underline decoration-transparent underline-offset-2 transition group-hover:decoration-inherit">
              {t("home.cards.lessons.link")}
            </div>
          </Link>
        </div>
      </section>

      <style>
        {`
        @keyframes fadeSlide { 0%{opacity:0;transform:translateY(4px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        `}
      </style>
    </div>
  );
}

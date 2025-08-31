import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18next/index.ts";

export default function Header() {
  const { t, i18n } = useTranslation();
  const current = (i18n.language || "en").split("-")[0];

  const langs = [
    { code: "pl", label: "PL" },
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
  ] as const;

  return (
    <header
      className="
        sticky top-0 z-50 border-b shadow-sm
        bg-gradient-to-b from-lime-100/60 via-cyan-50/50 to-violet-100/60
      "
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="text-xl font-semibold bg-gradient-to-r from-lime-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent"
        >
          {t("appName")}
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/materials"
              className={({ isActive }) =>
                (isActive ? "font-semibold underline " : "hover:underline ") +
                "text-black/80 transition-colors"
              }
            >
              {t("nav.materials")}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                (isActive ? "font-semibold underline " : "hover:underline ") +
                "text-black/80 transition-colors"
              }
            >
              {t("nav.contact")}
            </NavLink>
          </nav>

          <div className="flex items-center gap-1">
            {langs.map(({ code, label }) => {
              const active = current === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => changeLanguage(code as any)}
                  className={
                    "rounded px-2 py-1 text-xs border transition cursor-pointer " +
                    (active
                      ? "text-white bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 cursor-pointer"
                      : "border-black/20 text-black/70 hover:bg-black/5 cursor-pointer")
                  }
                  aria-pressed={active}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500" />
    </header>
  );
}

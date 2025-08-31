import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation(); 

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="text-xl font-semibold bg-gradient-to-r from-lime-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent"
        >
          {t("appName")}
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/materials"
            className={({ isActive }) =>
              (isActive ? "font-semibold underline " : "hover:underline ") +
              "transition-colors"
            }
          >
            {t("nav.materials")}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              (isActive ? "font-semibold underline " : "hover:underline ") +
              "transition-colors"
            }
          >
            {t("nav.contact")}
          </NavLink>
        </nav>
      </div>

      <div className="h-1 bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500" />
    </header>
  );
}


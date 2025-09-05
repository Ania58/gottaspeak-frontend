import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t bg-gradient-to-b from-white via-lime-50/40 to-cyan-50/40">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <Link
              to="/"
              className="inline-block text-lg font-semibold bg-gradient-to-r from-lime-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent"
            >
              GottaSpeak
            </Link>
            <p className="mt-2 text-sm text-black/70">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="text-sm sm:justify-self-end">
            <div className="font-medium text-black/80">{t("footer.legal")}</div>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  to="/privacy"
                  className="underline decoration-transparent underline-offset-2 hover:decoration-inherit transition"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="underline decoration-transparent underline-offset-2 hover:decoration-inherit transition"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li className="mt-3 text-black/60">
                {t("footer.supportHint")}{" "}
                <Link
                  to="/contact"
                  className="font-medium underline decoration-transparent underline-offset-2 hover:decoration-inherit transition"
                >
                  {t("footer.writeUs")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
          <p className="text-xs text-black/60">
            © {year} GottaSpeak — {t("footer.rights")}
          </p>
          <div className="h-1 w-28 rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400" />
        </div>
      </div>
    </footer>
  );
}

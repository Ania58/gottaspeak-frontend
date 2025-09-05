import { useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

function extractRoom(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^gs-[a-z0-9]+-[a-z0-9]+$/i.test(s)) return s;
  try {
    const url = new URL(s);
    const last = url.pathname.split("/").filter(Boolean).pop() || "";
    if (/^gs-[a-z0-9]+-[a-z0-9]+$/i.test(last)) return last;
  } catch {
    const last = s.split(/[\/\s]/).filter(Boolean).pop() || "";
    if (/^gs-[a-z0-9]+-[a-z0-9]+$/i.test(last)) return last;
  }
  return null;
}

export default function LessonJoin() {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleJoin(e?: React.FormEvent) {
    e?.preventDefault();
    setErr("");
    const room = extractRoom(value);
    if (!room) {
      setErr(t("lessons.join.error.invalid"));
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/lessons/${encodeURIComponent(room)}`);
      if (!r.ok) {
        setErr(r.status === 404 ? t("lessons.join.error.notfound") : `${r.status} ${r.statusText}`);
        setLoading(false);
        return;
      }
      const data = (await r.json()) as { url: string };
      window.location.href = data.url;
    } catch (e: any) {
      setErr(String(e?.message || e));
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(132,204,22,0.10),transparent_70%),radial-gradient(900px_520px_at_50%_100%,rgba(6,182,212,0.10),transparent_65%)]" />
      <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("lessons.join.title")}
        </h1>
        <p className="mt-2 text-black/70">{t("lessons.join.subtitle")}</p>

        <form onSubmit={handleJoin} className="mt-6 rounded-xl border bg-white/80 p-4 shadow-sm">
          <label htmlFor="room" className="text-sm text-black/70">
            {t("lessons.join.label")}
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="room"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("lessons.join.placeholder")}
              className="w-full rounded-md border px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-md border px-4 py-2 text-sm text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60 bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 hover:shadow"
            >
              {loading ? t("lessons.join.loading") : t("lessons.join.cta")}
            </button>
          </div>

          <p className="mt-2 text-xs text-black/60">{t("lessons.join.tip")}</p>

          {err && (
            <p className="mt-3 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
              {err}
            </p>
          )}
        </form>

        <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
      </div>

      <style>
        {`@keyframes fadeSlide{0%{opacity:.0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}`}
      </style>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

type Channel = "hello" | "support";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  channel: Channel;
  userId?: string;
};

export default function ContactPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    channel: "support",
    userId: "",
  });
  const [touched, setTouched] = useState<Record<keyof Omit<FormState, "channel" | "userId">, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email]
  );

  const errors: Partial<Record<keyof Omit<FormState, "channel" | "userId">, string>> = useMemo(() => {
    const e: Partial<Record<keyof Omit<FormState, "channel" | "userId">, string>> = {};
    if (!form.name.trim()) e.name = t("contact.errors.name");
    if (!emailOk) e.email = t("contact.errors.email");
    if (!form.message.trim() || form.message.trim().length < 3)
      e.message = t("contact.errors.message");
    return e;
  }, [form.name, form.message, emailOk, t]);

  const canSend = Object.keys(errors).length === 0 && !submitting;

  useEffect(() => {
    const saved = localStorage.getItem("contactDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<FormState>;
        setForm((f) => ({ ...f, ...parsed }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      localStorage.setItem(
        "contactDraft",
        JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          channel: form.channel,
          userId: form.userId,
        })
      );
    }, 250);
    return () => window.clearTimeout(id);
  }, [form.name, form.email, form.subject, form.channel, form.userId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    setOk(false);
    setError("");
    if (!canSend) return;

    setSubmitting(true);
    try {
      const r = await fetch(`${API_URL}/support-mail/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim().slice(0, 2000),
          subject: form.subject.trim() || undefined,
          channel: form.channel,
          userId: form.userId?.trim() || undefined,
        }),
      });

      if (!r.ok) {
        const msg = await r.text();
        throw new Error(`${r.status} ${r.statusText}${msg ? ` — ${msg}` : ""}`);
      }
      setOk(true);
      setForm((f) => ({ ...f, message: "" }));
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(132,204,22,0.08),transparent_70%),radial-gradient(900px_500px_at_50%_100%,rgba(6,182,212,0.08),transparent_65%)]" />
      <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="rounded-2xl border bg-gradient-to-b from-lime-50/70 via-cyan-50/60 to-violet-50/70 p-5 shadow-sm sm:p-8">
          <header className="mb-5">
            <h1 className="text-2xl font-semibold tracking-tight">{t("contact.title")}</h1>
            <p className="mt-1 text-sm text-black/70">{t("contact.subtitle")}</p>
            <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
          </header>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-black/70">{t("contact.channel.label")}</span>
            <div className="inline-flex overflow-hidden rounded-lg border">
              {(["hello", "support"] as Channel[]).map((c) => {
                const active = form.channel === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, channel: c }))}
                    className={
                      "cursor-pointer px-3 py-1.5 text-sm transition " +
                      (active
                        ? "text-white bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500"
                        : "bg-white hover:bg-black/5")
                    }
                    aria-pressed={active}
                  >
                    {t(`contact.channel.${c}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1">
              <label htmlFor="cName" className="text-sm text-black/80">
                {t("contact.name")}
              </label>
              <input
                id="cName"
                autoComplete="name"
                className={
                  "rounded-md border px-3 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 " +
                  (touched.name && errors.name ? "border-red-300" : "")
                }
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder={t("contact.placeholders.name")}
              />
              {touched.name && errors.name && (
                <p className="text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-1">
              <label htmlFor="cEmail" className="text-sm text-black/80">
                {t("contact.email")}
              </label>
              <input
                id="cEmail"
                type="email"
                autoComplete="email"
                className={
                  "rounded-md border px-3 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 " +
                  (touched.email && errors.email ? "border-red-300" : "")
                }
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder={t("contact.placeholders.email")}
              />
              {touched.email && errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-1">
              <label htmlFor="cSubject" className="text-sm text-black/80">
                {t("contact.subject")}
              </label>
              <input
                id="cSubject"
                className="rounded-md border px-3 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder={t("contact.placeholders.subject")}
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="cMessage" className="text-sm text-black/80">
                {t("contact.message")}
              </label>
              <textarea
                id="cMessage"
                className={
                  "min-h-[140px] rounded-md border px-3 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 " +
                  (touched.message && errors.message ? "border-red-300" : "")
                }
                maxLength={2000}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                placeholder={t("contact.placeholders.message")}
              />
              <div className="flex items-center justify-between text-xs text-black/50">
                <span>
                  {t("contact.counter", { n: form.message.trim().length, max: 2000 })}
                </span>
              </div>
              {touched.message && errors.message && (
                <p className="text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className="cursor-pointer rounded-md border px-3 py-1.5 text-xs transition hover:bg-black/5 active:scale-[0.98]"
                aria-expanded={advanced}
              >
                {advanced ? t("contact.advanced.hide") : t("contact.advanced.show")}
              </button>
            </div>

            {advanced && (
              <div className="origin-top animate-[fadeSlide_.18s_ease-out] grid gap-1">
                <label htmlFor="cUserId" className="text-sm text-black/80">
                  {t("contact.userId")} <span className="text-black/50">({t("contact.optional")})</span>
                </label>
                <input
                  id="cUserId"
                  className="rounded-md border px-3 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300"
                  value={form.userId || ""}
                  onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                  placeholder="user_abc123"
                />
              </div>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!canSend}
                className={
                  "cursor-pointer rounded-md border px-4 py-2 text-sm transition active:scale-[0.98] " +
                  (canSend
                    ? "bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 text-white shadow-sm hover:shadow"
                    : "bg-black/5 text-black/50")
                }
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                    {t("contact.sending")}
                  </span>
                ) : (
                  t("contact.send")
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({ name: "", email: "", subject: "", message: "", channel: "support", userId: "" });
                  setTouched({ name: false, email: false, subject: false, message: false });
                  setOk(false);
                  setError("");
                }}
                className="cursor-pointer rounded-md border px-4 py-2 text-sm transition hover:bg-black/5 active:scale-[0.98]"
              >
                {t("contact.clear")}
              </button>
            </div>
          </form>

          {ok && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 animate-[fadeSlide_.2s_ease-out] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              {t("contact.success")}
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mt-4 animate-[fadeSlide_.2s_ease-out] rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {t("contact.error")}<span className="sr-only">: </span>
              <span className="break-all">{error}</span>
            </div>
          )}
        </div>
      </div>

      <style>
        {`@keyframes fadeSlide{0%{opacity:0;transform:translateY(-4px)}100%{opacity:1;transform:translateY(0)}}`}
      </style>
    </div>
  );
}

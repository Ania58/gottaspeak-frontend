import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type CheckResult = {
  name: string;
  ok: boolean;
  ms: number;
  info?: string;
};

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

export default function SystemStatus() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      const results: CheckResult[] = [];

      async function time<T>(name: string, fn: () => Promise<T>, pickInfo?: (r: T) => string) {
        const start = performance.now();
        try {
          const out = await fn();
          const ms = Math.round(performance.now() - start);
          const info = pickInfo ? pickInfo(out) : undefined;
          results.push({ name, ok: true, ms, info });
        } catch (e: any) {
          const ms = Math.round(performance.now() - start);
          results.push({ name, ok: false, ms, info: String(e?.message || e) });
        }
      }

      const json = (r: Response) =>
        r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.statusText}`));

      await time(t("status.root"), async () => {
        const r = await fetch(`${API_URL}/`);
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.text();
      });

      await time(
        t("status.config"),
        async () => json(await fetch(`${API_URL}/config/public`)),
        (cfg: any) => {
          const langs = Array.isArray(cfg?.languages) ? cfg.languages.join(", ") : "-";
          return `${t("status.languages")}: ${langs}`;
        }
      );

      await time(
        t("status.materials"),
        async () => json(await fetch(`${API_URL}/materials?limit=1`)),
        (data: any) => `${t("status.items")}: ${Array.isArray(data?.items) ? data.items.length : 0}`
      );

      if (!cancelled) {
        setChecks(results);
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const allOk = checks.length && checks.every((c) => c.ok);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white bg-[radial-gradient(1100px_540px_at_50%_-10%,rgba(132,204,22,0.10),transparent_70%),radial-gradient(900px_520px_at_50%_100%,rgba(6,182,212,0.10),transparent_65%)]" />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("status.title")}
        </h1>
        <p className="mt-2 text-black/70">{t("status.subtitle")}</p>

        <div className="mt-6 rounded-xl border bg-white/80 p-4 shadow-sm">
          {loading && (
            <div className="animate-pulse text-sm text-black/60">{t("status.loading")}</div>
          )}

          {error && (
            <p className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && (
            <ul className="grid gap-3">
              {checks.map((c) => (
                <li
                  key={c.name}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          c.ok ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        title={c.ok ? t("status.ok") : t("status.fail")}
                        aria-label={c.ok ? t("status.ok") : t("status.fail")}
                      />
                      <span className="font-medium">{c.name}</span>
                    </div>
                    {c.info ? (
                      <div className="mt-1 text-xs text-black/60">{c.info}</div>
                    ) : null}
                  </div>
                  <div className="text-sm tabular-nums">{c.ms} ms</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 text-sm text-black/70">
          {checks.length ? (
            <span>
              {t("status.overall")}{" "}
              <span className={allOk ? "text-emerald-600" : "text-red-600"}>
                {allOk ? t("status.allGood") : t("status.issues")}
              </span>
            </span>
          ) : null}
        </div>

        <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
      </div>
    </div>
  );
}

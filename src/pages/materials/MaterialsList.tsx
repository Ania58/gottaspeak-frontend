import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 

type MaterialType = "grammar" | "vocabulary" | "other";
type MaterialKind = "lesson" | "exercise" | "quiz";

interface Material {
  _id: string;
  title: string;
  type: MaterialType;
  kind: MaterialKind;
  slug: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

export default function MaterialsList() {
  const { t } = useTranslation();
  const [data, setData] = useState<Paginated<Material> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    const params = new URLSearchParams({ limit: "20", sortBy: "createdAt", sortDir: "desc" });
    fetch(`${API_URL}/materials?${params.toString()}`, { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(`${r.status} ${r.statusText}${msg ? ` — ${msg}` : ""}`);
        }
        return r.json() as Promise<Paginated<Material>>;
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e.message || e));
      });
    return () => ac.abort();
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">
        {t("nav.materials")}
      </h1>

      {!data && !error && (
        <div className="h-2 w-24 animate-pulse rounded bg-gradient-to-r from-lime-200 via-cyan-200 to-violet-200" />
      )}

      {error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {data && data.items.length === 0 && (
        <p className="text-black/70">{t("materials.empty")}</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <ul className="grid gap-3">
            {data.items.map((m) => (
              <li key={m._id} className="rounded border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      to={`/materials/${m.type}/${m.slug}`}
                      className="text-lg font-medium underline decoration-transparent underline-offset-2 hover:decoration-inherit"
                    >
                      {m.title}
                    </Link>

                    <div className="mt-1 flex items-center gap-2 text-xs text-black/60">
                      <span className="rounded border px-2 py-0.5">{m.type}</span>
                      <span className="rounded border px-2 py-0.5">{m.kind}</span>
                      <span
                        className={
                          "ml-1 inline-block h-2 w-2 rounded-full " +
                          (m.isPublished ? "bg-emerald-500" : "bg-black/30")
                        }
                        title={m.isPublished ? t("materials.state.published") : t("materials.state.draft")}
                        aria-label={m.isPublished ? t("materials.state.published") : t("materials.state.draft")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.tags?.length ? (
                      <div className="hidden md:flex flex-wrap gap-1">
                        {m.tags.slice(0, 6).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-gradient-to-r from-lime-100 to-cyan-100 px-2 py-1 text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <Link
                      to={`/materials/${m.type}/${m.slug}`}
                      className="rounded border px-2 py-1 text-xs hover:bg-black/5"
                    >
                      {t("materials.open")}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-sm text-black/60">
            Page {data.page} / {data.totalPages} • total {data.total}
          </div>
        </>
      )}
    </div>
  );
}


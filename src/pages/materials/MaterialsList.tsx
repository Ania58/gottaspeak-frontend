import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

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
  const [sp, setSp] = useSearchParams();

  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(sp.get("limit") || "20", 10));

  const rawType = (sp.get("type") || "") as string;
  const type: "" | MaterialType =
    rawType === "grammar" || rawType === "vocabulary" || rawType === "other"
      ? (rawType as MaterialType)
      : "";

  const [data, setData] = useState<Paginated<Material> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy: "createdAt",
      sortDir: "desc",
    });
    if (type) params.set("type", type);

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
  }, [page, limit, type]);

  function setPage(next: number) {
    const s = new URLSearchParams(sp);
    s.set("page", String(next));
    if (!s.get("limit")) s.set("limit", String(limit));
    setSp(s, { replace: true });
  }

  function setType(next: "" | MaterialType) {
    const s = new URLSearchParams(sp);
    if (next) s.set("type", next);
    else s.delete("type");
    s.set("page", "1");
    setSp(s, { replace: true });
  }

  const canPrev = page > 1;
  const canNext = !!data && page < data.totalPages;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("nav.materials")}</h1>

        {/* Filtr typu */}
        <div className="flex items-center gap-2 text-sm">
          <label className="text-black/70" htmlFor="typeFilter">
            {t("materials.filters.type")}
          </label>
          <select
            id="typeFilter"
            className="rounded border px-2 py-1"
            value={type || ""}
            onChange={(e) =>
              setType((e.target.value as MaterialType) || "")
            }
          >
            <option value="">{t("materials.filters.allTypes")}</option>
            <option value="grammar">{t("materials.filters.grammar")}</option>
            <option value="vocabulary">{t("materials.filters.vocabulary")}</option>
            <option value="other">{t("materials.filters.other")}</option>
          </select>
        </div>
      </div>

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

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-black/5"
              onClick={() => canPrev && setPage(page - 1)}
              disabled={!canPrev}
            >
              {t("materials.pagination.prev")}
            </button>

            <div className="text-sm text-black/70">
              {t("materials.pagination.pageOf", { page: data.page, total: data.totalPages })} • {t("materials.pagination.total", { count: data.total })}
            </div>

            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-black/5"
              onClick={() => canNext && setPage(page + 1)}
              disabled={!canNext}
            >
              {t("materials.pagination.next")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}




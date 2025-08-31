import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

      {data && (
        <>
          <ul className="grid gap-3">
            {data.items.map((m) => (
              <li key={m._id} className="rounded border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-lg font-medium">{m.title}</div>
                    <div className="mt-1 text-xs text-black/60">
                      {m.type} • {m.kind} {m.isPublished ? "• published" : "• draft"}
                    </div>
                  </div>
                  {m.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
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

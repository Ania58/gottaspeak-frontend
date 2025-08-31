import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type MaterialType = "grammar" | "vocabulary" | "other";
type MaterialKind = "lesson" | "exercise" | "quiz";

interface Section {
  heading: string;
  content: string;
  examples?: string[];
}

interface Material {
  _id: string;
  title: string;
  type: MaterialType;
  kind: MaterialKind;
  slug: string;
  sections: Section[];
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

export default function MaterialDetails() {
  const { t } = useTranslation();
  const { type = "", slug = "" } = useParams();
  const [mat, setMat] = useState<Material | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!type || !slug) return;
    const ac = new AbortController();
    fetch(`${API_URL}/materials/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`, {
      signal: ac.signal,
    })
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(`${r.status} ${r.statusText}${msg ? ` — ${msg}` : ""}`);
        }
        return r.json() as Promise<Material>;
      })
      .then(setMat)
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e.message || e));
      });

    return () => ac.abort();
  }, [type, slug]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/materials" className="text-sm text-black/70 hover:underline">
          « {t("nav.materials")}
        </Link>
      </div>

      {!mat && !error && (
        <div className="grid gap-3">
          <div className="h-7 w-1/2 animate-pulse rounded bg-gradient-to-r from-lime-200 via-cyan-200 to-violet-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-black/10" />
          <div className="h-32 w-full animate-pulse rounded bg-black/5" />
        </div>
      )}

      {error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {mat && (
        <>
          <h1 className="mb-2 text-2xl font-semibold">{mat.title}</h1>

          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-black/60">
            <span className="rounded border px-2 py-0.5">{mat.type}</span>
            <span className="rounded border px-2 py-0.5">{mat.kind}</span>
            {mat.tags?.slice(0, 8).map((tag) => (
              <span
                key={tag}
                className="rounded bg-gradient-to-r from-lime-100 to-cyan-100 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-6">
            {mat.sections?.map((s, i) => (
              <section key={i} className="rounded border bg-white/70 p-4">
                <h2 className="mb-2 text-lg font-semibold">
                  <span className="bg-gradient-to-r from-lime-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                    {s.heading}
                  </span>
                </h2>
                <p className="whitespace-pre-wrap leading-relaxed">{s.content}</p>

                {s.examples && s.examples.length > 0 && (
                  <ul className="mt-3 list-disc pl-6 text-sm">
                    {s.examples.map((ex, j) => (
                      <li key={j}>{ex}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

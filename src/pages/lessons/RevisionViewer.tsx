import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

type RevRes = { meta?: Record<string, any>; steps?: string[] };
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RevisionViewer() {
  const { t } = useTranslation();
  const { level = "A2", unit = "1" } = useParams();
  const [data, setData] = useState<RevRes | null>(null);
  const [error, setError] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(false);
    setStep(0);

    (async () => {
      try {
        const res = await fetch(`${API}/courses/${level}/units/${unit}/revision`);
        if (!res.ok) { if (!cancelled) setError(true); return; }
        const json: RevRes = await res.json();
        if (!json || !Array.isArray(json.steps)) { if (!cancelled) setError(true); return; }
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => { cancelled = true; };
  }, [level, unit]);

  if (error) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
          {t("revisionViewer.notFoundTitle")}
        </h1>
        <p className="text-base md:text-lg text-slate-600 mb-6">
          {t("revisionViewer.notFoundDesc")}
        </p>
        <Link to={`/courses/${level}/units/${unit}`} className="inline-flex cursor-pointer items-center h-12 px-5 rounded-lg bg-slate-200 font-semibold">
          ← {t("revisionViewer.backToUnit")}
        </Link>
      </div>
    );
  }

  if (!data) return <div className="px-6 py-12">{t("revisionViewer.loading")}</div>;

  const total = data.steps!.length;
  const go = (n: number) => n >= 0 && n < total && setStep(n);

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-2">
        {data.meta?.title ?? t("revisionViewer.fallbackTitle", { unit })}
      </h1>

      <p className="text-sm md:text-base text-slate-600 mb-8">
        {t("revisionViewer.breadcrumb", { level, unit, step: step + 1, total })}
      </p>

      <article className="prose prose-slate prose-lg md:prose-xl max-w-none">
        <ReactMarkdown>{data.steps![step]}</ReactMarkdown>
      </article>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className="cursor-pointer inline-flex items-center justify-center h-12 px-6 rounded-lg bg-slate-200 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← {t("lessonViewer.prev")}
        </button>
        <button
          onClick={() => go(step + 1)}
          disabled={step === total - 1}
          className="cursor-pointer inline-flex items-center justify-center h-12 px-7 rounded-lg bg-slate-900 text-white font-semibold shadow-sm hover:translate-y-[-1px] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("lessonViewer.next")} →
        </button>
      </div>
    </div>
  );
}


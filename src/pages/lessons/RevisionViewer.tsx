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
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">{t("revisionViewer.notFoundTitle")}</h1>
        <p className="text-sm text-gray-600 mb-4">{t("revisionViewer.notFoundDesc")}</p>
        <Link to={`/courses/${level}/units/${unit}`} className="underline text-blue-600">
          ← {t("revisionViewer.backToUnit")}
        </Link>
      </div>
    );
  }

  if (!data) return <div className="p-6">{t("revisionViewer.loading")}</div>;

  const total = data.steps!.length;
  const go = (n: number) => n >= 0 && n < total && setStep(n);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">
        {data.meta?.title ?? t("revisionViewer.fallbackTitle", { unit })}
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        {t("revisionViewer.breadcrumb", { level, unit, step: step + 1, total })}
      </p>

      <article className="prose max-w-none">
        <ReactMarkdown>{data.steps![step]}</ReactMarkdown>
      </article>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          ← {t("lessonViewer.prev")}
        </button>
        <button
          onClick={() => go(step + 1)}
          disabled={step === total - 1}
          className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
        >
          {t("lessonViewer.next")} →
        </button>
      </div>
    </div>
  );
}

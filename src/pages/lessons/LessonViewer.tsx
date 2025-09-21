import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

type LessonRes = { meta?: Record<string, any>; steps?: string[] };
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LessonViewer() {
  const { t } = useTranslation();
  const { level = "A2", unit = "1", lesson = "1" } = useParams();
  const [data, setData] = useState<LessonRes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    setStep(0);

    (async () => {
      try {
        if (!/^\d+$/.test(String(lesson))) {
          if (!cancelled) setError("not-found");
          return;
        }

        const res = await fetch(
          `${API}/courses/${level}/units/${unit}/lessons/${lesson}`
        );

        if (!res.ok) {
          if (!cancelled) setError(`http-${res.status}`);
          return;
        }

        const json: LessonRes = await res.json();
        if (!json || !Array.isArray(json.steps)) {
          if (!cancelled) setError("bad-format");
          return;
        }

        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("network");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [level, unit, lesson]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">
          {t("lessonViewer.notFoundTitle")}
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          {t("lessonViewer.notFoundDesc")}
        </p>
        <Link
          to={`/courses/${level}/units/${unit}`}
          className="underline text-blue-600"
        >
          ← {t("lessonViewer.backToUnit")}
        </Link>
      </div>
    );
  }

  if (!data) return <div className="p-6">{t("lessonViewer.loading")}</div>;

  const total = data.steps!.length;
  const go = (n: number) => n >= 0 && n < total && setStep(n);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">
        {data.meta?.title ?? t("lessonViewer.fallbackTitle", { lesson })}
      </h1>

      <p className="text-sm text-gray-600 mb-4">
        {t("lessonViewer.breadcrumb", {
          level,
          unit,
          lesson,
          step: step + 1,
          total,
        })}
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



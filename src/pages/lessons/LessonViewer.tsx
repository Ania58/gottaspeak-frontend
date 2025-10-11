import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

type LessonRes = { meta?: Record<string, any>; steps?: string[] };
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const COURSES_ROOT = "/courses";
const unitPath = (level: string, unit: string) => `${COURSES_ROOT}/${level}/units/${unit}`;

export default function LessonViewer() {
  const { t } = useTranslation();
  const { level = "A2", unit = "1", lesson = "1" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState<LessonRes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `lesson:${level}:${unit}:${lesson}:step`;
  const stepFromUrl = Math.max(0, (parseInt(searchParams.get("step") || "", 10) || 1) - 1);
  const stepFromStorage = Math.max(0, parseInt(sessionStorage.getItem(storageKey) || "1", 10) - 1);
  const [step, setStep] = useState<number>(stepFromUrl || stepFromStorage || 0);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    (async () => {
      try {
        if (!/^\d+$/.test(String(lesson))) {
          if (!cancelled) setError("not-found");
          return;
        }
        const res = await fetch(`${API}/courses/${level}/units/${unit}/lessons/${lesson}`);
        if (!res.ok) { if (!cancelled) setError(`http-${res.status}`); return; }
        const json: LessonRes = await res.json();
        if (!json || !Array.isArray(json.steps)) { if (!cancelled) setError("bad-format"); return; }
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("network");
      }
    })();

    return () => { cancelled = true; };
  }, [level, unit, lesson]);

  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step") || "", 10);
    const next = String(step + 1);
    if (String(urlStep) !== next) {
      setSearchParams(prev => { prev.set("step", next); return prev; }, { replace: true });
    }
    sessionStorage.setItem(storageKey, next);
  }, [step, storageKey, searchParams, setSearchParams]);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") navigate(unitPath(level, unit));
  }, [navigate, level, unit]);
  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  if (error) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <Breadcrumb level={level} unit={unit} />
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
          {t("lessonViewer.notFoundTitle")}
        </h1>
        <p className="text-base md:text-lg text-slate-600 mb-6">
          {t("lessonViewer.notFoundDesc")}
        </p>
        <Link
          to={unitPath(level, unit)}
          className="inline-flex cursor-pointer items-center h-12 px-5 rounded-lg bg-slate-200 font-semibold"
        >
          ← {t("lessonViewer.backToUnit")}
        </Link>
      </div>
    );
  }

  if (!data) return <div className="px-6 py-12">{t("lessonViewer.loading")}</div>;

  const total = data.steps!.length;
  const go = (n: number) => n >= 0 && n < total && setStep(n);
  const atLastStep = step === total - 1;

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <Breadcrumb level={level} unit={unit} />

      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-2">
        {data.meta?.title ?? t("lessonViewer.fallbackTitle", { lesson })}
      </h1>

      <p className="text-sm md:text-base text-slate-600 mb-8">
        {t("lessonViewer.breadcrumb", { level, unit, lesson, step: step + 1, total })}
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

        {atLastStep ? (
          <button
            onClick={() => navigate(unitPath(level, unit))}
            className="cursor-pointer inline-flex items-center justify-center h-12 px-7 rounded-lg bg-emerald-600 text-white font-semibold shadow-sm hover:translate-y-[-1px] transition"
            aria-label={t("lessonViewer.finishAndBackToUnit")}
          >
            ✓ {t("lessonViewer.finishAndBackToUnit")}
          </button>
        ) : (
          <button
            onClick={() => go(step + 1)}
            className="cursor-pointer inline-flex items-center justify-center h-12 px-7 rounded-lg bg-slate-900 text-white font-semibold shadow-sm hover:translate-y-[-1px] transition"
            aria-label={t("lessonViewer.next")}
          >
            {t("lessonViewer.next")} →
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-6 text-sm md:text-base">
        <Link to={unitPath(level, unit)} className="cursor-pointer underline">
          ← {t("lessonViewer.backToUnit")}
        </Link>
        <Link to={COURSES_ROOT} className="cursor-pointer underline">
          {t("lessonViewer.backToCourses")}
        </Link>
      </div>
    </div>
  );
}

function Breadcrumb({ level, unit }: { level: string; unit: string }) {
  const { t } = useTranslation();
  return (
    <nav className="mb-6 flex items-center gap-3 text-sm text-slate-600" aria-label="breadcrumb">
      <Link to="/courses" className="cursor-pointer underline">
        ← {t("lessonViewer.breadcrumbCourses")}
      </Link>
      <span>/</span>
      <Link to={unitPath(level, unit)} className="cursor-pointer underline">
        {t("lessonViewer.breadcrumbUnit", { unit })}
      </Link>
    </nav>
  );
}



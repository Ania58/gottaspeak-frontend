import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

type LessonRes = { meta: Record<string, any>; steps: string[] };
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LessonViewer() {
  const { level = "A2", unit = "1", lesson = "1" } = useParams();
  const [data, setData] = useState<LessonRes | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setData(null);
    setStep(0);
    fetch(`${API}/courses/${level}/units/${unit}/lessons/${lesson}`)
      .then(r => r.json())
      .then(setData);
  }, [level, unit, lesson]);

  if (!data) return <div className="p-6">Loading…</div>;

  const total = data.steps.length;
  const go = (n: number) => n >= 0 && n < total && setStep(n);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{data.meta?.title ?? `Lesson ${lesson}`}</h1>
      <p className="text-sm text-gray-600 mb-4">
        Course {level} · Unit {unit} · Lesson {lesson} · Step {step + 1}/{total}
      </p>

      <article className="prose max-w-none">
        <ReactMarkdown>{data.steps[step]}</ReactMarkdown>
      </article>

      <div className="mt-6 flex gap-3">
        <button onClick={() => go(step - 1)} disabled={step === 0} className="px-4 py-2 rounded bg-gray-200">← Prev</button>
        <button onClick={() => go(step + 1)} disabled={step === total - 1} className="px-4 py-2 rounded bg-gray-800 text-white">Next →</button>
      </div>
    </div>
  );
}

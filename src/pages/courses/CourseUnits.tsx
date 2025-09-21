import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CourseUnits() {
  const { t } = useTranslation();
  const { level = "A2" } = useParams();
  const [units, setUnits] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    let cancelled = false;
    (async () => {
        setLoading(true);
        try {
        const res = await fetch(`${API}/courses/${level}`);
        const list = (await res.json()) as string[];
        if (!cancelled) setUnits((list || []).map(n => Number(n)));
        } catch {
        if (!cancelled) setUnits([]);
        } finally {
        if (!cancelled) setLoading(false);
        }
    })();
    return () => { cancelled = true; };
}, [level]);


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("courseUnits.title", { level })}
      </h1>

      {loading ? (
        <p>{t("courseUnits.loading")}</p>
      ) : units.length === 0 ? (
        <p className="text-gray-600">{t("courseUnits.empty")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {units.map((u) => (
            <Link
              key={u}
              to={`/courses/${level}/units/${u}`}
              className="block rounded-xl border p-5 hover:shadow"
            >
              <h2 className="text-xl font-semibold">
                {t("courseUnits.unitTitle", { unit: u.toString().padStart(2, "0") })}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t("courseUnits.openLessons")} →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


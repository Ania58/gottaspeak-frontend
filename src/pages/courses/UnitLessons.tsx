import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function UnitLessons() {
  const { t } = useTranslation();
  const { level = "A2", unit = "1" } = useParams();
  const [lessons, setLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRevision, setHasRevision] = useState(false); 

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/courses/${level}/units/${unit}`)
      .then(r => r.json())
      .then((data) => setLessons(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));

    fetch(`${API}/courses/${level}/units/${unit}/revision`)
      .then(r => setHasRevision(r.ok))
      .catch(() => setHasRevision(false));
  }, [level, unit]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("unitLessons.title", { level, unit })}
      </h1>

      {loading ? (
        <p>{t("unitLessons.loading")}</p>
      ) : lessons.length === 0 ? (
        <p className="text-gray-600">{t("unitLessons.empty")}</p>
      ) : (
        <>
          <ul className="grid gap-3 md:grid-cols-2">
            {lessons.map(n => (
              <li key={n} className="rounded-xl border p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {t("unitLessons.lessonTitle", { lesson: n.toString().padStart(2, "0") })}
                  </div>
                  <div className="text-xs text-gray-500">{t("unitLessons.clickToOpen")}</div>
                </div>
                <Link
                  to={`/lessons/${level}/${unit}/${n}`}
                  className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-black"
                >
                  {t("unitLessons.open")}
                </Link>
              </li>
            ))}
            {hasRevision && (
              <li className="rounded-xl border p-4 flex items-center justify-between bg-yellow-50">
                <div>
                  <div className="font-semibold">
                    {t("unitLessons.revisionTitle", { unit: unit.toString().padStart(2, "0") })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("unitLessons.revisionHint")}
                  </div>
                </div>
                <Link
                  to={`/courses/${level}/units/${unit}/revision`}
                  className="px-3 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  {t("unitLessons.openRevision")}
                </Link>
              </li>
            )}
          </ul>

          <div className="mt-6">
            <Link to={`/courses/${level}`} className="text-sm underline">
              ← {t("unitLessons.backToUnits")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

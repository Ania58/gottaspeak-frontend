import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

export default function CoursesList() {
  const { t } = useTranslation();

  const courses = LEVELS.map((level) => {
    const title = t("courses.levelTitle", { level, defaultValue: `${level} Course` });

    const desc = t(`courses.levelDesc.${level}`, { defaultValue: "" });

    return { level, title, desc };
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("courses.pageTitle", { defaultValue: "Courses" })}
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <Link
            key={c.level}
            to={`/courses/${c.level}`}
            className="block rounded-xl border p-5 hover:shadow"
          >
            <h2 className="text-xl font-semibold">{c.title}</h2>

            {c.desc ? (
              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                {t("courses.levelDesc.comingSoon", { defaultValue: "Coming soon." })}
              </p>
            )}

            <p className="mt-3 text-sm underline">
              {t("courses.openCourse", { defaultValue: "Open course" })} →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}



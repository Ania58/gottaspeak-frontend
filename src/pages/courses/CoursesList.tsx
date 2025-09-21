import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CoursesList() {
  const { t } = useTranslation();

  const courses = [
    {
      level: "A2",
      title: t("courses.levelTitle", { level: "A2" }),
      desc: t("courses.levelDesc.A2"),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("courses.pageTitle")}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <Link
            key={c.level}
            to={`/courses/${c.level}`}
            className="block rounded-xl border p-5 hover:shadow"
          >
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
            <p className="mt-3 text-sm underline">
              {t("courses.openCourse")} →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}


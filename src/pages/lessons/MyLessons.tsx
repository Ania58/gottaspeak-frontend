import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const API =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

type SessionItem = {
  id: string;
  room: string;
  courseLevel: string;
  unit: number;
  lesson: number;
  expiresAt: string | null;
};

type JoinResp = {
  url: string;
  session: SessionItem;
  me: {
    role: "teacher" | "student";
    displayName: string;
    userId: string | null;
  };
};

export default function MyLessons() {
  const { t } = useTranslation();

  const [userId, setUserId] = useState(() => localStorage.getItem("gs:userId") || "");
  const [displayName, setDisplayName] = useState(() => localStorage.getItem("gs:displayName") || "");
  const [role, setRole] = useState<"teacher" | "student">(
    (localStorage.getItem("gs:role") as "teacher" | "student") || "student"
  );

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SessionItem[]>([]);
  const [error, setError] = useState<string>("");

  const ready = useMemo(() => Boolean(userId && displayName), [userId, displayName]);

  useEffect(() => {
    let cancelled = false;
    if (!ready) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/sessions?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            setError(data?.error || `${res.status} ${res.statusText}`);
            setItems([]);
          }
          return;
        }
        const data: SessionItem[] = await res.json();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, userId]);

  function handleSaveIdentity(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !displayName) return;
    localStorage.setItem("gs:userId", userId);
    localStorage.setItem("gs:displayName", displayName);
    localStorage.setItem("gs:role", role);
    setItems([]);
  }

  async function handleJoin(id: string) {
    try {
      const res = await fetch(`${API}/sessions/${encodeURIComponent(id)}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, displayName, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || `${res.status} ${res.statusText}`);
        return;
      }
      const data: JoinResp = await res.json();
      window.location.href = data.url; 
    } catch (e: any) {
      alert(String(e?.message || e));
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold mb-2">{t("myLessons.title")}</h1>
      <p className="text-black/70 mb-6">{t("myLessons.subtitle")}</p>

      {!ready && (
        <form onSubmit={handleSaveIdentity} className="mb-8 rounded-xl border bg-white/80 p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">{t("myLessons.identity.title")}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col">
              <label htmlFor="uid" className="text-sm text-black/70">
                {t("myLessons.identity.userId")}
              </label>
              <input
                id="uid"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={t("myLessons.identity.userIdPh") as string}
                className="rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm text-black/70">
                {t("myLessons.identity.displayName")}
              </label>
              <input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("myLessons.identity.displayNamePh") as string}
                className="rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="role" className="text-sm text-black/70">
                {t("myLessons.identity.role")}
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "teacher" | "student")}
                className="rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <option value="student">{t("myLessons.identity.roles.student")}</option>
                <option value="teacher">{t("myLessons.identity.roles.teacher")}</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-md border px-4 py-2 text-sm text-white shadow-sm bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500"
          >
            {t("myLessons.identity.save")}
          </button>
          <p className="mt-2 text-xs text-black/60">{t("myLessons.identity.note")}</p>
        </form>
      )}

      {ready && (
        <>
          {loading ? (
            <p>{t("myLessons.loading")}</p>
          ) : error ? (
            <p className="text-red-700">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-black/60">{t("myLessons.empty")}</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((s) => (
                <li key={s.id} className="rounded-xl border p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {t("myLessons.itemTitle", {
                        level: s.courseLevel,
                        unit: String(s.unit).padStart(2, "0"),
                        lesson: String(s.lesson).padStart(2, "0"),
                      })}
                    </div>
                    {s.expiresAt && (
                      <div className="text-xs text-black/60">
                        {t("myLessons.expires", { date: new Date(s.expiresAt).toLocaleString() })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleJoin(s.id)}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-black"
                  >
                    {t("myLessons.join")}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            <button
              onClick={() => {
                setLoading(true);
                localStorage.removeItem("gs:userId");
                localStorage.removeItem("gs:displayName");
                localStorage.removeItem("gs:role");
                setUserId("");
                setDisplayName("");
                setRole("student");
                setItems([]);
                setLoading(false);
              }}
              className="text-sm underline"
            >
              {t("myLessons.changeIdentity")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

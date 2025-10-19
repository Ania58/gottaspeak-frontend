import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

type JoinRes = {
  url: string;
  session: {
    id: string;
    room: string;
    courseLevel: string;
    unit: number;
    lesson: number;
    expiresAt: string | null;
  };
  me: {
    role: "teacher" | "student";
    displayName: string;
    userId: string | null;
  };
};

export default function LiveJoin() {
  const { t } = useTranslation();
  const { sessionId = "" } = useParams();
  const [qs] = useSearchParams();
  const token = qs.get("t") || "";

  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setErr(t("liveJoin.errors.missingToken"));
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${API}/sessions/${encodeURIComponent(sessionId)}/join?t=${encodeURIComponent(token)}`
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErr(data?.error || `${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }
        const data: JoinRes = await res.json();

        if (!cancelled) {
          window.location.href = data.url; 
        }
      } catch (e: any) {
        if (!cancelled) {
          setErr(String(e?.message || e));
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, token, t]);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold mb-3">{t("liveJoin.title")}</h1>
      {loading && <p className="text-gray-700">{t("liveJoin.waiting")}</p>}
      {!loading && err && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3">
          <p className="text-red-700 font-medium mb-1">{t("liveJoin.errorTitle")}</p>
          <p className="text-red-700 text-sm">{err || t("liveJoin.errors.generic")}</p>
          <div className="mt-3">
            <Link to="/" className="underline text-sm">
              ← {t("liveJoin.backHome")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

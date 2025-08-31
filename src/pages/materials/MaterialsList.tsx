import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

type MaterialType = "grammar" | "vocabulary" | "other";
type MaterialKind = "lesson" | "exercise" | "quiz";

interface Material {
  _id: string;
  title: string;
  type: MaterialType;
  kind: MaterialKind;
  slug: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:4000";

export default function MaterialsList() {
  const { t } = useTranslation();
  const [sp, setSp] = useSearchParams();

  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  const rawLimit = parseInt(sp.get("limit") || "20", 10);
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20;

  const rawType = (sp.get("type") || "") as string;
  const type: "" | MaterialType =
    rawType === "grammar" || rawType === "vocabulary" || rawType === "other"
      ? (rawType as MaterialType)
      : "";

  const sortBy = ((): "createdAt" | "updatedAt" | "order" | "title" => {
    const v = sp.get("sortBy") || "createdAt";
    return (["createdAt", "updatedAt", "order", "title"] as const).includes(v as any)
      ? (v as any)
      : "createdAt";
  })();

  const sortDir = sp.get("sortDir") === "asc" ? "asc" : "desc";

  const search = sp.get("search") || "";
  const [q, setQ] = useState(search);
  useEffect(() => setQ(search), [search]);

  const selectedTags = (sp.get("tags") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const tagsMode: "any" | "all" = sp.get("tagsMode") === "all" ? "all" : "any";

  const [data, setData] = useState<Paginated<Material> | null>(null);
  const [error, setError] = useState("");
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    const url = params.toString()
      ? `${API_URL}/materials/tags?${params.toString()}`
      : `${API_URL}/materials/tags`;
    fetch(url, { signal: ac.signal })
      .then((r) => r.json() as Promise<{ tags: string[] }>)
      .then(({ tags }) => setTagsOptions(tags || []))
      .catch(() => {});
    return () => ac.abort();
  }, [type]);

  useEffect(() => {
    const ac = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortDir,
    });
    if (type) params.set("type", type);
    if (search) params.set("search", search);
    if (selectedTags.length) params.set("tags", selectedTags.join(","));
    if (selectedTags.length) params.set("tagsMode", tagsMode);
    fetch(`${API_URL}/materials?${params.toString()}`, { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          throw new Error(`${r.status} ${r.statusText}${msg ? ` — ${msg}` : ""}`);
        }
        return r.json() as Promise<Paginated<Material>>;
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e.message || e));
      });
    return () => ac.abort();
  }, [page, limit, type, sortBy, sortDir, search, selectedTags.join(","), tagsMode]);

  function setPage(next: number) {
    const s = new URLSearchParams(sp);
    s.set("page", String(next));
    setSp(s, { replace: true });
  }
  function setType(next: "" | MaterialType) {
    const s = new URLSearchParams(sp);
    if (next) s.set("type", next);
    else s.delete("type");
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function setLimit(next: number) {
    const s = new URLSearchParams(sp);
    s.set("limit", String(next));
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function setSortBy(next: "createdAt" | "updatedAt" | "order" | "title") {
    const s = new URLSearchParams(sp);
    s.set("sortBy", next);
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function setSortDir(next: "asc" | "desc") {
    const s = new URLSearchParams(sp);
    s.set("sortDir", next);
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function submitSearch() {
    const s = new URLSearchParams(sp);
    if (q.trim()) s.set("search", q.trim());
    else s.delete("search");
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function toggleTag(tag: string) {
    const s = new URLSearchParams(sp);
    const cur = (s.get("tags") || "").split(",").map((x) => x.trim()).filter(Boolean);
    const has = cur.includes(tag);
    const next = has ? cur.filter((t) => t !== tag) : [...cur, tag];
    if (next.length) s.set("tags", next.join(","));
    else s.delete("tags");
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function clearTags() {
    const s = new URLSearchParams(sp);
    s.delete("tags");
    s.set("page", "1");
    setSp(s, { replace: true });
  }
  function setTagsMode(next: "any" | "all") {
    const s = new URLSearchParams(sp);
    s.set("tagsMode", next);
    s.set("page", "1");
    setSp(s, { replace: true });
  }

  const canPrev = page > 1;
  const canNext = !!data && page < data.totalPages;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="rounded-xl border bg-gradient-to-b from-lime-50/60 via-cyan-50/50 to-violet-50/60 p-4 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("nav.materials")}</h1>
            <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400" />
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((v) => !v)}
            className="sm:hidden cursor-pointer rounded-md border px-3 py-2 text-sm shadow-sm transition hover:bg-black/5 active:scale-[0.98]"
          >
            {filtersOpen ? t("materials.filters.hide") : t("materials.filters.toggle")}
          </button>
        </div>

        <div className={(filtersOpen ? "block " : "hidden ") + "sm:block origin-top animate-[fadeSlide_.18s_ease-out]"}>
          <div className="flex flex-col gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              className="flex w-full items-center gap-2 sm:max-w-md"
            >
              <label htmlFor="searchBox" className="sr-only">
                {t("materials.filters.search")}
              </label>
              <input
                id="searchBox"
                className="w-full rounded-md border px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                placeholder={t("materials.filters.searchPlaceholder")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="cursor-pointer rounded-md border px-3 py-2 text-sm transition hover:shadow-sm hover:bg-black/5 active:scale-[0.98]">
                {t("materials.filters.searchBtn")}
              </button>
            </form>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="text-black/70" htmlFor="typeFilter">
                {t("materials.filters.type")}
              </label>
              <select
                id="typeFilter"
                className="w-full rounded-md border px-3 py-2 sm:w-64"
                value={type || ""}
                onChange={(e) => setType((e.target.value as MaterialType) || "")}
              >
                <option value="">{t("materials.filters.allTypes")}</option>
                <option value="grammar">{t("materials.filters.grammar")}</option>
                <option value="vocabulary">{t("materials.filters.vocabulary")}</option>
                <option value="other">{t("materials.filters.other")}</option>
              </select>
            </div>

            {tagsOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-black/70">{t("materials.filters.tags")}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {tagsOptions.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={
                          "cursor-pointer rounded-full border px-3 py-1 text-xs transition " +
                          (active
                            ? "bg-gradient-to-r from-lime-200 via-cyan-200 to-violet-200 shadow-sm"
                            : "hover:bg-black/5")
                        }
                      >
                        {tag}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={clearTags}
                    className="ml-1 cursor-pointer rounded-md border px-3 py-1.5 text-sm transition hover:bg-black/5 active:scale-[0.98]"
                  >
                    {t("materials.filters.clear")}
                  </button>
                </div>
                <div className="flex items-center gap-2 sm:self-end">
                  <label htmlFor="tagsModeSel" className="text-black/70">
                    {t("materials.filters.tagsMode")}
                  </label>
                  <select
                    id="tagsModeSel"
                    className="rounded-md border px-3 py-1.5 sm:w-44"
                    value={tagsMode}
                    onChange={(e) => setTagsMode(e.target.value === "all" ? "all" : "any")}
                  >
                    <option value="any">{t("materials.filters.any")}</option>
                    <option value="all">{t("materials.filters.all")}</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <label className="text-black/70" htmlFor="sortBy">
                  {t("materials.sort.by")}
                </label>
                <select
                  id="sortBy"
                  className="w-full rounded-md border px-3 py-2 sm:w-56"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "createdAt" | "updatedAt" | "order" | "title")}
                >
                  <option value="createdAt">{t("materials.sort.createdAt")}</option>
                  <option value="updatedAt">{t("materials.sort.updatedAt")}</option>
                  <option value="order">{t("materials.sort.order")}</option>
                  <option value="title">{t("materials.sort.title")}</option>
                </select>
              </div>

              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <label className="text-black/70" htmlFor="sortDir">
                  {t("materials.sort.direction")}
                </label>
                <select
                  id="sortDir"
                  className="w-full rounded-md border px-3 py-2 sm:w-44"
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value === "asc" ? "asc" : "desc")}
                >
                  <option value="desc">{t("materials.sort.desc")}</option>
                  <option value="asc">{t("materials.sort.asc")}</option>
                </select>
              </div>

              <div className="flex min-w-0 flex-col gap-1 sm:ml-auto sm:flex-row sm:items-center sm:gap-2">
                <label className="text-black/70" htmlFor="limitSel">
                  {t("materials.filters.limit")}
                </label>
                <select
                  id="limitSel"
                  className="w-full rounded-md border px-3 py-2 sm:w-24"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {!data && !error && (
          <div className="mt-4 h-2 w-24 animate-pulse rounded bg-gradient-to-r from-lime-200 via-cyan-200 to-violet-200" />
        )}

        {error && (
          <p className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        {data && data.items.length === 0 && (
          <p className="mt-4 text-black/70">{t("materials.empty")}</p>
        )}

        {data && data.items.length > 0 && (
          <div className="mt-4 grid gap-3">
            {data.items.map((m) => (
              <div
                key={m._id}
                className="group rounded-xl border bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link
                      to={`/materials/${m.type}/${m.slug}`}
                      className="text-lg font-medium transition hover:opacity-90"
                    >
                      {m.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/60">
                      <span className="rounded border px-2 py-0.5">{m.type}</span>
                      <span className="rounded border px-2 py-0.5">{m.kind}</span>
                      <span
                        className={
                          "ml-1 inline-block h-2 w-2 rounded-full " +
                          (m.isPublished ? "bg-emerald-500" : "bg-black/30")
                        }
                        title={m.isPublished ? t("materials.state.published") : t("materials.state.draft")}
                        aria-label={m.isPublished ? t("materials.state.published") : t("materials.state.draft")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    {m.tags?.length ? (
                      <div className="hidden flex-wrap gap-1 sm:flex">
                        {m.tags.slice(0, 6).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-gradient-to-r from-lime-100 to-cyan-100 px-2 py-1 text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link
                      to={`/materials/${m.type}/${m.slug}`}
                      className="cursor-pointer rounded-md border px-3 py-2 text-xs transition hover:shadow-sm hover:bg-black/5 active:scale-[0.98]"
                    >
                      {t("materials.open")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:opacity-50 transition hover:shadow-sm hover:bg-black/5 active:scale-[0.98]"
              onClick={() => canPrev && setPage(page - 1)}
              disabled={!canPrev}
            >
              {t("materials.pagination.prev")}
            </button>
            <div className="text-sm text-black/70">
              {t("materials.pagination.pageOf", { page: data.page, total: data.totalPages })} •{" "}
              {t("materials.pagination.total", { count: data.total })}
            </div>
            <button
              className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:opacity-50 transition hover:shadow-sm hover:bg-black/5 active:scale-[0.98]"
              onClick={() => canNext && setPage(page + 1)}
              disabled={!canNext}
            >
              {t("materials.pagination.next")}
            </button>
          </div>
        )}
      </div>

      <style>
        {`@keyframes fadeSlide{0%{opacity:0;transform:translateY(-4px)}100%{opacity:1;transform:translateY(0)}}`}
      </style>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
};

type NewsFeed = {
  updatedAt: string | null;
  items: NewsItem[];
};

const EMPTY_FEED: NewsFeed = { updatedAt: null, items: [] };

function safeItems(value: unknown): NewsItem[] {
  if (!value || typeof value !== "object" || !("items" in value) || !Array.isArray(value.items)) return [];
  const seen = new Set<string>();
  return value.items.filter((item): item is NewsItem => {
    if (!item || typeof item !== "object" || typeof item.title !== "string" ||
      typeof item.url !== "string" || typeof item.source !== "string" ||
      typeof item.publishedAt !== "string") return false;
    try {
      const url = new URL(item.url);
      if (url.protocol !== "https:" || seen.has(url.href) || !Number.isFinite(Date.parse(item.publishedAt))) return false;
      seen.add(url.href);
      return true;
    } catch { return false; }
  }).slice(0, 50);
}

function readableDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export default function AiNewsSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [feed, setFeed] = useState<NewsFeed>(EMPTY_FEED);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    // GitHub Pages uses a project subpath; local builds and custom domains use the root.
    const prefix = window.location.pathname.startsWith("/VibeCoder_resourceCenter")
      ? "/VibeCoder_resourceCenter" : "";
    setLoading(true);
    setError(false);
    fetch(`${prefix}/ai-news.json?v=${Date.now()}`, { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("News is temporarily unavailable");
        return response.json();
      })
      .then((json: NewsFeed) => {
        setFeed({ updatedAt: typeof json?.updatedAt === "string" ? json.updatedAt : null, items: safeItems(json) });
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [open, refresh]);

  const pastWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklyItems = feed.items.filter((item) => Date.parse(item.publishedAt) >= pastWeek);
  const visibleItems = showAll ? feed.items : weeklyItems;

  return (
    <aside id="ai-news-sidebar" className={`ai-news-sidebar ${open ? "open" : ""}`} aria-label="AI news feed" aria-hidden={!open}>
      <div className="ai-news-heading">
        <div className="ai-news-overline"><span className="signal-dot" /> Daily refreshed · 50 max</div>
        <div className="ai-news-title-row">
          <div><p className="eyebrow plain">The creative intelligence briefing</p><h2>AI News<span>.</span></h2></div>
          <button className="ai-news-close" onClick={onClose} aria-label="Collapse AI news sidebar" tabIndex={open ? 0 : -1}>×</button>
        </div>
        <p>Industry updates, new models, creative AI and the tools shaping digital work.</p>
        <div className="ai-news-status">
          <span>{feed.updatedAt ? `Updated ${readableDate(feed.updatedAt)}` : "Waiting for first daily digest"}</span>
          <button onClick={() => setRefresh((value) => value + 1)} aria-label="Reload AI news" tabIndex={open ? 0 : -1} disabled={loading}>↻ Refresh</button>
        </div>
        <div className="ai-news-tabs" role="group" aria-label="News timeframe">
          <button className={!showAll ? "selected" : ""} aria-pressed={!showAll} onClick={() => setShowAll(false)} tabIndex={open ? 0 : -1}>This week <span>{weeklyItems.length}</span></button>
          <button className={showAll ? "selected" : ""} aria-pressed={showAll} onClick={() => setShowAll(true)} tabIndex={open ? 0 : -1}>Latest 50 <span>{feed.items.length}</span></button>
        </div>
      </div>
      <div className="ai-news-stream" aria-live="polite">
        {loading && feed.items.length === 0 && <div className="ai-news-empty">Loading the latest AI headlines…</div>}
        {error && feed.items.length === 0 && <div className="ai-news-empty">News is temporarily unavailable. You can try refreshing.</div>}
        {!loading && !error && feed.items.length === 0 && <div className="ai-news-empty">The daily briefing will populate after its first scheduled update.</div>}
        {feed.items.length > 0 && visibleItems.length === 0 && <div className="ai-news-empty">No headlines published in the past week. See the latest 50 instead.</div>}
        {visibleItems.map((item) => {
          const domain = new URL(item.url).hostname;
          return (
            <a className="ai-news-item" key={item.id || item.url} href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
              <div className="ai-news-source">
                <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`} alt="" loading="lazy" decoding="async" />
                <span>{item.source}</span><time dateTime={item.publishedAt}>{readableDate(item.publishedAt)}</time>
              </div>
              <h3>{item.title}</h3>
              <span className="ai-news-read">Read article ↗</span>
            </a>
          );
        })}
      </div>
      <div className="ai-news-bottom">Curated automatically from publishers' RSS feeds. Headlines link to original reporting.</div>
    </aside>
  );
}

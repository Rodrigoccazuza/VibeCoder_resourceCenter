"use client";

import { useMemo, useState } from "react";
import { resources, type Resource } from "./resources";

const KNOWN_LINKS: Record<string, string> = {
  "Adobe Background Remover": "https://www.adobe.com/express/feature/image/remove-background",
  "Aiverse Design": "https://www.aiverse.design/",
  ChatGPT: "https://chatgpt.com/",
  "Claude Code": "https://www.anthropic.com/claude-code",
  "Codex by GPT": "https://openai.com/codex/",
  "Google ImageFX": "https://labs.google/fx/tools/image-fx",
  "Hailuo AI": "https://hailuoai.video/",
  "Kive AI": "https://www.kive.ai/",
  "Kling AI": "https://klingai.com/",
  "Let's Enhance": "https://letsenhance.io/",
  MagicPath: "https://www.magicpath.ai/",
  "Magnific AI": "https://magnific.ai/",
  "Manus AI": "https://manus.im/",
  Midjourney: "https://www.midjourney.com/",
  "Nano Banana": "https://gemini.google.com/",
  PicWish: "https://picwish.com/",
  PixCut: "https://pixcut.wondershare.com/",
  Runway: "https://runwayml.com/",
  "The Shape of AI": "https://www.shapeof.ai/",
  "Visual Electric": "https://visualelectric.com/",
  Canva: "https://www.canva.com/",
  Coolors: "https://coolors.co/",
  Freepik: "https://www.freepik.com/",
  Upwork: "https://www.upwork.com/",
  Figma: "https://www.figma.com/",
  "Figma Community": "https://www.figma.com/community",
  SegmentUI: "https://segmentui.com/",
  "UI Wiki": "https://uiwiki.co/",
  Awwwards: "https://www.awwwards.com/",
  "Bento Grids": "https://bentogrids.com/",
  DesignMunk: "https://designmunk.com/",
  Dribbble: "https://dribbble.com/",
  "Footer Design": "https://www.footer.design/",
  "Framer Community Gallery": "https://www.framer.community/",
  "Framer Gallery": "https://www.framer.com/gallery/",
  "Good Design Tools": "https://gooddesign.tools/",
  "Land Book": "https://land-book.com/",
  "Landing Love": "https://www.landing.love/",
  LandingFolio: "https://www.landingfolio.com/",
  "Lapa Ninja": "https://www.lapa.ninja/",
  Layers: "https://layers.to/",
  Mobbin: "https://mobbin.com/",
  Muzli: "https://muz.li/",
  "One Page Love": "https://onepagelove.com/",
  "Page Flows": "https://pageflows.com/",
  Pinterest: "https://www.pinterest.com/",
  "Really Good Emails": "https://reallygoodemails.com/",
  "Refero Design": "https://refero.design/",
  Savee: "https://savee.it/",
  "Screenshots Club": "https://screenshots.club/",
  "User Onboarding": "https://www.useronboard.com/",
  Pexels: "https://www.pexels.com/",
  Pixabay: "https://pixabay.com/",
  Unsplash: "https://unsplash.com/",
  Notion: "https://www.notion.com/",
  "OBS Studio": "https://obsproject.com/",
  "Absurd Design": "https://absurd.design/",
  "Adobe Fonts": "https://fonts.adobe.com/",
  Avataaars: "https://getavataaars.com/",
  CapCut: "https://www.capcut.com/",
  "Daily UI": "https://www.dailyui.co/",
  Designercize: "https://designercize.com/",
  DrawKit: "https://www.drawkit.com/",
  "Epidemic Sound": "https://www.epidemicsound.com/",
  "Eva Icons": "https://akveo.github.io/eva-icons/",
  FakeClients: "https://fakeclients.com/",
  "Font Awesome": "https://fontawesome.com/",
  FontPair: "https://www.fontpair.co/",
  Fontshare: "https://www.fontshare.com/",
  Goodbrief: "https://goodbrief.io/",
  "Growth.Design": "https://growth.design/",
  Humaaans: "https://www.humaaans.com/",
  Iconoir: "https://iconoir.com/",
  IconPark: "https://iconpark.oceanengine.com/",
  Icons8: "https://icons8.com/",
  "IRA Design": "https://iradesign.io/",
  Khroma: "https://www.khroma.co/",
  "LS Graphics": "https://www.ls.graphics/",
  "Mesh Gradients": "https://meshgradient.com/",
  "NHS Design System": "https://service-manual.nhs.uk/design-system",
  "Open Doodles": "https://www.opendoodles.com/",
  "Realtime Colors": "https://www.realtimecolors.com/",
  ShapeFest: "https://www.shapefest.com/",
  Sharpen: "https://sharpen.design/",
  Storyset: "https://storyset.com/",
  "The Design System Checklist": "https://www.designsystemchecklist.com/",
  Toolfolio: "https://toolfolio.io/",
  "Type Scale": "https://typescale.com/",
  Typewolf: "https://www.typewolf.com/",
  "UI Goodies": "https://uigoodies.com/",
  UI8: "https://ui8.net/",
  WhatFontIs: "https://www.whatfontis.com/",
  "Google Fonts": "https://fonts.google.com/",
  WhatFont: "https://whatfonttool.com/",
  Framer: "https://www.framer.com/",
  "Google reCAPTCHA": "https://www.google.com/recaptcha/about/",
  "Image-to-ThreeJS": "https://github.com/search?q=image+to+threejs&type=repositories",
  TweakCN: "https://tweakcn.com/",
  Vite: "https://vite.dev/",
  Wappalyzer: "https://www.wappalyzer.com/",
  Webflow: "https://webflow.com/",
};

const CATEGORY_META: Record<string, { code: string; copy: string }> = {
  AI: { code: "AI", copy: "Generate, enhance and automate" },
  Branding: { code: "BR", copy: "Color, identity and brand assets" },
  Business: { code: "BU", copy: "Freelance and client workflows" },
  "Email Design": { code: "EM", copy: "Campaigns, newsletters and references" },
  Figma: { code: "FG", copy: "Plugins, systems and components" },
  Inspiration: { code: "IN", copy: "References for stronger concepts" },
  Photography: { code: "PH", copy: "Stock imagery and visual assets" },
  Productivity: { code: "PR", copy: "Plan, capture and publish" },
  Resources: { code: "RS", copy: "Icons, type and design utilities" },
  Typography: { code: "TY", copy: "Fonts, pairing and type tools" },
  "Web Development": { code: "WD", copy: "Code, motion and no-code tools" },
};

const categories = Object.keys(CATEGORY_META);
const types = [...new Set(resources.map((resource) => resource.type))].sort();

function getLink(resource: Resource) {
  const known = resource.url || KNOWN_LINKS[resource.name];
  if (known) return { href: known, verified: true };
  if (resource.category === "Figma") {
    return {
      href: `https://www.figma.com/community/search?query=${encodeURIComponent(resource.name)}`,
      verified: false,
    };
  }
  return {
    href: `https://www.google.com/search?q=${encodeURIComponent(`${resource.name} ${resource.platform} official`)}`,
    verified: false,
  };
}

function getDomain(resource: Resource) {
  const { href, verified } = getLink(resource);
  if (!verified) return "Official link lookup";
  try { return new URL(href).hostname.replace("www.", ""); }
  catch { return resource.platform; }
}

function Icon({ name }: { name: "search" | "arrow" | "grid" | "spark" | "close" | "menu" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    spark: <path d="M12 2 14.6 9.4 22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z"/>,
    close: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All resources");
  const [type, setType] = useState("All types");
  const [access, setAccess] = useState("All access");
  const [visible, setVisible] = useState(24);
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesQuery = !normalized || [resource.name, resource.description, resource.bestFor, resource.platform, resource.keywords].join(" ").toLowerCase().includes(normalized);
      return matchesQuery
        && (category === "All resources" || resource.category === category)
        && (type === "All types" || resource.type === type)
        && (access === "All access" || resource.access === access);
    });
  }, [query, category, type, access]);

  const accessOptions = [...new Set(resources.map((resource) => resource.access))].sort();
  const officialCount = resources.filter((resource) => getLink(resource).verified).length;
  const selectCategory = (next: string) => { setCategory(next); setVisible(24); setMobileNav(false); };
  const reset = () => { setQuery(""); setCategory("All resources"); setType("All types"); setAccess("All access"); setVisible(24); };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#resource-grid">Skip to resources</a>
      <aside className={`sidebar ${mobileNav ? "is-open" : ""}`} aria-label="Resource categories">
        <div className="brand-lockup"><span className="brand-mark" aria-hidden="true">RC</span><span><strong>VibeCoder</strong><small>Resource center</small></span></div>
        <nav>
          <p className="nav-label">Explore</p>
          <button className={category === "All resources" ? "active" : ""} onClick={() => selectCategory("All resources")}><span className="nav-icon"><Icon name="grid" /></span><span>All resources</span><b>{resources.length}</b></button>
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => selectCategory(item)}>
              <span className="category-code">{CATEGORY_META[item].code}</span><span>{item}</span><b>{resources.filter((r) => r.category === item).length}</b>
            </button>
          ))}
        </nav>
        <div className="sidebar-note"><span className="signal-dot"/>Curated from Rodrigo&apos;s working library.</div>
      </aside>

      {mobileNav && <button className="backdrop" aria-label="Close category menu" onClick={() => setMobileNav(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open category menu"><Icon name="menu" /></button>
          <label className="search-field"><span className="sr-only">Search resources</span><Icon name="search" /><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(24); }} placeholder="Search tools, topics or use cases…" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" /></button>}</label>
          <div className="topbar-count"><span>{resources.length}</span><small>curated resources</small></div>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow"><span>VibeCoder library</span><b>Updated collection</b></p>
            <h1 id="hero-title">Build better digital work with <em>useful resources.</em></h1>
            <p>Discover design references, AI tools, Figma plugins, typography, assets and front-end utilities—organized around what each resource helps you achieve.</p>
            <a href="#resource-grid" className="primary-button">Explore the library <Icon name="arrow" /></a>
          </div>
          <div className="hero-stats" aria-label="Library statistics"><div><strong>{resources.length}</strong><span>Resources</span></div><div><strong>{categories.length}</strong><span>Categories</span></div><div><strong>{officialCount}</strong><span>Direct links</span></div></div>
          <a className="photo-credit" href="https://unsplash.com/photos/black-and-silver-laptop-computer-on-brown-wooden-table-uMHID74NqfM" target="_blank" rel="noreferrer">Photo: Dennis Cortés / Unsplash</a>
        </section>

        <section className="category-overview" aria-labelledby="category-title">
          <div className="section-heading"><div><p className="eyebrow plain">Browse by focus</p><h2 id="category-title">Choose your starting point</h2></div><button onClick={() => selectCategory("All resources")}>View everything <Icon name="arrow" /></button></div>
          <div className="category-cards">
            {categories.slice(0, 5).map((item) => (
              <button key={item} className={category === item ? "selected" : ""} onClick={() => selectCategory(item)}><span className="category-card-code">{CATEGORY_META[item].code}</span><span><strong>{item}</strong><small>{CATEGORY_META[item].copy}</small></span><b>{resources.filter((resource) => resource.category === item).length}</b></button>
            ))}
          </div>
        </section>

        <section className="library" aria-labelledby="library-title">
          <div className="section-heading library-heading">
            <div><p className="eyebrow plain">Curated database</p><h2 id="library-title">{category}</h2><p className="results-copy">{filtered.length} {filtered.length === 1 ? "resource" : "resources"} found</p></div>
            <div className="filters" aria-label="Resource filters">
              <label><span className="sr-only">Filter by resource type</span><select value={type} onChange={(event) => { setType(event.target.value); setVisible(24); }}><option>All types</option>{types.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span className="sr-only">Filter by access</span><select value={access} onChange={(event) => { setAccess(event.target.value); setVisible(24); }}><option>All access</option>{accessOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              {(query || category !== "All resources" || type !== "All types" || access !== "All access") && <button className="reset-button" onClick={reset}>Reset</button>}
            </div>
          </div>

          <div className="resource-grid" id="resource-grid">
            {filtered.slice(0, visible).map((resource) => {
              const link = getLink(resource);
              const domain = getDomain(resource);
              return (
                <a className="resource-card" key={resource.id} href={link.href} target="_blank" rel="noreferrer" aria-label={`${resource.name}: ${link.verified ? "open official resource" : "find official resource"}`}>
                  <div className={`resource-cover category-${resource.category.toLowerCase().replaceAll(" ", "-")}`}>
                    <span className="cover-grid" aria-hidden="true" /><span className="cover-code">{CATEGORY_META[resource.category]?.code || "RS"}</span><strong>{resource.name}</strong><small>{domain}</small><span className="cover-arrow"><Icon name="arrow" /></span>
                  </div>
                  <div className="resource-body">
                    <div className="card-meta"><span>{resource.category}</span><span>{resource.type}</span></div><h3>{resource.name}</h3><p>{resource.description}</p>
                    <div className="best-for"><b>Best for</b><span>{resource.bestFor.replace(/^Use this resource for\s*/i, "")}</span></div>
                    <div className="card-footer"><span>{resource.access}</span><b>{link.verified ? "Open resource" : "Find official page"}<Icon name="arrow" /></b></div>
                  </div>
                </a>
              );
            })}
          </div>

          {filtered.length === 0 && <div className="empty-state"><Icon name="spark" /><h3>No matching resources</h3><p>Try a broader term or clear the active filters.</p><button className="primary-button" onClick={reset}>Clear filters</button></div>}
          {visible < filtered.length && <div className="load-more"><button className="secondary-button" onClick={() => setVisible((count) => count + 24)}>Load 24 more <span>{visible} of {filtered.length}</span></button></div>}
        </section>

        <footer><div className="brand-lockup"><span className="brand-mark" aria-hidden="true">RC</span><span><strong>Rodrigo Cazuza</strong><small>Strategy, design & front-end production</small></span></div><p>Built as a practical, evolving reference library.</p><a href="#hero-title">Back to top ↑</a></footer>
      </main>
    </div>
  );
}

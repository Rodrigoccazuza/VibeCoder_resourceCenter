import { ImageResponse } from "next/og";

export const alt = "VibeCoder Resource Center interface preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const nav = [
    ["MO", "Motion & Interaction"],
    ["UI", "UI Component Libraries"],
    ["AI", "AI"],
    ["GH", "GitHub Repositories"],
    ["FP", "Figma Plugins"],
  ];
  const cards = [
    ["Motion Primitives", "Animated UI primitives"],
    ["shadcn/ui", "Composable component system"],
    ["React Bits", "Creative React effects"],
    ["21st.dev", "Community UI registry"],
    ["Magic UI", "Animated landing UI"],
    ["Radix UI", "Accessible primitives"],
  ];

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#000", color: "#fff", fontFamily: "Arial, sans-serif", padding: 28 }}>
      <div style={{ width: 250, borderRadius: 26, border: "1px solid #242424", background: "#0d0d0d", padding: 24, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 34 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#6026EC", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>RC</div>
          <div style={{ display: "flex", flexDirection: "column" }}><b style={{ fontSize: 19 }}>VibeCoder</b><span style={{ color: "#9b9ba3", fontSize: 12 }}>Resource center</span></div>
        </div>
        <div style={{ color: "#8d8d96", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>EXPLORE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#1a1a1a", borderRadius: 10, padding: "11px 12px", marginBottom: 8 }}><div style={{ width: 24, height: 24, border: "1px solid #333", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>▦</div><span style={{ fontSize: 14 }}>All resources</span></div>
        {nav.map(([code, label]) => <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#c2c2c7" }}><div style={{ width: 24, height: 24, border: "1px solid #303030", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{code}</div><span style={{ fontSize: 13 }}>{label}</span></div>)}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingLeft: 24 }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ width: 520, height: 46, border: "1px solid #262626", borderRadius: 24, background: "#0d0d0d", display: "flex", alignItems: "center", padding: "0 18px", color: "#8f8f98", fontSize: 14 }}>⌕ &nbsp; Search tools, topics or use cases…</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><b style={{ fontSize: 22 }}>241</b><span style={{ color: "#8f8f98", fontSize: 11 }}>curated resources</span></div>
        </div>

        <div style={{ border: "1px solid #262626", borderRadius: 24, background: "linear-gradient(120deg,#0d0d0d 0%,#151018 56%,#6026EC 145%)", padding: 30, minHeight: 210, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ maxWidth: 650, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}><span style={{ border: "1px solid #343434", borderRadius: 999, padding: "7px 11px", fontSize: 10, letterSpacing: 1.4 }}>VIBECODER LIBRARY</span><span style={{ color: "#b6b6bd", fontSize: 10 }}>UPDATED COLLECTION</span></div>
            <div style={{ fontSize: 43, lineHeight: 1.02, fontWeight: 700, letterSpacing: -2 }}>Resources for faster, better creative development.</div>
            <div style={{ color: "#b6b6bd", fontSize: 14, marginTop: 14 }}>Design, AI, motion, Figma, UI systems, inspiration and front-end tools — organized in one searchable library.</div>
          </div>
          <div style={{ background: "#6026EC", borderRadius: 999, padding: "13px 18px", fontSize: 13, fontWeight: 700 }}>Browse library →</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
          {cards.map(([name, desc]) => <div key={name} style={{ border: "1px solid #252525", borderRadius: 16, background: "#0d0d0d", padding: 16, minHeight: 118, display: "flex", flexDirection: "column", justifyContent: "space-between" }}><div style={{ width: 38, height: 38, borderRadius: 10, background: "#1a1a1a", color: "#9b5cff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{name.slice(0,2).toUpperCase()}</div><div><b style={{ fontSize: 15 }}>{name}</b><div style={{ color: "#9f9fa7", fontSize: 11, marginTop: 4 }}>{desc}</div></div></div>)}
        </div>
      </div>
    </div>,
    size,
  );
}

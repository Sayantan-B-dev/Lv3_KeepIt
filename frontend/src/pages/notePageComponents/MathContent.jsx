import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

// Helpers
const parseUrl = (href) => {
  try {
    return new URL(href);
  } catch (_) {
    return null;
  }
};

const getFaviconUrl = (hostname) => `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

// YouTube helpers
const extractYouTube = (href) => {
  const url = parseUrl(href);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "");
  if (!/(youtube\.com|youtu\.be|m\.youtube\.com)/i.test(host)) return null;

  let videoId = "";
  let start = 0;

  // video id from different paths
  if (host.includes("youtu.be")) {
    videoId = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (url.pathname.startsWith("/watch")) {
    videoId = url.searchParams.get("v") || "";
  } else if (url.pathname.startsWith("/embed/")) {
    videoId = url.pathname.split("/")[2] || "";
  } else if (url.pathname.startsWith("/shorts/")) {
    videoId = url.pathname.split("/")[2] || "";
  }

  // parse start time: t or start, supports 1h2m3s or seconds
  const t = url.searchParams.get("t") || url.searchParams.get("start") || "";
  if (t) {
    const matchHMS = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/i.exec(t);
    if (matchHMS && (matchHMS[1] || matchHMS[2] || matchHMS[3])) {
      const h = parseInt(matchHMS[1] || "0", 10);
      const m = parseInt(matchHMS[2] || "0", 10);
      const s = parseInt(matchHMS[3] || "0", 10);
      start = h * 3600 + m * 60 + s;
    } else if (!Number.isNaN(Number(t))) {
      start = parseInt(t, 10);
    }
  }

  if (!videoId) return null;
  return { videoId, start };
};

// Vimeo helper
const extractVimeo = (href) => {
  const url = parseUrl(href);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "");
  if (!/vimeo\.com/i.test(host)) return null;
  let id = "";
  if (host === "player.vimeo.com") {
    if (url.pathname.startsWith("/video/")) id = url.pathname.split("/")[2] || "";
  } else {
    // e.g., vimeo.com/123456789
    const segs = url.pathname.split("/").filter(Boolean);
    if (segs.length >= 1) id = segs[0];
  }
  if (!/^\d+$/.test(id)) return null;
  return { id };
};

// CodePen helper
const extractCodePen = (href) => {
  const url = parseUrl(href);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "codepen.io") return null;
  const segs = url.pathname.split("/").filter(Boolean);
  // user/{pen|full|details}/{hash}
  if (segs.length >= 3 && ["pen", "full", "details"].includes(segs[1])) {
    return { user: segs[0], hash: segs[2] };
  }
  return null;
};

const iframeWrapperStyle = { display: "flex", justifyContent: "start" };
const iframeContainerStyle = {
  position: "relative",
  width: "100%",
  aspectRatio: "16/9",
  background: "#000",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 8px 0 rgba(31,38,135,0.10)",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "underline",
  fontWeight: 500,
  wordBreak: "break-all",
  overflowWrap: "anywhere",
};

// Link card styles for bare URLs
const cardOuter = {
  display: "block",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  margin: "8px 0",
  textDecoration: "none",
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};
const cardRow = { display: "flex", alignItems: "center", gap: 12 };
const cardIcon = { width: 18, height: 18, borderRadius: 4 };
const cardTexts = { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 };
const cardTitle = { color: "#111827", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const cardSub = { color: "#6b7280", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

function MathContent({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        a({ href, children, ...props }) {
          const childText = Array.isArray(children) && children.length === 1 && typeof children[0] === "string" ? children[0] : "";
          const text = typeof childText === "string" ? childText : "";
          const textEqualsHref = text.replace(/&amp;/g, "&") === href;

          // YouTube embeds
          const yt = extractYouTube(href);
          if (yt && textEqualsHref) {
            const params = yt.start ? `?start=${yt.start}` : "";
            return (
              <div style={iframeWrapperStyle}>
                <div style={iframeContainerStyle}>
                  <iframe
                    src={`https://www.youtube.com/embed/${yt.videoId}${params}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: 0 }}
                  />
                </div>
              </div>
            );
          }

          // Vimeo embeds
          const vm = extractVimeo(href);
          if (vm && textEqualsHref) {
            return (
              <div style={iframeWrapperStyle}>
                <div style={iframeContainerStyle}>
                  <iframe
                    src={`https://player.vimeo.com/video/${vm.id}`}
                    title="Vimeo video"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: 0 }}
                  />
                </div>
              </div>
            );
          }

          // CodePen embeds
          const cp = extractCodePen(href);
          if (cp && textEqualsHref) {
            return (
              <div style={{ ...iframeWrapperStyle }}>
                <div style={{ ...iframeContainerStyle, aspectRatio: undefined, height: 420, background: "#1e1e1e" }}>
                  <iframe
                    height="100%"
                    style={{ width: "100%", border: 0 }}
                    scrolling="no"
                    title="CodePen"
                    src={`https://codepen.io/${cp.user}/embed/${cp.hash}?default-tab=result`}
                    frameBorder="no"
                    allowTransparency={true}
                    allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
              </div>
            );
          }

          // Bare-link card for other providers when text equals href
          if (textEqualsHref) {
            const url = parseUrl(href);
            const hostname = url ? url.hostname.replace(/^www\./, "") : href;
            const display = url ? `${hostname}${url.pathname}${url.search}` : href;
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" style={cardOuter} {...props}>
                <div style={cardRow}>
                  <img src={url ? getFaviconUrl(url.hostname) : ""} alt="" style={cardIcon} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                  <div style={cardTexts}>
                    <div style={cardTitle}>{display}</div>
                    <div style={cardSub}>{href}</div>
                  </div>
                </div>
              </a>
            );
          }

          // Inline link (with custom text)
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle} {...props}>
              {children}
            </a>
          );
        },
        pre({ children }) {
          return <pre style={{ background: "#23272e", color: "#f8f8f2", padding: "1em", borderRadius: 10, margin: "1em 0", overflowX: "auto", fontSize: "0.97em" }}>{children}</pre>;
        },
        code({ inline, children, ...props }) {
          if (inline) {
            return <code style={{ background: "#f3f4f6", color: "#23272e", padding: "2px 6px", borderRadius: 4, fontSize: "0.97em", border: "1px solid #e5e7eb" }} {...props}>{children}</code>;
          }
          return <code {...props}>{children}</code>;
        },
        table({ children }) {
          return (
            <div style={{ overflowX: "auto", maxWidth: "100vw" }}>
              <table style={{ minWidth: 400, width: "100%", borderCollapse: "collapse", margin: "1.5em 0", fontSize: "0.98em", background: "#f8fafc", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px 0 rgba(31,38,135,0.05)" }}>{children}</table>
            </div>
          );
        },
        thead({ children }) {
          return <thead style={{ background: "#e0e7ef" }}>{children}</thead>;
        },
        th({ children }) {
          return <th style={{ padding: "10px 16px", borderBottom: "2px solid #c7d2fe", fontWeight: 700, textAlign: "left", color: "#1e293b" }}>{children}</th>;
        },
        tr({ children }) {
          return <tr style={{ borderBottom: "1px solid #e5e7eb" }}>{children}</tr>;
        },
        td({ children }) {
          return <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", color: "#334155", verticalAlign: "top" }}>{children}</td>;
        },
        h1({ children }) {
          return <h1 style={{ fontSize: "2.2em", fontWeight: 800, margin: "1.2em 0 0.7em 0", color: "#1e293b", lineHeight: 1.15 }}>{children}</h1>;
        },
        h2({ children }) {
          return <h2 style={{ fontSize: "1.6em", fontWeight: 700, margin: "1.1em 0 0.6em 0", color: "#334155", lineHeight: 1.18 }}>{children}</h2>;
        },
        h3({ children }) {
          return <h3 style={{ fontSize: "1.25em", fontWeight: 600, margin: "1em 0 0.5em 0", color: "#475569", lineHeight: 1.22 }}>{children}</h3>;
        },
      }}
    >
      {content || ""}
    </ReactMarkdown>
  );
}

export default MathContent;

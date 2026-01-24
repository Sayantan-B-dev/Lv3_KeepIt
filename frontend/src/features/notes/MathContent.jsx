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

// YouTube helpers (supports watch, youtu.be, embed, shorts, playlists)
const extractYouTube = (href) => {
  const url = parseUrl(href);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "");
  if (!/(youtube\.com|youtu\.be|m\.youtube\.com)/i.test(host)) return null;

  let videoId = "";
  let playlistId = "";
  let start = 0;

  // video id from different paths
  if (host.includes("youtu.be")) {
    videoId = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (url.pathname.startsWith("/watch")) {
    videoId = url.searchParams.get("v") || "";
    playlistId = url.searchParams.get("list") || "";
  } else if (url.pathname.startsWith("/embed/")) {
    videoId = url.pathname.split("/")[2] || "";
  } else if (url.pathname.startsWith("/shorts/")) {
    videoId = url.pathname.split("/")[2] || "";
  } else if (url.pathname.startsWith("/playlist")) {
    playlistId = url.searchParams.get("list") || "";
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

  if (!videoId && !playlistId) return null;
  return { videoId, playlistId, start };
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

// Normalize spacing for typographic elements
const blockReset = { marginTop: 0, marginBottom: "0.6em" };
const listReset = { marginTop: 0, marginBottom: "0.6em", paddingLeft: "1.2em" };
const liReset = { marginTop: "0.2em", marginBottom: "0.2em" };

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
        p({ children }) {
          return <p className="mb-4 leading-relaxed text-red-100/90 text-[15px]">{children}</p>;
        },
        ul({ children }) {
          return <ul className="mb-4 pl-6 list-disc text-gray-300/90">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-4 pl-6 list-decimal text-gray-300/90">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-1.5">{children}</li>;
        },
        a({ href, children, ...props }) {
          const childText = Array.isArray(children) && children.length === 1 && typeof children[0] === "string" ? children[0] : "";
          const text = typeof childText === "string" ? childText : "";
          const textEqualsHref = text.replace(/&amp;/g, "&") === href;

          // YouTube embeds
          const yt = extractYouTube(href);
          if (yt && textEqualsHref) {
            // Playlist-only embed
            if (!yt.videoId && yt.playlistId) {
              return (
                <div className="flex justify-start my-6">
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/videoseries?list=${yt.playlistId}`}
                      title="YouTube playlist"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full border-0"
                    />
                  </div>
                </div>
              );
            }
            // Video (optionally within a playlist)
            if (yt.videoId) {
              const params = new URLSearchParams();
              if (yt.start) params.set('start', String(yt.start));
              if (yt.playlistId) params.set('list', yt.playlistId);
              const qs = params.toString();
              return (
                <div className="flex justify-start my-6">
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${yt.videoId}${qs ? `?${qs}` : ''}`}
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full border-0"
                    />
                  </div>
                </div>
              );
            }
          }

          // Vimeo embeds
          const vm = extractVimeo(href);
          if (vm && textEqualsHref) {
            return (
              <div className="flex justify-start my-6">
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <iframe
                    src={`https://player.vimeo.com/video/${vm.id}`}
                    title="Vimeo video"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                  />
                </div>
              </div>
            );
          }

          // CodePen embeds
          const cp = extractCodePen(href);
          if (cp && textEqualsHref) {
            return (
              <div className="flex justify-start my-6">
                <div className="relative w-full h-[420px] bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <iframe
                    height="100%"
                    className="w-full border-0"
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

          // Bare-link card for other providers
          if (textEqualsHref) {
            const url = parseUrl(href);
            const hostname = url ? url.hostname.replace(/^www\./, "") : href;
            const display = url ? `${hostname}${url.pathname}${url.search}` : href;
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block my-4 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all no-underline shadow-sm"
                {...props}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={url ? getFaviconUrl(url.hostname) : ""}
                    alt=""
                    className="w-5 h-5 rounded"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="text-red-100 font-semibold text-sm truncate">{display}</div>
                    <div className="text-gray-400 text-xs truncate">{href}</div>
                  </div>
                </div>
              </a>
            );
          }

          // Inline link
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 underline decoration-sky-300/30 underline-offset-4 hover:decoration-sky-300 transition-all font-medium"
              {...props}
            >
              {children}
            </a>
          );
        },
        pre({ children }) {
          return (
            <pre className="my-6 p-4 bg-black/60 text-red-50 font-mono text-sm rounded-xl border-2 border-white/20 overflow-x-auto shadow-2xl relative group">
              <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/30 font-sans border border-white/10 rounded pointer-events-none group-hover:text-white/50 transition-colors">
                Code
              </div>
              {children}
            </pre>
          );
        },
        code({ inline, children, ...props }) {
          if (inline) {
            return (
              <code className="px-1.5 py-0.5 mx-0.5 bg-white/10 text-red-300 font-mono text-[13px] rounded border border-white/30 shadow-sm" {...props}>
                {children}
              </code>
            );
          }
          return <code {...props}>{children}</code>;
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-6 border border-white/10 rounded-xl bg-black/20 shadow-lg">
              <table className="min-w-full border-collapse text-left text-sm text-red-100/90">
                {children}
              </table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="bg-white/10 border-b border-white/20">{children}</thead>;
        },
        th({ children }) {
          return <th className="px-6 py-4 font-bold uppercase tracking-wider text-white">{children}</th>;
        },
        tr({ children }) {
          return <tr className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">{children}</tr>;
        },
        td({ children }) {
          return <td className="px-6 py-4 align-top text-gray-300">{children}</td>;
        },
        h1({ children }) {
          return <h1 className="text-3xl font-extrabold mt-10 mb-6 text-white border-b border-white/20 pb-2">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-2xl font-bold mt-8 mb-4 text-red-200 border-l-4 border-red-500 pl-4">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-xl font-semibold mt-6 mb-3 text-red-300/90">{children}</h3>;
        },
      }}
    >
      {content || ""}
    </ReactMarkdown>
  );
}

export default MathContent;

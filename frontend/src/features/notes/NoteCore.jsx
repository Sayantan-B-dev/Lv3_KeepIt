import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

import NoteMermaid from "./NoteMermaid";
import NoteMath from "./NoteMath";

// URL Parsing Helpers
const parseUrl = (href) => {
  try { return new URL(href); } 
  catch (_) { return null; }
};

const extractYouTube = (href) => {
  const url = parseUrl(href);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "");
  if (!/(youtube\.com|youtu\.be|m\.youtube\.com)/i.test(host)) return null;
  let videoId = "";
  let playlistId = "";
  if (host.includes("youtu.be")) {
    videoId = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (url.pathname.startsWith("/watch")) {
    videoId = url.searchParams.get("v") || "";
    playlistId = url.searchParams.get("list") || "";
  } else if (url.pathname.startsWith("/playlist")) {
    playlistId = url.searchParams.get("list") || "";
  }
  if (!videoId && !playlistId) return null;
  return { videoId, playlistId };
};

const NoteCore = ({ content }) => {
  if (!content) return null;

  return (
    <div className="math-container max-w-none text-red-100/90 font-mono">
      <NoteMath />
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-6 leading-relaxed text-[15px] opacity-80">{children}</p>,
          a: ({ href, children }) => {
            const yt = extractYouTube(href);
            if (yt && (yt.videoId || yt.playlistId)) {
              const src = yt.videoId 
                ? `https://www.youtube.com/embed/${yt.videoId}`
                : `https://www.youtube.com/embed/videoseries?list=${yt.playlistId}`;
              return (
                <div className="my-8 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe src={src} className="w-full h-full" allowFullScreen />
                </div>
              );
            }
            return (
              <a href={href} target="_blank" rel="noreferrer" className="text-white hover:text-white/60 transition-colors underline underline-offset-4 decoration-white/20">
                {children}
              </a>
            );
          },
          pre: ({ children, ...props }) => {
            const isMermaid = React.isValidElement(children) && 
                              children.props.className === 'language-mermaid';
            
            if (isMermaid) {
              return <div className="mermaid-wrapper">{children}</div>;
            }

            const language = children?.props?.className?.replace('language-', '') || 'Code';
            return (
              <div className="relative my-8 group">
                <div className="absolute -top-3 right-4 text-[9px] text-white/30 uppercase font-black px-3 py-1 bg-black rounded-full border border-white/10 z-10">
                  {language}
                </div>
                <pre className="p-6 bg-black/60 rounded-2xl border-2 border-white/10 overflow-x-auto text-sm m-0 shadow-xl" {...props}>
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ inline, children, className, ...props }) => {
            const codeContent = String(children).trim();
            if (!inline && className === 'language-mermaid') {
              return <NoteMermaid chart={codeContent} />;
            }
            return inline ? (
              <code className="px-1.5 py-0.5 bg-white/5 text-white/60 rounded font-bold text-[13px] border border-white/10" {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-8 rounded-2xl border-2 border-white/10 bg-black/40 shadow-2xl">
              <table className="min-w-full text-sm text-left">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="px-6 py-4 bg-white/5 font-black uppercase text-white/40 tracking-widest text-[10px]">{children}</th>,
          td: ({ children }) => <td className="px-6 py-4 border-t border-white/5 text-white/70">{children}</td>,
          h1: ({ children }) => <h1 className="text-4xl font-black mt-12 mb-8 pb-4 border-b-2 border-white/10 uppercase italic tracking-tighter decoration-white/20 underline-offset-8">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-black mt-10 mb-6 border-l-8 border-white/20 pl-6 uppercase italic tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-black mt-8 mb-4 text-white uppercase tracking-widest italic">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 pl-6 border-l-4 border-white/10 italic text-white/60 bg-white/[0.02] py-4 rounded-r-2xl">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 opacity-80">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 opacity-80">{children}</ol>,
          li: ({ children }) => <li className="text-[15px]">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default NoteCore;

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import "katex/dist/katex.min.css";

// Configure Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

const Mermaid = ({ chart }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chart) return;
    let isMounted = true;

    const render = async () => {
      try {
        await mermaid.parse(chart);
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: res } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvg(res);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Syntax Violation");
        }
      }
    };

    const timeout = setTimeout(render, 300);
    return () => { 
      isMounted = false; 
      clearTimeout(timeout);
    };
  }, [chart]);

  if (error) {
    // If the chart is very short, the user is likely still typing the header. 
    // Show a simple code block instead of a loud error message.
    if (chart.length < 15) {
      return (
        <pre className="p-4 bg-black/40 rounded-xl border border-white/10 text-[10px] font-mono opacity-40 my-4 animate-pulse">
          {chart || "Defining diagram..."}
        </pre>
      );
    }

    return (
      <div className="text-[10px] text-red-400 font-mono p-4 border border-red-400/10 bg-red-400/5 rounded-xl my-4 flex flex-col gap-2 transition-all">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="font-bold uppercase tracking-widest text-red-500/60">Note: Incomplete Diagram</span>
        </div>
        <p className="opacity-80">Finish your definition (e.g., 'graph TD'). The diagram will render automatically.</p>
        <code className="p-2 bg-black/40 rounded border border-white/5 text-white/40 truncate">
          {chart}
        </code>
      </div>
    );
  }
  
  if (!svg) return <div className="animate-pulse h-10 w-full bg-white/5 rounded my-4" />;

  return (
    <div 
      className="flex justify-center my-4 p-4 bg-black/20 rounded-xl border border-white/5 overflow-x-auto transition-all duration-700 ease-in-out opacity-100 scale-100"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

// URL Parsing Helpers
const parseUrl = (href) => {
  try { return new URL(href); } 
  catch (_) { return null; }
};

const getFaviconUrl = (hostname) => `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

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

function MathContent({ content }) {
  if (!content) return null;

  return (
    <div className="math-container max-w-none text-red-100/90">
      <style>{`
        .math-container .katex-display {
          overflow-x: auto;
          overflow-y: hidden;
          padding: 1rem 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-4 leading-relaxed text-[15px]">{children}</p>,
          a: ({ href, children }) => {
            const yt = extractYouTube(href);
            if (yt && (yt.videoId || yt.playlistId)) {
              const src = yt.videoId 
                ? `https://www.youtube.com/embed/${yt.videoId}`
                : `https://www.youtube.com/embed/videoseries?list=${yt.playlistId}`;
              return (
                <div className="my-6 aspect-video rounded-xl overflow-hidden border border-white/10">
                  <iframe src={src} className="w-full h-full" allowFullScreen />
                </div>
              );
            }
            return (
              <a href={href} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                {children}
              </a>
            );
          },
          pre: ({ children, ...props }) => {
            // If the child is a mermaid code block, don't wrap in <pre> styles
            const isMermaid = React.isValidElement(children) && 
                              children.props.className === 'language-mermaid';
            
            if (isMermaid) {
              return <div className="mermaid-wrapper my-6">{children}</div>;
            }

            const language = children?.props?.className?.replace('language-', '') || 'Code';
            return (
              <div className="relative my-6 group">
                <div className="absolute top-2 right-2 text-[10px] text-white/40 uppercase font-mono px-2 py-0.5 bg-black/40 rounded border border-white/10 pointer-events-none z-10 transition-opacity opacity-0 group-hover:opacity-100">
                  {language}
                </div>
                <pre className="p-4 bg-black/60 rounded-xl border-2 border-white/20 overflow-x-auto text-sm m-0" {...props}>
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ inline, children, className, ...props }) => {
            const chartData = String(children).trim();
            if (!inline && className === 'language-mermaid') {
              return <Mermaid chart={chartData} />;
            }
            return inline ? (
              <code className="px-1.5 py-0.5 bg-white/10 text-red-300 rounded font-mono text-[13px] border border-white/30" {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-white/10 bg-black/20">
              <table className="min-w-full text-sm text-left">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="px-6 py-4 bg-white/5 font-bold uppercase text-white/70">{children}</th>,
          td: ({ children }) => <td className="px-6 py-4 border-t border-white/5 text-gray-400">{children}</td>,
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-6 pb-2 border-b border-white/10">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4 border-l-4 border-emerald-500 pl-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-emerald-400/80">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MathContent;

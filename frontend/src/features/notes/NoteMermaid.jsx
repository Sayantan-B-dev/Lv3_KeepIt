import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize Mermaid once
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
});

const NoteMermaid = ({ chart }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const chartId = useRef(`mermaid-svg-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    if (!chart) return;
    
    let isMounted = true;
    const renderChart = async () => {
      try {
        // Clear previous error
        setError(null);

        // Sanitize chart string if needed
        const cleanChart = chart.trim();

        // Validating syntax first
        await mermaid.parse(cleanChart);

        const { svg: renderedSvg } = await mermaid.render(chartId.current, cleanChart);
        
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Mermaid Render Error:", err);
          setError(err.message || "Syntax Violation");
        }
      }
    };

    const timeout = setTimeout(renderChart, 200);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [chart]);

  if (error) {
    if (chart.length < 20) {
        return (
          <pre className="p-4 bg-black/40 rounded-xl border border-white/10 text-[10px] font-mono opacity-40 my-4 animate-pulse">
            {chart || "Defining diagram..."}
          </pre>
        );
      }
  
      return (
        <div className="text-[10px] text-red-100/40 font-mono p-4 border border-white/5 bg-white/[0.02] rounded-xl my-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            <span className="font-bold uppercase tracking-widest text-white/20">Diagram Syntax Note</span>
          </div>
          <p className="opacity-80 mb-2">Ensure your Mermaid syntax is complete (e.g., 'flowchart TD').</p>
          <code className="block p-2 bg-black/40 rounded border border-white/5 text-white/30 truncate">
            {chart}
          </code>
        </div>
      );
  }

  if (!svg) {
    return (
      <div className="w-full h-32 animate-pulse bg-white/5 rounded-xl my-4 border border-white/5 flex items-center justify-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-20">Rendering Diagram...</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex justify-center my-6 p-6 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto shadow-2xl transition-all hover:border-white/20"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default NoteMermaid;

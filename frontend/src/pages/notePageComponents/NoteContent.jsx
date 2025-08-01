import React from "react";
import { marked } from "marked";
import DOMPurify from 'dompurify';

const NoteContent = ({
  editMode,
  editNote,
  handleInputChange,
  updateLoading,
  contentTooLarge,
  CONTENT_MAX_LENGTH,
  note,
}) => (
  <div className="my-8">
    <h2 className="font-semibold text-black mb-2 text-lg">Content : </h2>
    {editMode ? (
      <>
        {contentTooLarge && (
          <div className="mb-2 text-red-500 text-center">
            {CONTENT_MAX_LENGTH
              ? `Content is too long to edit (max ${CONTENT_MAX_LENGTH} characters).`
              : "Content is too large to edit in this field."}
          </div>
        )}
        <textarea
          name="content"
          value={editNote.content}
          onChange={handleInputChange}
          className="w-full h-200 border border-indigo-200 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-300"
          rows={16}
          maxLength={CONTENT_MAX_LENGTH}
          disabled={updateLoading || contentTooLarge}
          style={contentTooLarge ? { background: "#fef2f2" } : {}}
        />
      </>
    ) : (
      <div
        className="bg-white/40 rounded-xl px-5 py-4 shadow-lg  border-1 border-black whitespace-pre-line text-gray-800"
        dangerouslySetInnerHTML={{
          __html: (() => {
            // 1. Render markdown to HTML
            let html = DOMPurify.sanitize(
              marked(note.content, {
                highlight: function (code, lang) {
                  return code;
                },
              })
            )
              // Style <a> tags and ensure long links break inside the box
              .replace(
                /<a /g,
                '<a target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500; word-break: break-all; overflow-wrap: anywhere;" '
              )
              // Style <pre> blocks
              .replace(
                /<pre>/g,
                '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;">'
              )
              // Style <pre><code>
              .replace(
                /<pre[^>]*>\s*<code( class=".*?")?>/g,
                '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;"><code style="background: transparent; color: inherit; padding: 0; border-radius: 0; font-size: inherit;">'
              )
              // Style <code>
              .replace(
                /<code( class=".*?")?>/g,
                '<code style="background: #f3f4f6; color: #23272e; padding: 2px 6px; border-radius: 4px; font-size: 0.97em; border: 1px solid #e5e7eb;">'
              )
              // Style markdown tables - make them horizontally scrollable on small screens
              .replace(
                /<table>/g,
                '<div style="overflow-x:auto; max-width:100vw;"><table style="min-width:400px; width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.98em; background:#f8fafc; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px 0 rgba(31,38,135,0.05);">'
              )
              .replace(
                /<thead>/g,
                '<thead style="background:#e0e7ef;">'
              )
              .replace(
                /<th>/g,
                '<th style="padding:10px 16px; border-bottom:2px solid #c7d2fe; font-weight:700; text-align:left; color:#1e293b;">'
              )
              .replace(
                /<tr>/g,
                '<tr style="border-bottom:1px solid #e5e7eb;">'
              )
              .replace(
                /<td>/g,
                '<td style="padding:10px 16px; border-bottom:1px solid #e5e7eb; color:#334155; vertical-align:top;">'
              )
              // Close the wrapping div after </table>
              .replace(
                /<\/table>/g,
                '</table></div>'
              )
              // Style <ul> and <ol> for ChatGPT-like look
              .replace(
                /<ul>/g,
                '<ul style="margin-left: 1.5em; margin-bottom: 1em; list-style-type: disc; padding-left: 1.2em;">'
              )
              .replace(
                /<ol>/g,
                '<ol style="margin-left: 1.5em; margin-bottom: 1em; list-style-type: decimal; padding-left: 1.2em;">'
              )
              .replace(
                /<li>/g,
                '<li style="margin-bottom: 0.3em; font-size: 1em; line-height: 1.7;">'
              )
              // Style <h1> (#), <h2> (##), <h3> (###) with different sizes
              .replace(
                /<h1([^>]*)>/g,
                '<h1$1 style="font-size:2.2em; font-weight:800; margin:1.2em 0 0.7em 0; color:#1e293b; line-height:1.15;">'
              )
              .replace(
                /<h2([^>]*)>/g,
                '<h2$1 style="font-size:1.6em; font-weight:700; margin:1.1em 0 0.6em 0; color:#334155; line-height:1.18;">'
              )
              .replace(
                /<h3([^>]*)>/g,
                '<h3$1 style="font-size:1.25em; font-weight:600; margin:1em 0 0.5em 0; color:#475569; line-height:1.22;">'
              );

            // 2. Replace YouTube links with embedded video iframes
            // Only replace anchor tags where the link text is the same as the YouTube URL (i.e., not [text](youtube))
            html = html.replace(
              /<a [^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_\-]{11}))(?:[^"]*)?"[^>]*>(.*?)<\/a>/g,
              (match, url, videoId, linkText) => {
                // Only embed if the link text is exactly the same as the URL (no custom text)
                // Allow for possible HTML-encoded ampersands in the URL
                const normalizedUrl = url.replace(/&amp;/g, "&");
                const normalizedLinkText = linkText.replace(/&amp;/g, "&");
                if (!videoId || normalizedUrl !== normalizedLinkText) return match;
                // Responsive iframe wrapper
                return `
                  <div style=" display: flex; justify-content: start;">
                    <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px 0 rgba(31,38,135,0.10);">
                      <iframe
                        src="https://www.youtube.com/embed/${videoId}"
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        style="width: 100%; height: 100%; border: 0;"
                      ></iframe>
                    </div>
                  </div>
                `;
              }
            );

            return html;
          })()
        }}
      />
    )}
  </div>
);

export default NoteContent;
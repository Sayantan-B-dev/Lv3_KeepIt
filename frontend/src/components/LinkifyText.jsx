import React from "react";

const urlOrEmailRegex = /((?:https?:\/\/|ftp:\/\/|www\.)[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,24}(?=[^\w]|$)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24})/gi;

function safeHref(href) {
  // Only allow http, https, mailto, ftp
  if (/^(https?:|mailto:|ftp:)/i.test(href)) return href;
  return null;
}

const LinkifyText = ({ text }) => {
  if (!text) return null;
  const parts = [];
  let lastIndex = 0;
  let match;
  urlOrEmailRegex.lastIndex = 0;
  while ((match = urlOrEmailRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    let value = match[0];
    let isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/.test(value);
    let href, displayUrl;
    if (isEmail) {
      href = `mailto:${value}`;
      displayUrl = value;
    } else {
      href =
        value.startsWith("http") || value.startsWith("ftp")
          ? value
          : `http://${value}`;
      displayUrl = value.replace(/^https?:\/\//, "").replace(/^ftp:\/\//, "").replace(/\/$/, "");
    }
    parts.push({
      type: "link",
      value,
      href,
      displayUrl,
    });
    lastIndex = match.index + value.length;
  }
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }
  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === "link") {
          const safeLink = safeHref(part.href);
          return safeLink ? (
            <a
              key={idx}
              href={safeLink}
              target={safeLink.startsWith("mailto:") ? undefined : "_blank"}
              rel={safeLink.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              style={{ color: "blue", wordBreak: "break-all" }}
            >
              {part.displayUrl}
            </a>
          ) : (
            <span key={idx}>{part.displayUrl}</span>
          );
        } else {
          return <span key={idx}>{part.value}</span>;
        }
      })}
    </>
  );
};

export default LinkifyText; 
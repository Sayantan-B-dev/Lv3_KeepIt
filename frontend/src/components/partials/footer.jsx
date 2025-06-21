import React from "react";
import { Link } from "react-router-dom";
import {blackFontClass} from "./StickyNavbar";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", to: "#" },
      { name: "Pricing", to: "#" },
      { name: "Integrations", to: "#" },
      { name: "Documentation", to: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", to: "#" },
      { name: "Careers", to: "#" },
      { name: "Blog", to: "#" },
      { name: "Contact", to: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms", to: "#" },
      { name: "Privacy", to: "#" },
      { name: "Security", to: "#" },
    ],
  },
];

const socialLinks = [
  {
    name: "Twitter",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M22 5.924c-.793.352-1.646.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.93 8.93 0 0 1-2.828 1.082A4.48 4.48 0 0 0 12.03 9.5c0 .352.04.695.116 1.022C8.728 10.37 5.7 8.77 3.671 6.29a4.48 4.48 0 0 0-.607 2.256c0 1.557.793 2.933 2.002 3.74a4.47 4.47 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.6 4.393c-.193.052-.397.08-.607.08-.148 0-.292-.014-.432-.04a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.07a12.67 12.67 0 0 0 6.86 2.01c8.23 0 12.74-6.82 12.74-12.74 0-.194-.004-.387-.013-.578A9.13 9.13 0 0 0 24 4.59a8.98 8.98 0 0 1-2.6.713Z"
          fill="#64748b"
        />
      </svg>
    ),
    to: "#",
  },
  {
    name: "GitHub",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.42-.012 2.75 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"
          fill="#64748b"
        />
      </svg>
    ),
    to: "#",
  },
  {
    name: "LinkedIn",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5V5c0-2.761-2.239-5-5-5zm-11 19H5v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.5c0-1.104-.896-2-2-2s-2 .896-2 2v4.5h-3v-9h3v1.285c.417-.646 1.19-1.285 2.5-1.285 1.933 0 3.5 1.567 3.5 3.5v5.5z"
          fill="#64748b"
        />
      </svg>
    ),
    to: "#",
  },
];

const Footer = () => {
  return (
    <footer
      className="border-t border-gray-200 pt-12 pb-6 px-4 md:px-0 rounded-t-3xl bottom-0 w-full"
      style={{
        backdropFilter: 'blur(3px)',
        background: 'rgba(255, 255, 255, 0.1)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Brand & Description */}
        <div className="flex-1 mb-8 md:mb-0">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">KeepIt</span>
          </Link>
          <p className="text-gray-500 max-w-xs text-sm">
            Capture, organize, and share knowledge from across the web. Transform scattered information into meaningful content that grows with you.
          </p>
          <div className="flex gap-3 mt-5">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-indigo-50 rounded-full p-2 transition-colors"
                
                aria-label={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        {/* Links */}
        <div className="flex flex-1 justify-between gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-black font-bold mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className={`${blackFontClass} text-gray-500 hover:text-indigo-600 transition-colors text-sm`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <span>
          &copy; {new Date().getFullYear()} KeepIt. All rights reserved. @Sayantan-B-Dev
        </span>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

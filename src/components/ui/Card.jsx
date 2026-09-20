import React from "react";

/**
 * Card — the base surface used everywhere in the app: crisp white
 * container, thin slate border, small radius, only a whisper of shadow.
 */
export default function Card({ children, className = "", padded = true, ...rest }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg shadow-subtle ${
        padded ? "p-4" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

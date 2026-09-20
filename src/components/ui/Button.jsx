import React from "react";

const VARIANTS = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 border border-primary-500",
  outline: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
  danger: "bg-critical-text text-white hover:opacity-90 border border-critical-text",
  ghost: "bg-transparent text-primary-600 hover:bg-primary-50 border border-transparent",
};

const SIZES = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5",
  md: "text-sm px-3.5 py-2 gap-2",
};

export default function Button({
  children,
  variant = "outline",
  size = "sm",
  icon: Icon,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

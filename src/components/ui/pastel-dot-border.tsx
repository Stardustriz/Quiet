import React from "react";

export interface PastelDotBorderProps {
  children: React.ReactNode;
  className?: string;
  dotColor?: string;
  lineColor?: string;
  gridColor?: string;
}

export function PastelDotBorder({
  children,
  className = "",
  dotColor,
  lineColor,
  gridColor,
}: PastelDotBorderProps) {
  const customStyles = {
    ...(dotColor ? { "--dot-color": dotColor } : {}),
    ...(lineColor ? { "--line-color": lineColor } : {}),
    ...(gridColor ? { "--grid-color": gridColor } : {}),
  } as React.CSSProperties;

  const isFullHeight = className.includes("h-full");

  return (
    <div className={`dot-border-wrapper ${className}`} style={customStyles}>
      {/* 4 Edge-drawing dashed lines */}
      <span className="line horizontal top" aria-hidden="true" />
      <span className="line vertical right" aria-hidden="true" />
      <span className="line horizontal bottom" aria-hidden="true" />
      <span className="line vertical left" aria-hidden="true" />

      {/* 4 Corner-animating dots */}
      <span className="dot top left" aria-hidden="true" />
      <span className="dot top right" aria-hidden="true" />
      <span className="dot bottom right" aria-hidden="true" />
      <span className="dot bottom left" aria-hidden="true" />

      {/* Interactive button / link content */}
      <div
        className={`relative z-10 w-full ${
          isFullHeight ? "h-full flex flex-col flex-1" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default PastelDotBorder;

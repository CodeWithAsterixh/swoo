import React from "react";
import { IElement } from "../../models/Element";

type Props = {
  element: IElement;
  selected?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
};

const ElementRenderer: React.FC<Props> = ({
  element,
  selected = false,
  onPointerDown,
  onClick,
}) => {
  const { position, size, rotation, style } = element;
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: position?.x ?? 0,
    top: position?.y ?? 0,
    width: size?.width ?? 100,
    height: size?.height ?? 40,
    transform: `rotate(${rotation ?? 0}deg)`,
    boxSizing: "border-box",
    zIndex: element.zIndex ?? 0,
    cursor: "grab",
    userSelect: "none",
    outline: selected ? "2px solid #0b76ff" : undefined,
    background: element.type === "shape" ? style?.fill ?? "#eee" : undefined,
    borderRadius: style?.borderRadius ? `${style.borderRadius}px` : undefined,
    border: style?.stroke
      ? `${style.strokeWidth ?? 1}px solid ${style.stroke}`
      : undefined,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transformOrigin: "center center",
    ...((style || {}) as React.CSSProperties),
  };

  // root wrapper handles pointer events so image/text rendering remains decoupled
  return (
    <div style={baseStyle} onPointerDown={onPointerDown} onClick={onClick}>
      {element.type === "text" && (
        <div
          style={{
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              style?.textAlign === "left"
                ? "flex-start"
                : style?.textAlign === "right"
                ? "flex-end"
                : "center",
            padding: "4px",
            boxSizing: "border-box",
            color: style?.color ?? "#000",
            fontSize: style?.fontSize ?? 14,
            fontStyle: style?.fontStyle ?? "normal",
            fontWeight: style?.fontWeight ?? "400",
            fontFamily: (style as React.CSSProperties)?.fontFamily ?? undefined,
            lineHeight: style?.lineHeight ? `${style.lineHeight}px` : undefined,
            letterSpacing: style?.letterSpacing
              ? `${style.letterSpacing}px`
              : undefined,
            textDecoration: style?.textDecoration ?? "none",
          }}
        >
          {element.content ?? ""}
        </div>
      )}
      {element.type === "image" && (
        // avoid next/image complexity here; use native img for editor canvas
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.src ?? ""}
          alt={String(element.content ?? "image")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      )}
      {element.type === "shape" && (
        <div style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
      )}

      {/* Resize handles (render when selected) */}
      {selected && (
        <>
          {/* corners */}
          <div
            data-handle="nw"
            onPointerDown={onPointerDown}
            style={handleStyle("nw", "0%", "0%")}
          />
          <div
            data-handle="ne"
            onPointerDown={onPointerDown}
            style={handleStyle("ne", "100%", "0%")}
          />
          <div
            data-handle="se"
            onPointerDown={onPointerDown}
            style={handleStyle("se", "100%", "100%")}
          />
          <div
            data-handle="sw"
            onPointerDown={onPointerDown}
            style={handleStyle("sw", "0%", "100%")}
          />
          {/* edges */}
          <div
            data-handle="n"
            onPointerDown={onPointerDown}
            style={handleStyle("n", "50%", "0%")}
          />
          <div
            data-handle="e"
            onPointerDown={onPointerDown}
            style={handleStyle("e", "100%", "50%")}
          />
          <div
            data-handle="s"
            onPointerDown={onPointerDown}
            style={handleStyle("s", "50%", "100%")}
          />
          <div
            data-handle="w"
            onPointerDown={onPointerDown}
            style={handleStyle("w", "0%", "50%")}
          />
          {/* rotation handle */}
          <div
            data-handle="rotate"
            onPointerDown={onPointerDown}
            style={handleStyle("rotate", "50%", "-16px")}
          />
        </>
      )}
    </div>
  );
};

const handleBase: React.CSSProperties = {
  position: "absolute",
  width: 10,
  height: 10,
  background: "#0b76ff",
  borderRadius: 2,
  transform: "translate(-50%, -50%)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
  // default; overridden per-handle in handleStyle
  cursor: "pointer",
  zIndex: 1000,
};

const handleStyle = (
  handle: string,
  left: string,
  top: string
): React.CSSProperties => {
  let cursor = "pointer";
  // map handle to directional resize cursors
  switch (handle) {
    case "nw":
    case "se":
      cursor = "nwse-resize";
      break;
    case "ne":
    case "sw":
      cursor = "nesw-resize";
      break;
    case "n":
    case "s":
      cursor = "ns-resize";
      break;
    case "e":
    case "w":
      cursor = "ew-resize";
      break;
    case "rotate":
      // custom rotate cursor (data URI SVG) to resemble Figma rotate
      try {
        const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
  <path d='M21 2v6h-6' fill='none' stroke='#230b76ff' stroke-width='1.6'
        stroke-linecap='round' stroke-linejoin='round'/>
  <path d='M3 12a9 9 0 0 1 15-6' fill='none' stroke='#230b76ff'
        stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>
</svg>`;
        const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        cursor = `url("${uri}") 12 12, crosshair`;
      } catch {
        cursor = "crosshair";
      }
      break;
    default:
      cursor = "pointer";
  }

  return { ...handleBase, left, top, cursor };
};

// rotateHandleStyle removed — rotation handle uses handleStyle('rotate', ...)

export default ElementRenderer;

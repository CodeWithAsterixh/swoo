/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import ElementRenderer from "./ElementRenderer";
import useEditorStore from "../../store/editorStore";
import Image from "next/image";
import { FiPlus, FiMove } from "react-icons/fi";

type CanvasProps = {
  projectId?: string;
};

const Canvas: React.FC<CanvasProps> = () => {
  const project = useEditorStore((state) => state.project);
  const currentPageIndex = useEditorStore((state) => state.currentPage);
  const selectElement = useEditorStore((state) => state.selectElement);
  const selectedElements = useEditorStore((state) => state.selectedElements);
  const moveElement = useEditorStore((state) => state.moveElement);
  const setCurrentPage = useEditorStore((state) => state.setCurrentPage);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<{
    elementId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const resizingRef = useRef<{
    elementId: string;
    handle: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    origRotation: number;
  } | null>(null);

  const pending = useEditorStore((state) => state.pendingElement);
  const placePending = useEditorStore((state) => state.placePending);
  const cancelPlacement = useEditorStore((state) => state.cancelPlacement);
  const snapToGrid = useEditorStore((state) => state.snapToGrid);
  const gridSize = useEditorStore((state) => state.gridSize);

  const placingRef = useRef<{
    startX: number;
    startY: number;
    dragging: boolean;
  } | null>(null);
  const [preview, setPreview] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const page = project?.pages?.[currentPageIndex];
  const isDraggingCursor = isDragging ? "grabbing" : "default";
  const cursor = pending ? "none" : isDraggingCursor;

  const handleCanvasPointerDown = (ev: React.PointerEvent) => {
    if (!pending) return;
    ev.stopPropagation();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    placingRef.current = { startX: x, startY: y, dragging: true };
    setPreview({
      x: Math.round(x),
      y: Math.round(y),
      w: pending.size?.width ?? 120,
      h: pending.size?.height ?? 40,
    });
  };

  const handleCanvasPointerUp = (ev: React.PointerEvent) => {
    if (!pending || !placingRef.current) return;
    ev.stopPropagation();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    const { startX, startY } = placingRef.current;
    const dx = x - startX;
    const dy = y - startY;

    // Use default size if it was a simple click (threshold of 6px)
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      const w = pending.size?.width ?? 120;
      const h = pending.size?.height ?? 40;
      const px = Math.max(
        0,
        Math.min(rect.width - w, Math.round(startX - w / 2))
      );
      const py = Math.max(
        0,
        Math.min(rect.height - h, Math.round(startY - h / 2))
      );
      placePending(page?.id ?? "", px, py, w, h);
    } else {
      const rawW = Math.round(dx);
      const rawH = Math.round(dy);
      const px = rawW < 0 ? startX + rawW : startX;
      const py = rawH < 0 ? startY + rawH : startY;
      placePending(
        page?.id ?? "",
        Math.round(px),
        Math.round(py),
        Math.abs(rawW),
        Math.abs(rawH)
      );
    }

    placingRef.current = null;
    setPreview(null);
  };

  const handleCanvasClick = (ev: React.MouseEvent) => {
    // If clicking on canvas background (not an element), select the card
    if (!pending && ev.target === containerRef.current) {
      selectElement(page?.id ?? "", "__card__", false);
    }
  };

  useEffect(() => {
    if (project && page == null && project.pages.length > 0) {
      setCurrentPage(0);
    }
  }, [project, page, setCurrentPage]);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const r = resizingRef.current;
      if (r) {
        // handle resize
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;
        let newX = r.origX;
        let newY = r.origY;
        let newW = r.origW;
        let newH = r.origH;
        const minSize = 8;
        switch (r.handle) {
          case "nw":
            newX = r.origX + dx;
            newY = r.origY + dy;
            newW = r.origW - dx;
            newH = r.origH - dy;
            break;
          case "n":
            newY = r.origY + dy;
            newH = r.origH - dy;
            break;
          case "ne":
            newY = r.origY + dy;
            newW = r.origW + dx;
            newH = r.origH - dy;
            break;
          case "e":
            newW = r.origW + dx;
            break;
          case "se":
            newW = r.origW + dx;
            newH = r.origH + dy;
            break;
          case "s":
            newH = r.origH + dy;
            break;
          case "sw":
            newX = r.origX + dx;
            newW = r.origW - dx;
            newH = r.origH + dy;
            break;
          case "w":
            newX = r.origX + dx;
            newW = r.origW - dx;
            break;
          case "rotate": // compute center and angle
          {
            const el = page?.elements.find((el) => el.id === r.elementId);
            if (!el) break;
            const centerX = rect.left + (el.position.x + el.size.width / 2);
            const centerY = rect.top + (el.position.y + el.size.height / 2);
            const angle =
              Math.atan2(e.clientY - centerY, e.clientX - centerX) *
              (180 / Math.PI);
            // apply rotation
            useEditorStore
              .getState()
              .updateElement(page?.id ?? "", r.elementId, {
                rotation: Math.round(angle),
              } as any);
            return;
          }
        }

        if (newW < minSize) newW = minSize;
        if (newH < minSize) newH = minSize;
        // clamp to canvas bounds
        newX = Math.max(0, Math.min(newX, rect.width - newW));
        newY = Math.max(0, Math.min(newY, rect.height - newH));

        useEditorStore
          .getState()
          .updateElement(page?.id ?? "", r.elementId, {
            position: { x: Math.round(newX), y: Math.round(newY) },
            size: { width: Math.round(newW), height: Math.round(newH) },
          } as any);
        return;
      }

      const d = draggingRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      moveElement(page?.id ?? "", d.elementId, d.origX + dx, d.origY + dy);
    }

    function onPointerUp() {
      draggingRef.current = null;
      resizingRef.current = null;
      setIsDragging(false);
    }

    globalThis.addEventListener("pointermove", onPointerMove);
    globalThis.addEventListener("pointerup", onPointerUp);
    return () => {
      globalThis.removeEventListener("pointermove", onPointerMove);
      globalThis.removeEventListener("pointerup", onPointerUp);
    };
  }, [page, moveElement]);

  // keyboard nudges for selected elements
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // don't intercept when typing into inputs
      const active = document.activeElement as HTMLElement | null;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      )
        return;

      const selected = useEditorStore.getState().selectedElements;
      if (!selected || selected.length === 0) return;

      let dx = 0;
      let dy = 0;
      const step = e.shiftKey ? 10 : 1;
      switch (e.key) {
        case "ArrowLeft":
          dx = -step;
          break;
        case "ArrowRight":
          dx = step;
          break;
        case "ArrowUp":
          dy = -step;
          break;
        case "ArrowDown":
          dy = step;
          break;
        default:
          return;
      }

      e.preventDefault();
      const pageId = selected[0].pageId;
      if (selected.length === 1) {
        const el = page?.elements.find((p) => p.id === selected[0].elementId);
        if (!el) return;
        // use moveElement which respects snapping
        useEditorStore
          .getState()
          .moveElement(
            pageId,
            el.id,
            (el.position.x ?? 0) + dx,
            (el.position.y ?? 0) + dy
          );
      } else {
        // multi-select: batch update positions using a Map for O(1) lookups
        const elementMap = new Map(page?.elements.map((e) => [e.id, e]));
        const updates = selected.reduce((acc, s) => {
          const el = elementMap.get(s.elementId);
          if (el) {
            acc.push({
              pageId: s.pageId,
              elementId: s.elementId,
              patch: {
                position: {
                  x: (el.position.x ?? 0) + dx,
                  y: (el.position.y ?? 0) + dy,
                },
              },
            });
          }
          return acc;
        }, [] as any[]);
        if (updates.length > 0)
          useEditorStore.getState().updateElements(updates);
      }
    }

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [page]);

  // handle global pointer move for placement preview and cursor thumbnail
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!containerRef.current) return;
      // update cursor position (fixed, viewport coords)
      setCursorPos({ x: e.clientX, y: e.clientY });

      if (!pending) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!placingRef.current?.dragging) {
        // update preview position (centered at cursor)
        const w = pending.size?.width ?? 120;
        const h = pending.size?.height ?? 40;
        setPreview({
          x: Math.max(0, Math.min(rect.width - w, Math.round(x - w / 2))),
          y: Math.max(0, Math.min(rect.height - h, Math.round(y - h / 2))),
          w,
          h,
        });
      } else if (placingRef.current?.dragging) {
        const startX = placingRef.current.startX;
        const startY = placingRef.current.startY;
        const w = Math.max(1, Math.round(x - startX));
        const h = Math.max(1, Math.round(y - startY));
        setPreview({ x: Math.round(startX), y: Math.round(startY), w, h });
      }
    }

    globalThis.addEventListener("pointermove", onMove);
    return () => globalThis.removeEventListener("pointermove", onMove);
  }, [pending]);

  // set a custom cursor while placing (we render icon near cursor and hide native cursor)
  useEffect(() => {
    if (globalThis.window === undefined) return;
    // hide native cursor when showing our icon cursor or when dragging
    const styleId = "swoo-hide-cursor-style";
    function addHideCursorStyle() {
      if (document.getElementById(styleId)) return;
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    function removeHideCursorStyle() {
      const s = document.getElementById(styleId);
      if (s) s.remove();
    }

    // hide native cursor only when placing a pending element (we show a custom icon)
    if (pending) {
      addHideCursorStyle();
    } else {
      removeHideCursorStyle();
    }

    return () => {
      removeHideCursorStyle();
    };
  }, [pending, isDragging]);

  const handleElementPointerDown = (el: any, ev: React.PointerEvent) => {
    if (pending) {
      cancelPlacement();
      return;
    }
    ev.stopPropagation();
    const multiSelect = ev.shiftKey || ev.ctrlKey || ev.metaKey;
    selectElement(page?.id ?? "", el.id, multiSelect);

    const target = ev.target as HTMLElement;
    const handle = target?.dataset?.handle;
    const { clientX, clientY } = ev;

    if (handle) {
      resizingRef.current = {
        elementId: el.id,
        handle,
        startX: clientX,
        startY: clientY,
        origX: el.position?.x ?? 0,
        origY: el.position?.y ?? 0,
        origW: el.size?.width ?? 100,
        origH: el.size?.height ?? 40,
        origRotation: el.rotation ?? 0,
      };
      setIsDragging(true);
      return;
    }

    draggingRef.current = {
      elementId: el.id,
      startX: clientX,
      startY: clientY,
      origX: el.position?.x ?? 0,
      origY: el.position?.y ?? 0,
    };
    setIsDragging(true);
  };

  if (!project || !page) {
    return (
      <div
        style={{
          width: project?.canvas?.width ?? 600,
          height: project?.canvas?.height ?? 350,
          border: "1px solid #3a3a3a",
          background: "#2a2a2a",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          No project or page loaded.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Business Card Canvas"
      onPointerDown={handleCanvasPointerDown}
      onPointerUp={handleCanvasPointerUp}
      onClick={handleCanvasClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (!pending) selectElement(page?.id ?? "", "__card__", false);
        }
      }}
      style={{
        width: project.canvas?.width ?? 600,
        height: project.canvas?.height ?? 350,
        border: "2px solid #0b76ff",
        background: project.canvas?.backgroundColor ?? "#fff",
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
        // show grabbing cursor while actively dragging/resizing; hide native cursor only during placement
        cursor,
        outline: "none",
      }}
    >
      {/* grid overlay */}
      {snapToGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.35,
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}

      {page.elements.map((el) => (
        <ElementRenderer
          key={el.id}
          element={el as any}
          selected={selectedElements.some((s) => s.elementId === el.id)}
          onPointerDown={(ev) => handleElementPointerDown(el, ev)}
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        />
      ))}

      {/* placement preview */}
      {pending && preview && (
        <div
          style={{
            position: "absolute",
            left: preview.x,
            top: preview.y,
            width: preview.w,
            height: preview.h,
            pointerEvents: "none",
            opacity: 0.9,
            border: "1px dashed #0b76ff",
            background:
              pending.type === "image"
                ? "transparent"
                : "rgba(11,118,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pending.type === "image" &&
            (pending.src ? (
              <Image
                src={pending.src}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ color: "#888" }}>Image</div>
            ))}
          {pending.type === "text" && (
            <div
              style={{
                color: "#0b76ff",
                fontSize: "12px",
                pointerEvents: "none",
              }}
            >
              {pending.content ?? "Text"}
            </div>
          )}
        </div>
      )}

      {/* floating thumbnail near cursor */}
      {pending && cursorPos && (
        <div
          style={{
            position: "fixed",
            left: cursorPos.x + 12,
            top: cursorPos.y + 12,
            pointerEvents: "none",
            width: 80,
            height: 56,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.06)",
            zIndex: 9999,
          }}
        >
          {pending.type === "image" &&
            (pending.src ? (
              <Image
                src={pending.src}
                alt="thumb"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                Image
              </div>
            ))}
          {pending.type === "text" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(11,118,255,0.06)",
                color: "#0b76ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {pending.content ?? "Text"}
            </div>
          )}
        </div>
      )}

      {/* icon cursor for pending placement */}
      {pending && cursorPos && (
        <div
          style={{
            position: "fixed",
            left: cursorPos.x - 9,
            top: cursorPos.y - 9,
            pointerEvents: "none",
            zIndex: 10000,
            color: "#0b76ff",
          }}
        >
          <FiPlus size={18} />
        </div>
      )}

      {/* icon cursor for dragging an existing element */}
      {isDragging && cursorPos && (
        <div
          style={{
            position: "fixed",
            left: cursorPos.x - 9,
            top: cursorPos.y - 9,
            pointerEvents: "none",
            zIndex: 10000,
            color: "#fff",
          }}
        >
          <FiMove size={18} />
        </div>
      )}
    </div>
  );
};

export default Canvas;

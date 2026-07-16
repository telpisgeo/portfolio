"use client";

import { useLayoutEffect, useRef, useState } from "react";

/*
 * Інтерактивний колаж hero — геометрія 1:1 з Figma (Website / Collage).
 * 3 ітерації = 3 шари. Кожен елемент тягається вручну (нічого не відлітає);
 * розібравши елемент 1-ї ітерації, під ним видно той самий елемент 2-ї, потім 3-ї.
 * Кадр 441×622 масштабується під ширину контейнера (адаптив).
 */

const FRAME_W = 441;
const FRAME_H = 622;

type Slot = {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number; // порядок малювання в колажі (більше = вище)
  layer1Only?: boolean;
};

// Геометрія з Figma (frame collage-1, 441×622)
const SLOTS: Slot[] = [
  { name: "element-07", x: 65, y: 40, w: 304, h: 544, z: 0 },
  { name: "element-06", x: 33, y: 0, w: 168, h: 233, z: 1 },
  { name: "element-05", x: 200, y: 233, w: 204, h: 312, z: 2 },
  { name: "element-04", x: 0, y: 366, w: 340, h: 256, z: 3 },
  { name: "element-02", x: 306, y: 459, w: 135, h: 163, z: 4, layer1Only: true },
  { name: "element-01", x: 25, y: 304, w: 92, h: 116, z: 5, layer1Only: true },
];

const IMG_BASE = "/images/collage";

function imageFor(slot: Slot, iteration: number): string {
  if (slot.layer1Only) return `${IMG_BASE}/${slot.name}.webp`;
  return `${IMG_BASE}/${slot.name}-iteration-${iteration}.webp`;
}

type Piece = {
  id: string;
  slot: Slot;
  iteration: number;
  image: string;
};

const PIECES: Piece[] = [1, 2, 3].flatMap((iteration) =>
  SLOTS.filter((s) => iteration === 1 || !s.layer1Only).map((slot) => ({
    id: `${slot.name}-i${iteration}`,
    slot,
    iteration,
    image: imageFor(slot, iteration),
  })),
);

type Offset = { dx: number; dy: number };

type InteractiveCollageProps = {
  resetLabel?: string;
};

export default function InteractiveCollage({ resetLabel = "Зібрати назад" }: InteractiveCollageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [zOrder, setZOrder] = useState<Record<string, number>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const zCounter = useRef(0);
  const dragStart = useRef<{ id: string; startX: number; startY: number; baseDx: number; baseDy: number; scale: number } | null>(null);

  // Слідкуємо за шириною контейнера → масштаб кадру
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / FRAME_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onPointerDown = (piece: Piece) => (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // synthetic events don't have an active pointer to capture
    }
    const current = offsets[piece.id] ?? { dx: 0, dy: 0 };
    dragStart.current = {
      id: piece.id,
      startX: e.clientX,
      startY: e.clientY,
      baseDx: current.dx,
      baseDy: current.dy,
      scale: scale || 1,
    };
    zCounter.current += 1;
    setZOrder((prev) => ({ ...prev, [piece.id]: zCounter.current }));
    setDraggingId(piece.id);
  };

  const onPointerMove = (piece: Piece) => (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStart.current;
    if (!drag || drag.id !== piece.id) return;
    // Кадр масштабується, тож зсув у px кадру = зсув курсора / масштаб (рух 1:1 з курсором)
    const dx = drag.baseDx + (e.clientX - drag.startX) / drag.scale;
    const dy = drag.baseDy + (e.clientY - drag.startY) / drag.scale;
    setOffsets((prev) => ({ ...prev, [piece.id]: { dx, dy } }));
  };

  const onPointerUp = (piece: Piece) => () => {
    if (dragStart.current?.id === piece.id) {
      dragStart.current = null;
      setDraggingId(null);
    }
  };

  const reset = () => {
    setOffsets({});
    setZOrder({});
    zCounter.current = 0;
  };

  const hasMoved = Object.keys(offsets).length > 0;

  return (
    <div ref={wrapRef} className="relative w-full" style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
      <div
        className="relative"
        style={{ width: FRAME_W, height: FRAME_H, transformOrigin: "top left", transform: `scale(${scale})` }}
      >
        {PIECES.map((piece) => {
          const offset = offsets[piece.id] ?? { dx: 0, dy: 0 };
          const touched = zOrder[piece.id] !== undefined;
          const isDragging = draggingId === piece.id;
          // Ітерація домінує (1 зверху); всередині — порядок малювання елемента.
          // Зачеплені кусочки підіймаються над усіма у порядку останнього дотику.
          const z = touched ? 1000 + zOrder[piece.id] : (3 - piece.iteration) * 100 + piece.slot.z;
          // Натяк-тремтіння лише для верхнього шару, доки його не чіпали.
          const hint = piece.iteration === 1 && !touched;
          return (
            <div
              key={piece.id}
              onPointerDown={onPointerDown(piece)}
              onPointerMove={onPointerMove(piece)}
              onPointerUp={onPointerUp(piece)}
              className={`absolute select-none${hint ? " collage-hint-piece" : ""}`}
              style={{
                left: piece.slot.x,
                top: piece.slot.y,
                width: piece.slot.w,
                height: piece.slot.h,
                backgroundImage: `url(${piece.image})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                zIndex: z,
                transform: `translate(${offset.dx}px, ${offset.dy}px)${isDragging ? " scale(1.03) rotate(1.5deg)" : ""}`,
                transition: isDragging ? "none" : "transform 0.15s ease",
                animationDelay: hint ? `${1400 + piece.slot.z * 70}ms` : undefined,
                boxShadow: isDragging
                  ? "0 12px 32px rgba(0,0,0,0.35)"
                  : touched
                    ? "0 4px 12px rgba(0,0,0,0.25)"
                    : "none",
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={reset}
        title={resetLabel}
        aria-label={resetLabel}
        className={`group absolute top-1 right-1 z-[1100] flex items-center gap-2 rounded-full py-2 pl-2.5 pr-2.5 text-sm font-medium shadow-md transition-all duration-300 hover:pr-4 ${
          hasMoved ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "#FEF9DB", color: "#4F2A16" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100">
          {resetLabel}
        </span>
      </button>
    </div>
  );
}

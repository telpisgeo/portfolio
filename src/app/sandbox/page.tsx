"use client";

import { useRef, useState } from "react";

/*
 * Пісочниця інтерактивного колажу — геометрія 1:1 з Figma (Website / Collage).
 * 3 ітерації = 3 шари. Кожен елемент (element-01…07) — окремий кусочок, який
 * тягається вручну (нічого не відлітає). Розібравши елемент 1-ї ітерації,
 * під ним видно той самий елемент 2-ї, потім 3-ї ітерації.
 *
 * element-01 та element-02 існують тільки в 1-й ітерації.
 * Позиції взяті з collage-1 (те, що зараз на сайті) і застосовані до всіх шарів,
 * щоб елементи збігалися при розбиранні. Розміри — точно з Figma.
 */

const FRAME_W = 441;
const FRAME_H = 622;

type Slot = {
  name: string; // element-01 … element-07
  short: string; // "01"
  x: number;
  y: number;
  w: number;
  h: number;
  z: number; // порядок малювання в колажі (більше = вище)
  layer1Only?: boolean;
};

// Геометрія з Figma (frame collage-1, 441×622)
const SLOTS: Slot[] = [
  { name: "element-07", short: "07", x: 65, y: 40, w: 304, h: 544, z: 0 },
  { name: "element-06", short: "06", x: 33, y: 0, w: 168, h: 233, z: 1 },
  { name: "element-05", short: "05", x: 200, y: 233, w: 204, h: 312, z: 2 },
  { name: "element-04", short: "04", x: 0, y: 366, w: 340, h: 256, z: 3 },
  { name: "element-02", short: "02", x: 306, y: 459, w: 135, h: 163, z: 4, layer1Only: true },
  { name: "element-01", short: "01", x: 25, y: 304, w: 92, h: 116, z: 5, layer1Only: true },
];

const ITER_LABEL: Record<number, string> = {
  1: "1 · портрети",
  2: "2 · подорожі",
  3: "3 · арт",
};
const ITER_DOT: Record<number, string> = {
  1: "#FFCD00",
  2: "#8CBBE4",
  3: "#D9704F",
};

const IMG_BASE = "/images/collage";

// element-01 та element-02 існують тільки в 1-й ітерації (без суфікса ітерації)
function imageFor(slot: Slot, iteration: number): string {
  if (slot.layer1Only) return `${IMG_BASE}/${slot.name}.webp`;
  return `${IMG_BASE}/${slot.name}-iteration-${iteration}.webp`;
}

type Piece = {
  id: string;
  slot: Slot;
  iteration: number; // 1..3
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

export default function SandboxPage() {
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [zOrder, setZOrder] = useState<Record<string, number>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const zCounter = useRef(0);
  const dragStart = useRef<{ id: string; startX: number; startY: number; baseDx: number; baseDy: number } | null>(null);

  const onPointerDown = (piece: Piece) => (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // synthetic events (tests) don't have an active pointer to capture
    }
    const current = offsets[piece.id] ?? { dx: 0, dy: 0 };
    dragStart.current = {
      id: piece.id,
      startX: e.clientX,
      startY: e.clientY,
      baseDx: current.dx,
      baseDy: current.dy,
    };
    zCounter.current += 1;
    setZOrder((prev) => ({ ...prev, [piece.id]: zCounter.current }));
    setDraggingId(piece.id);
  };

  const onPointerMove = (piece: Piece) => (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStart.current;
    if (!drag || drag.id !== piece.id) return;
    const dx = drag.baseDx + (e.clientX - drag.startX);
    const dy = drag.baseDy + (e.clientY - drag.startY);
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 py-12" style={{ background: "#4F2A16" }}>
      <div className="text-center" style={{ color: "#FEF9DB" }}>
        <p className="text-sm opacity-70">Геометрія 1:1 з Figma · тягай кусочки — під ними наступна ітерація</p>
        <div className="mt-2 flex gap-4 justify-center text-xs">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: ITER_DOT[i] }} />
              {ITER_LABEL[i]}
            </span>
          ))}
        </div>
      </div>

      <div className="relative" style={{ width: FRAME_W, height: FRAME_H }}>
        {PIECES.map((piece) => {
          const offset = offsets[piece.id] ?? { dx: 0, dy: 0 };
          const touched = zOrder[piece.id] !== undefined;
          const isDragging = draggingId === piece.id;
          // База: ітерація домінує (1 зверху), всередині ітерації — порядок малювання елемента.
          // Зачеплені кусочки підіймаються над усіма у порядку останнього дотику.
          const z = touched ? 1000 + zOrder[piece.id] : (3 - piece.iteration) * 100 + piece.slot.z;
          return (
            <div
              key={piece.id}
              onPointerDown={onPointerDown(piece)}
              onPointerMove={onPointerMove(piece)}
              onPointerUp={onPointerUp(piece)}
              className="absolute select-none"
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
        onClick={reset}
        className="rounded-full px-6 py-2 text-sm font-bold"
        style={{ background: "#FFCD00", color: "#181311", cursor: "pointer" }}
      >
        Зібрати назад
      </button>
    </main>
  );
}

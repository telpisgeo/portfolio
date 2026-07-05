"use client";

import { useState } from "react";

type Props = {
  caption: string;
  statement: string;
  before: { label: string; ratio: string; src?: string };
  after: { label: string; ratio: string; src?: string };
  beforeLabel?: string;
  afterLabel?: string;
};

function ImgOrPlaceholder({ img }: { img: Props["before"] }) {
  if (img.src) {
    return <img src={img.src} alt={img.label} className="w-full rounded-lg" />;
  }
  const [w, h] = img.ratio.split("/").map(Number);
  return (
    <div
      className="w-full rounded-2xl bg-black/[0.06] flex items-center justify-center"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <span className="text-sm text-black/30">{img.label}</span>
    </div>
  );
}

export default function BeforeAfterBlock({ caption, statement, before, after, beforeLabel = "До", afterLabel = "Після" }: Props) {
  const [active, setActive] = useState<"before" | "after">("after");

  return (
    <div className="rounded-3xl bg-white overflow-hidden flex flex-col">
      <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-10 pb-6 md:pb-7 lg:pb-8">
        <div className="max-w-[912px] mx-auto flex flex-col gap-4">
          <p className="text-sm font-bold text-[#4A2C1A]">{caption}</p>
          <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
            {statement}
          </p>
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center border border-border rounded-full p-px">
              <button
                onClick={() => setActive("before")}
                className={`h-[43px] w-[100px] rounded-full text-sm font-medium transition-colors ${
                  active === "before"
                    ? "bg-[#FBCF0B] border border-border"
                    : "text-foreground"
                }`}
              >
                {beforeLabel}
              </button>
              <button
                onClick={() => setActive("after")}
                className={`h-[43px] w-[100px] rounded-full text-sm font-medium transition-colors ${
                  active === "after"
                    ? "bg-[#FBCF0B] border border-border"
                    : "text-foreground"
                }`}
              >
                {afterLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
        <ImgOrPlaceholder img={active === "before" ? before : after} />
      </div>
    </div>
  );
}

import type { Block } from "@/lib/case-blocks";
import DarkSlider from "@/components/DarkSlider";
import BeforeAfterBlock from "@/components/BeforeAfterBlock";
import FadeUp from "@/components/FadeUp";

export function Caption({ text }: { text: string }) {
  return <p className="text-sm font-bold text-muted-foreground">{text}</p>;
}

function IconParents() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M22.2012 31.5C29.5459 31.5001 35.4999 37.4541 35.5 44.7988V98.5H22.6797L13.2578 59.6465L12.9795 58.5H3.13379L9.68848 40.2939C11.5881 35.0177 16.5934 31.5 22.2012 31.5Z" stroke="#171311" strokeWidth="3"/>
      <path d="M49.7852 41.5C41.896 41.5 35.5 47.8959 35.5 55.7852V98.5H49.1826L52.5127 72.8076L52.5898 72.2139L53.0537 71.8359L57.0537 68.5859L58.0762 67.7549L59.0322 68.6611L73.0986 82H82.8789L85.2236 79.6553L77.0254 76.9229L76.4258 76.7227L76.1494 76.1533L68.666 60.6865L62.3535 48.9971C59.8595 44.3788 55.0338 41.5002 49.7852 41.5Z" stroke="#171311" strokeWidth="3"/>
      <rect x="20.5" y="11.5" width="10" height="15" rx="5" stroke="#171311" strokeWidth="3"/>
      <rect x="1.5" y="1.5" width="10" height="15" rx="5" transform="matrix(-1 0 0 1 49 20)" stroke="#171311" strokeWidth="3"/>
      <rect x="1.5" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M100 82H79C70.1634 82 63 89.1634 63 98V100" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function IconStudents() {
  return (
    <svg viewBox="0 0 100.122 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="1.5" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M99.0609 64.0004L98.5512 63.4906C93.3484 58.2878 92.691 50.247 94.5185 43.1197C98.1799 28.8395 94.4212 13.0496 83.2415 1.86986" stroke="black" strokeWidth="3"/>
      <path d="M96.25 90.5561L83.8683 78.1744C78.6655 72.9716 70.6246 72.3143 63.4973 74.1417C49.2171 77.8032 33.4272 74.0444 22.2475 62.8647C5.40421 46.0214 5.40421 18.713 22.2475 1.86967" stroke="black" strokeWidth="3"/>
      <circle cx="49.75" cy="50" r="23.5" stroke="black" strokeWidth="3"/>
      <path d="M63.75 70.0017C57.6778 65.4407 53.75 58.179 53.75 49.9999C53.75 41.8208 57.6778 34.5591 63.75 29.998" stroke="black" strokeWidth="3"/>
      <path d="M35.75 29.9983C41.8222 34.5593 45.75 41.821 45.75 50.0001C45.75 58.1792 41.8222 65.4409 35.75 70.002" stroke="black" strokeWidth="3"/>
      <line x1="26.75" y1="49.5" x2="74.75" y2="49.5" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function IconSchools() {
  return (
    <svg viewBox="0 0 100.5 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="2" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M50.5 18.5C60.7173 18.5 69 26.7827 69 37V98.5H32V37C32 26.7827 40.2827 18.5 50.5 18.5Z" stroke="black" strokeWidth="3"/>
      <path d="M100 17C89.2304 17 80.5 25.7304 80.5 36.5V100" stroke="black" strokeWidth="3"/>
      <path d="M2 17C12.2173 17 20.5 25.2827 20.5 35.5V100" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function IconTeachers() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="1.5" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M39.75 24.5C47.482 24.5 53.75 30.768 53.75 38.5V69.0752C53.75 69.8621 53.1121 70.5 52.3252 70.5C48.8051 70.5 45.7789 72.9963 45.1094 76.4521L42.8896 87.9102C42.5983 89.4138 41.2816 90.5 39.75 90.5C38.2184 90.5 36.9017 89.4138 36.6104 87.9102L34.3906 76.4521C33.7211 72.9963 30.6949 70.5 27.1748 70.5C26.3879 70.5 25.75 69.8621 25.75 69.0752V38.5C25.75 30.768 32.018 24.5 39.75 24.5Z" stroke="black" strokeWidth="3"/>
      <path d="M65.25 48.5C70.1377 48.5 74.2186 52.2271 74.6611 57.0947L76.5439 77.8027C76.578 78.1771 76.2832 78.5 75.9072 78.5C74.2477 78.5001 72.7987 79.6227 72.3838 81.2295L69.6494 91.8262C69.2521 93.3656 68.0785 94.585 66.5557 95.042C65.7041 95.2975 64.7959 95.2975 63.9443 95.042C62.4215 94.585 61.2479 93.3656 60.8506 91.8262L58.1162 81.2295C57.7013 79.6228 56.2523 78.5001 54.5928 78.5C54.2168 78.5 53.922 78.1771 53.9561 77.8027L55.8389 57.0947C56.2814 52.2271 60.3623 48.5 65.25 48.5Z" stroke="black" strokeWidth="3"/>
      <path d="M39.75 19.5C41.9591 19.5 43.75 17.7091 43.75 15.5C43.75 13.2909 41.9591 11.5 39.75 11.5C37.5409 11.5 35.75 13.2909 35.75 15.5C35.75 17.7091 37.5409 19.5 39.75 19.5Z" stroke="black" strokeWidth="3"/>
      <path d="M65.25 42.5C66.6307 42.5 67.75 41.3807 67.75 40V39C67.75 37.6193 66.6307 36.5 65.25 36.5C63.8693 36.5 62.75 37.6193 62.75 39V40C62.75 41.3807 63.8693 42.5 65.25 42.5Z" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function FigureIcon({ name }: { name: string }) {
  switch (name) {
    case "parents": return <IconParents />;
    case "students": return <IconStudents />;
    case "schools": return <IconSchools />;
    case "teachers": return <IconTeachers />;
    default: return null;
  }
}

function ImgPlaceholder({ label, ratio, className = "rounded-lg" }: { label: string; ratio: string; className?: string }) {
  return (
    <div
      className={`w-full bg-black/[0.06] border border-black/5 flex items-center justify-center ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <span className="text-sm text-foreground/35 px-4 text-center">{label}</span>
    </div>
  );
}

export function renderCaseBlock(block: Block, i: number) {
  switch (block.t) {
    case "meta":
      return (
        <div
          key={i}
          id={block.id}
          className="scroll-mt-36 rounded-2xl bg-background-alt p-6 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6"
        >
          {block.items.map((m) => (
            <div key={m.label} className="flex flex-col gap-2">
              <p className="text-sm font-bold text-accent-foreground">{m.label}</p>
              <p className="text-sm md:text-[16px] lg:text-lg font-medium text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      );
    case "caption":
      return (
        <div key={i} id={block.id} className="scroll-mt-36">
          <Caption text={block.text} />
        </div>
      );
    case "statement":
      return (
        <p key={i} className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
          {block.text}
        </p>
      );
    case "dark-slider":
      return <DarkSlider key={i} id={block.id} caption={block.caption} slides={block.slides} />;
    case "white-section":
      return (
        <div key={i} id={block.id} className="rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-4">
            <Caption text={block.caption} />
            <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.statement}</p>
          </div>
        </div>
      );
    case "light-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-10 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <Caption text={block.caption} />
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.statement}</p>
            </div>
          </div>
          <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            {block.img.src
              ? <img src={block.img.src} alt={block.img.label} className="w-full rounded-lg" />
              : <ImgPlaceholder label={block.img.label} ratio={block.img.ratio} />}
          </div>
        </div>
      );
    case "before-after":
      return (
        <BeforeAfterBlock
          key={i}
          caption={block.caption}
          statement={block.statement}
          before={block.before}
          after={block.after}
        />
      );
    case "dark-section":
      return (
        <div key={i} className="rounded-3xl bg-secondary overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <p className="text-sm font-bold text-primary">{block.caption}</p>
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-secondary-foreground font-normal">{block.statement}</p>
            </div>
          </div>
          <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            {block.video ? (
              <div className="bg-[#4B57A9] rounded-[8px] overflow-hidden">
                <video src={block.video.src} autoPlay loop muted playsInline className="w-full" style={{ aspectRatio: block.video.ratio.replace("/", " / ") }} />
              </div>
            ) : block.img?.src ? (
              <img src={block.img.src} alt={block.img.label} className="w-full rounded-lg" />
            ) : block.img ? (
              <ImgPlaceholder label={block.img.label} ratio={block.img.ratio} />
            ) : null}
          </div>
        </div>
      );
    case "figures":
      return (
        <div key={i} className="bg-white rounded-3xl px-4 md:px-6 lg:px-8 pt-6 md:pt-9 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
          <div className="max-w-[912px] mx-auto flex flex-col gap-5">
            <p className="text-sm font-bold text-muted-foreground">{block.caption}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {block.items.map((f) => (
                <div key={f.label} className="bg-primary rounded-2xl px-6 pt-6 md:pt-10 pb-6 flex flex-col gap-4">
                  <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px]">
                    <FigureIcon name={f.icon} />
                  </div>
                  <div className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.2] text-foreground font-normal">
                    <p>{f.value}</p>
                    <p>{f.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "proposal":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            {block.sectionCaption && <Caption text={block.sectionCaption} />}
            <div className="rounded-2xl bg-primary px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6 md:gap-8">
              {block.items.map((it) => (
                <div key={it.n} className="flex flex-col md:flex-row gap-1 md:gap-6">
                  <span className="text-[22px] md:text-[28px] lg:text-[36px] leading-none text-white font-normal tabular-nums shrink-0 md:w-12">
                    {it.n}
                  </span>
                  <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "quotes":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-primary px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 flex flex-col gap-6">
          <div className="max-w-[912px] mx-auto w-full flex flex-col gap-4">
            {block.sectionCaption && <Caption text={block.sectionCaption} />}
            {block.groups.map((g) => (
              <div key={g.caption} className="rounded-2xl bg-background-alt px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6 md:gap-8">
                <p className="text-sm font-bold text-foreground text-center">{g.caption}</p>
                <div className="flex flex-col gap-6 md:gap-8">
                  {g.items.map((q, j) => (
                    <div key={j} className="flex flex-col gap-2 text-center max-w-[680px] mx-auto">
                      <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">— {q.text}</p>
                      {q.author && <p className="text-xs md:text-sm text-foreground/45">{q.author}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "bullets":
      return (
        <div key={i} id="summary" className="scroll-mt-36 flex flex-col gap-6">
          <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.text}</p>
          <ul className="flex flex-col gap-3">
            {block.items.map((it, j) => (
              <li key={j} className="flex gap-3 text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
                <span className="text-foreground/30">—</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "bullets-card":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            <Caption text={block.sectionCaption} />
            <div className="rounded-2xl bg-primary px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6">
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.text}</p>
              <ul className="flex flex-col gap-4">
                {block.items.map((it, j) => (
                  <li key={j} className="flex gap-4 text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
                    <span className="text-foreground/30 shrink-0">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    case "img":
      return null; // rendered separately (full width)
  }
}

export function CaseBlockList({ blocks }: { blocks: Block[] }) {
  return (
    <article className="pt-6 px-4 md:px-8 lg:px-12">
      <div className="flex flex-col gap-6 md:gap-8">
        {blocks.map((block, i) => {
          if (block.t === "img") return null;
          if (block.t === "dark-section" || block.t === "dark-slider" || block.t === "light-section" || block.t === "before-after" || block.t === "figures" || block.t === "white-section" || block.t === "quotes" || block.t === "proposal" || block.t === "bullets-card") {
            return <FadeUp key={i}>{renderCaseBlock(block, i)}</FadeUp>;
          }
          return (
            <FadeUp key={i} className="max-w-[912px] mx-auto w-full">
              {renderCaseBlock(block, i)}
            </FadeUp>
          );
        })}
      </div>
    </article>
  );
}

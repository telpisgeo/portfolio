export type Block =
  | { t: "meta"; id?: string; items: { label: string; value: string }[] }
  | { t: "caption"; id?: string; text: string }
  | { t: "statement"; text: string }
  | { t: "dark-section"; caption: string; statement: string; img?: { label: string; ratio: string; src?: string }; video?: { src: string; ratio: string } }
  | { t: "dark-slider"; id?: string; caption: string; slides: { text: string; imgLabel: string; imgRatio: string; imgSrc?: string }[] }
  | { t: "light-section"; id?: string; caption: string; statement: string; img: { label: string; ratio: string; src?: string } }
  | { t: "figures"; caption: string; items: { value: string; label: string; icon: string }[] }
  | { t: "img"; label: string; ratio: string }
  | { t: "proposal"; id?: string; sectionCaption?: string; items: { n: string; text: string }[] }
  | { t: "quotes"; id?: string; sectionCaption?: string; groups: { caption: string; items: { text: string; author?: string }[] }[] }
  | { t: "white-section"; id?: string; caption: string; statement: string }
  | { t: "bullets"; text: string; items: string[] }
  | { t: "bullets-card"; id?: string; sectionCaption: string; text: string; items: string[] }
  | { t: "before-after"; id?: string; caption: string; statement: string; before: { label: string; ratio: string; src?: string }; after: { label: string; ratio: string; src?: string } };

export type Step = { label: string; href: string };

export type CaseContent = {
  eyebrow: string;
  title: string;
  steps: Step[];
  blocks: Block[];
};

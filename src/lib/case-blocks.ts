export type ImgRef = { label: string; ratio: string; src?: string; videoSrc?: string };
export type ShowcaseSite = { url: string; src?: string };

export type Block =
  | { t: "meta"; id?: string; items: { label: string; value: string }[] }
  | { t: "caption"; id?: string; text: string }
  | { t: "statement"; text: string }
  | {
      t: "dark-section";
      caption: string;
      statement: string;
      img?: { label: string; ratio: string; src?: string };
      video?: { src: string; ratio: string };
      carousel?: ShowcaseSite[];
    }
  | {
      t: "dark-slider";
      id?: string;
      caption: string;
      slides: { caption?: string; text: string; imgLabel: string; imgRatio: string; imgSrc?: string; videoSrc?: string }[];
    }
  | { t: "light-section"; id?: string; caption: string; statement: string; img: ImgRef }
  | { t: "figures"; caption: string; items: { value: string; label: string; icon: string }[] }
  | { t: "img"; label: string; ratio: string }
  | { t: "proposal"; id?: string; sectionCaption?: string; items: { n: string; text: string }[] }
  | { t: "quotes"; id?: string; sectionCaption?: string; groups: { caption: string; items: { text: string; author?: string }[] }[] }
  | { t: "white-section"; id?: string; caption: string; statement: string }
  | { t: "bullets"; text: string; items: string[] }
  | { t: "bullets-card"; id?: string; sectionCaption: string; text: string; items: string[] }
  | {
      t: "before-after";
      id?: string;
      caption: string;
      statement: string;
      before: ImgRef;
      after: ImgRef;
      beforeLabel?: string;
      afterLabel?: string;
    }
  | { t: "showcase"; id?: string; caption: string; statement: string; sites: ShowcaseSite[] };

export type Step = { label: string; href: string };

export type CaseContent = {
  eyebrow: string;
  title: string;
  steps: Step[];
  blocks: Block[];
};

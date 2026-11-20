import Image from "next/image";
import Link from "next/link";
import { isFunVideo, type FunItem } from "@/lib/fun-content";
import CenterPlayVideo from "./CenterPlayVideo";

// Pinterest-style wall: CSS multi-column keeps each tile at its natural
// aspect ratio and balances the columns without any JS layout.
export default function FunWall({ items, empty, locale }: { items: FunItem[]; empty: string; locale: string }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-base py-16 text-center">{empty}</p>;
  }
  return (
    <div className="columns-2 md:columns-3 gap-3 md:gap-4">
      {items.map((item, i) => (
        <figure key={`${item.id}-${i}`} className="break-inside-avoid mb-3 md:mb-4">
          <Link href={`/${locale}/fun/${item.id}`} className="group block">
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-black/[0.06] transition-[filter] duration-200 group-hover:brightness-95"
            style={{ aspectRatio: item.ratio }}
          >
            {item.more && item.more.length > 0 && (
              <span className="absolute top-2 right-2 z-10 rounded-full bg-black/55 text-white text-xs font-medium px-2 py-0.5">
                1/{item.more.length + 1}
              </span>
            )}
            {isFunVideo(item.src) ? (
              <CenterPlayVideo src={item.src} poster={item.poster || undefined} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <Image
                src={item.src}
                alt={item.caption ?? ""}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          </Link>
        </figure>
      ))}
    </div>
  );
}

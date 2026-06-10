import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background text-center">
      <div className="mb-8 rounded-2xl overflow-hidden">
        <Image
          src="https://media.giphy.com/media/MUWrwSOTVCNwn7Bf5t/giphy.gif"
          alt="Searching..."
          width={400}
          height={300}
          unoptimized
          className="w-[320px] h-auto"
        />
      </div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">404</p>
      <h1 className="text-3xl font-medium text-foreground mb-3">
        Упс, цієї сторінки вже немає
      </h1>
      <p className="text-base text-foreground/60 mb-8 max-w-xs">
        Схоже вона кудись зникла
      </p>
      <Link
        href="/uk"
        className="group inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/60 transition-colors"
      >
        <span className="translate-x-1 group-hover:translate-x-0 transition-transform duration-200">←</span>
        На головну
      </Link>
    </div>
  );
}

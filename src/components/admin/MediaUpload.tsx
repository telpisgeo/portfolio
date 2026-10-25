"use client";

import { useRef, useState } from "react";

type MediaUploadProps = {
  // "media" accepts either an image or a video file and picks the upload
  // pipeline based on the file actually chosen, rather than a fixed kind —
  // used where a single field can hold either (e.g. graph imageRows).
  kind: "image" | "video" | "media";
  dir: string;
  value: string | undefined;
  // `ratio` is passed alongside `src` in the same call (rather than as a
  // separate callback) so consumers can merge both into one state update —
  // two sequential callbacks would each close over the same stale value.
  onChange: (src: string, ratio?: string) => void;
  label?: string;
};

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Не вдалося прочитати файл"));
    reader.readAsDataURL(file);
  });
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "file";
}

function getExt(name: string): string {
  const m = name.match(/\.[^.]+$/);
  return m ? m[0] : "";
}

// Must match MAX_BYTES in /api/admin/media/route.ts. Checked client-side so
// an oversized file fails with a clear message instead of the request body
// getting rejected upstream (Vercel returns a non-JSON error page in that
// case, which crashes response parsing in a browser-specific, cryptic way).
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

// Videos that are already web-ready (mp4/webm up to this size) are uploaded as
// they are. Re-encoding them only makes them bigger and softer: the converter
// below targets high quality, so a 3MB VP9 clip came back as tens of MB.
const PASSTHROUGH_MAX_BYTES = 10 * 1024 * 1024;

function formatMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function parseJsonResponse(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Сервер повернув невірну відповідь (${res.status})`);
  }
}

export default function MediaUpload({ kind, dir, value, onChange, label }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  // Images are committed straight to the GitHub repo (see /api/admin/media),
  // so the returned path isn't actually servable until Vercel finishes
  // deploying that commit — showing it immediately would 404 half the time.
  // We show the file we just read instead, until the value changes again.
  const [localPreview, setLocalPreview] = useState<string | undefined>(undefined);

  async function uploadImage(file: File) {
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`Файл завеликий (${(file.size / 1024 / 1024).toFixed(1)}MB, макс. ${MAX_IMAGE_BYTES / 1024 / 1024}MB)`);
    }
    setProgress("Завантажую...");
    const dataUrl = await readAsDataURL(file);
    const filename = sanitizeFilename(file.name);
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dir, filename, data: dataUrl }),
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data.error ?? "Помилка завантаження зображення");
    setLocalPreview(dataUrl);
    onChange(data.path as string, data.width && data.height ? `${data.width}/${data.height}` : undefined);
  }

  async function uploadVideo(file: File) {
    const ext = getExt(file.name).toLowerCase();
    const { upload } = await import("@vercel/blob/client");
    const base = sanitizeFilename(file.name);

    // Already a compact web video: upload untouched.
    if ((ext === ".webm" || ext === ".mp4") && file.size <= PASSTHROUGH_MAX_BYTES) {
      setProgress("Завантажую у сховище...");
      const result = await upload(`${dir}/${base}${ext}`, file, {
        access: "public",
        contentType: ext === ".webm" ? "video/webm" : "video/mp4",
        handleUploadUrl: "/api/admin/blob-upload",
      });
      setInfo(`Завантажено без перекодування (${formatMB(file.size)})`);
      onChange(result.url);
      return;
    }

    setProgress("Завантажую FFmpeg...");
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL, fetchFile } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    ffmpeg.on("progress", ({ progress: p }) => {
      setProgress(`Конвертую відео... ${Math.min(100, Math.round(p * 100))}%`);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    const inputName = `input${ext || ".mp4"}`;
    const outputName = "output.mp4";
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    // Sized for a web page, not for archiving: 1280px wide and crf 28
    // (crf 20 produced files several times larger with no visible gain).
    await ffmpeg.exec([
      "-i", inputName,
      "-vf", "scale='min(1280,iw)':-2",
      "-c:v", "libx264",
      "-crf", "28",
      "-preset", "veryfast",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      outputName,
    ]);
    const output = await ffmpeg.readFile(outputName);
    const outputBytes = new ArrayBuffer(output.length);
    new Uint8Array(outputBytes).set(output as Uint8Array);
    const blob = new Blob([outputBytes], { type: "video/mp4" });

    setProgress("Завантажую у сховище...");
    const result = await upload(`${dir}/${base}.mp4`, blob, {
      access: "public",
      contentType: "video/mp4",
      handleUploadUrl: "/api/admin/blob-upload",
    });
    const note = `${formatMB(file.size)} → ${formatMB(blob.size)}`;
    setInfo(blob.size > 8 * 1024 * 1024 ? `${note}. Важко для сторінки — краще стиснути сильніше` : note);
    onChange(result.url);
  }

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const isVideo = kind === "video" || (kind === "media" && file.type.startsWith("video/"));
      if (isVideo) {
        setLocalPreview(undefined);
        await uploadVideo(file);
      } else {
        await uploadImage(file);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка завантаження");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  const isVideoValue = !!value && (/\.(webm|mp4|mov)$/i.test(value) || value.includes(".public.blob.vercel-storage.com/"));

  return (
    <div>
      {label && <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</label>}

      {value && (
        <div className="mb-2 flex items-start gap-2">
          {isVideoValue ? (
            <video src={value} className="max-h-32 rounded-lg" controls autoPlay loop muted playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localPreview ?? value} alt="" className="max-h-32 rounded-lg" />
          )}
          <button
            type="button"
            onClick={() => {
              setLocalPreview(undefined);
              onChange("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Прибрати
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-border rounded-xl px-4 py-3 text-sm text-muted-foreground text-center cursor-pointer hover:border-foreground transition-colors"
      >
        {busy ? (progress || "Завантажую...") : value ? "Замінити файл (перетягніть або клікніть)" : "Перетягніть файл або клікніть, щоб обрати"}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={
          kind === "image"
            ? "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.svg"
            : kind === "video"
              ? "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              : "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm,.png,.jpg,.jpeg,.webp,.gif,.svg,.mp4,.mov,.webm"
        }
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {info && !error && <p className="text-xs text-muted-foreground mt-1">{info}</p>}
      {value && <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{value}</p>}
    </div>
  );
}

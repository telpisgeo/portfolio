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
    onChange(data.path as string, data.width && data.height ? `${data.width}/${data.height}` : undefined);
  }

  async function uploadVideo(file: File) {
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

    const inputName = `input${getExt(file.name) || ".mp4"}`;
    const outputName = "output.mp4";
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec([
      "-i", inputName,
      "-vf", "scale='min(1920,iw)':-2",
      "-c:v", "libx264",
      "-crf", "20",
      "-preset", "veryfast",
      "-movflags", "+faststart",
      "-an",
      outputName,
    ]);
    const output = await ffmpeg.readFile(outputName);
    const outputBytes = new ArrayBuffer(output.length);
    new Uint8Array(outputBytes).set(output as Uint8Array);
    const blob = new Blob([outputBytes], { type: "video/mp4" });

    setProgress("Завантажую у сховище...");
    const { upload } = await import("@vercel/blob/client");
    const pathname = `${dir}/${sanitizeFilename(file.name)}.mp4`;
    const result = await upload(pathname, blob, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
    });
    onChange(result.url);
  }

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const isVideo = kind === "video" || (kind === "media" && file.type.startsWith("video/"));
      if (isVideo) await uploadVideo(file);
      else await uploadImage(file);
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
            <img src={value} alt="" className="max-h-32 rounded-lg" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
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
      {value && <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{value}</p>}
    </div>
  );
}

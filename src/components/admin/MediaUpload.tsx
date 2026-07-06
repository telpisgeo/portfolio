"use client";

import { useRef, useState } from "react";

type MediaUploadProps = {
  kind: "image" | "video";
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

export default function MediaUpload({ kind, dir, value, onChange, label }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function uploadImage(file: File) {
    setProgress("Завантажую...");
    const dataUrl = await readAsDataURL(file);
    const filename = sanitizeFilename(file.name);
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dir, filename, data: dataUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Помилка завантаження зображення");
    onChange(data.path, data.width && data.height ? `${data.width}/${data.height}` : undefined);
  }

  async function uploadVideo(file: File) {
    setProgress("Завантажую FFmpeg...");
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL, fetchFile } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    ffmpeg.on("progress", ({ progress: p }) => {
      setProgress(`Конвертую у WebM... ${Math.min(100, Math.round(p * 100))}%`);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    const inputName = `input${getExt(file.name) || ".mp4"}`;
    const outputName = "output.webm";
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec([
      "-i", inputName,
      "-vf", "scale='min(1280,iw)':-2",
      "-c:v", "libvpx-vp9",
      "-crf", "32",
      "-b:v", "0",
      "-deadline", "realtime",
      "-cpu-used", "4",
      "-an",
      outputName,
    ]);
    const output = await ffmpeg.readFile(outputName);
    const outputBytes = new ArrayBuffer(output.length);
    new Uint8Array(outputBytes).set(output as Uint8Array);
    const blob = new Blob([outputBytes], { type: "video/webm" });

    setProgress("Завантажую у сховище...");
    const { upload } = await import("@vercel/blob/client");
    const pathname = `${dir}/${sanitizeFilename(file.name)}.webm`;
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
      if (kind === "image") await uploadImage(file);
      else await uploadVideo(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка завантаження");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div>
      {label && <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</label>}

      {value && (
        <div className="mb-2 flex items-start gap-2">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-32 rounded-lg" />
          ) : (
            <video src={value} className="max-h-32 rounded-lg" controls />
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
        accept={kind === "image" ? "image/png,image/jpeg,image/webp,image/gif,image/svg+xml" : "video/mp4,video/quicktime,video/webm"}
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

# Cutout — remove background (Figma plugin)

Removes the background from images in Figma. The model (`@imgly/background-removal`, ISNet) runs
locally inside the plugin window, so images are never uploaded anywhere. No API key, no paid plan.

## Install (development plugin)

1. Figma Desktop → **Plugins → Development → Import plugin from manifest…**
2. Pick `tools/figma-cutout/manifest.json`.
3. Run it from **Plugins → Development → Cutout — remove background**.

## Use

- Select one or more images, or a frame/section that contains them (up to 200 are collected).
- Choose quality, result mode and whether to trim transparent edges, then **Remove background**.
- **New layer** puts the cutout to the right of the original; **Replace** swaps the image fill in place.

The first run downloads the model (about 40–170 MB depending on quality) from `staticimgly.com`
and `cdn.jsdelivr.net` (both listed in `manifest.json`) and caches it in the browser.

## Files

- `manifest.json` — plugin manifest (network access limited to the two CDNs above).
- `code.js` — reads image fills from the selection, creates the result layers.
- `ui.html` — runs the model, trims, reports progress.
- `serve.js` + `test/sample.png` — local test harness: `node serve.js`, then open
  `http://localhost:8765/ui.html?demo=/test/sample.png` in a normal browser tab.

## Notes

- Layers with several image fills use the first visible one.
- Tested: the model pipeline in a browser tab (sample image cut out correctly, ~27 s including the
  first model download). Not yet run inside Figma itself.

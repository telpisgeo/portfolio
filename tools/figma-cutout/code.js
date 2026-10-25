// Cutout — remove background. Runs the segmentation model in the plugin UI (ui.html);
// this file only reads images from the selection and writes the results back.
figma.showUI(__html__, { width: 340, height: 520, themeColors: true });

const MAX_ITEMS = 200;

function imageFillOf(node) {
  if (!('fills' in node) || node.fills === figma.mixed) return null;
  return node.fills.find((f) => f.type === 'IMAGE' && f.visible !== false) || null;
}

function collect(nodes) {
  const out = [];
  const seen = new Set();
  const add = (n) => {
    if (seen.has(n.id) || out.length >= MAX_ITEMS) return;
    if (imageFillOf(n) && n.width > 0 && n.height > 0) {
      seen.add(n.id);
      out.push({ id: n.id, name: n.name, w: Math.round(n.width), h: Math.round(n.height) });
    }
  };
  for (const n of nodes) {
    add(n);
    if ('findAll' in n) n.findAll((c) => { add(c); return false; });
  }
  return out;
}

function sendSelection() {
  figma.ui.postMessage({ type: 'selection', items: collect(figma.currentPage.selection) });
}
figma.on('selectionchange', sendSelection);
sendSelection();

async function bytesFor(node) {
  const fill = imageFillOf(node);
  const image = figma.getImageByHash(fill.imageHash);
  return image.getBytesAsync();
}

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'get-bytes') {
      const node = await figma.getNodeByIdAsync(msg.id);
      if (!node) throw new Error('Layer not found');
      const bytes = await bytesFor(node);
      figma.ui.postMessage({ type: 'bytes', id: msg.id, name: node.name, bytes });
    } else if (msg.type === 'result') {
      const node = await figma.getNodeByIdAsync(msg.id);
      if (!node) throw new Error('Layer not found');
      const image = msg.bytes ? figma.createImage(msg.bytes) : null;
      const scale = node.width / msg.srcW;
      if (msg.mode === 'replace') {
        node.fills = node.fills.map((f) =>
          f.type === 'IMAGE' && f.visible !== false ? { ...f, imageHash: image.hash } : f
        );
        figma.ui.postMessage({ type: 'saved', id: msg.id, nodeId: node.id });
      } else if (msg.pieces) {
        const parent = node.parent && 'appendChild' in node.parent ? node.parent : figma.currentPage;
        const ids = [];
        msg.pieces.forEach((p, i) => {
          const img = figma.createImage(p.bytes);
          const rect = figma.createRectangle();
          rect.name = node.name + ' (piece ' + (i + 1) + ')';
          rect.resize(Math.max(1, p.w * scale), Math.max(1, p.h * scale));
          rect.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
          parent.appendChild(rect);
          rect.x = node.x + node.width + 40 + p.boxX * scale;
          rect.y = node.y + p.boxY * scale;
          ids.push(rect.id);
        });
        figma.ui.postMessage({ type: 'saved', id: msg.id, nodeId: ids });
      } else {
        const rect = figma.createRectangle();
        rect.name = node.name + ' (cutout)';
        rect.resize(Math.max(1, msg.w * scale), Math.max(1, msg.h * scale));
        rect.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];
        const parent = node.parent && 'appendChild' in node.parent ? node.parent : figma.currentPage;
        parent.appendChild(rect);
        rect.x = node.x + node.width + 40 + msg.boxX * scale;
        rect.y = node.y + msg.boxY * scale;
        figma.ui.postMessage({ type: 'saved', id: msg.id, nodeId: rect.id });
      }
    } else if (msg.type === 'select') {
      const nodes = [];
      for (const id of msg.ids) {
        const n = await figma.getNodeByIdAsync(id);
        if (n) nodes.push(n);
      }
      figma.currentPage.selection = nodes;
      if (nodes.length) figma.viewport.scrollAndZoomIntoView(nodes);
    } else if (msg.type === 'notify') {
      figma.notify(msg.text);
    }
  } catch (e) {
    figma.ui.postMessage({ type: 'error', id: msg.id, message: String((e && e.message) || e) });
  }
};

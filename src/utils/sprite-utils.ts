// Shared sprite utilities used by SpriteBackground and PokePaste Visualizer

export interface FrameInfo { w: number; h: number; count: number }

export function spriteUrl(id: number, action: string): string {
  return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/${String(id).padStart(4, '0')}/${action}-Anim.png`;
}

export function animDataUrl(id: number): string {
  return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/${String(id).padStart(4, '0')}/AnimData.xml`;
}

export function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function fetchAnimData(id: number): Promise<Record<string, { w: number; h: number }>> {
  try {
    const res = await fetch(animDataUrl(id));
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const anims = doc.querySelectorAll('Anim');
    const result: Record<string, { w: number; h: number }> = {};
    anims.forEach((anim) => {
      const name = anim.querySelector('Name')?.textContent ?? '';
      const w = parseInt(anim.querySelector('FrameWidth')?.textContent ?? '0', 10);
      const h = parseInt(anim.querySelector('FrameHeight')?.textContent ?? '0', 10);
      if (name && w > 0 && h > 0) result[name] = { w, h };
    });
    return result;
  } catch {
    return {};
  }
}

export function calcFrameInfo(img: HTMLImageElement, dims: { w: number; h: number } | undefined): FrameInfo {
  if (dims && dims.w > 0 && dims.h > 0) {
    return { w: dims.w, h: dims.h, count: Math.max(1, Math.floor(img.naturalWidth / dims.w)) };
  }
  const h = Math.floor(img.naturalHeight / 8);
  return { w: h, h, count: Math.max(1, Math.floor(img.naturalWidth / h)) };
}
